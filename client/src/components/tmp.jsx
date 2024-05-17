import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
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
let lastSetDate = false;

export default function PinnedSubheaderList( {friendId} ) {

    const {user} = useAuth();
    // const {friendId} = useParams()
    const {socket} = useSocket();
  
    // const {state} = useLocation()
    // console.log(state)
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
    
    const groupedMessages = Object.values(
        messages.reduce((acc, current) => {
            console.log(current.created_at.slice(8, 10));
            if( !acc[current.created_at.slice(8, 10) ] ) {
                acc[current.created_at.slice(8, 10) ] = [];

            }
            acc[current.created_at.slice(8, 10)].push( current );
            return acc;
        }, {})
    );
    console.log(groupedMessages)

  return (
    <List
      sx={{
        width: '100%',
        maxWidth: 'full',
        bgcolor: 'inherit',
        position: 'relative',
        overflow: 'auto',
        maxHeight: 870,
        '& ul': { padding: 0 },
      }}
      subheader={<li />}
    >
      { 
      
      groupedMessages.map( (msgs) => {      

        <li key={ msgs[0].created_at }>
          <ul>
            <ListSubheader>{Number(new Date(msgs[0].created_at)) > new Date().setHours(0,0,0,0) ? "Today" : (
                  Number(new Date(msgs[0].created_at)) > new Date().setDate(new Date().getDate() - 1) ? "Yesterday" : new Date(msgs[0].created_at).toDateString().slice(3))
            }</ListSubheader>

            { msgs.map((msg) =>  {

                const isCurrentUser = msg.sender_id === user.id;
            // console.log(msg)
            return (
              <ListItem key={msg.id}>
                <TextChatBubble mId={msg.id}
                username={isCurrentUser ? "You" : state?.friendName }
                timestamp={msg.created_at}
                message={msg.content}
                deliveredStatus= {msg.read_at !== null ? "read" : "sent"}
                className="inline-block "
                isOptionsOpen={isOptionsOpen}
                setIsOptionsOpen={setIsOptionsOpen}
                deleteCurrMessage={deleteCurrMessage}
                contentEditable={contentEditable}
                setContentEditable={setContentEditable}
                handleEditMessage={handleEditMessage}
                isRead = {msg.read_at !== null}
                chatId = {currChat.id}
              />
              <ListItemText primary={'item'}/>
              </ListItem>
            );

      })}
          </ul>
        </li>
      }
      )}
    </List>
  );
}