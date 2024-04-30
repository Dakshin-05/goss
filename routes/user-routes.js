import express from 'express';
import passport from 'passport';
import {signUp, login, verifyToken, getUser, refreshToken, logout} from '../controllers/user-controller.js';
import "../passport/index.js"


const router = express.Router();


router.post("/signup", signUp);
router.post("/login", login);
router.get('/user', (req, res)=>{
    res.send("login success")
});
router.get('/refresh', refreshToken, verifyToken, getUser);
router.get('/logout', verifyToken, logout);

router.get('/auth/google',
passport.authenticate("google", {
    scope: ["profile", "email"]
}),
(req, res)=>{
    res.send("redirecting to google")
     console.log("redirecting to google")
} )

router.get("/auth/google/callback", 
passport.authenticate("google", {
    successRedirect: "/api/user",
    failureRedirect: "/api/login"
})
)

export default router;