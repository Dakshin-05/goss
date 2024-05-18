// src/MainContent.js
import React, { useState } from 'react';

const MainContent = () => {
  const [randomWelcome, setRandomWelcome] = useState(true);
  const [replyWithSticker, setReplyWithSticker] = useState(true);
  const [messageOnBoost, setMessageOnBoost] = useState(true);
  const [helpfulTips, setHelpfulTips] = useState(true);
  const [inactiveChannel, setInactiveChannel] = useState('');
  const [inactiveTimeout, setInactiveTimeout] = useState('5 minutes');
  const [systemMessagesChannel, setSystemMessagesChannel] = useState('general');

  return (
    <div className="flex-1 h-screen bg-gray-800 text-white overflow-y-auto p-8">
      <h2 className="text-3xl font-bold mb-8">Server Overview</h2>
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">SERVER NAME</label>
        <input type="text" className="w-full p-2 bg-gray-700 border border-gray-600 rounded" placeholder="Peter's server" />
      </div>
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">INACTIVE CHANNEL</label>
        <select value={inactiveChannel} onChange={(e) => setInactiveChannel(e.target.value)} className="w-full p-2 bg-gray-700 border border-gray-600 rounded">
          <option value="">No Inactive Channel</option>
          <option value="general">general</option>
        </select>
      </div>
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">INACTIVE TIMEOUT</label>
        <select value={inactiveTimeout} onChange={(e) => setInactiveTimeout(e.target.value)} className="w-full p-2 bg-gray-700 border border-gray-600 rounded">
          <option value="5 minutes">5 minutes</option>
          <option value="10 minutes">10 minutes</option>
        </select>
      </div>
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">SYSTEM MESSAGES CHANNEL</label>
        <select value={systemMessagesChannel} onChange={(e) => setSystemMessagesChannel(e.target.value)} className="w-full p-2 bg-gray-700 border border-gray-600 rounded">
          <option value="general">general</option>
        </select>
      </div>
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <input type="checkbox" checked={randomWelcome} onChange={() => setRandomWelcome(!randomWelcome)} className="mr-2" />
          <label>Send a random welcome message when someone joins this server.</label>
        </div>
        <div className="flex items-center mb-2">
          <input type="checkbox" checked={replyWithSticker} onChange={() => setReplyWithSticker(!replyWithSticker)} className="mr-2" />
          <label>Prompt members to reply to welcome messages with a sticker.</label>
        </div>
        <div className="flex items-center mb-2">
          <input type="checkbox" checked={messageOnBoost} onChange={() => setMessageOnBoost(!messageOnBoost)} className="mr-2" />
          <label>Send a message when someone boosts this server.</label>
        </div>
        <div className="flex items-center mb-2">
          <input type="checkbox" checked={helpfulTips} onChange={() => setHelpfulTips(!helpfulTips)} className="mr-2" />
          <label>Send helpful tips for server setup.</label>
        </div>
      </div>
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">DEFAULT NOTIFICATION SETTINGS</label>
        <div className="flex items-center mb-2">
          <input type="radio" name="notification" className="mr-2" />
          <label>All Messages</label>
        </div>
        <div className="flex items-center mb-2">
          <input type="radio" name="notification" className="mr-2" />
          <label>Only @mentions</label>
        </div>
      </div>
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Display</label>
        <div className="flex items-center mb-2">
          <input type="checkbox" className="mr-2" />
          <label>Show Boost progress bar</label>
        </div>
      </div>
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">SERVER BANNER BACKGROUND</label>
        <button className="p-2 bg-blue-600 rounded">Unlock with Boosting</button>
      </div>
    </div>
  );
};

export default MainContent;
