import { ChatEventEnum } from "../../constants.js";
import { db } from "../../db/index.js";
import { emitSocketEvent } from "../../socket/index.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const createOrGetOneOnOneChat = asyncHandler( async (req, res, next) => {
    const {receiverId} = req.params;

    try{
        const receiverQuery = await db.query("select * from profile where id=$1", [receiverId]);
        if(receiverQuery.rows.length === 0){
            throw new Error("Receiver not found")
        }
        const receiver = receiverQuery.rows[0];

        if(receiver.id === req.user.id){
            throw new Error("Cannot chat with yourself")
        }
        try{
            const chatQuery = await db.query("select * from chat where (member_one_id = $1 and member_two_id = $2) or (member_one_id = $2 and member_two_id = $1)", [req.id, receiver.id]);
            const chat = chatQuery.rows[0];

            if(chat){
                return res.status(200).json({message:"Chat retrieved successfully", chat: chat})
            }

            try{

                const newChatQuery = await db.query("insert into chat (member_one_id, member_two_id ) values ($1, $2) returning * ", [req.user.id, receiver.id])

                const newChat = newChatQuery.rows[0];
                const payload = newChat;
                
                emitSocketEvent(req, receiver.id, ChatEventEnum.NEW_CHAT_EVENT, payload )

                return res.status(201).json({message:"Chat retrieved successfully", payload:payload})
            }catch(err){
                console.log(err)
            }
          
        }catch(err){
            console.log(err)
        }

    }catch(err){
        console.log(err)
    }
})

export const getAllChats = asyncHandler(async (req, res, next) => {
    try{
        const allChats = await db.query("select * from chat where member_one_id=$1 or member_two_id=$1", [req.user.id]);
        return res.status(200).json({chats: allChats.rows || [], message: "User chats fetched successfully"})
    }catch(err){
        console.log(err);
    }
  });