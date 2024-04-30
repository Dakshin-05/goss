import express from "express";
import { configDotenv } from "dotenv";
import {db, dbConnect} from "./db/index.js";
import userRouter from "./routes/user-routes.js";


configDotenv();

const app = new express();
app.use(express.json());
await dbConnect();

app.listen(process.env.PORT, (req, res) => {
    console.log(`Server is listening on Port: ${process.env.PORT}`);
});

app.get("/", async(req, res)=>{
    res.json({"message": "Welcome"});
})

app.use("/api",userRouter);
