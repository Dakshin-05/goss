import {db} from "../../db/index.js";
import { ApiError } from "../../utils/apiError.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { generateAccessToken,generateRefreshToken, generateTemporaryToken } from "../../utils/jwtSign.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const saltRounds = 5;

const generateAccessAndRefreshTokens = async (userId) => {
    try {
      const userQuery = await db.query("select * from profile where id=$1", [userId])

      const user = userQuery.rows[0];
  
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);
  
      user.refreshToken = refreshToken;

      await db.query("update profile set validate_before_save=false where id=$1", [userId]);
      return { accessToken, refreshToken };
    } catch (error) {
      return res.status(500).json(new ApiError(500,  "Something went wrong!!"))
    }
  };

export const signUp = asyncHandler( async (req, res) =>{
    const {username, password, name, email} = req.body;
    console.log(username, password, name, email)
    try{
        const existingUser = await db.query(`select * from profile where username=$1`,[username])
        if(existingUser.rows.length !== 0){
            return res.status(409).json(ApiError(409, "User already exists"));
        }
        
        bcrypt.hash(password, saltRounds, async(err, hash) => {
            if(err){
              return res.status(500).json(new ApiError(500,  "Something went wrong!!"))
            }else{
                try{
                    const createdUser = await db.query(
                        "INSERT INTO profile(username, name, email, password, validate_before_save) values($1, $2, $3, $4, $5) returning *", [username, name, email, hash, false]
                    )
                    if(!createdUser.rows.length){
                      return res.status(500).json(new ApiError(500, "Something went wrong while registering the user"));
                    }
                    return res.status(201).json(new ApiResponse(200, {user:createdUser.rows[0]}, "User registered successfully"))
                }catch(err){
                  return res.status(500).json(new ApiError(500, "Something went wrong while registering the user"));
                }
            }
        })
    } catch(err){
      return res.status(500).json(new ApiError(500, "Something went wrong while registering the user"));
    } 
})

export const login = asyncHandler( async (req, res) => {
    const { usernameOrEmail, password} = req.body;
    if(!usernameOrEmail) {
      return res.status(400).json( new ApiError(400, "Username or email is required"));
    }
    try{
        const userQuery =  await db.query(`select * from profile where username=$1 or email=$1`,[usernameOrEmail]) 

        if(userQuery.rows.length === 0){
          return res.status(500).json(new ApiError (500, "User does not exist"))
        }
        const user = userQuery.rows[0]

        if(!bcrypt.compareSync(password, user.password)){
          return res.status(401).json(new ApiError(401, "Invalid user credentials"))
        }

        const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user.id)

        try{
            const loggedInUserQuery = await db.query("select id, name, username, email from profile where id=$1", [user.id])
            
            const loggedInUser = loggedInUserQuery.rows[0];

            const options = {
                httpOnly: true,
                secure:  true,
                expiresIn: 200000
            };

            console.log(accessToken)
                
            return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { user: loggedInUser, accessToken, refreshToken},
                    "User logged in successfully"));
        }catch(err){
          return res.status(500).json(new ApiError(500, "Something went wrong while registering the user"));
        }
    }catch(err){
      return res.status(500).json(new ApiError(500, "Something went wrong while registering the user"));
    }
})

export const logout = asyncHandler(async (req, res) => {

    try{
        await db.query("update profile set refresh_token=NULL where id = $1", [req.user.id]);
        const options = {
            httpOnly: true,
            secure: true,
          };
            return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out"));  
    }catch(err){
      return res.status(500).json(new ApiError(500, "Something went wrong while registering the user"));
    }
});


export const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken =
      req.cookies.refreshToken || req.body.refreshToken;
  
    if (!incomingRefreshToken) {
      return res.status(401).json(new ApiError(401, "Unauthorized request"));
    }
  
    try {
      const decodedToken = jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
      const userQuery = await db.query("select * from profile where id=$1", [decodedToken?.id]);

      if (user.rows.length === 0) {
        return res.status(401).json(ApiError(401, "Invalid refresh token"));
      }

      const user = userQuery.rows[0];

      if (incomingRefreshToken !== user?.refreshToken) {
        return res.status(401).json(new ApiError(401, "Refresh token is expired or used"));
      }
      const options = {
        httpOnly: true,
        secure: true,
      };

      
    const { accessToken, refreshToken: newRefreshToken } =
    await generateAccessAndRefreshTokens(user.id);

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", newRefreshToken, options)
    .json(
      new ApiResponse(
        200,
        { accessToken, refreshToken: newRefreshToken },
        "Access token refreshed"
      )
    );
} catch (error) {
  return res.status(401).json(new ApiError(401, error?.message || "Invalid refresh token"));
}
});


export const getUser = asyncHandler(async (req, res, next) => {
        const userId = req.id

        if(req.params.userId !== req.id){
            return res.status(403).json({message: "User not allowed to access this route"});
        }

        try{
            const user = await db.query(`select * from profile where id=$1;`,[userId])
            if(!user.rows){
                return res.status(404).json({message: "User not found"})
            }    
            return res.status(200).json({user: user.rows[0]});
        }catch(err) {
            console.log(err);
            res.redirect("/login");
        }
   
})

// export const verifyToken = asyncHandler((req, res, next) => {
//     const cookie = req.headers.cookie;
//     const token = cookie.split(';').filter((item) => {
//         const data = item.trim().split('=');
//         if(data[0] !== "connect.sid") 
//         return data[1];
//     })[0].split('=')[1];

//     if(!token){
//         return res.status(404).json({message:"Token not found"})
//     }

//     jwt.verify(String(token), process.env.ACCESS_TOKEN_SECRET, (err, user)=>{
//         if(err){
//             return res.status(400).json({message: "Invalid token"})
//         }
//         req.id = user.id;
//         next();
//     })
// })

// export const refreshToken = asyncHandler((req, res, next)=> {
//     const cookie = req.headers.cookie;

//     const previousToken  = cookie.split(';').filter((item) => {
//         const data = item.trim().split('=');
//         console.log(data)
//         if(data[0] !== "connect.sid") 
//         return data[1];
//     })[0].split('=')[1];

//     if(!previousToken){
//         throw new ApiError(401, "Unauthorized access");
//     }

    
//     jwt.verify(String(previousToken), process.env.ACCESS_TOKEN_SECRET, (err, user)=>{
//         if(err){
//             console.log(err);
//             return res.status(403).json({message:"Authentication failed"})
//         }
        
//         res.clearCookie(`${user.id}`);
//         res.cookie[`${user.id}`] = "";
//         const token = generateRefreshToken(user);
//         res.cookie(String(user.id), token, {
//             path: '/',
//             expires: new Date(Date.now() + 30000),
//             httpOnly: true,
//             sameSite: 'lax'
//         })
//         req.id = user.id;
//         next();
//     })
    

// })

// export const logout = asyncHandler(async (req, res, next) =>{
//     const cookie = req.headers.cookie;
//     const previousToken = cookie.split(';').filter((item) => {
//         const data = item.trim().split('=');
//         if(data[0] !== "connect.sid") 
//         return data[1];
//     })[0].split('=')[1];
    
//     if(!previousToken){
//         throw new ApiError(400, "Cannot find the token")
//     }

//     jwt.verify(String(previousToken), process.env.ACCESS_TOKEN_SECRET, (err, user) => {
//         if(err){
//             return res.status(403).json({message: "Authentication failed"})
//         }

//         res.clearCookie(`${user.id}`);
//         res.cookie[`${user.id}`] = "";

//         return res.status(200).json({message: "Successfully logged out"})
//     });
// })


