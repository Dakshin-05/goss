import { Tabs } from "flowbite-react";
import { HiStatusOnline } from "react-icons/hi";
import { FaUserFriends } from "react-icons/fa";
import { TiGroup } from "react-icons/ti";
import { MdPending } from "react-icons/md";
import { ImBlocked } from "react-icons/im";
import { IoMdPersonAdd , IoIosLogOut} from "react-icons/io";
import { useState, useCallback, useEffect } from "react";
import { requestHandler } from "../../utils";
import { 
  makeFriendRequest,
  getBlockedUsers,
  getAllFriends,
  getPendingRequests
} from "../../api";
import { useAuth } from "../../context/AuthContext";
import Friend from "./Friend.jsx";
import PendingRequest from "./PendingRequest.jsx";
import BlockedUsers from "./BlockedUsers.jsx";
import Online from "./Online.jsx";
import { useSocket } from "../../context/SocketContext.jsx";
import UserInfo from "./UserInfo.jsx";



export function TabsComponent() {
  const { user } = useAuth();
  const {socket} = useSocket()
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [blockedUsers, setBlockedUsers] = useState([])
  const [requestUsername, setRequestUsername] = useState("");
  const [isHovered, setIsHovered ] = useState(-1);
  const [isRequesting, setIsRequesting] = useState(false);
  const [response, setResponse] = useState("");
  const [message, setMessage] = useState("");
  const [onlineUsers, setOnlineUsers] = useState();
  const [userInfo, setUserInfo] = useState({});

  const handleUserInfo = (name, username, avatar) => {
    setUserInfo({name:name, username:username, avatar:avatar})
  }
  
  const handleDataChange = (e) => {
    setResponse(false);
      e.preventDefault();
      setRequestUsername(e.target.value);
  };

  const handleAddFriend = async () => {
    await requestHandler(
      async () =>  await makeFriendRequest(
        user.id,
        {requestedUsername:requestUsername}
      ),
      setIsRequesting,
      (res) => {
        setResponse("success")
        setMessage(res.message)
        setRequestUsername("")
      },
      alert
    );
};

  const loadAllFriends = useCallback(async () => {
      await requestHandler(
        async () => await getAllFriends(user.id),
        null,
        (res) => {
            setFriends(res.data.allFriends)
        },
        alert
      );
  },[user]);

  const loadPendingRequests = useCallback(async () => {
      await requestHandler(
        async () => await getPendingRequests(user.id),
        null,
        (res) => {
            setPendingRequests([res.data.incomingPendingRequests, res.data.outgoingPendingRequests])
        },
        alert
      );
  },[user]);

  const loadBlockedUsers = useCallback(async () => {
      await requestHandler(
        async () => await getBlockedUsers(user.id),
        null,
        (res) => {
            setBlockedUsers(res.data.blockedUsers)
        },
        alert
      );
  },[user]);

  useEffect(() => {
      loadAllFriends()
      loadPendingRequests()
      loadBlockedUsers()
  }, [  loadAllFriends,
    loadPendingRequests,
    loadBlockedUsers, isRequesting]);

    
  const onConnect = () => {
    console.log("connecting", user)
    socket.emit("ok", user);
  }

    const getVisitors = (users) => {
      console.log("connected event")
      setOnlineUsers(users)
   }

    useEffect(()=>{
      socket?.on("connected",onConnect);
      socket?.on("visitors", getVisitors)
      return () => {
         socket?.off("connected",onConnect)
         socket?.off('visitors', getVisitors) 
      }
     },[socket])
   
     console.log(onlineUsers)

  
  return (
    <Tabs aria-label="Tabs with underline" style="underline" >
      <Tabs.Item icon={FaUserFriends} disabled title="Friends">
      </Tabs.Item>
      <Tabs.Item active title="Online" icon={HiStatusOnline}>
        {friends && friends.map((f) => {
          if(onlineUsers?.includes(f.id))
            return <Online  key={f.id} id={f.id} name={f.name} username={f.username}  setFriends={setFriends} isHovered={isHovered} setIsHovered={setIsHovered} setIsRequesting={setIsRequesting} isOnline={onlineUsers?.includes(f.id)} handleUserInfo={handleUserInfo}/>
        })}
         {
          userInfo != {} && 
        <UserInfo userInfo={userInfo}/>
        }
      </Tabs.Item>
      <Tabs.Item title="All" icon={TiGroup}>
        {friends && friends.map((f) => (
          <Friend  key={f.id} id={f.id} name={f.name} username={f.username} friends_from={f.friends_from} setFriends={setFriends} isHovered={isHovered} setIsHovered={setIsHovered} setIsRequesting={setIsRequesting} handleUserInfo={handleUserInfo}/>
        ))}
        {
          userInfo != {} && 
        <UserInfo userInfo={userInfo}/>
        }
      </Tabs.Item>
      <Tabs.Item title="Pending" icon={MdPending}>
        {pendingRequests && pendingRequests[0] && pendingRequests[0].map((pr) => (
          <PendingRequest key={pr.id} name={pr.name} username={pr.username} id={pr.id} type="incoming" setIsRequesting={setIsRequesting} />
        ))}

        {pendingRequests && pendingRequests[1] && pendingRequests[1].map((pr) => (
          <PendingRequest key={pr.id} name={pr.name} id={pr.id} username={pr.username} type="outgoing" setIsRequesting={setIsRequesting} />
        ))}
      </Tabs.Item>
      <Tabs.Item title="Blocked" icon={ImBlocked}>
        {blockedUsers && blockedUsers.map((f) => (
          <BlockedUsers key={f.id} name={f.name}  id={f.id} username={f.username} blocked_at={f.blocked_at} setIsRequesting={setIsRequesting}/>
        ))}
      </Tabs.Item>
      <Tabs.Item title="Add Friend" icon={IoMdPersonAdd}>
        
      <div class="max-w-[80%] mx-auto">
         <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
           <div class="relative">
             <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                 <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                     <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                 </svg>
             </div>
             <input type="search" id="default-search" class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="You can add friends with their Goss username" required value={requestUsername} onChange={handleDataChange}/>
             <button type="submit" class="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={handleAddFriend}>Send Friend Request</button>
           </div>
           {response && 

<div class="flex items-center p-4 mb-4 mt-2 text-sm text-green-800 border border-green-300 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400 dark:border-green-800" role="alert">
  <svg class="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
  </svg>
  <span class="sr-only"></span>
  <div>
    <span class="font-medium">{message}</span> 
  </div>
</div>


}

        </div>
      
      </Tabs.Item>
    
    </Tabs>
  );
}
