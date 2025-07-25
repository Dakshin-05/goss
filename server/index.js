import express from "express";
import { configDotenv } from "dotenv";
import {db, dbConnect} from "./db/index.js";
import userRouter from "./routes/auth/user-routes.js";
import passport from "passport";
import session from "express-session";
import cors from 'cors';
import cookieParser from "cookie-parser";
import friendRequestRouter from "./routes/friend-request-routes.js";
import { initializeSocketIO } from "./socket/index.js";
import { Server } from "socket.io";
import { createServer } from "http";
import chatRouter from "./routes/chat/chat-routes.js";
import messageRouter from "./routes/message-routes.js"
import serverRequestRouter from "./routes/server/server-request-routes.js"
import serverOperationRouter from "./routes/server/server-operations-routes.js"
import {errorHandler} from "./middlewares/error-middlewares.js"

configDotenv();

const app = express();

const httpServer = createServer(app);

const io = new Server(httpServer, {
    pingTimeout: 60000,
    cors: {
        origin: process.env.CORS_ORIGIN ,
        credentials: true
    }
});

app.set("io", io);


export const getVisitors = async() => {
   
    let users = [];
    const sockets = await io.fetchSockets()
 sockets.forEach(socket => {
    if(socket.user)
    users.push(socket?.user?.id)
 });
    return users; 
  };
  

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));

await dbConnect();
app.use(express.json());
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser());

initializeSocketIO(io); 

app.use(
    session({
        secret: process.env.EXPRESS_SESSION_SECRET,
        resave: true,
        saveUninitialized: true,
    })
)

app.use(passport.initialize())
app.use(passport.session())

app.use("/api",userRouter);
app.use("/api/user/:userId/",friendRequestRouter);
app.use("/api/user/:userId/", chatRouter)
app.use("/api/user/:userId/:chatId", messageRouter);

app.use("/api/user/:userId/", serverRequestRouter)
app.use("/api/user/:userId/", serverOperationRouter)

app.use(errorHandler)
httpServer.listen(process.env.PORT, (req, res) => {
    console.log(`Server is listening on Port: ${process.env.PORT}`);
});

