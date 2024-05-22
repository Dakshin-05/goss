import React from 'react';
import { FaLocationDot } from "react-icons/fa6";

const EventCard = ({event}) => {
    console.log(event)
  return (
    <div className="w-full bg-gray-800 text-white rounded-lg shadow-lg p-6 ">
      <div className="flex items-center justify-between mb-4 ">
        <div className="flex items-center gap-4 text-blue-100">
           
          <svg class="w-10 h-10 -ml-4 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
            <path fill-rule="evenodd" d="M6 5V4a1 1 0 1 1 2 0v1h3V4a1 1 0 1 1 2 0v1h3V4a1 1 0 1 1 2 0v1h1a2 2 0 0 1 2 2v2H3V7a2 2 0 0 1 2-2h1ZM3 19v-8h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Zm5-6a1 1 0 1 0 0 2h8a1 1 0 1 0 0-2H8Z" clip-rule="evenodd"/>
          </svg>
          <div className="flex flex-col">
          <p className='text-gray-400'>{new Date(event.start_date).toDateString().slice(4)} 
          </p>
          <p className='text-gray-400'> {new Date(event.start_date).toDateString().slice(0,3)} at {event.start_time}</p>
          </div>
        </div>
        <div className="flex items-center">

        </div>
      </div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold">{event.event_name}</h2>
        <p>{event.description}</p>
      </div>
      <div className="mb-4 flex">
      <FaLocationDot/>
        <p className="text-gray-400 -mt-1 ml-2"> {event.location}</p>
      </div>
    </div>
  );
};

export default EventCard;