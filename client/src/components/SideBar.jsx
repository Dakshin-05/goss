import React, { useEffect } from 'react'
import DirectMessage from './sidebar/DirectMessage'
import { BiMessageAdd } from "react-icons/bi";
import { useNavigate } from 'react-router-dom';
import UserInfo from './FriendInfo';


function SideBar({directMessage, setDirectMessages, setFriendInfo, isRequesting, setIsRequesting}) {
   const navigate = useNavigate()
   const addDirectMessage = () => {
      // want to finish this part
   }

   const redirectHome = () => {
      navigate('/home')
   }

  return (
    <>
     <aside id="separator-sidebar" class="h-screen transition-transform -translate-x-full sm:translate-x-0 w-full " aria-label="Sidebar">
         <div class="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-lightbase">
            <ul class="space-y-2 font-medium">
               <li onClick={()=>{setFriendInfo({})}}>
                  <div class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-hoverbase group" onClick={redirectHome}>
                     <svg class="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                        <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z"/>
                     </svg>
                     <span class="flex-1 ms-3 whitespace-nowrap">Friends</span>
                     
                  </div>
               </li>
               <li>
                  <div class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-hoverbase group mb-4"  onClick={addDirectMessage}>
                  <BiMessageAdd size={20}/>
                     <span class="flex-1 ms-3 whitespace-nowrap">Direct Message</span>
                     
                  </div>
               </li>
            </ul>
            <hr />
            {/* <div class="space-y-2 font-medium ml-2 my-1 py-2" onClick={addDirectMessage}>
            <BiMessageAdd size={20}/> Direct messages
               <button className='m-2' onClick={addDirectMessage}><BiMessageAdd size={20}/></button> want to move this item to the end
            </div> */}
            <ul class="space-y-2 font-medium mt-2">
            {directMessage && directMessage.map((f) => (
               <li> 
                  <DirectMessage id={f.id} name={f.name} username={f.username} friends_from={f.friends_from} setDirectMessages={setDirectMessages} setFriendInfo={setFriendInfo}  isRequesting={isRequesting}
            setIsRequesting={setIsRequesting}/>
               </li>
            ))}
            </ul>
            
            <ul>
               {/* <UserInfo /> */}
            </ul>
            
         </div>
      </aside>
    </>
  )
}

export default SideBar