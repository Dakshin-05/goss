import { ChatEventEnum } from "../../constants.js";
import { db } from "../../db/index.js";
import { emitSocketEvent } from "../../socket/index.js";
import { ApiError } from "../../utils/apiError.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const createServer = asyncHandler(async (req, res) =>{
    const {userId} = req.params;
    const {serverName} = req.body;
    if(req.user.id !== userId){
        return res.status(404).json(new ApiError(500, "User not allowed to access this route"));
    }
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

export const createChannel = asyncHandler(async (req, res) =>{
    const {userId, serverId} = req.params;
    const {channelName} = req.body;
    if(req.user.id !== userId){
        return res.status(404).json(new ApiError(500, "User not allowed to access this route"));
    }
    try {
        const serverQuery = await db.query(`SELECT * from server WHERE server_id = $1;`, [serverId]);
        if(serverQuery.rowCount === 0) {
            return res.status(404).json( new ApiError(404, {}, "Server not found") )
        }
        try {
            const isMemberQuery = await db.query("SELECT * from server_member WHERE server_id = $1 AND member_id = $2;", [serverId, userId]);
            if( isMemberQuery.rowCount === 0) {
                return res.status(502).json( new ApiError(502, "User not a part of the server") );
            }
            const member = isMemberQuery.rows[0];
            try {
                const canCreateChannel = await db.query(`SELECT * from server_roles WHERE server_id = $1 AND role_name = $2 AND can_manage_channels = true;`,[serverId, member.role_name]);
                if(canCreateChannel.rowCount === 0) {
                    return res.status(403).json( new ApiError(403, {}, "User not alllowed to create channel") )
                }
                try {
                    const newChannel = await db.query(`INSERT INTO Channels(channel_name, server_id, creator_id) VALUES($1, $2, $3) returning *;`, [channelName, serverId, userId]);
                    
                    if(newChannel.rowCount === 0) {
                        return res.status(404).json(new ApiError(404, {},  "Error while creating server"));
                    }
                    return res.status(200).json(new ApiResponse(200, {newChannel:newChannel.rows[0]} , "Server created successfully"));
                } catch(err) {
                    return res.status(500).json( new ApiError(500) );
                }
            } catch(err) {
                return res.status(500).json( new ApiError(500) );
            }
        } catch(err) {
            return res.status(500).json( new ApiError(500) );
        }        
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
        
        const serverDetails = serverDetailsQuery.rows[0];
        
        try {
            // const channelDetailsQuery = await db.query(`SELECT * from Channels C JOIN (SELECT * from Server where server_id = $1) S WHERE S.server_id = C.server_id;`, [serverId]);
            const channelDetailsQuery = await db.query(`SELECT * from Channels where server_id=$1`, [serverId]);
            if(channelDetailsQuery.rowCount === 0) {
                return res.status(404).json(new ApiError(404, "Channels not found"));
            }
            const channelsDetails = channelDetailsQuery.rows;
            return res.status(200).json(new ApiResponse(200, {serverDetails: serverDetails, channelsDetails: channelsDetails}, "Server Data fetched successfully"));
        } catch(err) {
            console.log(err)
            return res.status(500).json( new ApiError(500) );
        } 
    } catch(err) {
        console.log(err)
        return res.status(500).json( new ApiError(500) );
    }
})

export const getAllServers = asyncHandler(async (req, res) => {
    const {userId} = req.params;
    console.log(userId)
    try {
        const serverDetailsQuery = await db.query("SELECT * from (SELECT * from server_member where member_id = $1) SM JOIN server S ON S.server_id = SM.server_id JOIN (SELECT * from channels WHERE channel_name = 'General') C ON C.server_id = S.server_id;", [userId]);
        if(serverDetailsQuery.rowCount === 0) {
            return res.status(200).json( new ApiError(200, {}, "User not a part of any server"))
        }
        const serverDetails = serverDetailsQuery.rows;
        return res.status(200).json(new ApiResponse(200, {serverDetails:serverDetails}, "Servers Data fetched successfully"));
    } catch(err) {
        console.log(err)
        return res.status(500).json( new ApiError(500, "Not fetching servers") );
    }
})

