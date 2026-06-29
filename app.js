import express, { urlencoded } from "express"
import prisma from "./prismaConfig/prisma.js";
import register from "./router/auth.js";
import product from "./router/product.js";
import cors from "cors";

import productMiddleware from "./middlewares/productMiddleware.js"
import { tr } from "zod/v4/locales";
const app = express();
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true
    })
)

const PORT = 8000;

app.use(urlencoded({ extended: true }));

app.use(express.json());

app.use("/auth", register);

app.use("/product", productMiddleware, product);

app.listen(PORT, () => console.log(`server side at http://localhost:${PORT}`));