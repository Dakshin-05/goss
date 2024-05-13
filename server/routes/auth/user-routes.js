import { Router } from 'express';
import passport from 'passport';
import {signUp, login, getUser, logout, refreshAccessToken} from '../../controllers/auth/user-controller.js';
import { handleGoogleLogin } from '../../auth/user-auth-controller.js';
import "../../passport/index.js"
import { validate } from '../../validators/validate.js';
import { userLoginValidator, userRegisterValidator } from '../../validators/auth/user-validators.js';
import { verifyJWT } from '../../middlewares/auth-middlewares.js';


const router = Router();

router.route("/signup").post(userRegisterValidator(), validate, signUp)

router.route("/login").post(userLoginValidator(), validate, login);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/logout").post(verifyJWT, logout);

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