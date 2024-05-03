import express from 'express';
import {verifyToken} from '../controllers/user-controller.js';
import { handleFriendRequest, makeFriendRequest, showAllFriends, showBlockedUsers, showPendingRequests } from '../controllers/friend-request-controller.js';


const friendRequestRouter = express.Router();

friendRequestRouter.post('/user/:userId/makeFriendRequest', verifyToken, makeFriendRequest );
friendRequestRouter.post('/user/:userId/handleFriendRequest', verifyToken, handleFriendRequest);
friendRequestRouter.get('/user/:userId/showAllFriends', verifyToken, showAllFriends);
friendRequestRouter.get('/user/:userId/showBlockedUsers', verifyToken, showBlockedUsers);
friendRequestRouter.get('/user/:userId/showPendingRequests', verifyToken, showPendingRequests);

export default friendRequestRouter;