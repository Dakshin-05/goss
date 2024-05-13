import {Router} from 'express';
import { verifyJWT } from '../../middlewares/auth-middlewares.js';
import {joinServerViaRequest, joinServerViaLink, handleJoinRequest, leaveServer, addNewParticipantInServer} from '../../controllers/server/server-request-controller.js';


const router = Router({ mergeParams: true });


router.use( verifyJWT );

router.post('/joinServerViaRequest', joinServerViaRequest);
router.post('/joinServerViaLink', joinServerViaLink);
router.post('/handleJoinRequest', handleJoinRequest);
router.post('/leaveServer', leaveServer);
router.post('/addNewParticipantInServer', addNewParticipantInServer);

export default router;
