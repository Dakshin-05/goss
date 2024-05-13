import { MdOutlineCancel } from "react-icons/md";

function DirectMessage({name, friends, setFriends}) {
    const handleRemoveFromSideBar = () => {
        setFriends(prev => prev.filter(f => f.name !== name));
        console.log(friends)
    };
  return (
    <>
        <p class="flex items-center p-1 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
            <svg class="flex-shrink-0 w-5 h-10 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
            
            </svg>
            <span class="flex-1 ms-3 whitespace-nowrap">{name}</span>
            <button class="flex-row-reverse pr-3 m-3" onClick={handleRemoveFromSideBar}><MdOutlineCancel /></button>
        </p>
    </>
  );
}

export default DirectMessage;