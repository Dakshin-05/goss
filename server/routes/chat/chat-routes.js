import { Router } from "express";
import { verifyJWT } from "../../middlewares/auth-middlewares.js"; 
import { getAllChats, getChat } from "../../controllers/chat/chat-controller.js";
import { validate } from "../../validators/validate.js";
import { uuidPathVariableValidator } from "../../validators/common/postgres-validators.js";

const router = Router({ mergeParams: true });

// router.use(verifyJWT);


router.get("/:friendId/getChat", getChat)
router.get("/getAllChats", getAllChats)
// router.route("/:receiverId").get(getMessages)


export default router;