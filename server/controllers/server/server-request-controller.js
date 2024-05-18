import { ChatEventEnum } from "../../constants.js";
import {db} from "../../db/index.js";
import { emitSocketEvent } from "../../socket/index.js";
import { ApiError } from "../../utils/apiError.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const joinServerViaRequest = asyncHandler(async (req, res) => {
    const userId = req.id;
    const { requestedServerId } = req.body;

    if(req.params.userId !== req.id) {
        return res.status(403).json(new ApiResponse(403, {}, "User not allowed to access this route"));
    }

    try {
        const requestedServer = await db.query(`select * from server where server_name = $1;`, [requestedServerId]);
        if(requestedServer.rows.length === 0) {
            return res.status(404).json({message: "Requested server not found"})
        }
        try {
            const isBannedUser = await db.query(`select * from server_request where username = $1 and status = $2;`, [userId, 'banned']);
            if(isBannedUser.rows.length !== 0) {
                return res.status(403).json({message: "Used Banned"});
            }
            try {
                await db.query(`insert into server_request (user_id, server_id) values ($1, $2);`, [userId, requestedServerId])
                return req.status(200).json({message: "Request send successfully"})
            } catch (err) {
                return res.status(500).json( new ApiError(500) );
            }
        } catch (err) {
            return res.status(500).json( new ApiError(500) );
        } 
    } catch(err) {
        return res.status(500).json( new ApiError(500) );
    }
});

export const joinServerViaLink = asyncHandler(async (req, res) => {
    const {inviteLink} = req.body;
    const userId = req.id;
    if(req.params.userId !== req.id) {
        return res.status(403).json({message: "User not allowed to access this route"});
    }

    try {
        const requestedServer = await db.query(`select * from server where invite_link = $1;`, [inviteLink]);
        if(requestedServer.rowCount === 0) {
            return res.status(404).json({message: "Requested SERVER not found"})
        }
        try {
            const isBannedUser = await db.query(`select * from server_request where username = $1 and status = 'banned';`, [userId]);
            if(isBannedUser.rowCount !== 0) {
                return res.status(403).json({message: "User already Banned"});
            }
            try {
                await db.query(`insert into server_member(user_id, server_id) values ($1, $2);`, [userId, requestedServer.rows[0].id])
                return req.status(200).json({message: "User added successfully"})
            } catch (err) {
                return res.status(500).json( new ApiError(500) );
            }
        } catch (err) {
            return res.status(500).json( new ApiError(500) );
        } 
    } catch(err) {
        return res.status(500).json( new ApiError(500) );
    }
})
;


export const handleJoinRequest = asyncHandler(async (req, res) => {
    const {userId, serverId, status} = req.body;
    if(req.params.userId !== req.id){
        return res.status(403).json( new ApiError(403, "User not allowed to access this route" ));
    }
    if(status !== 'accepted' && status !== 'blocked'){
        return res.status(422).json({message: "Invalid status"});
    }

    try{
        await db.query(`update server_request set status = $1 where user_id = $2 and server_id = $3`, [status, userId, serverId])
        return res.status(200).json( new ApiResponse(200, serverId) );
    }catch(err){
        return res.status(500).json( new ApiError(500) );
    }

});

