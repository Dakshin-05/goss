import express from "express";
import { configDotenv } from "dotenv";
import {db, dbConnect} from "./db/index.js";
import userRouter from "./routes/user-routes.js";
import passport from "passport";
import session from "express-session";
import cors from 'cors';
import cookieParser from "cookie-parser";

configDotenv();

const app = new express();
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
await dbConnect();
app.use(express.json());
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie:{
            maxAge: 1000*30
        }
    })
)
app.use("/api",userRouter);
app.use(passport.initialize())
app.use(passport.session())

app.use(cookieParser());

app.listen(process.env.PORT, (req, res) => {
    console.log(`Server is listening on Port: ${process.env.PORT}`);
});

app.get("/", async(req, res)=>{
    res.render("index.ejs")
})

