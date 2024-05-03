import { generateAccessToken } from "../utils/jwtSign.js";

export const handleGoogleLogin = (req, res, next) => {
    const {user} = req;
    console.log(req)
    const token = generateAccessToken(user);

        res.cookie(String(user.id), token, {
            path: '/',
            expires: new Date(Date.now() + 120000),
            httpOnly: true,
            sameSite: 'lax'
        })

        console.log("token: "+ token);

        res.status(200).json({message:"You are successfully logged in"});
        res.redirect("/api/user")
}