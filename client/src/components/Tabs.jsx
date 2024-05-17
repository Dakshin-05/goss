import React, { useState } from 'react'
import { FaUserFriends } from "react-icons/fa";
import { MdPending } from "react-icons/md";
import { ImBlocked } from "react-icons/im";
import { IoMdPersonAdd , IoIosLogOut} from "react-icons/io";
import { HiStatusOnline } from "react-icons/hi";
import { TiGroup } from "react-icons/ti";

function Tabs({tabs, setTabs,}) {

  return (
    <>
    <div class="border-b border-gray-200 dark:border-gray-700">
    <ul class="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
        <li class="" onClick={()=>{setTabs("online")}}>
            <a  class={`inline-flex items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-blue-400 dark:hover:text-gray-300 disabled group ${tabs==="friends" ? " border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500" : ""}`}>
           <FaUserFriends size={20}/>
           <p className="ml-2">Friends</p>
            </a>
        </li>
        <li class="" onClick={()=>{setTabs("online")}}>
        <a  class={`inline-flex items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-blue-400 dark:hover:text-gray-300 group ${tabs==="online" ? " border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500" : ""}`}>
            <HiStatusOnline size={20}/>
           <p className="ml-2">Online</p>
            </a>
        </li>
        <li class="" onClick={()=>{setTabs("all")}}>
        <a  class={`inline-flex items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-blue-400 dark:hover:text-gray-300 group ${tabs==="all" ? " border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500" : ""}`}>
            <TiGroup size={20}/>
           <p className="ml-2">All</p>
            </a>
        </li>
        <li class="" onClick={()=>{setTabs("pending")}}>
        <a  class={`inline-flex items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-blue-400 dark:hover:text-gray-300 group ${tabs==="pending" ? " border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500" : ""}`}>
            <MdPending size={20}/>
           <p className="ml-2">Pending</p>
            </a>
        </li>
        <li class="" onClick={()=>{setTabs("blocked")}}>
        <a  class={`inline-flex items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-blue-400 dark:hover:text-gray-300 group ${tabs==="blocked" ? " border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500" : ""}`}>
            <ImBlocked size={20}/>
           <p className="ml-2">Blocked</p>
            </a>
        </li>
        <li class="" onClick={()=>{setTabs("addFriend")}}>
        <a  class={`inline-flex items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-blue-400 dark:hover:text-gray-300 group ${tabs==="addFriend" ? " border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500" : ""}`}>
            <IoMdPersonAdd size={20}/>
           <p className="ml-2">Add Friend</p>
            </a>
        </li>
    </ul>
</div>

    </>
  )
}

export default Tabs