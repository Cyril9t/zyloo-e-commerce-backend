import express, { json } from "express";
import prisma from "../prismaConfig/prisma.js";
import https from "https"
const router = express.Router()

// router.post("/checkOuts", async (req, res) => {
//     try {
//         const user = req.user

//         const { item, name, color, image, size, quantity, price, total, email, firstName, lastName, StreetAddress, city, state, postalCode, paymentMethod } = req.body

//         if (
//             !total ||
//             !email ||
//             !firstName ||
//             !lastName ||
//             !StreetAddress ||
//             !city ||
//             !state ||
//             !postalCode ||
//             !paymentMethod
//         ) {
//             return res.status(400).json({
//                 Message: "All fields are required"
//             })
//         }

//         const code = Math.floor(1000000 + Math.random() * 900000);

//         console.log(code)

//         const Order = await prisma.orders.create({
//             data: {
//                 orderid: `ZYL-${code}`, total, user: {
//                     connect: {
//                         id: user.id
//                     }
//                 }

//             }
//         })

//         const Address = await prisma.checkoutAddress.create({
//             data: {
//                 email, firstName, lastName, StreetAddress, city, state, postalCode, paymentMethod, OrderItem: { connect: { id: Order.id } }
//             }
//         })


//         const orderId = Order.id

//         const OrderItem = await prisma.orderItems.createMany({
//             data: item.map((i) => ({
//                 name: i.productItem.product.name,
//                 color: i.productItem.color,
//                 image: i.productItem.image,
//                 size: i.productItem.size,
//                 price: i.productItem.price,
//                 quantity: i.quantity,
//                 orderId
//             }))
//         })


//         const OrderPlaced = await prisma.orders.findUnique({
//             where: { id: Order.id },
//             include: {
//                 OderItem: true,
//                 Address: true
//             }
//         })


//         const params = JSON.stringify({
//             "email": email,
//             "amount": OrderPlaced.total * 100
//         })

//         const options = {
//             hostname: 'api.paystack.co',
//             port: 443,
//             path: '/transaction/initialize',
//             method: 'POST',
//             headers: {
//                 Authorization: `Bearer ${process.env.PAYSTACK_TEST_KEY}`,
//                 'Content-Type': 'application/json'
//             }
//         }

//         const paystackReq = https.request(options, paySatck => {
//             let data = ''

//             paySatck.on('data', (chunk) => {
//                 data += chunk
//             });

//             paySatck.on('end', () => {
//                 const response = JSON.parse(data)
//                 console.log(response)
//                 res.status(200).json({ Message: "Order success", OrderPlaced: OrderPlaced, response })
//             })
//         }).on('error', error => {
//             console.error(error)
//         })

//         paystackReq.write(params)
//         paystackReq.end()

//         // const findCart = await prisma.cart.findUnique({
//         //     where: { userId: user.id }
//         // })

//         // if (!findCart) return res.json({ Message: "No cart found" })

//         // const deleteItem = await prisma.cartItem.deleteMany({
//         //     where: { cartId: findCart.id }
//         // })

//         // const deleteCart = await prisma.cart.delete({
//         //     where: {
//         //         id: findCart.id
//         //     }
//         // })


//         // res.json({ Message: "Order success", OrderPlaced: OrderPlaced })

//     } catch (error) {
//         console.log(error)
//         res.status(500).json({ Message: " internal Error" })
//     }
// })


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
                return res.status(404).json({
                    Message: "Product item not found"
                });
            }

            if (productItem.stock < i.quantity) {
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
                "http://localhost:5173/verifyPayment"
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
                                total,
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