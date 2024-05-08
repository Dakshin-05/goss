import { Router } from "express";
// import { verifyToken } from "../controllers/auth/user-controller.js";
import { sendMessage } from "../controllers/message-controller.js";
  
const router = new Router();

// router.use(verifyToken);

router.post("/", sendMessage);
// router.post("/messages", getAllMessage);

export default router;