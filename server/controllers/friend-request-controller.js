import {db} from "../db/index.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const makeFriendRequest = asyncHandler(async (req, res, next) => {
    const {requestedUsername} = req.body;
    console.log(req.id)
    if(req.params.userId !== req.id){
        return res.status(403).json({message: "User not allowed to access this route"});
    }
    try{
        const requestedUser = await db.query(`select * from profile where username=$1;`,[requestedUsername])
        if(requestedUser.rows.length === 0){
            return res.status(404).json({message: "Requested user not found"})
        }    
        try{

            await db.query(`insert into friend_request (from_id, to_id) values ($1, $2)`, [req.id, requestedUser.rows[0].id])
            return res.status(200).json({message: "Request sent successfully"});
        }catch(err){
            console.log(err)
        }
    }catch(err){
        console.log(err)
    }

})

export const handleFriendRequest = asyncHandler(async (req, res, next) => {
    const {fromId, toId, status} = req.body;
    if(req.params.userId !== req.id){
        return res.status(403).json({message: "User not allowed to access this route"});
    }
    console.log(status)
    if(status !== 'accepted' && status !== 'blocked'){
        return res.status(422).json({message: "Invalid status"});
    }

    try{
        await db.query(`update friend_request set status = $1 where from_id = $2 and to_id = $3`, [status, fromId, toId])
        return res.status(200).json({message: "Request handled successfully"});
    }catch(err){
        console.log(err)
    }

})

export const showAllFriends =  asyncHandler(async (req, res, next) => {
    if(req.params.userId !== req.id){
        return res.status(403).json({message: "User not allowed to access this route"});
    }
    try{
        const allFriends = await db.query(`select username from profile where profile.id in ((select friend_id from friends where user_id=$1) union (select user_id from friends where friend_id=$1)) `, [req.id])
        return res.status(200).json({message: "fetched successfully", allFriends: allFriends.rows})
    }catch(err){
        console.log(err)
    }
})

export const showBlockedUsers = asyncHandler(async (req, res, next) => {
    if(req.params.userId !== req.id){
        return res.status(403).json({message: "User not allowed to access this route"});
    }
    try{
        const blockedUsers = await db.query(`select username from blocked_users join profile on profile.id = blocked_id where user_id=$1`, [req.id])
        return res.status(200).json({message: "fetched successfully", blockedUsers: blockedUsers.rows})
    }catch(err){
        console.log(err)
    }
})

export const showPendingRequests = asyncHandler( async (req, res, next) => {
    if(req.params.userId !== req.id){
        return res.status(403).json({message: "User not allowed to access this route"});
    }
    try{
        const incomingPendingRequests = await db.query(`select username from profile join friend_request on profile.id=to_id where to_id=$1 and status=$2`, [req.id, 'pending'])
        const outgoingPendingRequests = await db.query(`select username from profile join friend_request on profile.id=from_id where from_id=$1 and status=$2`, [req.id, 'pending'])
        return res.status(200).json({message: "fetched successfully", incomingPendingRequests: incomingPendingRequests.rows, outgoingPendingRequests: outgoingPendingRequests.rows})
    }catch(err){
        console.log(err)
    }
})

