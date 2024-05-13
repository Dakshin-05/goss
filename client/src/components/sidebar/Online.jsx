import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { requestHandler } from "../../utils"
import { deleteFriend } from "../../api"
import { useAuth } from "../../context/AuthContext"



function Online({avatar, name, username, id, friends_from, isHovered, setIsHovered, setIsRequesting, isOnline,  handleUserInfo}) {

  const {user, setFriendId} = useAuth()
  const navigate = useNavigate()
  const redirectChat = () => {
    
    navigate(`/chat/${id}`)
  }

  const removeFriend = async() => {
    await requestHandler(
      async () => await deleteFriend(user.id, {friendId:id}),
      setIsRequesting,
      () => {},
      alert
    )
  }

  return (

    <>
      <p class="flex items-center p-1 bg-gray-800 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group group1  mb-0.5" onMouseEnter={()=>{id!==isHovered && setIsHovered(-1) }} key={id} onClick={()=>{handleUserInfo(name, username, avatar)}}>
        <svg class="flex-shrink-0 w-5 h-10 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
        </svg>
        <div class="float-left flex flex-row justify-between space-x-50">
          <div class="flex items-center  gap-4 whitespace-nowrap">
         {
           avatar ?          
           <img class="w-10 h-10 rounded-full bg-gray-100" src="/docs/images/people/profile-picture-5.jpg" alt="" /> : 
           <div class='bg-gray-100 w-10 rounded-full mr-2 flex justify-center items-center h-10 '><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" id="profile"><g fill="none" fill-rule="evenodd" stroke="#200E32" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" transform="translate(4 2.5)"><circle cx="7.579" cy="4.778" r="4.778"></circle><path d="M5.32907052e-15,16.2013731 C-0.00126760558,15.8654831 0.0738531734,15.5336997 0.219695816,15.2311214 C0.677361723,14.3157895 1.96797958,13.8306637 3.0389178,13.610984 C3.81127745,13.4461621 4.59430539,13.3360488 5.38216724,13.2814646 C6.84083861,13.1533327 8.30793524,13.1533327 9.76660662,13.2814646 C10.5544024,13.3366774 11.3373865,13.4467845 12.1098561,13.610984 C13.1807943,13.8306637 14.4714121,14.270023 14.929078,15.2311214 C15.2223724,15.8479159 15.2223724,16.5639836 14.929078,17.1807781 C14.4714121,18.1418765 13.1807943,18.5812358 12.1098561,18.7917621 C11.3383994,18.9634099 10.5550941,19.0766219 9.76660662,19.1304349 C8.57936754,19.2310812 7.38658584,19.2494317 6.19681255,19.1853548 C5.92221301,19.1853548 5.65676678,19.1853548 5.38216724,19.1304349 C4.59663136,19.077285 3.8163184,18.9640631 3.04807112,18.7917621 C1.96797958,18.5812358 0.686515041,18.1418765 0.219695816,17.1807781 C0.0745982583,16.8746908 -0.000447947969,16.5401098 5.32907052e-15,16.2013731 Z"></path></g></svg> </div> 
         }
        <div class="font-medium dark:text-white">
        <div>{name}<div class="hidden ml-2 group-hover:inline text-indigo-300 text-sm">{username}</div></div>
        <div class={`text-sm  ${isOnline ? "text-green-500" : " text-gray-500"}`} >{isOnline ? "Online" : "Offline"}</div>
        </div>
      </div>
      </div>
        <span class="flex-1 ms-3 whitespace-nowrap "></span> 
        <div class="float-right flex flex-row justify-between space-x-50">  
        <div class='bg-indigo-600 w-10 rounded-full mr-3 flex justify-center items-center h-full hover:cursor-pointer' onClick={redirectChat}>
        <svg class="icon__4ee3f float-left ax-w-fit justify-center p-1 items-center  " aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M12 22a10 10 0 1 0-8.45-4.64c.13.19.11.44-.04.61l-2.06 2.37A1 1 0 0 0 2.2 22H12Z" ></path></svg>
        </div>
        <div class='bg-indigo-600 relative w-10 h-8 rounded-full flex justify-center items-center hover:cursor-pointer' onMouseEnter={()=>setIsHovered(id)} >
        <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 4 15" >
        <path d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z "/>
        </svg>
        {
          id === isHovered &&
          <div id="dropdownDots" class="z-10 absolute top-10 right-5 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600" onMouseLeave={()=>setIsHovered(-1)}>
            <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownMenuIconButton">
              <li>
                <div class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" onClick={removeFriend}>Remove Friend</div>
              </li>
              <li>
                <div class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Start Video Chat</div>
              </li>
              <li>
                <div class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Start Audio Chat</div>
              </li>
            </ul>
            <div class="py-2">
              <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Further link</a>
            </div>
        </div>
        }
        </div>  
      </div>
      </p>
    </>
  )
}

export default Online