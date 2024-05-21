import React from 'react';
import Avatar from './Avatar';
import Info from './Info';
import Mutuals from './Mutuals';
import Note from './Note';

const ProfileCard = ({name, username, friendsFrom, avatarUrl, mutualFriends, mutualServers, numServers, numFriends }) => {
  return (
    <div className="bg-gray-900 text-white p-2 rounded-lg shadow-lg max-w-xs">
        
        {/* <svg class="w-[48px] h-[48px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-width="2" d="M7 17v1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-4a3 3 0 0 0-3 3Zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
        </svg> */}
 <div className={`bg-${["red", "green", "blue"][Math.floor(Math.random() * 3)]}-500 p-4 rounded-t-lg flex items-center relative`}>
  <br></br><br></br><br></br><br></br><br></br>
        <div className="absolute left-4 top-24 w-24 h-24 bg-gray-900 rounded-full flex items-center justify-center border-2 border-white">
          <span className="text-3xl">🎭</span>
        </div>
      </div>


      <Info
        username={name}
        discriminator={username}
        memberSince={friendsFrom}
      />
      <Mutuals servers={numServers} friends={numFriends} mutualFriends={mutualFriends} mutualServers={mutualServers} />
      <Note />
    </div>
  );
};

export default ProfileCard;
