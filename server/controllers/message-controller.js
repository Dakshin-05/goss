import { ChatEventEnum } from "../constants.js";
import { db } from "../db/index.js";
import { emitSocketEvent } from "../socket/index.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const sendMessage = asyncHandler(async (req, res) => {
    const { chatId } = req.params;
    const { content } = req.body;

    console.log(content);
    if (!content) {
        return res.status(400).json(new ApiError(400, {}, "Message content is required"));
    }

    try {
        const chatQuery = await db.query("SELECT * FROM chat WHERE id = $1", [chatId]);
        
        if (chatQuery.rowCount === 0) {
            return res.status(404).json(new ApiError(404, {}, "Chat does not exist"));
        }
        
        const chat = chatQuery.rows[0];
        const recipientId = chat.member_one_id === req.user.id ? chat.member_two_id : chat.member_one_id;

        try {
            const message = await db.query("INSERT INTO message (chat_id, sender_id, content) VALUES ($1, $2, $3) RETURNING *", [chat.id, req.user.id, content]);
           
            emitSocketEvent(req, recipientId, ChatEventEnum.MESSAGE_RECEIVED_EVENT, message.rows[0]);
        
            return res.status(200).json(new ApiResponse(200, { message: message.rows[0] }, "Message saved successfully"));
        } catch (err) {
            return res.status(500).json(new ApiResponse(500, {}, "Something went wrong"));
        }
    } catch (err) {
        return res.status(500).json(new ApiResponse(500, {}, "Something went wrong"));
    }
});



export const getMessages = asyncHandler( async(req, res, next) => {
    const {chatId} = req.params;
    if(req.params.userId !== req.user.id){
        return res.status(403).json(new ApiError(403,{}, "User not allowed to access this route"));
    }

    try{
        const chatQuery = await db.query("select * from chat where id=$1", [chatId]);

        if(chatQuery.rowCount === 0){
            return res.status(404).json( new ApiResponse(404, {}, "You are not friends"))
        }

        try{
            const messagesQuery = await db.query("select * from message where chat_id=$1 order by created_at", [chatId]);

            return res.status(200).json( new ApiResponse(200, {messages: messagesQuery.rows}, "Chat messages fetched successfully"))

        } catch(err) {
            console.log(err)
            return res.status(500).json( new ApiResponse(500, {}, "Something went wrong!!"))
        }
    } catch(err) {
        console.log(err)
        return res.status(500).json( new ApiResponse(500, {}, "Something went wrong!!"))
    }
});

export const deleteMessage = asyncHandler(async(req, res, next) =>{
    const {chatId} = req.params;
    const {messageId} = req.body;
    console.log(messageId)
    if(req.params.userId !== req.user.id){
        return res.status(403).json(new ApiError(403,{}, "User not allowed to access this route"));
    }

    try{
        const chatQuery = await db.query("select * from chat where id=$1 and deleted_at is null", [chatId]);

        if(chatQuery.rowCount === 0){
            return res.status(404).json( new ApiResponse(404, {}, "You are not friends"))
        }

        const recipientId = chatQuery.rows[0].member_one_id === req.user.id ? chatQuery.rows[0].member_two_id : chatQuery.rows[0].member_one_id;

        try{
            const messagesQuery = await db.query("select * from message where id=$1 and sender_id=$2", [messageId, req.user.id]);

            if(messagesQuery.rowCount === 0){
                return res.status(404).json( new ApiResponse(404, {}, "Message not found or You are not the sender of the message!!"))
            }

            try{
                const deleteMessageQuery = db.query("delete from message where id=$1",[messageId]);
                emitSocketEvent(req, recipientId, ChatEventEnum.MESSAGE_DELETED_EVENT, messageId);
                return res.status(200).json( new ApiResponse(200, {}, "Messages deleted successfully"))

            } catch(err) {
                console.log(err)
                return res.status(500).json( new ApiResponse(500, {}, "Something went wrong!!"))
            }

        } catch(err) {
            console.log(err)
            return res.status(500).json( new ApiResponse(500, {}, "Something went wrong!!"))
        }
    } catch(err) {
        console.log(err)
        return res.status(500).json( new ApiResponse(500, {}, "Something went wrong!!"))
    }
});

export const editMessage = asyncHandler(async(req, res, next) =>{
    const {chatId} = req.params;
    const {messageId} = req.body;
    const {newContent} = req.body
    console.log(messageId)
    if(req.params.userId !== req.user.id){
        return res.status(403).json(new ApiError(403,{}, "User not allowed to access this route"));
    }

    try{
        const chatQuery = await db.query("select * from chat where id=$1 and deleted_at is null", [chatId]);

        if(chatQuery.rowCount === 0){
            return res.status(404).json( new ApiResponse(404, {}, "You are not friends"))
        }

        const recipientId = chatQuery.rows[0].member_one_id === req.user.id ? chatQuery.rows[0].member_two_id : chatQuery.rows[0].member_one_id;

        try{
            const messagesQuery = await db.query("select * from message where id=$1 and sender_id=$2", [messageId, req.user.id]);

            if(messagesQuery.rowCount === 0){
                return res.status(404).json( new ApiResponse(404, {}, "Message not found or You are not the sender of the message!!"))
            }

            try{
                const editMessageQuery = db.query("update message set updated_at = current_timestamp, content = $2 where id=$1",[messageId, newContent]);
                emitSocketEvent(req, recipientId, ChatEventEnum.MESSAGE_EDITED_EVENT, {
                    messageId: messageId,
                    newContent: newContent
                });
                return res.status(200).json( new ApiResponse(200, {}, "Messages edited successfully"))

            } catch(err) {
                console.log(err)
                return res.status(500).json( new ApiResponse(500, {}, "Something went wrong!!"))
            }

        } catch(err) {
            console.log(err)
            return res.status(500).json( new ApiResponse(500, {}, "Something went wrong!!"))
        }
    } catch(err) {
        console.log(err)
        return res.status(500).json( new ApiResponse(500, {}, "Something went wrong!!"))
    }
});