import express, { json } from "express";
import prisma from "../prismaConfig/prisma.js";
import https from "https"
const router = express.Router()

router.post("/checkOuts", async (req, res) => {
    try {
        const user = req.user;

        const {
            item,
            email,
            firstName,
            lastName,
            StreetAddress,
            city,
            state,
            postalCode,
            paymentMethod
        } = req.body;



        if (
            !item ||
            !Array.isArray(item) ||
            item.length === 0 ||
            !email ||
            !firstName ||
            !lastName ||
            !StreetAddress ||
            !city ||
            !state ||
            !postalCode ||
            !paymentMethod
        ) {
            console.log("All checkout fields are required")
            return res.status(400).json({
                Message: "All checkout fields are required"
            });
        }


        let total = 0;

        for (const i of item) {
            const productItem = await prisma.productItem.findUnique({
                where: {
                    id: i.productItem.id
                },
                include: {
                    product: true
                }
            });

            if (!productItem) {
                console.log("Product item not found")
                return res.status(404).json({
                    Message: "Product item not found"
                });
            }

            if (productItem.stock < i.quantity) {
                console.log(`${productItem.product.name} is out of stock`)
                return res.status(400).json({
                    Message: `${productItem.product.name} is out of stock`
                });
            }

            const subtotal = productItem.price * i.quantity;
            const discount = subtotal > 300 ? 30 : 0;
            const shipping = subtotal > 250 || subtotal === 0 ? 0 : 20;
            const tax = Math.round(subtotal * 0.08);

            total += subtotal + shipping + tax - discount;

        }


        const amount = total * 100;

        const params = JSON.stringify({
            email,
            amount,
            callback_url:
                "https://zyloo-five.vercel.app/verifyPayment"
        });

        const options = {
            hostname: "api.paystack.co",
            port: 443,
            path: "/transaction/initialize",
            method: "POST",
            headers: {
                Authorization:
                    `Bearer ${process.env.PAYSTACK_TEST_KEY}`,
                "Content-Type": "application/json"
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

                        if (!response.status) {
                            return res.status(400).json({
                                Message:
                                    response.message ||
                                    "Unable to initialize payment"
                            });
                        }

                        const {
                            reference,
                            authorization_url
                        } = response.data;


                        await prisma.pendingPayment.create({
                            data: {
                                reference,
                                userId: user.id,
                                email,
                                firstName,
                                lastName,
                                StreetAddress,
                                city,
                                state,
                                postalCode,
                                paymentMethod,
                                total: amount,
                                items: item,
                                status: "PENDING"
                            }
                        });


                        return res.status(200).json({
                            Message: "Payment initialized",
                            authorization_url,
                            reference
                        });

                    } catch (error) {
                        console.error(error);

                        return res.status(500).json({
                            Message:
                                "Error processing Paystack response"
                        });
                    }
                });
            }
        );

        paystackReq.on("error", (error) => {
            console.error(error);

            return res.status(500).json({
                Message: "Paystack connection failed"
            });
        });

        paystackReq.write(params);
        paystackReq.end();

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            Message: "Internal server error"
        });
    }
})

export default router