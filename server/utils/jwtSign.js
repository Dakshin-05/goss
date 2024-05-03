import jwt from "jsonwebtoken";
import { configDotenv } from "dotenv"; 

configDotenv();

export const generateAccessToken = (user) => {
    return jwt.sign({
        id: user.id,
        email: user.email,
        username: user.username,
    }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    });
}

export const generateRefreshToken =  (user) => {
    return jwt.sign(
        {
            id: user.id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );
};