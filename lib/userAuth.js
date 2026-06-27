import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import "dotenv/config"

export const hashPassword = (password) => {
    const salt = 10;
    return bcrypt.hash(password, salt);
}

export const comparePassword = (plainText, hash) => {

    return bcrypt.compare(plainText, hash)
}

export const userToken = (payload) => {

    const token = jwt.sign(payload, process.env.JWT);

    return token;
}

export const verifyToken = (token) => {
    const verify = jwt.verify(token, process.env.JWT)

    return verify
}