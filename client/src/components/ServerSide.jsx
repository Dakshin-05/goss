import React from 'react';
import ServerHeader from './ServerHeader';
import Events from './Events';
import ChannelSection from './ChannelSection';
import Footer from './Footer';

function ServerSide() {
  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <ServerHeader />
      <div className="flex-grow overflow-y-auto">
        <Events />
        <hr className="border-gray-700 my-2" />
        <ChannelSection title="INFORMATION" channels={['welcome-and-rules', 'announcements', 'resources']} />
        <ChannelSection title="TEXT CHANNELS" channels={['general']} />
        <ChannelSection title="VOICE CHANNELS" channels={['Lounge', 'Meeting Room']} icon="🎙" />
      </div>
      <Footer user="Peter" status="Online" />
    </div>
  );
}

export default ServerSide;
