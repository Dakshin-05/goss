import {Router} from 'express';
import { verifyJWT } from '../../middlewares/auth-middlewares.js';

import { channelDetails, createServer, deleteServer, getAllServers, getServerDetails, renameChannel, renameServer, transferOwnerShip } from '../../controllers/server/server-operation-controller.js';


const router = Router({ mergeParams: true });


router.use( verifyJWT );

router.post('/createServer', createServer);
router.get('/:serverId/getServerDetails', getServerDetails);
router.get('/getAllServers', getAllServers);
router.get('/:serverId/:channelId/channelDetails', channelDetails)
router.patch('/:serverId/renameServer', renameServer);
router.patch('/:serverId/:channelId/renameChannel', renameChannel);
router.delete('/:serverId/deleteServer', deleteServer);
router.patch('/:serverId/transferOwnerShip', transferOwnerShip);

export default router;
