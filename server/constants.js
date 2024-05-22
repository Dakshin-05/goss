export const ChatEventEnum = Object.freeze({
    CONNECTED_EVENT: "connected",
    DISCONNECT_EVENT: "disconnect",
    JOIN_CHAT_EVENT: "joinChat",
    LEAVE_CHAT_EVENT: "leaveChat",
    UPDATE_GROUP_NAME_EVENT: "updateGroupName",
    MESSAGE_RECEIVED_EVENT: "messageReceived",
    MESSAGE_DELETED_EVENT: "messageDeleted",
    MESSAGE_EDITED_EVENT: "messageEdited",
    NEW_CHAT_EVENT: "newChat",
    SOCKET_ERROR_EVENT: "socketError",
    STOP_TYPING_EVENT: "stopTyping",
    TYPING_EVENT: "typing",
    ONLINE_EVENT: "online",
    MESSAGE_DELIVERED_EVENT: "delivered",
    JOIN_CHANNEL_CHAT_EVENT: "joinChannelChat",
    CHANNEL_MESSAGE_RECEIVED_EVENT: "channelMessageReceived",
    CHANNEL_MESSAGE_DELETED_EVENT: "channelMessageDeleted",
    CHANNEL_MESSAGE_EDITED_EVENT: "channelMessageEdited",
  });
  
  export const AvailableChatEvents = Object.values(ChatEventEnum);
  
  export const USER_TEMPORARY_TOKEN_EXPIRY = 20 * 60 * 1000; 