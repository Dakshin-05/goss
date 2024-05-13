import {Router} from 'express';
import { handleFriendRequest, makeFriendRequest, getAllFriends, getBlockedUsers, getPendingRequests, removePendingRequest, blockUser, removeBlockedUser, removeFriend } from '../controllers/friend-request-controller.js';
import { verifyJWT } from '../middlewares/auth-middlewares.js';


const router = Router({ mergeParams: true });

router.use(verifyJWT);

router.post('/makeFriendRequest', makeFriendRequest );
router.patch('/handleFriendRequest', handleFriendRequest);
router.get('/getAllFriends', getAllFriends);
router.get('/getBlockedUsers', getBlockedUsers);
router.get('/getPendingRequests', getPendingRequests);
router.patch('/removePendingRequest', removePendingRequest);
router.patch('/removeFriend', removeFriend);
router.patch('/removeBlockedUser', removeBlockedUser);
router.patch('/blockUser', blockUser)

export default router;