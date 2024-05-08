import {Router} from 'express';
import { handleFriendRequest, makeFriendRequest, showAllFriends, showBlockedUsers, showPendingRequests } from '../controllers/friend-request-controller.js';
import { verifyJWT } from '../middlewares/auth-middlewares.js';


const router = Router();

router.use(verifyJWT);

router.post('/makeFriendRequest', makeFriendRequest );
router.post('/handleFriendRequest', handleFriendRequest);
router.get('/showAllFriends', showAllFriends);
router.get('/showBlockedUsers', showBlockedUsers);
router.get('/showPendingRequests', showPendingRequests);

export default router;