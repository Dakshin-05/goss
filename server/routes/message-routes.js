import { Router } from "express";
import { verifyJWT } from "../middlewares/auth-middlewares.js";
import { getMessages, sendMessage } from "../controllers/message-controller.js";
import { createServer } from "../controllers/server/server-operation-controller.js";
  
const router = new Router({ mergeParams: true });

router.use(verifyJWT);
// router.post("/", sendMessage);
// router.post('/createServer', createServer);
router.get("/getMessages", getMessages)
// router.post("/messages", getAllMessage);

export default router;