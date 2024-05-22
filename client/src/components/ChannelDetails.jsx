import React, { useCallback, useEffect, useState } from 'react'
import DirectMessage from './sidebar/DirectMessage'
import { BiMessageAdd } from "react-icons/bi";
import { useNavigate } from 'react-router-dom';
import UserInfo from './FriendInfo';
import { MdEvent } from "react-icons/md";
import { GrChannel } from "react-icons/gr";
import { useAuth } from '../context/AuthContext';
import { requestHandler } from '../utils';
import { getAllEvents, getServerDetails } from '../api';
import { IoMdAdd } from "react-icons/io";
import EventCard from './EventCard';


function SideBar({channels, setChannels, serverId, setIsEventOpen, setIsAddChannelOpen, events, setEvents}) {

   const {user} = useAuth();
   const navigate = useNavigate();
   
   const loadEvents = useCallback(async() => {
      await requestHandler(
        async () => await getAllEvents(user.id, serverId),
        null,
        (res) => {
            console.log(res)
            setEvents(res.data.eventDetails)
        },
        alert
      );
     }, [serverId]);

   const loadChannels = useCallback(async () => {
       await requestHandler(
         async () => await getServerDetails(user.id, serverId),
         null,
         (res) => {
            console.log("res", res.data)
           setChannels(res.data.channelsDetails);
         },
         alert
       );
    }, [serverId]);

    useEffect(() =>{
       loadChannels();
       loadEvents();
    },[loadChannels, loadEvents])
console.log("channels", channels)



const redirectHome = () => {
    navigate('/home')
 }
 console.log(events)
  return (
    <>
     <aside id="separator-sidebar" class="h-screen transition-transform -translate-x-full sm:translate-x-0 w-full " aria-label="Sidebar">
         <div class="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-lightbase">
            <ul class="space-y-2 font-medium">
               <li>
                  <div class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-hoverbase group" onClick={redirectHome}>
                     <svg class="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                        <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z"/>
                     </svg>
                     <span class="flex-1 ms-3 whitespace-nowrap">Friends</span>
                     
                  </div>
               </li>
               <li onClick={()=>{setIsEventOpen(true)}}>
                  <div class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-hoverbase group mb-4" >
                  <MdEvent size={20}/>
                     <span class="flex-1 ms-3 whitespace-nowrap" >Events {events.length &&  <span className='text-sidebarblue'>{events.length}</span> }</span>
                     
                  </div>
               </li>
               <li >
                  <div class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-hoverbase group mb-4" >
                  <GrChannel size={20}/>
                     <span class="flex-1 ms-3 whitespace-nowrap">Channels</span>
                     <div onClick={()=>{setIsAddChannelOpen(true)}}><IoMdAdd size={20}  /></div>
                     
                  </div>
               </li>
        
            </ul>
            <hr />
            {/* <div class="space-y-2 font-medium ml-2 my-1 py-2" onClick={addDirectMessage}>
            <BiMessageAdd size={20}/> Direct messages
               <button className='m-2' onClick={addDirectMessage}><BiMessageAdd size={20}/></button> want to move this item to the end
            </div> */}
            <ul class="space-y-2 font-medium mt-2">
                {
                    channels && channels.map((channel)=> <li> 
                    <div class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-hoverbase group mb-4" onClick={()=>{navigate(`/channels/${serverId}/${channel.channel_id}`)}} >
                     <span class="flex-1 ms-3 whitespace-nowrap"># {channel.channel_name}</span>
                  </div>              
               </li>)
                }
               
            </ul>
            {
events.length !== 0 &&
            <div className='fixed bottom-0 h-56 select-none overflow-y-scroll no-scrollbar lg:w-56 mb-2  border-2 border-white rounded-lg -ml-1 space-y-2 font-medium mt-2'>
      
               {
                  events.length === 0 ? <></>: events.map((event)=>  <> <EventCard event={event}/><hr/></>)
               }            </div>
}
            
         </div>
      </aside>
    </>
  )
}

export default SideBar