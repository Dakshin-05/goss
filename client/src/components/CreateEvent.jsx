import React, { useState } from 'react'
import { IoMdClose } from "react-icons/io";
export default function CreateEvent({setIsEventOpen}) {

    const [data, setData] = useState({
        event: "",
        description: "",
        startDate: "",
        startTime: ""
      });

    
      const handleDataChange =
        (name) => (e => {
          setData({
            ...data,
            [name]: e.target.value,
          });
        });
    
      const handleSubmit = async () => {
        // await createEvent(data);
        console.log(data)
      }
    


    return (
        <>
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-4 border-lightbase p-4 rounded-3xl w-96 bg-lightbase'>
        <form> 
            <div className='' onClick={()=>{setIsEventOpen(false)}}>
            <IoMdClose size={20}/>

            </div>
            <h1 className='text-xl text-center'>Event</h1>
            <div class="mb-6">                <label for="email" class="block mb-2 text-md font-medium text-gray-900 dark:text-white">Event Topic</label>

                <input type="text" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 " placeholder="What's your event ?" value={data.event} required onChange={handleDataChange("event")}/>
            </div> 
            <div class="mb-6">
                <label for="email" class="block mb-2 text-md font-medium text-gray-900 dark:text-white">Description</label>
                <textarea type="text" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Tell people a little more about the event" required value={data.description} onChange={handleDataChange("description")}/>
            </div> 
            <div class="relative max-w-sm">
            <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            </div>
            <label for="date" class="block mb-2 text-md font-medium text-gray-900 dark:text-white">Select Date:</label>
            <input datepicker datepicker-buttons datepicker-autoselect-today type="date" class="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 -left-px  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Select date" value={data.startDate} onChange={handleDataChange("startDate")}/>
            </div>

    <label for="time" class="block mt-5 mb-2 text-md font-medium text-gray-900 dark:text-white">Select time:</label>
    <div class="flex">
        <input type="time" id="time" class="rounded bg-gray-50 border text-gray-900 leading-none focus:ring-blue-500 focus:border-blue-500 block flex-1 w-full text-md border-gray-300 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" min="09:00" max="18:00" required value={data.startTime} onChange={handleDataChange("startTime")}/>
      
    </div>



            <button type="submit" class="text-white mt-5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-md w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mb-1" onClick={handleSubmit}>Submit</button>
        </form>
        </div>
        </>
    );
}