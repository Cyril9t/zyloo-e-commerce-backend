import express, { json } from "express";
import prisma from "../prismaConfig/prisma.js";

const router = express.Router();

router.post('/upload', async (req, res) => {

    try {

        const { name, price, description, stock, image, category, tagName, id } = req.body

        if (!name || !price || !description || !stock || !image) return res.status(400).json({ Message: "Missing A field" })
        const user = req.user;

        const userRole = user.role === "ADMIN";

        if (!userRole) return res.status(401).json({ Message: "Only admin can upload products" });

        const product = await prisma.product.create({
            data: {
                id: crypto.randomUUID(), name: name, price: Number(price), description, stock: Number(stock), image, category,

                user: {
                    connect: { id: user.id }

                },
                category: {
                    connectOrCreate: [
                        {
                            where: { name: category },
                            create: {
                                name: category
                            }
                        }
                    ]
                },
                tag: {
                    connectOrCreate: [
                        {
                            where: { name: tagName },

                            create: {

                                name: tagName
                            }
                        }
                    ]
                }
            }, include: {
                tag: true,
                category: true,
                user: {
                    select: {
                        fullName: true
                    }
                }
            }
        })

        res.status(201).json({ Message: "Product uploaded successfully", product });

    } catch (error) {
        console.log(error)
        res.status(500).json({ Message: "Internal error", error })
    }

})


router.get("/products", async (req, res) => {
    try {


        const product = await prisma.product.findMany({
            include: {
                tag: true,
                category: true,
                user: {
                    select: {
                        fullName: true
                    }
                }
            }
        })

        res.status(200).json({ Message: "All available product", product })

    } catch (err) {
        console.log(err)
    }
})


export default router