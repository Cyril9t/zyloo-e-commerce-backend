import express from "express"
import prisma from "../prismaConfig/prisma.js";
import { hashPassword, comparePassword, userToken, verifyToken } from "../lib/userAuth.js";
import { registerSchema, loginSchema } from "../lib/validate.js";
import passport from "passport";
import { date, email } from "zod";
import { tr } from "zod/v4/locales";

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

        const code = Math.floor(100000 + Math.random() * 900000);

        await prisma.verificationCode.create({
            data: {
                code, expiresAt: new Date(Date.now() + 10 * 1000), userId: user.id
            }
        })

        res.status(200).json({ Message: "Login success" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ Message: "Internal error" });
    }
})

router.put("/sendVerificationCode", async (req, res) => {
    try {
        const { email } = req.body

        const code = Math.floor(100000 + Math.random() * 900000);

        const findExistUser = await prisma.user.findUnique({
            where: { email },
            include: {
                verificationCode: {
                    select: {
                        id: true
                    },
                    orderBy: {
                        id: "desc",
                    },
                    take: 1
                }
            }
        })
        const verificationId = findExistUser.verificationCode.map((id) => ({ id: id.id }))[0].id

        await prisma.verificationCode.update({
            where: { id: verificationId, userId: findExistUser.id },
            data: {
                code, expiresAt: new Date(Date.now() + 10 * 1000),
            }
        })

        res.status(201).json({ Message: `A 6 digit verification code sent to this email "${email}"` })

    } catch (error) {
        console.log(error)
        res.status(500).json({ Message: "Server error" })
    }
})

router.post("/verifyCode", async (req, res) => {
    try {
        const { code, email } = req.body

        const findUniqueUser = await prisma.user.findUnique({
            where: { email },
            include: {
                verificationCode: {
                    select: {
                        id: true,

                    },
                    orderBy: {
                        id: "desc",
                    },
                    take: 1
                },

            },

        })

        const getVerifyCode = findUniqueUser.verificationCode.map((id) => ({ id: id.id }));
        const id = getVerifyCode.map((id) => id)[0].id;

        const verification = await prisma.verificationCode.findUnique({
            where: { userId: findUniqueUser.id, id: id, }
        })

        if (code !== verification.code) {

            return res.status(400).json({ Message: "Invalid Code" })
        }

        const user = findUniqueUser

        const token = await userToken({ id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role });
        const userInfo = {
            id: user.id, name: user.firstName, email: user.email, role: user.role
        }

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({ Message: "Verification Success", userInfo })

    } catch (error) {
        console.log(error)
        res.status(500).json({ Message: "server error" })
    }
})

router.post("/logout", async (req, res) => {
    try {

        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
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
    failureRedirect: "https://zyloo-five.vercel.app/login"
}),
    async (req, res) => {
        const CreateUser = req.user
        console.log(req.user, "Login")

        const token = await userToken({ id: CreateUser.id, firstName: CreateUser.firstName, lastName: CreateUser.lastName, email: CreateUser.email, role: CreateUser.role });

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })

        res.redirect("https://zyloo-five.vercel.app/")
    }
)


router.delete("/deleteUser", async (req, res) => {
    try {
        const deleteUser = await prisma.user.delete({
            where: { email: "cyrilesin214@gmail.com" }
        })

        res.json(deleteUser)
    } catch (error) {
        console.log(error)
    }
})

export default router;