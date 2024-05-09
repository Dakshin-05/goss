
import { Tabs } from "flowbite-react";
import { HiClipboardList, HiStatusOnline } from "react-icons/hi";
import { FaUserFriends } from "react-icons/fa";
import { TiGroup } from "react-icons/ti";
import { MdPending } from "react-icons/md";
import { ImBlocked } from "react-icons/im";
import { IoMdPersonAdd } from "react-icons/io";
import { useState } from "react";
import { requestHandler } from "../utils";
import { 
  makeFriendRequest,
  getBlockedUsers,
  getAllFriends,
  getPendingRequests
} from "../api";
import { useAuth } from "../context/AuthContext";

export function TabsComponent() {
  const { user } = useAuth();
  const [friendUsername, setFriendUsername] = useState("");

  
  const handleDataChange =
    (e) => {
      setAddFriend(e.target.value);
      console.log(friendUsername)
    };

    const handleAddFriend = async () => {
      // await requestHandler(
      //   async () =>
      //     await makeFriendRequest(
      //       user?.id,
      //       friendUsername
      //     ),
      //   null,
      //   (res) => {
      //     setFriendUsername("")
          
      //   },
      //   alert
      // );
    }

  
  return (
    <Tabs aria-label="Tabs with underline" style="underline">
      <Tabs.Item icon={FaUserFriends} disabled title="Friends">
      </Tabs.Item>
      <Tabs.Item active title="Online" icon={HiStatusOnline}>
        
      </Tabs.Item>
      <Tabs.Item title="All" icon={TiGroup}>
        
      </Tabs.Item>
      <Tabs.Item title="Pending" icon={MdPending}>
        
      </Tabs.Item>
      <Tabs.Item title="Blocked" icon={ImBlocked}>
        
      </Tabs.Item>
      <Tabs.Item title="Add Friend" icon={IoMdPersonAdd}>
        <>
         
        <form class="max-w-[80%] mx-auto">
        <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
          <div class="relative">
            <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                </svg>
            </div>
            <input type="search" id="default-search" class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="You can add friends with their Goss username" required value={friendUsername} onChange={handleDataChange}/>
            <button type="submit" class="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={handleAddFriend}>Send Friend Request</button>
          </div>
        </form>


        </>
      </Tabs.Item>
      
    </Tabs>
  );
}
