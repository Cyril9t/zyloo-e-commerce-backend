import express from "express";
import prisma from "../prismaConfig/prisma.js";

const router = express.Router()


router.get("/OrderSuccess/:id", async (req, res) => {
    try {

        const OrderSuccess = await prisma.orders.findFirst({
            where: { id: req.params.id, },
            include: {
                OderItem: true,
                Address: true
            }
        })

        res.json({ Message: "Order Success", OrderSuccess })

    } catch (error) {
        console.log(error)
        res.status(500).json({ Message: "Internal Error" })
    }
})

router.get("/Orders", async (req, res) => {
    try {
        const user = req.user

        const Orders = await prisma.orders.findMany({
            where: { userId: user.id },
            include: {
                OderItem: {
                    take: 1
                }
            },


        })

        res.json({ Message: "Order", Orders })
    } catch (error) {
        console.log(error)
    }
})


export default router