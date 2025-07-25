import {Router} from 'express';
import { verifyJWT } from '../../middlewares/auth-middlewares.js';
import {joinServerViaRequest, joinServerViaLink, handleJoinRequest, leaveServer, addNewParticipantInServer, joinServer} from '../../controllers/server/server-request-controller.js';


const router = Router({ mergeParams: true });


router.use( verifyJWT );

router.post('/joinServerViaRequest', joinServerViaRequest);
router.post('/joinServerViaLink', joinServerViaLink);
router.post('/joinServer', joinServer);

router.post('/handleJoinRequest', handleJoinRequest);
router.post('/leaveServer', leaveServer);
router.post('/:serverId/addNewParticipantInServer', addNewParticipantInServer);

export default router;
