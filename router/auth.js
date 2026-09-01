import express from "express"
import prisma from "../prismaConfig/prisma.js";
import { hashPassword, comparePassword, userToken, verifyToken } from "../lib/userAuth.js";
import { registerSchema, loginSchema } from "../lib/validate.js";
import passport from "passport";

const router = express.Router();

router.post("/register", async (req, res) => {
    try {

        const data = registerSchema.safeParse(req.body);

        if (!data.success) return res.status(200).json({ Error: data.error.flatten().fieldErrors });

        const { firstName, lastName, password, email } = data.data;

        const existing = await prisma.user.findUnique({
            where: { email }
        })

        if (existing) {
            return res.status(200).json({ Message: "User already exist" });
        }

        const hash = await hashPassword(password);

        const user = await prisma.user.create({
            data: {
                firstName, lastName, password: hash, email,
            }
        });

        res.status(201).json({ Message: "Registration successful" });

    } catch (error) {
        console.log(error, "err side")
    }
});

router.post("/login", async (req, res) => {
    try {

        const validate = loginSchema.safeParse(req.body);

        const { email, password } = validate.data;

        if (!validate.success) return res.status(400).json({ Error: validate.error.flatten().fieldErrors });

        // if (!email | !password) return res.status(400).json({ Message: "Input fields are required " });

        const user = await prisma.user.findUnique({
            where: { email }
        })

        if (!user) return res.status(404).json({ Message: "User not exist" });

        const compare = await comparePassword(password, user.password);

        if (!compare) return res.status(404).json({ Message: "Incorrect credentials" })

        const token = await userToken({ id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role });
        const userInfo = {
            id: user.id, name: user.firstName, email: user.email, role: user.role
        }
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })

        res.status(200).json({ Message: "Login success", userInfo });

    } catch (error) {
        console.log(error);
        res.status(500).json({ Message: "Internal error" });
    }
})

router.post("/logout", async (req, res) => {
    try {

        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            expires: new Date(Date.now()),
        })

        res.status(200).json({ Message: "Logged out Successfully" })

    } catch (error) {
        console.log(error)
        res.status(500).json({ Message: "Internal Error" })
    }
})

router.get("/google", passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
})
);

router.get("/google/callback", passport.authenticate("google", {
    session: false,
    failureRedirect: "http://localhost:5173/login"
}),
    async (req, res) => {
        const CreateUser = req.user
        console.log(req.user, "Login")

        const token = await userToken({ id: CreateUser.id, firstName: CreateUser.firstName, lastName: CreateUser.lastName, email: CreateUser.email, role: CreateUser.role });

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })

        res.redirect("http://localhost:5173/")
    }
)


export default router;