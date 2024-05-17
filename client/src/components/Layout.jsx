"use client";
import { useCallback, useEffect, useState } from "react";
import { TabsComponent } from "./TabsComponent.jsx";
import { getAllFriends, createServer, getAllServers } from "../api/index.js";
import { useAuth } from "../context/AuthContext.jsx";
import { requestHandler } from "../utils/index.js";
import DirectMessage from "./sidebar/DirectMessage.jsx";

import { TextInput, Textarea } from "flowbite-react";
import { useSocket } from "../context/SocketContext.jsx";
import UserInfo from "./FriendInfo.jsx";
import ServerSideBar from "./ServerSideBar.jsx";
import SideBar from "./SideBar.jsx"
import CreateServer from "./CreateServer.jsx";
import { FaUserFriends } from "react-icons/fa";
import Tabs from "./Tabs.jsx";
import TmpChat from "./tmpchat.jsx";
import SwitchTabs from "./SwitchTabs.jsx";



export function LayOut() {
   const { user } = useAuth();
   const {socket} = useSocket();
   const [friends, setFriends] = useState([]);
   const [onlineUsers, setOnlineUsers] = useState("");

   const loadFriends = useCallback(async () => {
      await requestHandler(
        async () => await getAllFriends(user.id),
        null,
        (res) => {
            setFriends(res.data.allFriends)
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




  return (
    <>
    {/* <div className="flex flex-row">
   
     
      <div class="p-4 sm:ml-64 mr-96">
         <TabsComponent friendChat={friendChat} setFriendChat={setFriendChat} />
      </div>
      
    </div> */}
    <div className="flex flex-row">
      <div className="h-screen w-20">
      <ServerSideBar setIsOpen={setIsOpen}/>
      </div>
      <div className="h-screen w-56">
      <SideBar />
      </div>
      <div className="flex flex-col w-full">
      <div className="h-14 ">
        <Tabs tabs={tabs} setTabs={setTabs}/>
      </div>
      <div className="flex flex-row">
        <div className="mt-5 lg:w-4/5 overflow-y-scroll h-[90vh] w-full no-scrollbar">
        <SwitchTabs tabs={tabs} setTabs={setTabs} friendChat={friendChat} setFriendChat={setFriendChat}/>
        </div>
        <div className="lg:w-1/5 h-auto bg-red-100">

        </div>
      </div>
    
    </div>
      {
         isOpen && <CreateServer setIsOpen={setIsOpen}/>
      }
    </div>
    </>
  );
}
