import {db} from "../db/index.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const makeFriendRequest = asyncHandler(async (req, res, next) => {
    const {requestedUsername} = req.body;
    console.log(requestedUsername, "friend_request")
    if(req.params.userId !== req.user.id){
        return res.status(403).json(new ApiError(403,"User not allowed to access this route"));
    }

    try{
        const requestedUserQuery = await db.query(`select * from profile where username=$1;`,[requestedUsername])
        if(requestedUserQuery.rows.length === 0){
            return res.status(202).json(new ApiResponse(202,{},"Requested user not found"))
        }    
        const requestedUser = requestedUserQuery.rows[0];
        if(requestedUser.id === req.user.id){
            return res.status(201).json(new ApiResponse(201, {},"You cannot be friends with yourself"))
        }
            try{
                const isBlockedQuery = await db.query(`select * from blocked_users where user_id=$1 and blocked_id=$2`, [requestedUser.id, req.user.id])
                if(isBlockedQuery.rows.length !== 0){ 
                    return res.status(202).json(new ApiResponse(202,{},"Requested user not found"))
                }  
            }catch(err){
                console.log(err)
                return res.status(500).json(new ApiError(500, "Something went wrong!!"))
            }
            
            try{
                const isFriendQuery = await db.query('select * from friends where (user_id=$1 and friend_id=$2) or (user_id=$2 and friend_id=$1)', [req.user.id, requestedUser.id])
                if(isFriendQuery.rows.length !== 0){
                    return res
                    .status(201)
                    .json(
                        new ApiResponse(
                            201,
                            { },
                            "You are already friends with that user")); 
                        }
            } catch (err){
                console.log(err)
                return res.status(500).json(new ApiError(500,  "Something went wrong!!"))
            }

            try{
                const isFriendRequestPresentQuery = await db.query('select * from friend_request where (from_id=$1 and to_id=$2)', [req.user.id, requestedUser.id])
                if(isFriendRequestPresentQuery.rows.length !== 0){
                    return res.status(200).json(new ApiResponse(200, {}, "Request sent successfully"));
                }
            } catch (err){
                console.log(err)
                return res.status(500).json(new ApiError(500,  "Something went wrong!!"))
            }

            try{
                const isOtherFriendRequestPresentQuery = await db.query('select * from friend_request where (from_id=$1 and to_id=$2)', [requestedUser.id, req.user.id])
                if(isOtherFriendRequestPresentQuery.rows.length !== 0){
                    try{
                      
                        await db.query(`update friend_request set status = $1 where from_id = $2 and to_id = $3`, ['accepted', requestedUser.id, req.user.id ])
                        return res.status(200).json(new ApiResponse(200, {}, "You are now friends with the requested user"));
                    }catch(err){
                        console.log(err)
                        return res.status(500).json(new ApiError(500,  "Something went wrong!!"))
                    }
                }
            } catch (err){
                console.log(err)
                return res.status(500).json(new ApiError(500,  "Something went wrong!!"))
            }
            await db.query(`insert into friend_request (from_id, to_id) values ($1, $2)`, [req.user.id, requestedUser.id])
            return res.status(200).json(new ApiResponse(200, {}, "Request sent successfully"));

        }catch(err){
            console.log(err)
            return res.status(500).json(new ApiError(500, "Something went wrong!!"))
        }

})

export const handleFriendRequest = asyncHandler(async (req, res, next) => {
    const {fromId, status} = req.body;
    if(req.params.userId !== req.user.id){
        return res.status(403).json(new ApiError(403,  "User not allowed to access this route"));
    }
    if(status !== 'accepted' && status !== 'blocked' && status !== 'ignored'){
        return res.status(422).json(new ApiError(422,   "Invalid request"));
    }
    try{
        const handleRequestQuery = await db.query(`update friend_request set status = $1 where from_id = $2 and to_id = $3`, [status,  fromId, req.user.id])

        if(handleRequestQuery.rowCount !== 0){
            return res.status(200).json(new ApiResponse(200, {}, "Request handled successfully"));
        }else{
            return res.status(404).json(new ApiError(404,  "Request not found"));
        }
    }catch(err){
        return res.status(500).json(new ApiError(500, "Something went wrong!!"))
    }

})

export const getAllFriends =  asyncHandler(async (req, res, next) => {
    // if(req.params.userId !== req.user.id){
    //     return res.status(403).json(new ApiError(403, "User not allowed to access this route"));
    // }
    // const allFriendsQuery = await db.query(`select id, username, name, friends_from from profile where profile.id in ((select friend_id from friends where user_id=$1) union (select user_id from friends where friend_id=$1)) `, [req.user.id])

    try{
        const allFriendsQuery = await db.query(`select id, username, name, friends_from from profile join friends on (profile.id=user_id or profile.id=friend_id) where (user_id=$1 or friend_id=$1) and id != $1`, [req.params.userId])
   
    return res.status(200).json(new ApiResponse(200, {allFriends: allFriendsQuery.rows}, "fetched successfully"))
    }catch(err){
        return res.status(500).json(new ApiError(500,  "Something went wrong!!"))
    }
})

