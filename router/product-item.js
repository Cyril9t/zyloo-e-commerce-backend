import express, { json } from "express";
import prisma from "../prismaConfig/prisma.js";
import { uploads } from "../lib/multer.js";
import { uploadToCloudinary } from "../lib/uploadToClodinary.js";
const router = express.Router()

const multer =

    router.post("/product-item/:id", uploads.array("images"), async (req, res) => {
        try {
            const file = req.files

            const uploadedImages = await Promise.all(file.map((file) => uploadToCloudinary(file)))

            if (!uploadedImages) return res.json({ Message: "Error while uploading ProductItem" })

            const imagUrl = uploadedImages.map((img) => (img.secure_url));

            const { price, stock, color, size, product, } = JSON.parse(req.body.productItemInfo)


            const productImage = imagUrl.map((url) => ({ image: url, }));

            const productsItem = await prisma.productItem.create({
                data: {
                    price, stock, color, size,

                    image: productImage[0].image,

                    product: {
                        connect: {
                            id: req.params.id
                        }
                    }
                },
            })

            res.status(201).json({ Message: 'Product-Item successfully created', item: productsItem })

        } catch (error) {
            console.log(error)
            res.status(500).json({ Message: "Internal Error" })
        }
    })

export default router