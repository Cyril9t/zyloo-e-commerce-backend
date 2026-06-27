import express, { urlencoded } from "express"
import prisma from "./prismaConfig/prisma.js";
import register from "./router/auth.js";
import product from "./router/product.js";
// export const router = express.Router();
const app = express();
const PORT = 8000;

app.use(urlencoded({ extended: true }));

app.use(express.json());

app.use("/auth", register)
app.use("/product", product)

app.listen(PORT, () => console.log(`server side at http://localhost:${PORT}`));
