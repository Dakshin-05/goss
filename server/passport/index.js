import passport from "passport";
import {db} from "../db/index.js"
import { Strategy as GoogleStrategy } from "passport-google-oauth2";

// passport.use(
//     "local",
//     new Strategy(async function verify(email, password, cb){
//         try{
//             const result = await db.query("SELECT * FROM profile WHERE email=$1", [email]);
//             if(result.rows.length){
//                 const user = result.rows[0];
//                 bcrypt.compare(password, user.password, (err, result)=>{
//                     if(err) return cb(err);
//                     else if(result) return cb(null, user);
//                     else return cb(null, false);
//                 })
//             }else{
//                 return cb("User not found");
//             }
//         }catch(err){
//             return cb(err);
//         }
//     })
// )


passport.use(
    "google",
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:5000/api/auth/google/callback",
            userProfileURL: "https://www/googleapis.com/oauth2/v3/userinfo"
        },
        async (accessToken, refreshToken, profile, cb) => {
            
            console.log(profile);
            try{
                const result = await db.query("SELECT * FROM profile WHERE email=$1", [profile.email]);
                if(result.rows.length === 0){
                    const username = profile.email.split('@')[0];
                    const {displayName, email, _json:{sub:password}} = profile;
                    const newResult = await db.query("INSERT INTO profile (username, name, email, password) VALUES ($1, $2, $3, $4) RETURNING id, username,name, email", [username, displayName, email, password]);
                    const newUser = newResult.rows[0];
                    console.log(newUser)
                    cb(null, newUser)
                }else{
                    console.log(result.rows[0])
                    cb(null, result.rows[0]);
                }
            }catch(err){
                cb(err);
            }
        }
    )
)

passport.serializeUser((user, cb)=>{
    cb(null, user);
})

passport.deserializeUser((user, cb)=>{
    cb(null, user);
})



