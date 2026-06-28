import express from "express"
import prisma from "../prismaConfig/prisma.js";
import { hashPassword, comparePassword, userToken, verifyToken } from "../lib/userAuth.js";
import { Role } from "../generated/prisma/index.js";

const router = express.Router();

router.post("/register", async (req, res) => {
    try {

        const { fullName, password, email } = req.body;

        if (!fullName || !password || !email) return res.status(400).json({ Message: "Input fields are required " });

        const existing = await prisma.user.findUnique({
            where: { email }
        })

        if (existing) return res.status(409).json({ Message: "User already exist" });

        const hash = await hashPassword(password);

        const user = await prisma.user.create({
            data: {
                fullName, password: hash, email
            }
        });

        res.status(201).json({ Message: "Registration successful", user });

    } catch (error) {
        console.log(error, "err side")
    }
});

router.post("/login", async (req, res) => {
    try {

        const { email, password } = req.body;

        if (!email | !password) return res.status(400).json({ Message: "Input fields are required " });

        const existing = await prisma.user.findUnique({
            where: { email }
        })

        if (!existing) return res.status(404).json({ Message: "User not exist" });

        const compare = await comparePassword(password, existing.password);

        if (!compare) return res.status(400).json({ Message: "Incorrect credentials" })

        const token = await userToken({ id: existing.id, name: existing.fullName, email: existing.email, role: existing.role });

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 3600000
        })



        res.status(200).json({ Message: "Login success" });


    } catch (error) {
        console.log(error);
        res.status(500).json({ Message: "Internal error" });
    }
})

export default router;