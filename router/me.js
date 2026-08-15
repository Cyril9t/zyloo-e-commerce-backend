import prisma from "../prismaConfig/prisma.js";
import express, { Router } from "express";

const router = express.Router()

router.get("/me", async (req, res) => {

    try {

        const decoded = req.user;

        const email = decoded.email

        if (!email) return res.status(401).json({ Message: "Unauthorized" })

        const user = await prisma.user.findUnique({
            where: { email }
        })

        res.status(200).json({ Message: "User", decoded })

    } catch (error) {
        console.log(error)

        res.status(500).json({ Message: "Internal error" })
    }
})

export default router