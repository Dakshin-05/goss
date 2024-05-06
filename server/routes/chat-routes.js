import { Router } from "express";
import { verifyToken } from "../controllers/user-controller.js";
import { createOrGetOneOnOneChat, getAllChats } from "../controllers/chat-controller.js";

const chatRouter = Router();

chatRouter.use(verifyToken)

chatRouter.post("/:receiverId",createOrGetOneOnOneChat )
chatRouter.get("/getAllChats", getAllChats)

export default chatRouter;