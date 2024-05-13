import { ChatEventEnum } from "../../constants.js";
import { db } from "../../db/index.js";
import { emitSocketEvent } from "../../socket/index.js";
import { ApiError } from "../../utils/apiError.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const createServer = asyncHandler(async (req, res) =>{
    // const {userId} = req.params;
    // if(req.user.id !== userId){
    //     return res.status(404).json(new ApiError(500, "User not allowed to access this route"));
    // }
    const {serverName, userId} = req.body;
    console.log(serverName)
    try {
        const newServer = await db.query(`INSERT INTO Server(server_name, owner_id) VALUES($1, $2) returning *;`, [serverName, userId]);
        
        if(newServer.rows[0].length === 0)
            return res.status(404).json(new ApiError(500, "Error while creating server"));
        
        const roomId = newServer.rows[0].server_id;
        emitSocketEvent(req, roomId, ChatEventEnum.NEW_CHAT_EVENT, newServer);
        return res.status(200).json(new ApiResponse(200, newServer.rows[0] , "Server created successfully"));

    } catch(err){
        console.log(err)
        
        return res.status(500).json( new ApiError(500) );
    }
})

export const getServerDetails = asyncHandler(async(req, res) => {
    const {serverId} = req.params;
    try {
        const serverDetailsQuery = await db.query(`SELECT * from Server where server_id = $1;`, [serverId]);
        
        if(serverDetailsQuery.rowCount === 0) {
            return res.status(404).json( new ApiError(404, "Server not found"))
        }
        
        const serverDetails = serverDetailsQuery.rows[0] || [];
        
        try {
            // const channelDetailsQuery = await db.query(`SELECT * from Channels C JOIN (SELECT * from Server where server_id = $1) S WHERE S.server_id = C.server_id;`, [serverId]);
            const channelDetailsQuery = await db.query(`SELECT * from Channels where server_id=$1`, [serverId]);
            if(channelDetailsQuery.rowCount === 0) {
                return res.status(404).json(new ApiError(404, "Channels not found"));
            }
            const channelsDetails = channelDetailsQuery.rows[0];
            const payload = [...serverDetails, ...channelsDetails]
            return res.status(200).json(new ApiResponse(200, payload, "Server Data fetched successfully"));
        } catch(err) {
            console.log(err)
            return res.status(500).json( new ApiError(500) );
        } 
    } catch(err) {
        console.log(err)
        return req.status(500).json( new ApiError(500) );
    }
})

export const channelDetails = asyncHandler(async(req, res) => {
    const {channelId} = req.params;
    try{
            const channelDetailsQuery = await db.query(`SELECT * from Channels C JOIN (SELECT * from Server where server_id = $1) S WHERE S.server_id = C.server_id;`, [serverId]);
            if(channelDetailsQuery.rowCount === 0) {
                return res.status(404).json(new ApiError(404, "Channels not found"));
            }
            const channelsDetails = channelDetailsQuery.rows[0];
            const payload = [...serverDetails, ...channelsDetails]
            return res.status(200).json(new ApiResponse(200, payload, "Server Data fetched successfully"));
        } catch(err) {
            console.log(err)
            return res.status(500).json( new ApiError(500) );
        }
})

export const renameServer = asyncHandler(async(req, res, next) => {
    const {serverId} = req.params;
    const {newName} = req.body;
    const {userId} = req.params;

    try {
        const serverDetailsQuery = await db.query(`SELECT * from Server where server_id = $1;`, [serverId]);
        
        if( serverDetailsQuery.rowCount === 0) {
            return res.status(404).json(new ApiError("Server not found") );
        } 
        
        const serverDetails = serverDetailsQuery.rows[0];

        try{
            const memberQuery = await db.query(`SELECT * from server_member where server_id = $1 AND member_id = $2;` , [serverId, userId]);
            if( memberQuery.rowCount === 0) {
                return res.status(401).json( new ApiError(401,{}, "User not a part of the channel"));
            }
            try {
                const user = memberQuery.rows[0];
                const hasPermission = await db.query(`SELECT * from server_roles where server_id = $1 AND channel_id = $2 AND server_roles = $3 AND can_manage_channel = true;`, [serverId, channelId, user.role])
                if(hasPermission.rowCount === 0) {
                    return res.status(401).json( new ApiError(401, 'User does not has the previlage to change the channel name'))
                }
                try {
                    const renamedServerQuery = await db.query(`UPDATE server SET server_name = $1 where server_id = $2 RETURNING *;`, [newName, serverId]);
                    if(renamedServerQuery.rowCount === 0 || renamedServerQuery.rows[0].server_name.toString() !== newName) {
                        return res.status(501).json( new ApiError(501, "Change not implemented"))
                    }
                    try {
                        const participants = await db.query(`SELECT * from server_member where server_id = $1`, [serverId]);
                        if(participants.rowCount === 0) {
                            return res.status(500).json( new ApiError(500, "No participants"))
                        }
                    
                        const payload =  renamedServerQuery.rows[0];
                        participants.rows.forEach( (participant) => {
                            emitSocketEvent(req, participant.id.toString(), ChatEventEnum.UPDATE_GROUP_NAME_EVENT, payload)
                        });
                        return res.status(200).json(ApiResponse(200, payload, "Server Renamed successfully"));
                    } catch(err) {
                        console.log(err)
                        return res.status(500).json( new ApiError(500) );
                    }         
                } catch(err) {
                    console.log(err)
                    return res.status(500).json( new ApiError(500) );
                }   
            } catch(err) {
                console.log(err)
                return res.status(500).json( new ApiError(500) );
            }
        } catch(err) {
            console.log(err)
            return res.status(500).json( new ApiError(500) );
        }
    } catch(err) {
        console.log(err)
        return res.status(500).json( new ApiError(500) );
    }
})


