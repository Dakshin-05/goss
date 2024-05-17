import React from 'react'
import { FaPlus } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { useAuth } from '../context/AuthContext';

function ServerSideBar({setIsOpen}) {


    
    const { logout } = useAuth();
    const handleLogout = async () => {
        await logout();
    }

  return (
   <>
   <aside id="separator-sidebar" class="" aria-label="Sidebar">
     <div class="m-2 w-16 h-16 rounded-e-xl rounded-s-xl  bg-green-400 ">
      </div>
     <div class="m-2  w-16 h-16 flex justify-center items-center rounded-e-xl rounded-s-xl bg-green-400 "  onClick={()=>{setIsOpen(true)}}>
     <FaPlus size={32} />
      </div>
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