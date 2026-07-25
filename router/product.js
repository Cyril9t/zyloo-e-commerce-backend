import express, { json } from "express";
import prisma from "../prismaConfig/prisma.js";
import { uploads } from "../lib/multer.js";
import { uploadToCloudinary } from "../lib/uploadToClodinary.js";

const router = express.Router();


router.post('/upload', uploads.array("images"), async (req, res) => {

    try {

        if (!req.files) {
            // console.log("error", req.files)
            res.status(400).json({ error: 'No file uploaded' });
            return
        }

        const productInfo = JSON.parse(req.body.productInfo)

        const files = req.files

        const uploadedImages = await Promise.all(files.map((file) => uploadToCloudinary(file)))

        if (!uploadedImages) return res.json({ Message: "Error while uploading" })
        const imageUrls = uploadedImages.map((img) => (img.secure_url));

        const { name, price, description, stock, category, tagName, id } = productInfo

        if (!name || !price || !description || !stock) return res.status(400).json({ Message: "Missing A field" })
        const user = req.user;

        const userRole = user.role === "ADMIN";

        if (!userRole) return res.status(401).json({ Message: "Only admin can upload products" });

        const product = await prisma.product.create({
            data: {
                id: crypto.randomUUID(), name: name, price: Number(price), description, stock: Number(stock), category,

                user: {
                    connect: { id: user.id }

                },
                images: {
                    create:

                        imageUrls.map((url) => ({ productImages: url, }))


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
                            where: {
                                name: tagName,
                            },

                            create: {

                                name: tagName
                            }
                        }
                    ]
                }
            }, include: {
                tag: true,
                category: true,
                images: true,
                user: {
                    select: {
                        firstName: true
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
                images: true,
                user: {
                    select: {
                        firstName: true
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