export const renameChannel = asyncHandler(async(req, res, next) => {
    const {serverId, channelId} = req.params;
    const userId = req.id;
    const {newName} = req.body;

    try {
        const channelDetailsQuery = await db.query(`SELECT * from Channels where server_id = $1 AND channel_id  = $2;`, [serverId, channelId]);
        
        if( channelDetailsQuery.rowCount === 0) {
            return res.status(404).json(new ApiError("Channel not found") );
        } 
        const channelDetails = channelDetailsQuery.rows[0];
        
        try{
            const memberQuery = await db.query(`SELECT * from server_member where serverId = $1 AND member_id = $2;` , [serverId, userId]);
            if( memberQuery.rowCount === 0) {
                return res.status(401).json( new ApiError(401, "User not a part of the channel"));
            }
            try {
                const user = memberQuery.rows[0];
                const hasPermission = await db.query(`SELECT * from server_roles where server_id = $1 AND channel_id = $2 AND server_roles = $3 AND can_manage_channel = true;`, [serverId, channelId, user.role])
                if(hasPermission.rowCount === 0) {
                    return res.status(401).json( new ApiError(401, 'User does not has the previlage to change the channel name'))
                }
                try {
                    const renamedChannelQuery = await db.query(`UPDATE channels SET channel_name = $1 where channel_id = $2 AND server_id = $3 RETURNING *;`, [newName, channelId, serverId]);
                    if(renamedChannelQuery.rowCount === 0 || renamedChannelQuery.rows[0].channel_name.toString() !== newName) {
                        return res.status(501).json( new ApiError(501, "Change not implemented"))
                    }
                    try {
                        const participants = await db.query(`SELECT * from server_member where server_id = $1`, [serverId]);
                        if(participants.rowCount === 0) {
                            return res.status(500).json( new ApiError(500, "No participants"))
                        }
    
                        const payload =  renamedChannelQuery.rows[0];
                        participants.rows.forEach( (participant) => {
                            emitSocketEvent(req, participant.id.toString(), ChatEventEnum.UPDATE_GROUP_NAME_EVENT, payload)
                        });
                    } catch(err) {
                        console.log(err)
                        return req.status(500).json( new ApiError(500) );
                    }        
                } catch(err) {
                    console.log(err)
                    return req.status(500).json( new ApiError(500) );
                }
            } catch(err) {
                console.log(err)
                return res.status(500).json( new ApiError(500) );

            }
        } catch(err) {
            console.log(err)
            return res.status(500).json( new ApiError(500) );
        }
    } catch(err) {
        console.log(err)
        return req.status(500).json( new ApiError(500) );
    }
})


export const deleteServer = asyncHandler(async(req, res) => {
    const {serverId} = req.params;
    const userId = req.id;

    try {
        const serverDetailsQuery = await db.query(`SELECT * from Server where server_id = $1;`, [serverId]);
        
        if( serverDetailsQuery.rowCount === 0) {
            return res.status(404).json(new ApiError("Server not found") );
        } 
        const serverDetails = serverDetailsQuery.rows[0];
        try{
            const memberQuery = await db.query(`SELECT * from server_member where serverId = $1 AND member_id = $2;` , [serverId, userId]);
            if( memberQuery.rowCount === 0) {
                return res.status(401).json( new ApiError(401, "User not a part of the channel"));
            }
            try {
                const user = memberQuery.rows[0];
                const hasPermission = await db.query(`SELECT * from server_roles where server_id = $1 AND server_roles = $2
                
                
                
                
                
                
                AND IS_ADMINISTRATOR = true;`, [serverId, channelId, user.role])
                if(hasPermission.rowCount === 0) {
                    return res.status(401).json( new ApiError(401, 'User does not has the previlage to change the channel name'))
                }
                try {
                    const participants = await db.query(`SELECT * from server_member where server_id = $1`, [serverId]);
                    if(participants.rowCount === 0) {
                        return res.status(500).json( new ApiError(500, "No participants"))
                    }
                    try {
                        await db.query(`DELETE FROM server WHERE server_id = $1`, [serverId]);
                        participants.rows.forEach( (participant) => {
                            emitSocketEvent(req, participant.id.toString(), ChatEventEnum.LEAVE_GROUP_NAME_EVENT, payload)
                        });
                        return res.status(200).json(ApiResponse(200, payload, "Server Renamed successfully"));
                    } catch(err) {
                        console.log(err)
                        return res.status(500).json( new ApiError(500) );
                    }         
                } catch(err) {
                    console.log(err)
                    return req.status(500).json( new ApiError(500) );
                }
            } catch(err) {
                console.log(err)
                return req.status(500).json( new ApiError(500) );
            }
        } catch(err) {
            console.log(err)
            return req.status(500).json( new ApiError(500) );
        }
    } catch(err) {
        console.log(err)
        return req.status(500).json( new ApiError(500) );
    }
})