"use client";
import { useCallback, useEffect, useState } from "react";
import { TabsComponent } from "./TabsComponent.jsx";
import { getAllFriends, createServer, getAllServers } from "../../api/index.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { requestHandler } from "../../utils/index.js";
import DirectMessage from "./DirectMessage.jsx";
import { FiLogOut } from "react-icons/fi";
import { TextInput, Textarea } from "flowbite-react";
import { useSocket } from "../../context/SocketContext.jsx";
import UserInfo from "./UserInfo.jsx";
import { BiSolidMessageRoundedDots } from "react-icons/bi";
import { FaPlus } from "react-icons/fa";

export function SideBar() {
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
   
   const handleInputOnChange = (e) => {
      setNewServerName(e.target.value)
   }
   
   const handleCreateServer = async () => {
      console.log(newServerName)
      await requestHandler(
        async () => await createServer(user.id, newServerName),
        null,
        (res) => {
            console.log(res)
            setIsOpen(false)
        },
        alert
      );

   }

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

  const { logout } = useAuth();
  const [isOpen , setIsOpen] = useState(false);
  const [newServerName, setNewServerName] = useState("");

  const handleLogout = async () => {
    await logout();
  }


  return (
    <>
     <aside id="separator-sidebar" class="fixed top-0 left-0 z-40 w-20 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
     <div class="m-2 w-16 h-16 rounded-e-xl rounded-s-xl  bg-green-400 ">
      </div>
     <div class="m-2  w-16 h-16 flex justify-center items-center rounded-e-xl rounded-s-xl bg-green-400 "  onClick={()=>{setIsOpen(true)}}>
     <FaPlus size={32} />
    </div>
      </aside>

      <aside id="separator-sidebar" class="fixed top-0 left-20 z-40  h-screen transition-transform -translate-x-full sm:translate-x-0 w-44" aria-label="Sidebar">
         <div class="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
            <ul class="space-y-2 font-medium">
               <li>
                  <a href="#" class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                     <svg class="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                        <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z"/>
                     </svg>
                     <span class="flex-1 ms-3 whitespace-nowrap">Friends</span>
                     
                  </a>
               </li>
            </ul>
            <ul class="pt-4 mt-4 space-y-2 font-medium border-t border-gray-200 dark:border-gray-700">
            <li>
                  <a href="#" class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                  <FiLogOut />
                     <span class="flex-1 ms-3 whitespace-nowrap" onClick={handleLogout}>Logout</span>
                  </a>
               </li>
            </ul>
            <ul class="pt-4 mt-4 space-y-2 font-medium border-t border-gray-200 dark:border-gray-700 fixed bottom-0">
            <li>
                  <a href="#" class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                  <FiLogOut />
                     <span class="flex-1 ms-3 whitespace-nowrap" onClick={handleLogout}>Logout</span>
                  </a>
               </li>
            </ul>
            
         </div>
      </aside>

      <div class="p-4 sm:ml-64 mr-96">
         <TabsComponent />
      </div>
      

{
isOpen &&
<div id="select-modal" tabindex="-1" aria-hidden="true" class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96">
    <div class="relative p-4 w-full max-w-md max-h-full">
        <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                    Create Your Server
                </h3>
                <button type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="select-modal" onClick={()=>{setIsOpen(false)}}>
                    <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>
                    <span class="sr-only">Close modal</span>
                </button>
            </div>

            <div class="p-4 md:p-5">
                <p class="text-gray-500 dark:text-gray-400 mb-4">Server Name:</p>
                <ul class="space-y-4 mb-4">
                    <li>
                    <div class="col-span-2">
                        <input type="text" name="name" id="name" value={newServerName} onChange={handleInputOnChange} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Type server name" required=""/>
                    </div>
                    </li>
                   
                </ul>
                <button class="text-white inline-flex w-full justify-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={handleCreateServer}>
                    Create
                </button>
            </div>
        </div>
    </div>
</div> 
}

    </>
  );
}
