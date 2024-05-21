import React, { useState } from 'react'
import { FaPlus } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { useAuth } from '../context/AuthContext';
import { MdExplore } from "react-icons/md";
import { useNavigate } from 'react-router-dom';


function ServerSideBar({servers, setIsOpen, showServer}) {

    // console.log(servers)
    const [toolTip, setToolTip] = useState(-1)

    const navigate = useNavigate()
    
    const { logout } = useAuth();
    const handleLogout = async () => {
        await logout();
    }

    const navigateToServer = async (serverId, genChannelId) =>{
      navigate(`/channels/${serverId}/${genChannelId}`)
    } 
      
      const logos = servers.map( (server) => 
      <div class="m-2 w-14 h-14 rounded-e-2xl rounded-s-2xl bg-sidebarblue flex flex-col justify-center items-center " onClick={() => navigateToServer(server.server_id, server.channel_id)} onMouseEnter={()=>{setToolTip(server.server_id)}} onMouseLeave={()=>{setToolTip(-1)}}>
        <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M4.5 17H4a1 1 0 0 1-1-1 3 3 0 0 1 3-3h1m0-3.05A2.5 2.5 0 1 1 9 5.5M19.5 17h.5a1 1 0 0 0 1-1 3 3 0 0 0-3-3h-1m0-3.05a2.5 2.5 0 1 0-2-4.45m.5 13.5h-7a1 1 0 0 1-1-1 3 3 0 0 1 3-3h3a3 3 0 0 1 3 3 1 1 0 0 1-1 1Zm-1-9.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"/>
        </svg>
      
        {toolTip === server.server_id &&
          <div className='relative left-5 z-10 bg-secondary rounded-lg p-1'>{server.server_name}</div>}
        
      </div>
      )
  return (

   <>
    <aside id="separator-sidebar" class="bg-base h-screen" aria-label="Sidebar">
      <div class="m-2 w-14 flex justify-center items-center h-14 rounded-e-2xl rounded-s-2xl  bg-sidebarblue ">
      <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17h6l3 3v-3h2V9h-2M4 4h11v8H9l-3 3v-3H4V4Z"/>
</svg>

      </div>
      <div class="m-2  w-14 h-14 flex justify-center items-center rounded-e-2xl rounded-s-2xl bg-sidebarblue "  onClick={()=>{setIsOpen(true)}}>
      <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14m-7 7V5"/>
</svg>

      </div>
      <div class="m-2 w-14 flex justify-center items-center h-14 rounded-e-2xl rounded-s-2xl  bg-sidebarblue " oncl>
    <MdExplore size={24}/>
      </div>
<hr />
      {logos}
      <ul class="pt-4 mt-4 space-y-2 font-medium  fixed bottom-0">
        <li>
          <div class="flex flex-row items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group justify-center ml-4" onClick={handleLogout}>
            <FiLogOut size={24}/>
          </div>
      </li>
    </ul>
   </aside>
   </>
  )
}

export default ServerSideBar