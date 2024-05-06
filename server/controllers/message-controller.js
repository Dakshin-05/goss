import { ChatEventEnum } from "../constants.js";
import { emitSocketEvent } from "../socket/index.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const sendMessage = asyncHandler(async(req, res)=>{
    const conversationId = req.params;
    const content = req.body;
    if(!content){
        throw new ApiError(400, "message content is required");
    }
    const selectedConversationQuery = await db.query("select * from conversation where id=$1", [conversationId]);

    const selectedConversation = selectedConversationQuery.rows[0];

    if(!selectedConversation){
        throw new ApiError(404, "chat does not exist");
    }
    const message = await db.query("insert into message (conversation_id, sender_id, content returning *", [selectedConversation, req.id, content]);

    emitSocketEvent(req, selectedConversation.member_one_id === req.id ? selectedConversation.member_two_id : req.id, ChatEventEnum.MESSAGE_RECEIVED_EVENT, message);

    return res.status(200).json(new ApiResponse(201, message, "message saved successfully"));

})