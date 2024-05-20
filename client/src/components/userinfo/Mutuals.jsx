import React from 'react';

const Mutuals = ({servers, friends, mutualFriends, mutualServers }) => {
  return (
    <div className="mb-4">
      <div className="mb-2">
        <h3 className="text-lg font-bold">Mutuals</h3>
        <p className="text-sm">{friends} Friend • {servers} Servers</p>
      </div>
      <div className="flex justify-between">
        <div className="flex items-center">
          <img src="friend_icon_url" alt="Friend" className="w-6 h-6 rounded-full mr-2" />
          <span>{mutualFriends} Mutual Friends</span>
        </div>
        <div className="flex items-center">
          <img src="server_icon_url" alt="Server" className="w-6 h-6 rounded-full mr-2" />
          <span>{mutualServers} Mutual Servers</span>
        </div>
      </div>
    </div>
  );
};

export default Mutuals;
