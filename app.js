import cors from "cors";
import express, { urlencoded } from "express"
import prisma from "./prismaConfig/prisma.js";
import register from "./router/auth.js";
import product from "./router/product.js";
import middleware from "./middlewares/middleware.js"
import me from "./router/me.js";
import totalUser from "./router/users.js";
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

app.use("/user", middleware, me)

app.use("/users", totalUser)

app.use("/product", middleware, product);

app.listen(PORT, () => console.log(`server side at http://localhost:${PORT}`));