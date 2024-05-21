import {Server, Socket} from "socket.io";
import { ChatEventEnum } from "../constants.js";
import { db } from "../db/index.js";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/apiError.js";
import cookie from "cookie"
import { getVisitors } from "../index.js";

const mountJoinChatEvent = (socket) => {
    socket.on(ChatEventEnum.JOIN_CHAT_EVENT, (chatId)=>{
        console.log(`User joined the chat 🤝. chatId:`, chatId);
        socket.join(chatId)
    })
}

const mountJoinChannelChatEvent = (socket) => {
    socket.on(ChatEventEnum.JOIN_CHANNEL_CHAT_EVENT, (channelId)=>{
        console.log(`User joined the channel 🤝. channelId:`, channelId);
        socket.join(channelId)
    })
}

const mountParticipantTypingEvent = (socket) => {
    socket.on(ChatEventEnum.TYPING_EVENT, (chatId)=> {
        socket.in(chatId).emit(ChatEventEnum.TYPING_EVENT, chatId)
    })
}

const mountParticipantStoppedTypingEvent = (socket) => {
    socket.on(ChatEventEnum.STOP_TYPING_EVENT, (chatId)=>{
        socket.in(chatId).emit(ChatEventEnum.STOP_TYPING_EVENT, chatId)
    })
}

const mountMessageDeliveredEvent = (socket) => {
    socket.on(ChatEventEnum.MESSAGE_DELIVERED_EVENT, ({chatId, messageId})=>{
        console.log("from socket Backend: ", chatId, messageId);
        try{
            db.query("update message set read_at = current_timestamp where id = $1", [messageId])
        } catch (err){
            console.log(err)
        }
        socket.in(chatId).emit(ChatEventEnum.MESSAGE_DELIVERED_EVENT, messageId)
    })
}




const initializeSocketIO = (io) => {
    return io.on("connection", async(socket)=> {
        try{
            const cookies = cookie.parse(socket.handshake.headers?.cookie || "");
            let token = cookies?.accessToken;

            if(!token){
                token = socket.handshake.auth?.token;
            }
                    
            if (!token) {
                throw new ApiError(401, "Un-authorized handshake. Token is missing");
            }

            const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

            const userQuery = await db.query("select id, name, username, email from profile where id=$1", [decodedToken.id])


            if(userQuery.rowCount === 0){
                throw new ApiError(401, "un-authorized handshake - user invalid")
            }

            const user = userQuery.rows[0];
            console.log(user)

            socket.user = user;

            socket.join(user.id.toString());
            socket.emit(ChatEventEnum.CONNECTED_EVENT);

            console.log("User connected 🗼. userId: ", user.id.toString());

            mountJoinChatEvent(socket);
            mountJoinChannelChatEvent(socket);
            mountParticipantTypingEvent(socket);
            mountParticipantStoppedTypingEvent(socket);
            mountMessageDeliveredEvent(socket);
            
            socket.on("ok", async user =>{
                console.log("new user")
                socket.user = user;
                io.emit("visitors", await getVisitors())
            });

            socket.on("markMessagesAsSeen", async ({ mId, userId }) => {
                try {
                    await db.query("update message set seen=true where id=$1 and seen=false", [mId])
                    // await Message.updateMany({ conversationId: conversationId, seen: false }, { $set: { seen: true } });
                    // await Conversation.updateOne({ _id: conversationId }, { $set: { "lastMessage.seen": true } });
                    io.to(userId).emit("messagesSeen", { mId });
                } catch (error) {
                    console.log(error);
                }
            });
            

            socket.on(ChatEventEnum.DISCONNECT_EVENT, async () => {
                console.log("user has disconnected 🚫. userId: " + socket.user?.id);
                io.emit("visitors", await getVisitors());
                if(socket.user?.id){
                    socket.leave(socket.user.id);
                }
            })

        }catch(err){
            socket.emit(ChatEventEnum.SOCKET_ERROR_EVENT, err?.message || "socket error")
        }
    })
}

const emitSocketEvent = (req, roomId, event, payload) => {
    req.app.get("io").in(roomId).emit(event, payload);
}

export { initializeSocketIO, emitSocketEvent };