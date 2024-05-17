import React, { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { LocalStorage, requestHandler } from '../utils';
import { deleteMessage, getChat, getChatMessages, sendMessage, editMessages } from '../api';
import { useLocation, useParams } from 'react-router-dom';
import TextChatBubble from './TextChatBubble';



const CONNECTED_EVENT = "connected";
const DISCONNECT_EVENT = "disconnect";
const JOIN_CHAT_EVENT = "joinChat";
const NEW_CHAT_EVENT = "newChat";
const TYPING_EVENT = "typing";
const STOP_TYPING_EVENT = "stopTyping";
const MESSAGE_RECEIVED_EVENT = "messageReceived";
const LEAVE_CHAT_EVENT = "leaveChat";
const UPDATE_GROUP_NAME_EVENT = "updateGroupName";
const MESSAGE_DELETED_EVENT = "messageDeleted";
const MESSAGE_EDITED_EVENT= "messageEdited"
let state;
let set = false;

// const topLabel = document.getElementById('date-label')
// const messageBox = document.getElementById('messages')
// messageBox.addEventListener('scroll', () => {
//   const dateLabels = document.querySelectorAll('.divider')
//   let currentLabel = null
//   dateLabels.forEach((dateLabel) => {
//     if(messageBox.scrollTop >= dateLabel.offsetTop)
//     {
//       currentLabel = dateLabel
//     }
//   })
//   if(currentLabel) {
//     topLabel.style.opacity = '1'
//     topLabel.innerText = currentLabel.innerText
//   } else {
//     topLabel.style.opacity = '0'
//   }
// })

const TmpChat = ({friendId})  => {

  const {user} = useAuth();
  // const {friendId} = useParams()
  const {socket} = useSocket();

  const {state} = useLocation()
  console.log(state)
  //states
  const [currChat, setCurrChat] = useState(null);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [messages, setMessages] = useState([])
  const [unReadMessages, setUnReadMessages] = useState([])
  const [isConnected, setIsConnected] = useState(false)
  const [currMessage, setCurrMessage] = useState("")
  let timeSetForDay = false;
  
  const [isOptionsOpen, setIsOptionsOpen] = useState(-1);
  const [contentEditable, setContentEditable] = useState(-1);
  const [editMessage, setEditMessage] = useState(-1);

  const handleMessageOnChange = (e) => {
    setCurrMessage(e.target.value)
    if (!socket || !isConnected) return;
     
    //yet to be completed
  }
  
  const handleEditMessage = (mId, message) => {
    setEditMessage(mId);
    setCurrMessage(message)
  }

 


  const sendEditedMessage = async (messageId, newContent) => {
      if (!currChat.id) return alert("No chat is selected");
  
      if (!socket) return alert("Socket not available");
  
  
      requestHandler(
        async () => await editMessages(user.id, currChat.id , messageId, newContent),
        setLoadingMessages,
        (res) => {
          const { data } = res;
          setMessages((prev)=> prev.map(m=>({...m, content: messageId === m.id ?newContent : m.content })))
          setEditMessage(-1);
          setCurrMessage("")
        },
        alert
      )
    }
  
 

  const onMessageReceived = (message) => {
    console.log(message)
    setMessages((prev) => [...prev, message])
  }

  const onMessageDeleted = (messageId) => {
    setMessages(prev => prev.filter((msg) => msg.id !== messageId));
  }

  const onMessageEdit = ({messageId, newContent}) => {
    setMessages((prev)=> prev.map(m=>({...m, content: messageId === m.id ?newContent : m.content })))
  }
  
  useEffect(()=>{
    window.scrollTo(0, document.body.scrollHeight);

  },[messages])
 
  const getCurrChat = async () => {
    requestHandler(
      async () => await getChat(user.id, friendId),
      null,
      (res) => {
        const { data } = res;
        setCurrChat(data.chat || []);
      },
      alert
    )
  }

  const getMessages = async () => {
    if (!currChat.id) return alert("No chat is selected");

    if (!socket) return alert("Socket not available");


    requestHandler(
      async () => await getChatMessages(user.id, currChat.id || ""),
      setLoadingMessages,
      (res) => {
        const { data } = res;
        setMessages(data.messages || []);
      },
      alert
    );
  };

  const deleteCurrMessage = async (messageId) => {
    if (!currChat.id) return alert("No chat is selected");

    if (!socket) return alert("Socket not available");


    requestHandler(
      async () => await deleteMessage(user.id, currChat.id , messageId),
      setLoadingMessages,
      (res) => {
        const { data } = res;
        setMessages(prev => prev.filter((msg) => msg.id !== messageId));
      },
      alert
    )
  }
  
  const handleSendMessage = async () => {
    console.log("sending message!!")
    if (!currChat.id || !socket) return;

    await requestHandler(
      async () =>
        await sendMessage(
          user.id,
          currChat.id || "",
          currMessage
        ),
      null,
      (res) => {
        setCurrMessage("");
        getMessages()
  
      },
      alert
    );
  };


  useEffect(()=>{
    getCurrChat();
    window.scrollTo(0, document.body.scrollHeight);
  },[]);

  useEffect(()=>{
    if(currChat){
      socket?.emit(JOIN_CHAT_EVENT, currChat.id);
      setIsConnected(true);
      getMessages();
    }
  },[currChat]);

  const onConnect = () => {
    console.log("connecting")
  }


  useEffect(()=>{

    socket.on(CONNECTED_EVENT,onConnect);
    
    socket.on(DISCONNECT_EVENT, ()=>{
      console.log("disconnected event")
    });

    socket.on(MESSAGE_RECEIVED_EVENT, onMessageReceived);
    socket.on(MESSAGE_DELETED_EVENT, onMessageDeleted);
    socket.on(MESSAGE_EDITED_EVENT, onMessageEdit);
    
    return () => {
      socket.off(CONNECTED_EVENT, () => {
        console.log("connected event")
      });

      socket.off(DISCONNECT_EVENT, ()=>{
        console.log("disconnected event")
      });

      socket.off(MESSAGE_RECEIVED_EVENT, onMessageReceived);
      socket.off(MESSAGE_DELETED_EVENT, onMessageDeleted);
      socket.off(MESSAGE_EDITED_EVENT, onMessageEdit);

    };
  },[socket]);

  return (
    
    <div className='h-full overflow-y-auto px-3'>
      <div class=''
      >
      <div className='flex flex-col '>
        {messages && messages.map((m) => {
          timeSetForDay=false
           if(new Date(m.created_at).toLocaleDateString().slice(2,4) != set){
            set = Number(new Date(m.created_at).toLocaleDateString().slice(2,4))
            timeSetForDay=true
                   }
          /*
               
          */
          const groupedMessages = Object.values(
            messages.reduce((acc, current) => {
                acc[current.created_at.toLocaleDateString().slice(2, 4)] = acc[current.created_at.toLocaleDateString().slice(2, 4)] ?? [];
                acc[current.created_at.toLocaleDateString().slice(2, 4)].push(current);
                return acc;
            }, {})
        );
          const isCurrentUser = m.sender_id === user.id;
          return (
            <>{
                timeSetForDay && 
                <div class="flex justify-center max-xl sticky">
                  {Number(new Date(m.created_at)) > new Date().setHours(0,0,0,0) ? "Today" : (
                  Number(new Date(m.created_at)) > new Date().setDate(new Date().getDate() - 1) ? "Yesterday" : new Date(m.created_at).toDateString().slice(3))
                  }
                </div>
            }
           
            <div key={m.id} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} my-3`}>
              <TextChatBubble mId={m.id}
                username={isCurrentUser ? "You" : state?.friendName }
                timestamp={m.created_at}
                message={m.content}
                deliveredStatus= {m.read_at !== null ? "read" : "sent"}
                className="inline-block "
                isOptionsOpen={isOptionsOpen}
                setIsOptionsOpen={setIsOptionsOpen}
                deleteCurrMessage={deleteCurrMessage}
                contentEditable={contentEditable}
                setContentEditable={setContentEditable}
                handleEditMessage={handleEditMessage}
                isRead = {m.read_at !== null}
                chatId = {currChat.id}
              />
            </div>
            </>
          );
        })}
      </div>

      </div>

<div class="fixed  mt-5 bottom-2 w-full px-2 ">   
    <label for="search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
    <div class="relative">
        <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
        <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 16">
        <path d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z"/>
        <path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z"/>
    </svg>
        </div>
        <input type="search" id="search" class="block w-5/6 p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 " placeholder="Your Message" required value={currMessage}  onChange={handleMessageOnChange} autoComplete='off'/>
        <button type="submit" class="text-white absolute end-2.5 placeholder: bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" id='focus' onClick={()=>{editMessage === -1 ? handleSendMessage(): sendEditedMessage(editMessage, currMessage)}}>{editMessage !== -1 ? "Edit" : "Send"}</button>
    </div>
</div>

    </div>
  )
}

export default TmpChat;