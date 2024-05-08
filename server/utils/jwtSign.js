import jwt from "jsonwebtoken";
import { configDotenv } from "dotenv"; 
import crypto from "crypto"
import bcrypt from 'bcrypt'
import { USER_TEMPORARY_TOKEN_EXPIRY } from "../constants.js";

configDotenv();

export const generateAccessToken = (user) => {
    return jwt.sign({
        id: user.id,
        email: user.email,
        username: user.username,
    }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    });
};

export const isPasswordCorrect = async (password) => {
    return await bcrypt.compare(password, this.password);
 };


export const generateRefreshToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn: process.env.REFRESH_TOKEN_EXPIRY}
    )
}

export const generateTemporaryToken = () => {
    const unHashedToken = crypto.randomBytes(20).toString("hex");

    const hashedToken = crypto.createHash("sha256").update(unHashedToken).digest("hex");

    const tokenExpiry = Date.now() + USER_TEMPORARY_TOKEN_EXPIRY;

    return {unHashedToken, hashedToken, tokenExpiry};
}

