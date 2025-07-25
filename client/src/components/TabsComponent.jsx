import { Tabs } from "flowbite-react";
import { HiStatusOnline } from "react-icons/hi";
import { FaUserFriends } from "react-icons/fa";
import { TiGroup } from "react-icons/ti";
import { MdPending } from "react-icons/md";
import { ImBlocked } from "react-icons/im";
import { IoMdPersonAdd , IoIosLogOut} from "react-icons/io";
import { useState, useCallback, useEffect } from "react";
import { requestHandler } from "../utils/index.js";
import { 
  makeFriendRequest,
  getBlockedUsers,
  getAllFriends,
  getPendingRequests
} from "../api/index.js";
import { useAuth } from "../context/AuthContext.jsx";
import Friend from "./sidebar/Friend.jsx";
import PendingRequest from "./sidebar/PendingRequest.jsx";
import BlockedUsers from "./sidebar/BlockedUsers.jsx";
import Online from "./sidebar/Online.jsx";
import { useSocket } from "../context/SocketContext.jsx";
import UserInfo from "./FriendInfo.jsx";
import AddFriend from "./AddFriend.jsx";
import TmpChat from "./tmpchat.jsx";


export function TabsComponent({friendChat, setFriendChat}) {
  const { user } = useAuth();
  const {socket} = useSocket()
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [blockedUsers, setBlockedUsers] = useState([])
 
  
  const [isHovered, setIsHovered ] = useState(-1);
  const [isRequesting, setIsRequesting] = useState(false);
 

  const [onlineUsers, setOnlineUsers] = useState();
  const [userInfo, setUserInfo] = useState({});

  const handleUserInfo = (name, username, avatar) => {
    setUserInfo({name:name, username:username, avatar:avatar})
  }
  
  


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
    friendChat === -1 ?
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
          <Friend  key={f.id} id={f.id} name={f.name} username={f.username} friends_from={f.friends_from} setFriends={setFriends} isHovered={isHovered} setIsHovered={setIsHovered} setIsRequesting={setIsRequesting} handleUserInfo={handleUserInfo}
          setFriendChat={setFriendChat}
          />
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
        <AddFriend setIsRequesting={setIsRequesting}/>
      </Tabs.Item>
    
    </Tabs> :
    <TmpChat friendId={friendChat}/>
  );
}
