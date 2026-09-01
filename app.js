import cors from "cors";
import express, { urlencoded } from "express"
import prisma from "./prismaConfig/prisma.js";
import register from "./router/auth.js";
import product from "./router/product.js";
import middleware from "./middlewares/middleware.js"
import me from "./router/me.js";
import totalUser from "./router/users.js";
import cart from "./router/cart.js";
import productItem from "./router/product-item.js";
import checkOut from "./router/CheckOut.js";
import Orders from "./router/Orders.js";
import verify from "./paymentGateWay/verifyPayment.js"
import passport from "passport";
import "dotenv/config"
import "./Oauth2/PassportConfig.js";

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

app.use(passport.initialize())




app.use("/auth", register);

app.use("/user", middleware, me)

app.use("/users", totalUser)

app.use("/product", middleware, product);

app.use("/cart", middleware, cart)

app.use("/product", middleware, productItem)

app.use("/checkOut", middleware, checkOut)

app.use("/Order", middleware, Orders)

app.use("/Payment", middleware, verify)


app.listen(PORT, () => console.log(`server side at http://localhost:${PORT}`));