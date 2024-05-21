import {Router} from 'express';
import { verifyJWT } from '../../middlewares/auth-middlewares.js';

import { channelDetails, createChannel, createServer, deleteServer, getAllParticipants, getAllServers, getChannelChats, getServerDetails, renameChannel, renameServer, transferOwnerShip, sendMessage } from '../../controllers/server/server-operation-controller.js';


const router = Router({ mergeParams: true });


router.use( verifyJWT );

router.post('/createServer', createServer);
router.get('/:serverId/getServerDetails', getServerDetails);
router.get('/getAllServers', getAllServers);
router.get('/:serverId/:channelId/channelDetails', channelDetails)
router.get('/:serverId/getAllParticipants', getAllParticipants)
router.patch('/:serverId/renameServer', renameServer);
router.patch('/:serverId/:channelId/renameChannel', renameChannel);
router.delete('/:serverId/deleteServer', deleteServer);
router.patch('/:serverId/transferOwnerShip', transferOwnerShip);
router.post('/:serverId/createChannel', createChannel);
router.get('/:serverId/:channelId/getChannelChats', getChannelChats);
router.post('/:serverId/:channelId/sendMessage', sendMessage);


export default router;
