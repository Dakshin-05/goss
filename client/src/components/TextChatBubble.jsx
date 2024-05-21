import React, { useEffect, useState } from 'react'
import { useSocket } from '../context/SocketContext'

let set = false;

function TextChatBubble({username,timestamp, message, deliveredStatus, mId, isOptionsOpen, setIsOptionsOpen, deleteCurrMessage, handleEditMessage, isRead, chatId, handleReplyMessage}) {
    const { socket } = useSocket();
    const [status, setStatus] = useState(deliveredStatus); // Declare and initialize deliveredStatus
    let timeSetForDay = false;
    const MESSAGE_DELIVERED_EVENT = "delivered";
    
    
    const changeStatus = () => {
        setStatus("read"); // Update deliveredStatus using setDeliveredStatus
        console.log("from msg");
    };

    const onMessageRead = async () => {
        setStatus("read");
    }
    
    // useEffect(() => {
    //     if (status === "sent") {
    //         if (username === "You") {
    //             socket?.once(mId.toString(), changeStatus);
    //         } else {
    //             socket?.emit(mId.toString());
    //         }
    //     }
    // }, [status, mId, socket, username]); // Add deliveredStatus as a dependency
    
    useEffect(()=>{
        if(chatId !== undefined && username !== 'You' && status === "sent")
            socket.emit(MESSAGE_DELIVERED_EVENT, {chatId: chatId, messageId: mId})

    },[]);

    useEffect(()=>{
        if(chatId !== undefined && username === 'You')
            socket.on(MESSAGE_DELIVERED_EVENT, onMessageRead);
    },[])
 

  return (
    <>
        
        <div class="flex items-start gap-2.5" onClick={()=>console.log(mId)}>
            {username !== 'You' && 
            <img class="w-8 h-8 rounded-full " src="data:image/png;base64,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" alt="Jese image" />}
                 {
                isOptionsOpen === mId && username === 'You' &&
            <div id="dropdownDots" class="z-10  bg-white divide-y divide-gray-100 rounded-lg shadow w-40 dark:bg-gray-700 dark:divide-gray-600">
                <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownMenuIconButton">
                    {/* <li>
                        <a class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" onClick={handleReplyMessage(mId, message)}>Reply</a>
                    </li> */}
                    <li>
                        <a  class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" onClick={() =>  navigator.clipboard.writeText(message)}>Copy</a>
                    </li>
                    <li>
                        <a  class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" onClick={()=>{ handleEditMessage(mId, message)}}>Edit</a>
                    </li>
                    {/* <li>
                        <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Report</a>
                    </li> */}
                    <li>
                        <a y class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" onClick={() => deleteCurrMessage(mId)}>Delete</a>
                    </li>
                </ul>
            </div>}
{
username === 'You' && 
                <button id="dropdownMenuIconButton" data-dropdown-toggle="dropdownDots" data-dropdown-placement="bottom-start" class="inline-flex  self-center items-center p-2 text-sm font-medium text-center text-gray-900 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800 dark:focus:ring-gray-600 mb-6" type="button" onClick={()=>{setIsOptionsOpen(mId)}}>
                <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 4 15">
                    <path d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"/>
                </svg>
            </button>}

            
            <div class="flex flex-col gap-1 w-full max-w-[320px]">
                <div class="flex items-center space-x-2 rtl:space-x-reverse">
                    <span class="text-sm font-semibold text-gray-900 dark:text-white">{username}</span>
                   
                </div>
                <div class={`flex flex-col leading-1.5 min-w-40  p-4 border-gray-200 bg-gray-100 
                ${username==="You" ?  "rounded-b-xl rounded-s-xl" : "rounded-b-xl rounded-e-xl" }  dark:bg-gray-700`}>
                    <p  class="text-sm font-normal text-gray-900
                    dark:text-white" 
                    >{message}</p>
                </div>
                <div>

                <span class={`text-sm inline ${username==="You" ? "float-left" : "float-end"} font-normal text-gray-500 dark:text-gray-400`}>{username === "You" && status}</span>
                {/* <span class="text-sm inline font-normal floaleft text-gray-500 dark:text-gray-400">{new Date(timestamp).toTimeString().slice(0,5)}</span> */}
                <span class={`text-sm inline font-normal ${username==="You" ? "float-end" : "float-left"} text-gray-500 dark:text-gray-400`}>{new Date(timestamp).toTimeString().slice(0,5)}</span>
                </div>
            </div>
            {
                username !== 'You' && 
                <button id="dropdownMenuIconButton" data-dropdown-toggle="dropdownDots" data-dropdown-placement="bottom-start" class="inline-flex mt-4 self-center items-center p-2 text-sm font-medium text-center text-gray-900 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800 dark:focus:ring-gray-600 mb-10" type="button" onClick={()=>{setIsOptionsOpen(mId)}}>
                <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 4 15">
                    <path d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"/>
                </svg>
            </button>
            }
           
            {username === 'You' &&
              <img class="w-8 h-8 rounded-full " src="data:image/png;base64,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" alt="Jese image" />}
              {
                isOptionsOpen === mId && username !== 'You' &&
            <div id="dropdownDots" class="z-10  bg-white divide-y divide-gray-100 rounded-lg shadow w-40 dark:bg-gray-700 dark:divide-gray-600">
                <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownMenuIconButton">
                    {/* <li>
                        <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Reply</a>
                    </li> */}
                
                    <li>
                        <a  class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" onClick={() =>  navigator.clipboard.writeText(message)}>Copy</a>
                    </li>
                    {/* <li>
                        <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Report</a>
                    </li> */}
                     <li>
                        <a  class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"  onClick={()=>{
                            handleEditMessage(mId, message)
                            }}>Edit</a>
                    </li>
                    <li>
                        <a y class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" onClick={() => deleteCurrMessage(mId)}>Delete</a>
                    </li>
                </ul>
            </div>}
        </div>
              

    </>
  )
}

export default TextChatBubble