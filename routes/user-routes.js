import express from 'express';
import {signUp, login, verifyToken, getUser, refreshToken, logout} from '../controllers/user-controller.js';


const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);
router.get('/user', verifyToken, getUser);
router.get('/refresh', refreshToken, verifyToken, getUser);
router.get('/logout', verifyToken, logout);

export default router;