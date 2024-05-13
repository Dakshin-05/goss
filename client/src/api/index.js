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

const getUserChat = (userId) => {
    return apiClient.get(`/user/${userId}/getChat`);
};

const makeFriendRequest = (userId, data) => {
    return apiClient.post(`/user/${userId}/makeFriendRequest`, data)
}

const getAllFriends = (userId) => {
    return apiClient.get(`/user/${userId}/getAllFriends`)
}

const deleteFriend = (userId, data) => {
    console.log(data)
    return apiClient.patch(`/user/${userId}/removeFriend`, data)
}

const getBlockedUsers = (userId) => {
    return apiClient.get(`/user/${userId}/getBlockedUsers`)
}

const removeBlockedUser = (userId, data) => {
    return apiClient.patch(`/user/${userId}/removeBlockedUser`, data)
}

const getPendingRequests = (userId) => {
    return apiClient.get(`/user/${userId}/getPendingRequests`)
}

const acceptOrIgnorePendingRequest = (userId, data) => {
    return apiClient.patch(`/user/${userId}/handleFriendRequest`, data)
}

const removePendingRequest = (userId, data) => {
    return apiClient.patch(`/user/${userId}/removePendingRequest`, data)
}

const getChatMessages = (userId, chatId) => {
    return apiClient.get(`/user/${userId}/${chatId}/getMessages`)
}


const getChat = (userId, friendId) => {
    return apiClient.get(`/user/${userId}/${friendId}/getChat`)
}

const getAllChats = (userId) => {
    return apiClient.get(`/user/${userId}/getAllChats`)
}

const sendMessage = (userId, chatId, content) => {
    // const formData = new FormData();
    // if (content) {
    //   formData.append("content", content);
    // }
    return apiClient.post(`/user/${userId}/${chatId}/`, {content: content});
  };

export {
    getChatMessages,
    getUserChat,
    makeFriendRequest,
    deleteFriend,
    getBlockedUsers,
    removeBlockedUser,
    getAllFriends,
    getPendingRequests,
    acceptOrIgnorePendingRequest,
    removePendingRequest,
    loginUser,
    logoutUser,
    registerUser,
    sendMessage,
    getChat,
    getAllChats
};