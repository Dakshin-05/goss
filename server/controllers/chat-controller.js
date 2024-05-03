import { ChatEventEnum } from "../constants.js";
import { db } from "../db/index.js";
import { emitSocketEvent } from "../socket/index.js";

export const createOrGetOneOnOneChat = async (req, res, next) => {
    const {receiverId} = req.params;
    console.log(receiverId)
    try{
        const result = await db.query("select * from profile where id=$1", [receiverId]);
        if(result.rows.length === 0){
            throw new Error("receiver not found")
        }

        if(result.rows[0].id === req.id){
            throw new Error("cannot chat with yourself")
        }
        try{
            const chat = await db.query("select * from conversation where (member_one_id = $1 and member_two_id = $2) or (member_one_id = $2 and member_two_id = $1)", [req.id, receiverId]);
            if(chat.rows.length !== 0){
                return res.status(200).json({message:"chat retrievekkd successfully", chat: chat.rows[0]})
            }
            try{
                const newChat = await db.query("insert into conversation (member_one_id, member_two_id ) values ($1, $2) returning * ", [req.id, receiverId])
                const payload = newChat.rows[0];
                console.log(newChat)
    
                emitSocketEvent(req, receiverId, ChatEventEnum.NEW_CHAT_EVENT, payload )
                return res.status(201).json({message:"chat retrieveld successfully", payload:payload})
            }catch(err){
                console.log(err)
            }
          
        }catch(err){
            console.log(err)
        }

     

    }catch(err){
        console.log(err)
    }
}

export const getAllChats = async (req, res) => {
  };