export const getBlockedUsers = asyncHandler(async (req, res, next) => {
    if(req.params.userId !== req.user.id){
        return res.status(403).json(new ApiError(403, "User not allowed to access this route"));
    }
    try{
        const blockedUsersQuery = await db.query(`select id, username, name, blocked_at from blocked_users join profile on profile.id = blocked_id where user_id=$1`, [req.user.id])
        return res.status(200).json(new ApiResponse(200, {blockedUsers: blockedUsersQuery.rows}, "fetched successfully"))
    }catch(err){
        return res.status(500).json(new ApiError(500,  "Something went wrong!!"))
    }
})

export const getPendingRequests = asyncHandler( async (req, res, next) => {
    if(req.params.userId !== req.user.id){
        return res.status(403).json(new ApiError(403,  "User not allowed to access this route"));
    }
    try{
        const incomingPendingRequestsQuery = await db.query(`select id, username, name from profile join friend_request on profile.id=from_id where to_id=$1 and status=$2 `, [req.user.id, 'pending'])
        const outgoingPendingRequestsQuery = await db.query(`select id, username, name from profile join friend_request on profile.id=to_id where from_id=$1 and status=$2`, [req.user.id, 'pending'])
        return res.status(200).json(new ApiResponse(200, { incomingPendingRequests: incomingPendingRequestsQuery.rows, outgoingPendingRequests: outgoingPendingRequestsQuery.rows},"fetched successfully"))
    }catch(err){
        return res.status(500).json(new ApiError(500,  "Something went wrong!!"))
    }
})

export const removePendingRequest = asyncHandler( async (req, res, next) => {
    const { toId } = req.body;
    if(req.params.userId !== req.user.id){
        return res.status(403).json(new ApiResponse(403, {}, "User not allowed to access this route"));
    }
    try{
        const deletePendingRequestsQuery = await db.query(`delete from friend_request where from_id=$1 and to_id=$2`, [req.user.id, toId])
        if(deletePendingRequestsQuery.rowCount === 0){
            return res.status(400).json(new ApiError(400,"request doesn't exit"))
        }
        return res.status(200).json(new ApiResponse(200, {},"deleted successfully"))
    }catch(err){
        return res.status(500).json(new ApiError(500,  "Something went wrong!!"))
    }
})

export const blockUser = asyncHandler(async (req, res, next) => {
    const {toId} = req.body;
    console.log(toId, "toid")
    if(req.params.userId !== req.user.id){
        return res.status(403).json(new ApiError(403, "User not allowed to access this route"));
    }

    try{
        const requestedUserQuery = await db.query(`select * from profile where id=$1;`,[toId])
        if(requestedUserQuery.rows.length === 0){
            return res.status(404).json(new ApiError(404,"Requested user not found"))
        }    
        const requestedUser = requestedUserQuery.rows[0];
        if(requestedUser.id === req.user.id){
            return res.status(400).json(new ApiError(400,"You cannot block yourself"))
        }

        try{
            await db.query('insert into blocked_users(user_id, blocked_id) values($2, $1)', [requestedUser.id, req.user.id])
            return res.status(200).json(new ApiResponse(200,{},"User blocked successfully"))
        } catch (err){
            return res.status(500).json(new ApiError(500, "Something went wrong!!"))
        }

    } catch (err){
        return res.status(500).json(new ApiError(500, "Something went wrong!!"))
    }
})

export const removeBlockedUser = asyncHandler( async(req, res, next) =>{
    const { blockedId } = req.body;
    if(req.params.userId !== req.user.id){
        return res.status(403).json(new ApiError(403,  "User not allowed to access this route"));
    }
    try {

        const requestedUserQuery = await db.query(`select * from profile where id=$1;`,[blockedId])
        if(requestedUserQuery.rows.length === 0){
            return res.status(404).json(new ApiError(404,"Requested user not found"))
        }    
        try{
            const deleteBlockedUserQuery = await db.query(`delete from blocked_users where user_id=$1 and blocked_id=$2`, [req.user.id, blockedId])
            if(deleteBlockedUserQuery.rowCount === 0){
                return res.status(201).json(new ApiResponse(201, {},"User not blocked"))
            }
            return res.status(200).json(new ApiResponse(200, {},"User unblocked successfully"))
        }catch(err){
            return res.status(500).json(new ApiError(500,  "Something went wrong!!"))
        }
    } catch (err) {
        return res.status(500).json(new ApiError(500,  "Something went wrong!!"))
    }
    
})

export const removeFriend = asyncHandler( async(req, res, next) =>{
    const { friendId } = req.body;
    console.log(friendId, "fds");
    if(req.params.userId !== req.user.id){
        return res.status(403).json(new ApiError(403,  "User not allowed to access this route"));
    }
    try {

        const requestedUserQuery = await db.query(`select * from profile where id=$1;`,[friendId])
        if(requestedUserQuery.rows.length === 0){
            return res.status(404).json(new ApiError(404,"Requested user not found"))
        }    
        try{
            const deleteFriendQuery = await db.query(`delete from chat where (member_one_id=$1 and member_two_id=$2) or (member_one_id=$2 and member_two_id=$1)`, [req.user.id, friendId])
            if(deleteFriendQuery.rowCount === 0){
                return res.status(201).json(new ApiResponse(201, {},"User is not friend"))
            }
            return res.status(200).json(new ApiResponse(200, {},"Removed Friend successfully"))
        }catch(err){
            return res.status(500).json(new ApiError(500, "Something went wrong!!"))
        }
    } catch (err) {
        return res.status(500).json(new ApiError(500, "Something went wrong!!"))
    }
    
})


