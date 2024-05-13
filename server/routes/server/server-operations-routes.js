import {Router} from 'express';
import { verifyJWT } from '../../middlewares/auth-middlewares.js';

import { channelDetails, createServer, deleteServer, getServerDetails, renameChannel, renameServer } from '../../controllers/server/server-operation-controller.js';


const router = Router({ mergeParams: true });


router.use( verifyJWT );

router.post('/createServer', createServer);
router.get('/:serverId/getServerDetails', getServerDetails);
router.get('/channelDetails', channelDetails)
router.patch('/:serverId/renameServer', renameServer);
router.patch('/renameChannel', renameChannel);
router.delete('/deleteServer', deleteServer);

export default router;
