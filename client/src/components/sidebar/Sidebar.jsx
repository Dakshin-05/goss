"use client";
import { useCallback, useEffect, useState } from "react";
import { TabsComponent } from "./TabsComponent.jsx";
import { getAllFriends } from "../../api/index.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { requestHandler } from "../../utils/index.js";
import DirectMessage from "./DirectMessage.jsx";
import { FiLogOut } from "react-icons/fi";
import { TextInput, Textarea } from "flowbite-react";
import { useSocket } from "../../context/SocketContext.jsx";
import UserInfo from "./UserInfo.jsx";
import { BiSolidMessageRoundedDots } from "react-icons/bi";


export function SideBar() {
   const { user } = useAuth();
   const {socket} = useSocket();
   const [friends, setFriends] = useState([]);
   const [onlineUsers, setOnlineUsers] = useState();

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

   useEffect(() => {
      loadFriends()
  }, [loadFriends]);

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

  const handleLogout = async () => {
    await logout();
  }


  return (
    <>
     <aside id="separator-sidebar" class="fixed top-0 left-0 z-40 w-20 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
     <div class="m-2 w-16 h-16 rounded-e-xl rounded-s-xl bg-green-400 ">

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
   
    </>
  );
}
