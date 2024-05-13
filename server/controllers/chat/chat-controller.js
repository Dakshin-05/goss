import { ChatEventEnum } from "../../constants.js";
import { db } from "../../db/index.js";
import { emitSocketEvent } from "../../socket/index.js";
import { ApiError } from "../../utils/apiError.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

// export const createOrGetOneOnOneChat = asyncHandler( async (req, res, next) => {
//     const {receiverId} = req.params;

//     try{
//         const receiverQuery = await db.query("select * from profile where id=$1", [receiverId]);
//         if(receiverQuery.rows.length === 0){
//             throw new Error("Receiver not found")
//         }
//         const receiver = receiverQuery.rows[0];

//         if(receiver.id === req.user.id){
//             throw new Error("Cannot chat with yourself")
//         }
//         try{
//             const chatQuery = await db.query("select * from chat where (member_one_id = $1 and member_two_id = $2) or (member_one_id = $2 and member_two_id = $1)", [req.id, receiver.id]);
//             const chat = chatQuery.rows[0];

//             if(chat){
//                 return res.status(200).json({message:"Chat retrieved successfully", chat: chat})
//             }

//             try{

//                 const newChatQuery = await db.query("insert into chat (member_one_id, member_two_id ) values ($1, $2) returning * ", [req.user.id, receiver.id])

//                 const newChat = newChatQuery.rows[0];
//                 const payload = newChat;
                
//                 emitSocketEvent(req, receiver.id, ChatEventEnum.NEW_CHAT_EVENT, payload )

//                 return res.status(201).json({message:"Chat retrieved successfully", payload:payload})
//             }catch(err){
//                 console.log(err)
//             }
          
//         }catch(err){
//             console.log(err)
//         }

//     }catch(err){
//         console.log(err)
//     }
// })

export const getChat  = asyncHandler(async (req, res, next) => {
    const { friendId } = req.params;
    console.log(friendId)

    if(req.params.userId !== req.user.id){
        return res.status(403).json(new ApiError(403,{}, "User not allowed to access this route"));
    }

    try{
        const receiverQuery = await db.query("select * from profile where id=$1", [friendId]);

        if(receiverQuery.rowCount === 0){
            return res.status(404).json( new ApiResponse(404, {}, "Requested user not found!!"))
        }
        console.log(receiverQuery)

        try{
            const currentChatQuery = await db.query("select * from chat where (member_one_id=$1 and member_two_id=$2) or (member_one_id=$2 and member_two_id=$1)", [req.user.id, friendId]);

            if(currentChatQuery.rowCount === 0){
                return res.status(403).json( new ApiResponse(403, {}, "You both are not friends!!"))
            }
            
            const currentChat = currentChatQuery.rows[0];
            console.log(currentChat)
       
            // const payload = currChat;
                
            // emitSocketEvent(req, friendId, ChatEventEnum.NEW_CHAT_EVENT, payload )

            return res.status(200).json( new ApiResponse(200, {chat: currentChat}, "User chats fetched successfully"))
        } catch(err) {
            return res.status(500).json( new ApiResponse(500, {}, "Somethfing went wrong!!"))
        }
    } catch(err) {
        return res.status(500).json( new ApiResponse(500, {}, "Somethfding went wrong!!"))
    }
  });


export const getAllChats = asyncHandler(async (req, res, next) => {
    
    if(req.params.userId !== req.user.id){
        return res.status(403).json(new ApiError(403,{}, "User not allowed to access this route"));
    }

    try{
        const chatQuery = await db.query("select * from chat where member_one_id = $1 or member_two_id = $1", [req.user.id]);

        return res.status(200).json( new ApiResponse(200, {chats: chatQuery.rows}, "User chats fetched successfully"))

    } catch(err) {
        return res.status(500).json( new ApiError(500, {}, "Something went wrong!!"))
    }
    
  });
