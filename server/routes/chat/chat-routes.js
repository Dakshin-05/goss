import { Router } from "express";
import { verifyJWT } from "../../middlewares/auth-middlewares.js";
import { createOrGetOneOnOneChat, getAllChats } from "../../controllers/chat/chat-controller.js";
import { validate } from "../../validators/validate.js";
import { uuidPathVariableValidator } from "../../validators/common/postgres-validators.js";

const router = Router();

router.use(verifyJWT);

router.route("/").get(getAllChats);
router.route("/:receiverId").post(uuidPathVariableValidator("receiverId"), validate, createOrGetOneOnOneChat)


export default router;