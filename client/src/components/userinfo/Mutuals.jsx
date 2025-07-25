import React from 'react';
import { FaUserFriends } from "react-icons/fa";

const Mutuals = ({servers, friends, mutualFriends, mutualServers }) => {
  return (
    <div className="mb-4">
      <div className="mb-2">
        
        <p className="text-sm">{friends} Friend • {servers} Servers</p>
      </div>
      <hr />
      <h3 className="text-lg font-bold mt-2">Mutuals</h3>
      <div className="flex justify-between">
      
        <div className="flex items-center">
        <FaUserFriends size={20}/>
          <span className='ml-2'>{mutualFriends} Mutual Friends</span>
        </div>
        <div className="flex items-center">
        <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M4.5 17H4a1 1 0 0 1-1-1 3 3 0 0 1 3-3h1m0-3.05A2.5 2.5 0 1 1 9 5.5M19.5 17h.5a1 1 0 0 0 1-1 3 3 0 0 0-3-3h-1m0-3.05a2.5 2.5 0 1 0-2-4.45m.5 13.5h-7a1 1 0 0 1-1-1 3 3 0 0 1 3-3h3a3 3 0 0 1 3 3 1 1 0 0 1-1 1Zm-1-9.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"/>
        </svg>
          <span className='ml-2'>{mutualServers} Mutual Servers</span>
        </div>
      </div>
    </div>
  );
};

export default Mutuals;
