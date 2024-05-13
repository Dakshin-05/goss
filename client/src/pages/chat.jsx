import {
  PaperAirplaneIcon,
  PaperClipIcon,
  XCircleIcon,
} from "@heroicons/react/20/solid";
import { useEffect, useRef, useState } from "react";
import { getAllChats, getAllFriends, getChatMessages, getUserChat, sendMessage } from "../api";
import AddChatModal from "../components/chat/AddChatModal";
import ChatItem from "../components/chat/ChatItem";
import MessageItem from "../components/chat/MessageItem";
import Typing from "../components/chat/Typing";
import Input from "../components/Input";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import {
  LocalStorage,
  classNames,
  getChatObjectMetadata,
  requestHandler,
} from "../utils";


const CONNECTED_EVENT = "connected";
const DISCONNECT_EVENT = "disconnect";
const JOIN_CHAT_EVENT = "joinChat";
const NEW_CHAT_EVENT = "newChat";
const TYPING_EVENT = "typing";
const STOP_TYPING_EVENT = "stopTyping";
const MESSAGE_RECEIVED_EVENT = "messageReceived";
const LEAVE_CHAT_EVENT = "leaveChat";

const ChatPage = ({friend}) => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const currentChat = useRef(null);
  const typingTimeoutRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [openAddChat, setOpenAddChat] = useState(false);
  const [loadingChats, setLoadingChats] = useState(false); 
  const [loadingMessages, setLoadingMessages] = useState(false); 
  const [chats, setChats] = useState([]); 
  const [messages, setMessages] = useState([]); 
  const [unreadMessages, setUnreadMessages] = useState([]); 
  const [isTyping, setIsTyping] = useState(false);
  const [selfTyping, setSelfTyping] = useState(false); 

  const [message, setMessage] = useState(""); 
  const [localSearchQuery, setLocalSearchQuery] = useState("")

  

//   const updateChatLastMessage = (
//     chatToUpdateId,
//     message
//   ) => {
//     const chatToUpdate = chats.find((chat) => chat._id === chatToUpdateId)!;

//     // Update the 'lastMessage' field of the found chat with the new message
//     chatToUpdate.lastMessage = message;

//     // Update the 'updatedAt' field of the chat with the 'updatedAt' field from the message
//     chatToUpdate.updatedAt = message?.updatedAt;

