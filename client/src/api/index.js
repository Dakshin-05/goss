import axios from "axios";
import { LocalStorage } from "../utils";

const apiClient = axios.create({
    baseURL: "http://localhost:5000/api",
    withCredentials: true,
    timeout: 120000
})

apiClient.interceptors.request.use(
    function(config){
        const token = LocalStorage.get("token");
        config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    function (err) {
        return Promise.reject(err)
    }
);

const loginUser = (data) => {
    return apiClient.post('/login', data);
};

const registerUser = (data) => {
    return apiClient.post('/signup', data);
};

const logoutUser = () => {
    return apiClient.post('/logout');
};

const getUserChats = (userId) => {
    return apiClient.get(`/user/${userId}/getAllChats`);
};

const makeFriendRequest = (userId, data) => {
    return apiClient.post(`/user/${userId}/makeFriendRequest`, data)
}

const getAllFriends = (userId) => {
    return apiClient.get(`/user/${userId}/getAllFriends`)
}

const getBlockedUsers = (userId) => {
    return apiClient.get(`/user/${userId}/getBlockedUsers`)
}

const getPendingRequests = (userId) => {
    return apiClient.get(`/user/${userId}/getPendingRequests`)
}
  
const createUserChat = (userId, receiverId) => {
    return apiClient.post(`/user/${userId}/${receiverId}`);
};

const getChatMessages = (userId, conversationId) => {
    return apiClient.get(`/user/${userId}/${conversationId}/messages`)
}

const deleteOneOnOneChat = (chatId) => {
    return apiClient.delete(`/chat-app/chats/remove/${chatId}`);
};

const sendMessage = (chatId, content) => {
    const formData = new FormData();
    if (content) {
      formData.append("content", content);
    }
    return apiClient.post(`/chat-app/messages/${chatId}`, formData);
  };

export {
    createUserChat,
    getChatMessages,
    getUserChats,
    makeFriendRequest,
    getBlockedUsers,
    getAllFriends,
    getPendingRequests,
    loginUser,
    logoutUser,
    registerUser,
    deleteOneOnOneChat,
    sendMessage
};