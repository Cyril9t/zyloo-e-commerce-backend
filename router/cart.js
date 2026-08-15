import express, { json } from "express";
import prisma from "../prismaConfig/prisma.js";
import { date } from "zod";
import { _isoDateTime } from "zod/v4/core";

const router = express.Router()


router.post("/cart", async (req, res) => {
    try {
        const user = req.user

        const { productItemId, quantity } = req.body


        const cart = await prisma.cart.findUnique({
            where: { userId: user.id },
        })

        if (!cart) {

            const createCart = await prisma.cart.create({
                data: {
                    user: {
                        connect: {
                            id: user.id
                        }
                    }
                }
            })
        }

        const ExistingItem = await prisma.cartItem.findFirst({
            where: { productItemId: productItemId, cartId: cart.id }
        })

        if (ExistingItem) {

            const UpdateItem = await prisma.cartItem.update({
                where: { id: ExistingItem?.id },
                data: {
                    quantity: ExistingItem.quantity + quantity
                }
            })
            res.json({ Message: "Updated", Item: UpdateItem })
            return
        }

        const createItem = await prisma.cartItem.create({
            data: {
                cartId: cart.id, productItemId, quantity
            }
        })

        res.status(201).json({ Massage: "Product Added Successfully", update: createItem })

    } catch (error) {
        console.log(error)
        res.status(500).json({ Massage: "Internal Error" })
    }
})


router.get("/cartsItem", async (req, res) => {
    try {
        const user = req.user;

        const cart = await prisma.cart.findUnique({
            where: { userId: user.id },
            include: {
                items: true
            }
        })

        const cartItem = await prisma.cartItem.findMany({
            where: { cartId: cart.id },
            include: {
                productItem: {
                    include: {
                        product: {
                            select: {
                                name: true,
                                description: true
                            }
                        },

                    }
                }

            },
        })

        res.status(200).json({ Message: "Your Cart", cart: cartItem });

    } catch (error) {
        console.log(error)
        res.status(500).json({ Message: "Internal Error" })
    }
})


router.patch("/cartUpdate/:id", async (req, res) => {
    try {

        const { productItemId, quantity } = req.body

        const ExistingItem = await prisma.cartItem.findFirst({
            where: { productItemId }
        })

        const item = await prisma.cartItem.update({
            where: { id: req.params.id },
            data: {
                quantity: ExistingItem.quantity + 1
            }
        })

        res.json({ Message: "Updated", item: item })

    } catch (error) {
        console.log(error)
        res.status(500).json({ Message: "internal error" })
    }
})

router.patch("/minusCartItem/:id", async (req, res) => {
    try {

        const { productItemId, quantity } = req.body

        const ExistingItem = await prisma.cartItem.findFirst({
            where: { productItemId }
        })

        const item = await prisma.cartItem.update({
            where: { id: req.params.id },
            data: {
                quantity: ExistingItem.quantity - 1
            }
        })

        res.json({ Message: "Updated", item: item })

    } catch (error) {
        console.log(error)
        res.status(500).json({ Message: "internal error" })
    }
})


router.delete("/deleteCart/:id", async (req, res) => {
    try {
        const deleteItem = await prisma.cartItem.delete({
            where: { id: req.params.id }
        })

        const cartItem = await prisma.cartItem.findMany({
            include: {
                productItem: {
                    include: {
                        product: {
                            select: {
                                name: true,
                                description: true
                            }
                        },

                    }
                }

            },
        })
        res.json({ Message: "Deleted", cart: cartItem })

    } catch (error) {
        console.log(error)
        res.json({ Message: "Internal Error" })
    }
})


router.delete("/deleteCarts", async (req, res) => {
    try {
        const user = req.user;
        const findCart = await prisma.cart.findUnique({
            where: { userId: user.id }
        })

        if (!findCart) return res.json({ Message: "No cart found" })


        const deleteItem = await prisma.cartItem.deleteMany({
            where: { cartId: findCart.id }
        })



        res.json({ Message: "Order Placed", deleteItem })
    } catch (error) {
        console.log(error)
        res.status(500).json({ Message: "Internal Error" })
    }
})

export default router