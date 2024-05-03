import {Server, Socket} from "socket.io";
import { AvailableChatEvents, ChatEventEnum } from "../constants.js";
import { db } from "../db/index.js";

const mountJoinChatEvent = (socket) => {
    socket.on(ChatEventEnum.JOIN_CHAT_EVENT, (chatId)=>{
        console.log(`User joined the chat 🤝. chatId: `, chatId);
        socket.join(chatId)

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

export const initializeSocketIO = (io) => {
    return io.on("connection", async(socket)=> {
        console.log(socket);
        try{
            const cookie = cookie.parse(socket.handshake.headers?.cookie || "");
            const token = cookie.split(';').filter((item) => {
                const data = item.trim().split('=');
                console.log(data)
                if(data[0] !== "connect.sid") 
                return data[1];
            })[0].split('=')[1];

            if(!token){
                throw new Error("un-authorized handshake - token invalid")
            }

            const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

            const user = await db.query("select * from profile where id=$1", [decodedToken.id])

            if(!user){
                throw new Error("un-authorized handshake - user invalid")
            }

            socket.user = user;

            socket.join(user.id.toString());
            socket.emit(ChatEventEnum.CONNECTED_EVENT);

            console.log("User connected 🗼. userId: ", user.id.toString());

            mountJoinChatEvent(socket);
            mountParticipantTypingEvent(socket);
            mountParticipantStoppedTypingEvent(socket);
            
            socket.on(ChatEventEnum.DISCONNECT_EVENT, () => {
                console.log("user has disconnected 🚫. userId: " + socket.user?.id);
                if(socket.user?.id){
                    socket.leave(socket.user.id);
                }
            })

        }catch(err){
            socket.emit(ChatEventEnum.SOCKET_ERROR_EVENT, err?.message || "socket error")
        }
    })
}

export const emitSocketEvent = (req, roomId, event, payload) => {
    req.app.get("io").in(roomId).emit(event, payload);
}

