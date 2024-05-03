import express from 'express';
import passport from 'passport';
import {signUp, login, verifyToken, getUser, refreshToken, logout} from '../controllers/user-controller.js';
import { handleGoogleLogin } from '../auth/user-auth-controller.js';
import "../passport/index.js"


const router = express.Router();


router.post("/signup", signUp);
router.post("/login", login);
router.get('/user', verifyToken, getUser);
router.get('/refresh', refreshToken, verifyToken, getUser);
router.post('/logout', verifyToken, logout);

router.get('/auth/google',
passport.authenticate("google", {
    scope: ["profile", "email"]
})
)

router.get("/auth/google/callback", 
passport.authenticate("google", {
    failureRedirect: "/api/login"
}),

    handleGoogleLogin,
    
)

export default router;