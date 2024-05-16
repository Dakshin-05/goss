import { Router } from "express";
import { verifyJWT } from "../middlewares/auth-middlewares.js";
import { getMessages, sendMessage, deleteMessage, editMessage } from "../controllers/message-controller.js";
import { createServer } from "../controllers/server/server-operation-controller.js";
  
const router = new Router({ mergeParams: true });

router.use(verifyJWT);
router.post("/sendMessage", sendMessage);
// router.post('/createServer', createServer);
router.get("/getMessages", getMessages)
router.patch("/deleteMessage", deleteMessage)
router.patch('/editMessage', editMessage)
// router.post("/messages", getAllMessage);

export default router;