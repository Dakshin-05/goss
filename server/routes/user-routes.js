import express from 'express';
import passport from 'passport';
import {signUp, login, verifyToken, getUser, refreshToken, logout} from '../controllers/user-controller.js';
import { handleGoogleLogin } from '../auth/user-auth-controller.js';
import "../passport/index.js"


const userRouter = express.Router();


userRouter.post("/signup", signUp);
userRouter.post("/login", login);
userRouter.get('/refresh', refreshToken, verifyToken, getUser);
userRouter.post('/logout', verifyToken, logout);

userRouter.get('/auth/google',
passport.authenticate("google", {
    scope: ["profile", "email"]
})
)

userRouter.get("/auth/google/callback", 
passport.authenticate("google", {
    failureRedirect: "/api/login"
}),

handleGoogleLogin,

)

userRouter.get('/user/:userId', verifyToken, getUser);
export default userRouter;