//     // Update the state of chats, placing the updated chat at the beginning of the array
//     setChats([
//       chatToUpdate, // Place the updated chat first
//       ...chats.filter((chat) => chat._id !== chatToUpdateId), // Include all other chats except the updated one
//     ]);
//   };

  const getChat = async () => {
    requestHandler(
      async () => await getAllChats(user.id),
      setLoadingChats,
      (res) => {
        const { data } = res;
        setChats(data.chats || []);
        console.log(data)
      },
      alert
    );
  };

  const getMessages = async () => {
    if (!currentChat.current?.id) return alert("No chat is selected");

    if (!socket) return alert("Socket not available");

    socket.emit(JOIN_CHAT_EVENT, currentChat.current?.id);

    setUnreadMessages(
      unreadMessages.filter((msg) => msg.chat !== currentChat.current?.id)
    );

    requestHandler(
      async () => await getChatMessages(user.id, currentChat.current?.id || ""),
      setLoadingMessages,

      (res) => {
        const { data } = res;
        setMessages(data.messages || []);
      },
      alert
    );
  };

  const sendChatMessage = async () => {
    
    if (!currentChat.current?.id || !socket) return;

    socket.emit(STOP_TYPING_EVENT, currentChat.current?.id);

    await requestHandler(
      async () =>
        await sendMessage(
          user.id,
          currentChat.current?.id || "",
          message
        ),
      null,
      (res) => {
        setMessage("");
        setMessages((prev) => [res.data, ...prev]); 
      },
      alert
    );
  };

  const handleOnMessageChange = (e) => {
    setMessage(e.target.value);

    if (!socket || !isConnected) return;

    if (!selfTyping) {
      setSelfTyping(true);
      socket.emit(TYPING_EVENT, currentChat.current?.id);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    const timerLength = 3000;

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit(STOP_TYPING_EVENT, currentChat.current?.id);
      setSelfTyping(false);
    }, timerLength);
  };

  const onConnect = () => {
    console.log("connecting")
    setIsConnected(true);
  };

  const onDisconnect = () => {
    setIsConnected(false);
  };

  const handleOnSocketTyping = (chatId) => {
    if (chatId !== currentChat.current?.id) return;
    setIsTyping(true);
  };

  const handleOnSocketStopTyping = (chatId) => {
    if (chatId !== currentChat.current?.id) return;
    setIsTyping(false);
  };

  const onMessageReceived = (message) => {
    
    if (message?.chat_id !== currentChat.current?.id) { // changed
      setUnreadMessages((prev) => [message, ...prev]);
    } else {
      setMessages((prev) => [message, ...prev]);
    }

    updateChatLastMessage(message.chat_id || "", message); // changed
  };

  const onNewChat = (chat) => { // want to remove 
    setChats((prev) => [chat, ...prev]);
  };

  const onChatLeave = (chat) => {
    
    if (chat.id === currentChat.current?.id) {
      currentChat.current = null;
      LocalStorage.remove("currentChat");
    }
    setChats((prev) => prev.filter((c) => c.id !== chat.id));
  };

  useEffect(() => {
    getChat();

    const _currentChat = LocalStorage.get("currentChat");

    if (_currentChat) {
      currentChat.current = _currentChat;
     
      socket?.emit(JOIN_CHAT_EVENT, _currentChat.current?._id);
      getMessages();
    }
    
  }, []);


  useEffect(() => {
    if (!socket) return;
   
    socket.on(CONNECTED_EVENT, onConnect);
    
    socket.on(DISCONNECT_EVENT, onDisconnect);
    
    socket.on(TYPING_EVENT, handleOnSocketTyping);
    
    socket.on(STOP_TYPING_EVENT, handleOnSocketStopTyping);
    
    socket.on(MESSAGE_RECEIVED_EVENT, onMessageReceived);
    
    socket.on(NEW_CHAT_EVENT, onNewChat);
    
    socket.on(LEAVE_CHAT_EVENT, onChatLeave);
    

    
    return () => {
      socket.off(CONNECTED_EVENT, onConnect);
      socket.off(DISCONNECT_EVENT, onDisconnect);
      socket.off(TYPING_EVENT, handleOnSocketTyping);
      socket.off(STOP_TYPING_EVENT, handleOnSocketStopTyping);
      socket.off(MESSAGE_RECEIVED_EVENT, onMessageReceived);
      socket.off(NEW_CHAT_EVENT, onNewChat);
      socket.off(LEAVE_CHAT_EVENT, onChatLeave);
    };

  }, [socket, chats]);

  return (
    <>
      {/* <AddChatModal
        open={openAddChat}
        onClose={() => {
          setOpenAddChat(false);
        }}
        onSuccess={() => {
          getChat();
        }}
      /> */}

      <div className="w-full justify-between items-stretch h-screen flex flex-shrink-0">
        <div className="w-1/3 relative ring-white overflow-y-auto px-4">
          <div className="z-10 w-full sticky top-0 bg-dark py-4 flex justify-between items-center gap-4">
            <Input
              placeholder="Search user or group..."
              value={localSearchQuery}
              onChange={(e) =>
                setLocalSearchQuery(e.target.value.toLowerCase())
              }
            />
            <button
              onClick={() => setOpenAddChat(true)}
              className="rounded-xl border-none bg-primary text-white py-4 px-5 flex flex-shrink-0"
            >
              + Add chat
            </button>
          </div>
          {loadingChats ? (
            <div className="flex justify-center items-center h-[calc(100%-88px)]">
              <Typing />
            </div>
          ) : (
            // Iterating over the chats array
            [...chats]
              .map((chat) => {
                return (
                  <ChatItem
                    chat={chat}
                    isActive={chat.id === currentChat.current?.id}
                    unreadCount={
                      unreadMessages.filter((n) => n.chat === chat.id).length
                    }
                    onClick={(chat) => {
                      if (
                        currentChat.current?.id &&
                        currentChat.current?.id === chat.id
                      )
                        return;
                      LocalStorage.set("currentChat", chat);
                      currentChat.current = chat;
                      setMessage("");
                      getMessages();
                    }}
                    key={chat.id}
                    onChatDelete={(chatId) => {
                      setChats((prev) =>
                        prev.filter((chat) => chat.id !== chatId)
                      );
                      if (currentChat.current?.id === chatId) {
                        currentChat.current = null;
                        LocalStorage.remove("currentChat");
                      }
                    }}
                  />
                );
              })
          )}
        </div>
        <div className="w-2/3 border-l-[0.1px] border-secondary">
          {currentChat.current && currentChat.current?.id ? (
            <>
              <div className="p-4 sticky top-0 bg-dark z-20 flex justify-between items-center w-full border-b-[0.1px] border-secondary">
                <div className="flex justify-start items-center w-max gap-3">
                  {false? (
                    <div className="w-12 relative h-12 flex-shrink-0 flex justify-start items-center flex-nowrap">
                      {currentChat.current?.participants
                        .slice(0, 3)
                        .map((participant, i) => {
                          return (
                            <img
                              key={participant._id}
                              src={participant.avatar.url}
                              className={classNames(
                                "w-9 h-9 border-[1px] border-white rounded-full absolute outline outline-4 outline-dark",
                                i === 0
                                  ? "left-0 z-30"
                                  : i === 1
                                  ? "left-2 z-20"
                                  : i === 2
                                  ? "left-4 z-10"
                                  : ""
                              )}
                            />
                          );
                        })}
                    </div>
                  ) : (
                    <img
                      className="h-14 w-14 rounded-full flex flex-shrink-0 object-cover"
                      src="#"
                      
                    />
                  )}
                  <div>
                    <p className="font-bold">
                      {"title"}
                    </p>
                    <small className="text-zinc-400">
                      {
                        "description"
                      }
                    </small>
                  </div>
                </div>
              </div>
              <div
                className={classNames(
                  "p-8 overflow-y-auto flex flex-col-reverse gap-6 w-full",
                    "h-[calc(100vh-176px)]"
                )}
                id="message-window"
              >
                {loadingMessages ? (
                  <div className="flex justify-center items-center h-[calc(100%-88px)]">
                    <Typing />
                  </div>
                ) : (
                  <>
                    {isTyping ? <Typing /> : null}
                    {messages?.map((msg) => {
                      return (
                        <MessageItem
                          key={msg._id}
                          isOwnMessage={msg.sender_id === user?.id}
                          isGroupChatMessage={false}
                          message={msg}
                        />
                      );
                    })}
                  </>
                )}
              </div>
              {false ? (
                <div className="grid gap-4 grid-cols-5 p-4 justify-start max-w-fit">
                  {attachedFiles.map((file, i) => {
                    return (
                      <div
                        key={i}
                        className="group w-32 h-32 relative aspect-square rounded-xl cursor-pointer"
                      >
                        <div className="absolute inset-0 flex justify-center items-center w-full h-full bg-black/40 group-hover:opacity-100 opacity-0 transition-opacity ease-in-out duration-150">
                          <button
                            onClick={() => {
                              setAttachedFiles(
                                attachedFiles.filter((_, ind) => ind !== i)
                              );
                            }}
                            className="absolute -top-2 -right-2"
                          >
                            <XCircleIcon className="h-6 w-6 text-white" />
                          </button>
                        </div>
                        <img
                          className="h-full rounded-xl w-full object-cover"
                          src={URL.createObjectURL(file)}
                          alt="attachment"
                        />
                      </div>
                    );
                  })}
                </div>
              ) : null}
              <div className="sticky top-full p-4 flex justify-between items-center w-full gap-2 border-t-[0.1px] border-secondary">
                <input
                  hidden
                  id="attachments"
                  type="file"
                  value=""
                  multiple
                  max={5}
                  onChange={(e) => {
                    if (e.target.files) {
                      // setAttachedFiles([...e.target.files]);
                      console.log("files part")
                    }
                  }}
                />
                <label
                  htmlFor="attachments"
                  className="p-4 rounded-full bg-dark hover:bg-secondary"
                >
                  <PaperClipIcon className="w-6 h-6" />
                </label>

                <Input
                  placeholder="Message"
                  value={message}
                  onChange={handleOnMessageChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      sendChatMessage();
                    }
                  }}
                />
                <button
                  onClick={sendChatMessage}
                  disabled={!message }
                  className="p-4 rounded-full bg-dark hover:bg-secondary disabled:opacity-50"
                >
                  <PaperAirplaneIcon className="w-6 h-6" />
                </button>
              </div>
            </>
          ) : (
            <div className="w-full h-full flex justify-center items-center">
              No chat selected
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ChatPage;