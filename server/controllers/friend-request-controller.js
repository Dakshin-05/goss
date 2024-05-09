import {db} from "../db/index.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const makeFriendRequest = asyncHandler(async (req, res, next) => {
    const {requestedUsername} = req.body;

    if(req.params.userId !== req.user.id){
        return res.status(403).json(new ApiResponse(403, {}, "User not allowed to access this route"));
    }

    try{
        const requestedUserQuery = await db.query(`select * from profile where username=$1;`,[requestedUsername])
        if(requestedUserQuery.rows.length === 0){
            return res.status(404).json(new ApiError(404,{},"Requested user not found"))
        }    
        const requestedUser = requestedUserQuery.rows[0];
        if(requestedUser.id === req.user.id){
            return res.status(403).json(new ApiError(403,{},"You cannot be friends with yourself"))
        }
            try{
                const isBlockedQuery = await db.query(`select * from blocked_users where user_id=$1 and blocked_id=$2`, [requestedUser.id, req.user.id])
                if(isBlockedQuery.rows.length !== 0){ 
                    return res.status(404).json(new ApiError(404,{},"Requested user not found"))
                }  
            }catch(err){
                console.log(err)
            }
            
            try{
                const isFriendQuery = await db.query('select * from friends where (user_id=$1 and friend_id=$2) or (user_id=$2 and friend_id=$1)', [req.user.id, requestedUser.id])
                if(isFriendQuery.rows.length !== 0){
                    return res
                    .status(200)
                    .json(
                        new ApiResponse(
                            409,
                            { },
                            "You are already friends with that user")); 
                        }
            } catch (err){
                console.log(err);
            }

            try{
                const isFriendRequestPresentQuery = await db.query('select * from friend_request where (from_id=$1 and to_id=$2)', [req.user.id, requestedUser.id])
                if(isFriendRequestPresentQuery.rows.length !== 0){
                    return res.status(200).json(new ApiResponse(200, {}, "Request sent successfully"));
                }
            } catch (err){
                console.log(err);
            }

            try{
                const isOtherFriendRequestPresentQuery = await db.query('select * from friend_request where (from_id=$1 and to_id=$2)', [requestedUser.id, req.user.id])
                if(isOtherFriendRequestPresentQuery.rows.length !== 0){
                    try{
                        console.log(isOtherFriendRequestPresentQuery)
                        await db.query(`update friend_request set status = $1 where from_id = $2 and to_id = $3`, ['accepted', requestedUser.id, req.user.id ])
                        return res.status(200).json(new ApiResponse(200, {}, "You are now friends with the requested user"));
                    }catch(err){
                        console.log(err)
                    }
                }
            } catch (err){
                console.log(err);
            }
            await db.query(`insert into friend_request (from_id, to_id) values ($1, $2)`, [req.user.id, requestedUser.id])
            return res.status(200).json(new ApiResponse(200, {}, "Request sent successfully"));

        }catch(err){
            console.log(err)
        }

})

export const handleFriendRequest = asyncHandler(async (req, res, next) => {
    const {toId, status} = req.body;
    if(req.params.userId !== req.user.id){
        return res.status(403).json(new ApiResponse(403, {}, "User not allowed to access this route"));
    }
    if(status !== 'accepted' && status !== 'blocked'){
        return res.status(422).json(new ApiResponse(422, {}, "Invalid status"));
    }
    try{
        const handleRequestQuery = await db.query(`update friend_request set status = $1 where from_id = $2 and to_id = $3`, [status, toId, req.user.id])
        if(handleRequestQuery.rowCount){
            return res.status(200).json(new ApiResponse(200, {}, "Request handled successfully"));
        }else{
            return res.status(404).json(new ApiResponse(404, {}, "Request not found"));
        }
    }catch(err){
        console.log(err)
    }

})

export const getAllFriends =  asyncHandler(async (req, res, next) => {
    if(req.params.userId !== req.user.id){
        return res.status(403).json(new ApiError("User not allowed to access this route"));
    }
    try{
        const allFriendsQuery = await db.query(`select id, username, name from profile where profile.id in ((select friend_id from friends where user_id=$1) union (select user_id from friends where friend_id=$1)) `, [req.user.id])
    return res.status(200).json(new ApiResponse(200, {allFriends: allFriendsQuery.rows}, "fetched successfully"))
    }catch(err){
        console.log(err)
    }
})

export const getBlockedUsers = asyncHandler(async (req, res, next) => {
    if(req.params.userId !== req.user.id){
        return res.status(403).json(new ApiResponse(403, {}, "User not allowed to access this route"));
    }
    try{
        const blockedUsersQuery = await db.query(`select id, username, name from blocked_users join profile on profile.id = blocked_id where user_id=$1`, [req.user.id])
        return res.status(200).json(new ApiResponse(200, {blockedUsers: blockedUsersQuery.rows}, "fetched successfully"))
    }catch(err){
        console.log(err)
    }
})

export const getPendingRequests = asyncHandler( async (req, res, next) => {
    if(req.params.userId !== req.user.id){
        return res.status(403).json(new ApiResponse(403, {}, "User not allowed to access this route"));
    }
    try{
        const incomingPendingRequestsQuery = await db.query(`select id, username, name from profile join friend_request on profile.id=from_id where to_id=$1 and status=$2`, [req.user.id, 'pending'])
        const outgoingPendingRequestsQuery = await db.query(`select id, username, name from profile join friend_request on profile.id=to_id where from_id=$1 and status=$2`, [req.user.id, 'pending'])
        return res.status(200).json(new ApiResponse(200, { incomingPendingRequests: incomingPendingRequestsQuery.rows, outgoingPendingRequests: outgoingPendingRequestsQuery.rows},"fetched successfully"))
    }catch(err){
        console.log(err)
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
            return res.status(200).json(new ApiResponse(400, {},"request doesn't exit"))
        }
        return res.status(200).json(new ApiResponse(200, {},"deleted successfully"))
    }catch(err){
        console.log(err)
    }
})

export const blockUser = asyncHandler(async (req, res, next) => {
    const {toId} = req.body;

    if(req.params.userId !== req.user.id){
        return res.status(403).json(new ApiResponse(403, {}, "User not allowed to access this route"));
    }

    try{
        const requestedUserQuery = await db.query(`select * from profile where id=$1;`,[toId])
        if(requestedUserQuery.rows.length === 0){
            return res.status(404).json(new ApiError(404,{},"Requested user not found"))
        }    
        const requestedUser = requestedUserQuery.rows[0];
        if(requestedUser.id != req.user.id){
            return res.status(400).json(new ApiResponse(400,{},"You cannot block yourself"))
        }

        try{
            await db.query('insert into blocked_users(user_id, blocked_id) values($2, $1)', [requestedUser.id, req.user.id])
            return res.status(200).json(new ApiResponse(200,{},"User blocked successfully"))
        } catch (err){
            console.log(err);
        }

    } catch (err){
        console.log(err)
    }
})




