import { Router } from "express";
import { verifyToken } from "../controllers/user-controller.js";
import { sendMessage } from "../controllers/message-controller.js";

const router = new Router();

router.use(verifyToken);

router.post("/", sendMessage);


export default router;