import { Textarea } from 'flowbite-react'
import React, { useCallback, useEffect, useState } from 'react'
import ProfileCard from './userinfo/ProfileCard.jsx'
import { requestHandler } from '../utils/index.js';
import { getAllFriends, getAllServers } from '../api/index.js';
import { useAuth } from '../context/AuthContext.jsx';


function FriendInfo({friendInfo, servers, friends}) {
   
   console.log(friendInfo)
   const avatarUrl =  'https://cdn.discordapp.com/avatars/user_id/avatar.png'
   const [mutualFriends, setMutualFriends ] = useState(0);
   const [mutualServers, setMutualServers ] = useState(0);
   const [numServers, setNumServers] = useState(0);
   const [numFriends, setNumFriends] = useState(0);


    const loadServers = async () => {
      await requestHandler(
        async () => await getAllServers(friendInfo.id),
        null,
        (res) => {
            const friendServer = res.data.serverDetails;
            const server1ID = servers.map( (server) => server.id )
            const server2ID = friendServer.map( (server) => server.id )
            setMutualServers(server2ID.filter( (serverID) => server1ID.includes(serverID) ).length)
            setNumServers(friendServer.length);

        },
        alert
      );
   };

   const loadFriends = async () => {
      await requestHandler(
        async () => await getAllFriends(friendInfo.id),
        null,
        (res) => {
            const friendFriends = (res.data.allFriends);
            const friend1ID = friends.map( (friend) => friend.id );
            const friend2ID = friendFriends.map( (friend) => friend.id );
            setMutualFriends(friend2ID.filter( (friendID) => friend1ID.includes(friendID) ).length)
            setNumFriends(friendFriends.length);
            console.log(friendInfo, friend1ID, friend2ID, friendFriends)

        },
        alert
      );
   };


    useEffect(() => {
      if(friendInfo.id){
         loadFriends();
         loadServers();
      }
     
    },[friendInfo, servers, friends])
   

  return (
    <>
       <aside id="separator-sidebar" class=" lg:w-full w-0 h-full transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
         <div class="h-full lg:w-full w-0 px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-lightbase">
            {/* <ul class="space-y-2 font-medium">
               <li>
                  <a href="#" class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                     <svg class="flex-shrink-0 lg:w-5 w-0 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                        <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z"/>
                     </svg>
                     <span class="flex-1 ms-3 whitespace-nowrap">User Info</span>
                     
                  </a>
               </li>
            </ul> */}
            {/* <ul class="pt-4 mt-4 space-y-2 font-medium border-t border-gray-200 dark:border-gray-700">
            <li>
               <div class="max-w-sm pb-4 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                  <a href="#">
                     <img class="rounded-t-lg h-32 border-b-2 " src="../../images.png" alt="" />
                  </a>
                  <div class="relative ml-5 z-10 bottom-10">
                  <img class="lg:w-20 w-0 h-20 rounded-full z-10 bg-red-800" src="/docs/images/people/profile-picture-5.jpg" alt=""/>
                  <span class="top-1 left-16 absolute  w-3.5 h-3.5 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full"></span>
               </div>



               <div class="lg:w-11/12 w-0 -mt-4 text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white ml-4">
                  <button type="button" class="relative block items-center w-full px-4 py-2 text-sm font-medium border-b border-gray-200 rounded-t-lg hover:bg-gray-100 hover:text-blue-800 focus:z-10 focus:ring-2 focus:ring-blue-800 focus:text-blue-800 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white text-left">
                  
                     <div>{friendInfo.name}</div>
                     <div>{friendInfo.username}</div>
                  </button>
                  <button type="button" class="relative block items-center lg:w-full w-0 px-4 py-2 text-sm font-medium border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white text-left">
                     
                     MUTUALS
                     <div>0 servers</div>
                  </button>
                  <button type="button" class="relative block items-center lg:w-full w-0 px-4 py-2 text-sm font-medium border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white text-left">
                  
                     Friends since 
                     <div>{new Date(friendInfo.friends_from).toDateString().slice(3)}</div>
                  </button>
                  <button type="button" class="relative block items-center lg:w-full w-0 px-4 py-2 text-sm font-medium border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white text-left">
                     
                     Note
                     <Textarea/>
                  </button>
                  
               </div>


                  
                  
               </div>
            </li>

            </ul> */}
            
            <ProfileCard avatarUrl={avatarUrl} name={friendInfo.name} username={friendInfo.username} friendsFrom={friendInfo.friends_from} mutualFriends={mutualFriends} mutualServers={mutualServers} numFriends={numFriends} numServers={numServers}/>
         </div>
      </aside>

    </>
  )
}

export default FriendInfo