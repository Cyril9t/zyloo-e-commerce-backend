import express, { json } from "express";
import prisma from "../prismaConfig/prisma.js";
import https from "https"
const router = express.Router()



router.post("/verifyPayment", async (req, res) => {
    try {
        const user = req.user;

        const { reference } = req.body;

        if (!reference) {
            return res.json({
                Message: "Payment reference is required"
            });
        }


        const options = {
            hostname: "api.paystack.co",
            port: 443,
            path: `/transaction/verify/${reference}`,
            method: "GET",
            headers: {
                Authorization:
                    `Bearer ${process.env.PAYSTACK_TEST_KEY}`
            }
        };

        const paystackReq = https.request(
            options,
            (paystackRes) => {

                let data = "";

                paystackRes.on("data", (chunk) => {
                    data += chunk;
                });

                paystackRes.on("end", async () => {
                    try {
                        const response = JSON.parse(data);


                        if (
                            !response.status ||
                            response.data.status !== "success"
                        ) {
                            return res.status(400).json({
                                Message: "Payment was not successful"
                            });
                        }

                        const pendingPayment =
                            await prisma.pendingPayment.findUnique({
                                where: {
                                    reference
                                }
                            });

                        if (!pendingPayment) {
                            return res.status(404).json({
                                Message:
                                    "Pending payment not found"
                            });
                        }


                        if (pendingPayment.status === "PAID") {
                            return res.status(400).json({
                                Message:
                                    "Payment has already been processed"
                            });
                        }


                        if (
                            response.data.amount !==
                            pendingPayment.total * 100
                        ) {
                            console.log(pendingPayment.total * 100, "PAYSTaCK =>:", response.data.amount)
                            return res.status(400).json({
                                Message:
                                    "Payment amount does not match"
                            });
                        }


                        const code = Math.floor(
                            1000000 +
                            Math.random() * 900000
                        );


                        const result = await prisma.$transaction(
                            async (tx) => {
                                const order =
                                    await tx.orders.create({
                                        data: {
                                            orderid:
                                                `ZYL-${code}`,

                                            total:
                                                pendingPayment.total,

                                            user: {
                                                connect: {
                                                    id:
                                                        user.id
                                                }
                                            }
                                        }
                                    });


                                await tx.checkoutAddress.create({
                                    data: {
                                        email:
                                            pendingPayment.email,

                                        firstName:
                                            pendingPayment.firstName,

                                        lastName:
                                            pendingPayment.lastName,

                                        StreetAddress:
                                            pendingPayment.StreetAddress,

                                        city:
                                            pendingPayment.city,

                                        state:
                                            pendingPayment.state,

                                        postalCode:
                                            pendingPayment.postalCode,

                                        paymentMethod:
                                            pendingPayment.paymentMethod,

                                        OrderItem: {
                                            connect: {
                                                id:
                                                    order.id
                                            }
                                        }
                                    }
                                });


                                await tx.orderItems.createMany({
                                    data:
                                        pendingPayment.items.map(
                                            (i) => ({

                                                name:
                                                    i.productItem
                                                        .product
                                                        .name,

                                                color:
                                                    i.productItem
                                                        .color,

                                                image:
                                                    i.productItem
                                                        .image,

                                                size:
                                                    i.productItem
                                                        .size,

                                                price:
                                                    i.productItem
                                                        .price,

                                                quantity:
                                                    i.quantity,

                                                orderId:
                                                    order.id
                                            })
                                        )
                                });


                                const cart =
                                    await tx.cart.findUnique({
                                        where: {
                                            userId:
                                                user.id
                                        }
                                    });


                                if (cart) {

                                    await tx.cartItem.deleteMany({
                                        where: {
                                            cartId:
                                                cart.id
                                        }
                                    });

                                    await tx.cart.delete({
                                        where: {
                                            id:
                                                cart.id
                                        }
                                    });
                                }


                                await tx.pendingPayment.update({
                                    where: {
                                        reference
                                    },

                                    data: {
                                        status: "PAID"
                                    }
                                });

                                return order;
                            }
                        );

                        const decreaseStock = await Promise.all(
                            pendingPayment.items.map((item) =>
                                prisma.productItem.update({
                                    where: {
                                        id: item.productItemId,
                                    },
                                    data: {
                                        stock: {
                                            decrement: item.quantity,
                                        },
                                    },
                                })
                            )
                        );
                        return res.status(200).json({
                            Message: "Payment successful",
                            Order: result
                        });

                    } catch (error) {
                        console.error(error);

                        return res.status(500).json({
                            Message:
                                "Error processing payment"
                        });
                    }
                });
            }
        );

        paystackReq.on("error", (error) => {
            console.error(error);

            return res.status(500).json({
                Message:
                    "Unable to verify payment"
            });
        });

        paystackReq.end();

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            Message: "Internal server error"
        });
    }
}
)


export default router