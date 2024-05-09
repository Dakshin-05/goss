import {Router} from 'express';
import { handleFriendRequest, makeFriendRequest, getAllFriends, getBlockedUsers, getPendingRequests, removePendingRequest, blockUser } from '../controllers/friend-request-controller.js';
import { verifyJWT } from '../middlewares/auth-middlewares.js';


const router = Router({ mergeParams: true });

router.use(verifyJWT);

router.post('/makeFriendRequest', makeFriendRequest );
router.post('/handleFriendRequest', handleFriendRequest);
router.get('/getAllFriends', getAllFriends);
router.get('/getBlockedUsers', getBlockedUsers);
router.get('/getPendingRequests', getPendingRequests);
router.delete('/removePendingRequest', removePendingRequest);
router.patch('/blockUser', blockUser)

export default router;