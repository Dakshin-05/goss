import {db} from "../db/index.js";
import { generateAccessToken,generateRefreshToken } from "../utils/jwtSign.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const saltRounds = 5;

export const signUp = async (req, res, next) =>{
    const {username, password, name, email} = req.body;

    console.log(req.body);
    
    try{
        const existingUser = await db.query(`select * from test where username=$1;`,[username])
        
        if(existingUser.rows.length !== 0){
            res.status(201).json({"message":"Username already exists!!"});
            return ;
        }

        const queryStr1 = `INSERT INTO profile(username, name, email, password) values($1, $2, $3, $4)`;
        bcrypt.hash(password, saltRounds, async(err, hash) => {
            if(err){
                console.log(err);
            }else{
                await db.query(
                    queryStr1, [username, name, email, hash]
                )
            }
        })

    } catch(err){
        console.log(err);
    } 


    res.status(200).json({message: "user created successfully!!"});
}

export const login = async (req, res, next) => {
    const {username, email, password} = req.body;
    try{
        console.log(username, email, password);
        const existingUser = username ? await db.query(`select * from profile where username=$1;`,[username]) : await db.query(`select * from profile where email=$1;`,[email])
        console.log(existingUser)
        if(existingUser.rows.length === 0){
            res.status(400).json({message:"Username do not exist!!"});
            res.redirect("/api/signup");
            return;
        }
        const user = existingUser.rows[0];

        if(!bcrypt.compareSync(password, user.password)){
            return res.status(400).json({message:"Incorrect email or password"});
        }

        const token = generateAccessToken(user);

        res.cookie(String(user.id), token, {
            path: '/',
            expires: new Date(Date.now() + 30000),
            httpOnly: true,
            sameSite: 'lax'
        })

        console.log("token: "+ token);

        
        res.status(200).json({message:"You are successfully logged in"})

    }catch(err){
        console.log(err)
    }
}

export const getUser = async (req, res, next) => {
        const userId = req.id
        try{
            const user = await db.query(`select * from profile where id=$1;`,[userId])
            if(!user.rows){
                return res.status(404).json({message: "User not found"})
            }    
            res.status(200).json({user});
        }catch(err) {
            console.log(err);
            res.redirect("/api/login");
        }
   
}

export const verifyToken = (req, res, next) => {
    const cookie = req.headers.cookie;
    const token = cookie.split(';').filter((item) => {
        const data = item.trim().split('=');
        console.log(data)
        if(data[0] !== "connect.sid") 
        return data[1];
    })[0].split('=')[1];

    if(!token){
        return res.status(404).json({message:"Token not found"})
    }

    jwt.verify(String(token), process.env.ACCESS_TOKEN_SECRET, (err, user)=>{
        if(err){
            return res.status(400).json({message: "Invalid token"})
        }
        req.id = user.id;
        next();
    })
}

export const refreshToken = (req, res, next)=> {
    const cookie = req.headers.cookie;
    const previousToken  = cookie.split(';').filter((item) => {
        const data = item.trim().split('=');
        console.log(data)
        if(data[0] !== "connect.sid") 
        return data[1];
    })[0].split('=')[1];
    console.log(previousToken)

    if(!previousToken){
        return res.status(400).json({message:"Cannot find the token"});
    }
    jwt.verify(String(previousToken), process.env.ACCESS_TOKEN_SECRET, (err, user)=>{
        if(err){
            console.log(err);
            return res.status(403).json({message:"Authentication failed"})
        }
        res.clearCookie(`${user.id}`);
        res.cookie[`${user.id}`] = "";
        const token = generateRefreshToken(user);
        
        console.log("refreshed token : " + token);

        res.cookie(String(user.id), token, {
            path: '/',
            expires: new Date(Date.now() + 30000),
            httpOnly: true,
            sameSite: 'lax'
        })

        req.id = user.id;
        next();
    })

}

export const logout = async (req, res, next) =>{
    const cookie = req.headers.cookie;
    const prevToken = cookie.split(';').filter((item) => {
        const data = item.trim().split('=');
        console.log(data)
        if(data[0] !== "connect.sid") 
        return data[1];
    })[0].split('=')[1];
    
    if(!prevToken){
        return res.status(400).json({message: "Cannot find the token"});
    }

    jwt.verify(String(prevToken), jwtSecretKey, (err, user) => {
        if(err){
            console.log(err);
            return res.status(403).json({message: "Authentication failed"})
        }

        res.clearCookie(`${user.id}`);
        res.cookie[`${user.id}`] = "";

        return res.status(200).json({message: "Successfully logged out"})
    });
}