export const leaveServer = asyncHandler(async (req, res, next) => {
    const { serverId } = req.params;
    const userId = req.id;

    try {
        const serverDetails = await db.query(`SELECT * from server WHERE server_id = $1;`, [serverId]);
        if(serverDetails.rowCount === 0)
            return res.status(404).json( new ApiError(404, "Server not found"))

        try {
            const isUserAMemberQuery = await db.query(`SELECT * from server_member where server_id = $1 AND user_id = $2`, [serverId, userId]);
            if( isUserAMemberQuery.rowCount === 0)
                return res.status(404).json( new ApiError(404, "User not a member of the server"));
            try {
                await db.query(`DELETE FROM server_member WHERE server_id = $1 AND user_id = $2`, [serverId, memberId]);
                
                try {
                    const participantsQuery = await db.query(`SELECT user_id from server_member WHERE server_id = $1`, [serverId]);
                    if( participantsQuery.rowCount === 0) {
                        return res.status(500).json( new ApiResponse(500, isUserAMemberQuery.rows[0], "Coudn't notify members"));
                    }
                    const participants = participantsQuery.rows[0];
                    const payload = isUserAMemberQuery.rows[0];
                    participants.forEach( (participant)=> {
                        emitSocketEvent(req, participant.id.toString(), ChatEventEnum.LEFT_SERVER_EVENT, payload);
                    });
                    return res.status(200).json( new ApiResponse(200, {}, "User leave successfully"))
                } catch {
                    return res.status(500).json( new ApiError(500) );
                }
            } catch {
                return res.status(500).json( new ApiError(500) );
            }
        } catch {
            return res.status(500).json( new ApiError(500) );
        }
    } catch {
        return res.status(500).json( new ApiError(500) );
    }
});

export const addNewParticipantInServer = asyncHandler(async (req, res, next) => {
    const {serverId, userId} = req.params;
    const {participantId} = req.body;

    try {
        const serverQuery = await db.query(`SELECT * from server where server_id = $1`, [serverId]);
        if( serverQuery.rowCount === 0 ) {
            return res.status(404).json( new ApiError(404, "server not found"));
        } 
        try {
            const hasAccessQuery = await db.query(`SELECT * from (SELECT * from server_member WHERE server_id = $1 AND member_id = $2)SM JOIN (SELECT * from server_roles WHERE server_id = $1 AND can_manage_channels = true)SR ON SM.server_id = SR.server_id AND SM.role_name = SR.role_name;`, [serverId, userId]);
            if(hasAccessQuery.rowCount === 0)
                return res.status(401).json( new ApiError(401, "User dont has the permission to add participants"))
            try {
                const isAlreadyMember = await db.query(`SELECT * from server_member WHERE server_id = $1 AND member_id = $2;`, [serverId, participantId]);
                if(isAlreadyMember.rowCount !== 0) {
                    return res.status(400).json( new ApiError(400, "New participant already a member"));
                }
                try {
                    const isFriend = await db.query(`SELECT * from chat WHERE (member_one_id = $1 AND member_two_id = $2) OR (member_one_id=$2 AND member_two_id = $1);`, [userId, participantId]);
                    try {
                        const newParticipant = await db.query(`INSERT INTO server_member(server_id, member_id, role_name) VALUES ($1, $2, $3) returning *;`, [serverId, userId, 'member']);
                        // try {
                        //     const participantsQuery = await db.query(`SELECT user_id FROM server_member WHERE server_id = $1;`, [serverId]);
                        //     if( participantsQuery.rowCount === 0) {
                        //         return res.status(500).json( new ApiError(500, "Couldnt fetch participants"));
                        //     }
                        //     const participants = participantsQuery.rows;
                        //     participants.forEach( (participant) => {
                        //         emitSocketEvent(req, participant.id.toString(), ChatEventEnum.JOIN_SERVER_EVENT, newParticipant);
                        //     })
                        // } catch(err) {
                        //     console.log(err)
                        //     return res.status(500).json( new ApiError(500, {}, "6") );
                        // }
                        return res.status(200).json(new ApiResponse(200, {newParticipant: newParticipant}, "User added successfully"))
                    } catch(err) {
                        console.log(err)
                        return res.status(500).json( new ApiError(500, {}, "5") );
                    }
                } catch(err) {
                    console.log(err)
                    return res.status(500).json( new ApiError(500, {}, "4") );
                }
            } catch(err) {
            console.log(err)

                return res.status(500).json( new ApiError(500, {}, "3") );
            }
        } catch(err) {
            console.log(err)
            return res.status(500).json( new ApiError(500, {}, "2") );
        }
    } catch {
        return res.status(500).json( new ApiError(500, {}, "1") );
    }
});
