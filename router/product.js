import express from "express";
import prisma from "../prismaConfig/prisma.js";
import { warnOnce } from "../generated/prisma/runtime/client.js";

const router = express.Router();

router.post('/upload', async (req, res) => {
    try {

        const { name, price, description, stock, image, category, tagName, id } = req.body

        if (!name || !price || !description || !stock || !image) return res.status(400).json({ Message: "Missing A field" })

        const product = await prisma.product.create({
            data: {
                id: crypto.randomUUID(), name: name, price: Number(price), description, stock: Number(stock), image, category,

                user: {
                    connect: { id: id }

                },
                category: {
                    connectOrCreate: [
                        {
                            where: { name: category },
                            create: {
                                id: crypto.randomUUID(),
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
                                id: crypto.randomUUID(),
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
        const pro = await prisma.product.findMany({
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

        res.json(pro)
    } catch (err) {
        console.log(err)
    }
})


export default router