import { Router } from "express";
import { verifyToken } from "../controllers/user-controller.js";
import { createOrGetOneOnOneChat } from "../controllers/chat-controller.js";

const chatRouter = Router();

chatRouter.use(verifyToken)

chatRouter.post("/:receiverId",createOrGetOneOnOneChat )

export default chatRouter;