export const getAllParticipants = asyncHandler(async(req, res) => {
    const {userId, serverId} = req.params;
    try {
        const serverDetailsQuery = await db.query(`SELECT * from Server where server_id = $1;`, [serverId]);
        
        if(serverDetailsQuery.rowCount === 0) {
            return res.status(404).json( new ApiError(404, "Server not found"))
        }
        
        const serverDetails = serverDetailsQuery.rows[0];
        
        try {
            const isParticipantQuery = await db.query(`SELECT * from server_member where server_id=$1 and member_id = $2`, [serverId, userId]);
            if(isParticipantQuery.rowCount === 0) {
                return res.status(404).json(new ApiError(404, "User not a part of sever"));
            }
            try {
                const participantsQuery = await db.query(`SELECT * from (SELECT * from server_member where server_id = $1) SM JOIN Profile P ON P.id = SM.member_id ;`, [serverId]);
                if( participantsQuery.rowCount === 0) {
                    return res.status(500).json( new ApiError(500, "Cant fetch members from server"));
                }
                return res.status(200).json(new ApiResponse(200, {participants: participantsQuery.rows}, "Participants fetched successfully"));
            } catch(err) {
                console.log(err);
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

export const channelDetails = asyncHandler(async(req, res) => {
    const {serverId, channelId} = req.params;
    try{
            const channelDetailsQuery = await db.query(`SELECT * from (SELECT * from Channels C WHERE C.channel_id = $2) C JOIN (SELECT * from server where server_id = $1) S ON S.server_id = C.server_id;`, [serverId, channelId]);
            if(channelDetailsQuery.rowCount === 0) {
                return res.status(404).json(new ApiError(404, "Channels not found"));
            }
            const channelsDetails = channelDetailsQuery.rows[0];
            return res.status(200).json(new ApiResponse(200, {channelsDetails:channelsDetails}, "Channel Data fetched successfully"));
        } catch(err) {
            console.log(err)
            return res.status(500).json( new ApiError(500) );
        }
})

export const getChannelChats = asyncHandler( async(req, res) => {
    const {userId, serverId, channelId} = req.params;

    if(req.params.userId !== req.user.id){
        return res.status(403).json(new ApiError(403,{}, "User not allowed to access this route"));
    }

    try {
        const serverDetailsQuery = await db.query(`SELECT * from Server where server_id = $1;`, [serverId]);
        
        if(serverDetailsQuery.rowCount === 0) {
            return res.status(404).json( new ApiError(404,{}, "Server not found"))
        }
        
        try {
            const isParticipantQuery = await db.query(`SELECT * from server_member where server_id=$1 and member_id = $2`, [serverId, userId]);
            if(isParticipantQuery.rowCount === 0) {
                return res.status(404).json(new ApiError(404,{}, "User not a part of sever"));
            }

            try{
                const channelDetailQuery = await db.query(`SELECT * from Channels C WHERE C.channel_id = $1 AND C.server_id = $2;`, [channelId, serverId])
                if(channelDetailQuery.rowCount === 0){
                    return res.status(404).json(new ApiError(404,{}, "Channel does not exist"));
                }

                try {
                    const channelMessages = await db.query(`SELECT * FROM channel_message where channel_id=$1;`, [channelId])
                    if(channelDetailQuery.rowCount === 0){
                        return res.status(200).json( new ApiResponse(200, {}, "No messages yet!..."))
                    }

                    return res.status(200).json(new ApiResponse(200, {messages:channelMessages.rows}, "Messages fetched successfully!..."))

                } catch(err) {
                    console.log(err)
                    return res.status(500).json( new ApiError(500, {}, "Something went wrong!!"))
                }

            } catch (err){
                console.log(err)

                return res.status(500).json( new ApiError(500, {}, "Something went wrong!!"))
            }

        } catch (err){
            console.log(err)

            return res.status(500).json( new ApiError(500, {}, "Something went wrong!!"))
        }
    } catch(err) {
        console.log(err)
        return res.status(500).json( new ApiError(500, {}, "Something went wrong!!"))
    }
}) 

export const sendMessage = asyncHandler(async (req, res) => {
    const { serverId, channelId } = req.params;
    const {content} = req.body;
    console.log(content);
    if (!content) {
        return res.status(400).json(new ApiError(400, {}, "Message content is required"));
    }

    try {
        console.log("3")
        const serverQuery = await db.query("SELECT * FROM server WHERE server_id = $1", [serverId]);
        
        if (serverQuery.rowCount === 0) {
            console.log("1")
            return res.status(404).json(new ApiError(404, {}, "Server does not exist"));
        }

        try{
            const channelQuery = await db.query("SELECT * FROM channels WHERE server_id = $1 and channel_id = $2", [serverId, channelId]);
        
            if (channelQuery.rowCount === 0) {
                console.log("2")
                return res.status(404).json(new ApiError(404, {}, "Channel does not exist..."));
            }

            try {
                const message = await db.query("INSERT INTO channel_message (channel_id, sender_id, content) VALUES ($1, $2, $3) RETURNING *", [channelId, req.user.id, content]);
               
                emitSocketEvent(req, channelId, ChatEventEnum.MESSAGE_RECEIVED_EVENT, message.rows[0]);
            
                return res.status(200).json(new ApiResponse(200, { message: message.rows[0] }, "Message saved successfully"));
            } catch (err) {
                return res.status(500).json(new ApiResponse(500, {}, "Something went wrong"));
            }

        }catch(err) {
            return res.status(500).json(new ApiResponse(500, {}, "Something went wrong"));
        }
        
    } catch (err) {
        return res.status(500).json(new ApiResponse(500, {}, "Something went wrong"));
    }
});

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
                return res.status(401).json( new ApiError(401, {}, "User not a part of the channel"));
            }
            try {
                const user = memberQuery.rows[0];
                const hasPermission = await db.query(`SELECT * from server_roles where server_id = $1  AND role_name = $2 AND can_manage_channels = true;`, [serverId, user.role_name])
                if(hasPermission.rowCount === 0) {
                    return res.status(401).json( new ApiError(401, {}, 'User does not has the previlage to change the channel name'))
                }
                try {
                    const renamedServerQuery = await db.query(`UPDATE server SET server_name = $1 where server_id = $2 RETURNING *;`, [newName, serverId]);
                    if(renamedServerQuery.rowCount === 0 || renamedServerQuery.rows[0].server_name.toString() !== newName) {
                        return res.status(501).json( new ApiError(501, "Change not implemented"))
                    }
                    try {
                        const participants = await db.query(`SELECT * from server_member where server_id = $1`, [serverId]);
                        if(participants.rowCount === 0) {
                            return res.status(500).json( new ApiError(500, {},  "No participants"))
                        }
                    
                        // const payload =  renamedServerQuery.rows[0];
                        // participants.rows.forEach( (participant) => {
                        //     emitSocketEvent(req, participant.id.toString(), ChatEventEnum.UPDATE_GROUP_NAME_EVENT, payload)
                        // });
                        return res.status(200).json(new ApiResponse(200, {}, "Server Renamed successfully"));
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
    const {userId, serverId, channelId} = req.params;

    const {newName} = req.body;

    console.log(newName)

    try {
        const channelDetailsQuery = await db.query(`SELECT * from Channels where server_id = $1 AND channel_id  = $2;`, [serverId, channelId]);
        
        if( channelDetailsQuery.rowCount === 0) {
            return res.status(404).json(new ApiError(404, {}, "Channel not found") );
        } 
        const channelDetails = channelDetailsQuery.rows[0];

        console.log(channelDetails)
        
        try{
            const memberQuery = await db.query(`SELECT * from server_member where server_id = $1 AND member_id = $2;` , [serverId, userId]);
            if( memberQuery.rowCount === 0) {
                return res.status(401).json( new ApiError(401, {},  "User not a part of the channel"));
            }
            try {
                const user = memberQuery.rows[0];
                const hasPermission = await db.query(`SELECT * from server_roles where server_id = $1 AND role_name = $2 AND can_manage_channels = true;`, [serverId,  user.role_name])
                console.log(hasPermission.rows)
                if(hasPermission.rowCount === 0) {
                    return res.status(401).json( new ApiError(401, {},  'User does not has the previlage to change the channel name'))
                }
                try {
                    const renamedChannelQuery = await db.query(`UPDATE channels SET channel_name = $1 where channel_id = $2 AND server_id = $3 RETURNING *;`, [newName, channelId, serverId]);
                    console.log(renamedChannelQuery.rows)
                    if(renamedChannelQuery.rowCount === 0 || renamedChannelQuery.rows[0].channel_name.toString() !== newName) {
                        return res.status(501).json( new ApiError(501, {},  "Change not implemented"))
                    }
                    
                    return res.status(200).json(new ApiResponse(200, {}, "Channel renamed successfully"))
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
    } catch(err) {
        console.log(err)
        return res.status(500).json( new ApiError(500, {}, "1") );

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
                const hasPermission = await db.query(`SELECT * from server_roles where server_id = $1 AND server_roles = $2 AND IS_ADMINISTRATOR = true;`, [serverId, channelId, user.role])
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

export const transferOwnerShip = asyncHandler(async (req, res) => {
    const {serverId, newOwnerId} = req.params;
    const userId = req.id;

    try {
        const serverDetailsQuery = await db.query(`SELECT * from Server where server_id = $1;`, [serverId]);
        
        if( serverDetailsQuery.rowCount === 0) {
            return res.status(404).json(new ApiError("Server not found") );
        } 
        try{
            const userDetailsQuery = await db.query(`SELECT * from server_member where serverId = $1 AND member_id = $2;` , [serverId, userId]);
            if( userDetailsQuery.rowCount === 0) {
                return res.status(401).json( new ApiError(401, "User not a part of the server"));
            }
            try {
                const newOwnerDetailsQuery = await db.query(`SELECT * from server_member where serverId = $1 AND member_id = $2 AND  $2 != $3;`,[serverId, newOwnerId, userId]);
                if( newOwnerDetailsQuery.rowCount === 0) {
                    return res.status(401).json( new ApiError(401, "User who's gonna be new owner is not a part of the server"));
                }
                try {
                    const hasPermission = await db.query(`SELECT * from server where server_id = $1 AND owner_id = $2`, [serverId, userId])
                    if(hasPermission.rowCount === 0) {
                        return res.status(401).json( new ApiError(401, 'User does not has the previlage to transfer Ownership'))
                    }
                        try {
                            await db.query(`UPDATE server SET owner_id = $1 WHERE server_id = $2;`, [newOwnerId, serverId]); 
                            return res.status(200).json( new ApiResponse(200, {newOwnerDetails:newOwnerDetailsQuery.rows[0]}, "Ownership transferred successfully"))
                        } catch(err) {
                            console.log(err)
                            return res.status(500).json( new ApiError(500) );
                        }  
                } catch(err) {
                    console.log(err)
                    return res.status(500).json( new ApiError(500) );
                }
            } catch (err) {
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


export const createRole = asyncHandler(async (req, res) => {
    const {serverId, userId} = req.params;
    const {role_name, view_channel, manage_channel, delete_channel, manage_permission, invite, kick_member, ban_member, send_message, attach_file, manage_message, create_poll, create_event, manage_event, is_administrator} = req.body;

    try {
        const serverDetailsQuery = await db.query(`SELECT * from Server where server_id = $1;`, [serverId]);
        
        if( serverDetailsQuery.rowCount === 0) {
            return res.status(404).json(new ApiError("Server not found") );
        } 
        try{
            const memberQuery = await db.query(`SELECT * from server_member where serverId = $1 AND member_id = $2;`, [serverId, userId]);
            if( memberQuery.rowCount === 0) {
                return res.status(401).json( new ApiError(401, "User not a part of the channel"));
            }
            try {
                const user = memberQuery.rows[0];
                const hasPermission = await db.query(`SELECT * from server where server_id = $1 AND owner_id = $2;`, [serverId, userId])
                if(hasPermission.rowCount === 0) {
                    return res.status(401).json( new ApiError(401, 'User does not has the previlage to add roles to the server'));
                }
                try {
                    const newRole = await db.query(`INSERT INTO server_roles VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) return *;`, [serverId, role_name, view_channel, manage_channel, delete_channel, manage_permission, invite, kick_member, ban_member, send_message, attach_file, manage_message, create_poll, create_event, manage_event, is_administrator]);
                    if( newRole.rowCount === 0) {
                        return res.status(501).json( new ApiError(401, 'Error occured while creating new role'));
                    }
                    return res.status(200).json( new ApiResponse(200, {newRole:newRole.rows[0]}, "Role created successfully"))
                } catch(err) {
                    return res.status(500).json( new ApiError(500) );
                }
            } catch(err) {
                return res.status(500).json( new ApiError(500) );
            }
        } catch {
            return res.status(500).json( new ApiError(500) );
        }
    } catch(err) {
        return res.status(500).json( new ApiError(500) );
    }
})