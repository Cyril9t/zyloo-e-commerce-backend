import express, { json } from "express";
import prisma from "../prismaConfig/prisma.js";

const router = express.Router()

router.post("/checkOuts", async (req, res) => {
    try {
        const user = req.user

        const { item, name, color, image, size, quantity, price, total, email, firstName, lastName, StreetAddress, city, state, postalCode, paymentMethod } = req.body

        if (total, email, firstName, lastName, StreetAddress, city, state, postalCode, paymentMethod) {

        } else {
            res.json({ Message: "Fields required" })
            return
        }

        const code = Math.floor(1000000 + Math.random() * 900000);

        console.log(code)

        const Order = await prisma.orders.create({
            data: {
                orderid: `ZYL-${code}`, total, user: {
                    connect: {
                        id: user.id
                    }
                }

            }
        })

        const Address = await prisma.checkoutAddress.create({
            data: {
                email, firstName, lastName, StreetAddress, city, state, postalCode, paymentMethod, OrderItem: { connect: { id: Order.id } }
            }
        })


        const orderId = Order.id

        const OrderItem = await prisma.orderItems.createMany({
            data: item.map((i) => ({
                name: i.productItem.product.name,
                color: i.productItem.color,
                image: i.productItem.image,
                size: i.productItem.size,
                price: i.productItem.price,
                quantity: i.quantity,
                orderId
            }))
        })


        const OrderPlaced = await prisma.orders.findUnique({
            where: { id: Order.id },
            include: {
                OderItem: true,
                Address: true
            }
        })

        res.json({ Message: "Order success", OrderPlaced: OrderPlaced })

    } catch (error) {
        console.log(error)
        res.status(500).json({ Message: " internal Error" })
    }
})

export default router