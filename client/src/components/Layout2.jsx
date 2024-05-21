"use client";
import { useCallback, useEffect, useState } from "react";
import { TabsComponent } from "./TabsComponent.jsx";
import { getAllFriends, createServer, getAllServers } from "../api/index.js";
import { useAuth } from "../context/AuthContext.jsx";
import { requestHandler } from "../utils/index.js";
import DirectMessage from "./sidebar/DirectMessage.jsx";

import { TextInput, Textarea } from "flowbite-react";
import { useSocket } from "../context/SocketContext.jsx";
import FriendInfo from "./FriendInfo.jsx";
import ServerSideBar from "./ServerSideBar.jsx";
import SideBar from "./SideBar.jsx"
import CreateServer from "./CreateServer.jsx";
import { FaUserFriends } from "react-icons/fa";
import Tabs from "./Tabs.jsx";
import TmpChat from "./tmpchat.jsx";
import SwitchTabs from "./SwitchTabs.jsx";
import ParticipantBar from "./ParticipantBar.jsx";
import { useParams } from "react-router-dom";
import CreateEvent from "./CreateEvent.jsx"
import AddChannel from "./AddChannel.jsx"



export function LayOut2({Component1, Component2, Component3}) {
   const { user } = useAuth();
   const { serverId } = useParams();
   const {socket} = useSocket();
   const [friends, setFriends] = useState([]);
   const [directMessages, setDirectMessages] = useState([])
   const [onlineUsers, setOnlineUsers] = useState("");
   const [servers, setServer] = useState([])

   const loadFriends = useCallback(async () => {
      await requestHandler(
        async () => await getAllFriends(user.id),
        null,
        (res) => {
            setFriends(res.data.allFriends)
            setDirectMessages(res.data.allFriends)
        },
        alert
      );
   }, [user]);

   const loadServers = useCallback(async () => {
      await requestHandler(
        async () => await getAllServers(user.id),
        null,
        (res) => {
            console.log(res)
            setServer(res.data.serverDetails)
        },
        alert
      );
   }, [user]);
   
  


   useEffect(() => {
      loadFriends();
      loadServers();
  }, [loadFriends, loadServers]);

//   const onConnect = () => {
//    console.log("connecting", user)
//    socket.emit("ok", user);
//  }

//   useEffect(()=>{
//    socket?.on("connected",onConnect);
//    socket?.on("visitors", getVisitors)
//    return () => {
//       socket?.off("connected",onConnect)
//       socket?.off('visitors', getVisitors) 
//    }
//   },[socket])

//   const getVisitors = (users) => {
//    console.log("connected event")
//    setOnlineUsers(users)
// }


// console.log(onlineUsers)

  const [isOpen , setIsOpen] = useState(false);
  const [friendChat, setFriendChat] = useState(null);
  const [tabs, setTabs] = useState("online");
  const [friendInfo, setFriendInfo] = useState({});
  const [isRequesting, setIsRequesting] = useState(false);
  const [isEventOpen, setIsEventOpen] = useState(false)
  const [isAddChannelOpen, setIsAddChannelOpen] = useState(false);

  const [channels, setChannels] = useState([]);


  console.log(friendInfo)
  console.log(isEventOpen
  )

  return (
    <>
    {/* <div className="flex flex-row">
      <div class="p-4 sm:ml-64 mr-96">
         <TabsComponent friendChat={friendChat} setFriendChat={setFriendChat} />
      </div>
      
    </div> */}
    <div className="flex flex-row">
      <div className="h-screen w-20">
      <ServerSideBar servers={servers} setIsOpen={setIsOpen}/>
      </div>
      <div className="h-screen w-72">
      {(Component3 === undefined)?(<SideBar  directMessage = {directMessages} setDirectMessages={setDirectMessages} setFriendInfo={setFriendInfo}  isRequesting={isRequesting}
            setIsRequesting={setIsRequesting}/>):<Component3 channels={channels} setChannels={setChannels} serverId={serverId} setIsEventOpen={setIsEventOpen} setIsAddChannelOpen={setIsAddChannelOpen}/> }
      </div>
      <div className="flex flex-col w-full">
      <div className="h-14 ">
        <Tabs tabs={tabs} setTabs={setTabs} setFriendInfo={setFriendInfo}/>
      </div>
      <div className="flex flex-row">
        <div id="main-chat" className="mt-5 lg:w-10/12 overflow-y-scroll h-[90vh] w-full no-scrollbar">
            <Component1 tabs={tabs} setTabs={setTabs} friendChat={friendChat} setFriendChat={setFriendChat} setFriendInfo={setFriendInfo} isRequesting={isRequesting}
            setIsRequesting={setIsRequesting} setDirectMessages={setDirectMessages}/>
        </div>
        <div className="lg:w-3/12 w-0 h-auto bg-gray-50 dark:bg-lightbase">
          {(Component2 === undefined)?
           (Object.keys(friendInfo).length !== 0 ? 
            <FriendInfo friendInfo={friendInfo} friends={friends} servers ={servers} /> : <div className="flex flex-col items-center justify-center mt-20">
              <p>It's quiet for now...</p>
              <p>Make friends and start chatting!</p></div>)
          : <Component2 serverId={serverId}/>}
        </div>
      </div>
    </div>
      {
         isOpen && <CreateServer setIsOpen={setIsOpen} loadServers={loadServers}/>
      }
      {
         isEventOpen && <CreateEvent setIsEventOpen={setIsEventOpen} />
      }
      {
         isAddChannelOpen && <AddChannel setIsAddChannelOpen={setIsAddChannelOpen} serverId={serverId} setChannels={setChannels}/>
      }
    </div>
    </>
  );
}
