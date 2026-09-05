import prisma from "../prismaConfig/prisma.js";
import express from "express"

const router = express.Router()

router.get("/users", async (req, res) => {
    try {

        const users = await prisma.user.findMany({
            select: {
                firstName: true,
                lastName: true,
                email: true,
                role: true,
                id: true
            }
        })

        res.status(200).json({ Message: "total User", users })

    } catch (error) {
        console.log(error)
    }
})

router.delete("/deleteUser/:id", async (req, res) => {
    try {
        const { id } = req.params.id

        await prisma.user.delete({
            where: { id: id }
        })

        res.status(200).json({ Message: "User Deleted" })
    } catch (error) {
        console.log(error)
    }
})


export default router