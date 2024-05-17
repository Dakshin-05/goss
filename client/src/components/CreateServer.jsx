import React, { useState } from 'react'
import { requestHandler } from '../utils';
import { createServer } from '../api';
import { useAuth } from '../context/AuthContext';

function CreateServer({setIsOpen}) {
    const {user} = useAuth();
    const [newServerName, setNewServerName] = useState("");
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

  return (
    <>
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
    </>
  )
}

export default CreateServer