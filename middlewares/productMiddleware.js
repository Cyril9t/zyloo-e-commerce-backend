import { verifyToken } from "../lib/userAuth.js";

const productMiddleware = async (req, res, next) => {
    try {
        const cookie = req.headers.cookie;

        if (!cookie) {
            return res.status(401).json({
                message: "No cookies found",
            });
        }

        const tokenCookie = cookie
            .split("; ")
            .find((v) => v.startsWith("token="));

        if (!tokenCookie) {
            return res.status(401).json({
                message: "Token not found",
            });
        }

        const token = tokenCookie.split("=")[1];

        const decoded = await verifyToken(token);

        if (!decoded) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }

        req.user = decoded

        next();

    } catch (error) {
        console.error(error);

        return res.status(500).json({ message: "Error from middleware" });
    }
};

export default productMiddleware