import React from 'react'
import { getAllParticipants } from "../api/index.js";
import { useCallback, useEffect, useState } from "react";
import { requestHandler } from '../utils';
import { useAuth } from '../context/AuthContext.jsx';


export default function ParticipantBar( {serverId} ) {
    const {user} = useAuth();
    const [grpParticipants, setgrpParticipants] = useState([]);

    const loadParticipants = useCallback(async () => {
        await requestHandler(
          async () => await getAllParticipants(user.id, serverId),
          null,
          (res) => {
            const members = res.data.participants;
            // console.log(members)
            const groupedParticipants = members.reduce((accumulator, item) => {
                const category = item.role_name;
                if (!accumulator[category]) {
                  accumulator[category] = [];
                }
                accumulator[category].push( { user_id: item.member_id, user_name: item.username } );
                return accumulator;
              }, {});
                
                setgrpParticipants(groupedParticipants);
          },
          alert
        );
     }, [serverId]);

     useEffect(() =>{
        loadParticipants();
     },[loadParticipants])


     /*

     

<ul class="w-48 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
    <li class="w-full px-4 py-2 border-b border-gray-200 rounded-t-lg dark:border-gray-600">Profile</li>
    <li class="w-full px-4 py-2 border-b border-gray-200 dark:border-gray-600">Settings</li>
    <li class="w-full px-4 py-2 border-b border-gray-200 dark:border-gray-600">Messages</li>
    <li class="w-full px-4 py-2 rounded-b-lg">Download</li>
</ul>

     */
    // console.log(grpParticipants)
     return (
        <div  className='relative flex flex-col items-center  h-full w-full px-4 mt-5 bg-lightbase'>
            <div  class='select-none overflow-y-scroll mb-14 w-full no-scrollbar'>
            {
                (Object.entries(grpParticipants).map(([roleName, users]) => (
                    <>
                      <ul key="{roleName}-key"className="w-full mb-1 mt-1 text-sm font-medium text-gray-900 bg-whit dark:bg-lightbase dark:border-gray-600 dark:text-white">
                        <li key={roleName} className="w-full px-4 py-2  border-gray-200 dark:border-gray-600">
                          {roleName.toLocaleUpperCase()}  <span> {(roleName !== 'Owner') ? `- ${users.length}` : "" }</span> 
                        </li>
                            {users.map((user) => (

                            // <div class="flex items-center p-1 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-hoverbase group"
                            <li key={user.user_id} class="flex items-center p-3 pl-9 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-hoverbase w-full">
                            <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
  <path stroke="currentColor" stroke-width="2" d="M7 17v1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-4a3 3 0 0 0-3 3Zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
</svg>

                            <span className='pl-1'>{user.user_name} {user.name}</span>
                          </li>
                        ))}
                      </ul>
                      {/* <hr /> */}
                    </>
                  )) )
            }
            </div>
        </div>
     );
}