import axios from 'axios'
import { useEffect, useState } from 'react'
import Chat from './Chat';
axios.defaults.withCredentials = true;
let firstRender = true;
const Welcome = () => {
    const [user, setUser] = useState({});
    const refreshToken = async() =>{
        const res = await axios.get('http://localhost:5000/api/refresh',{
            withCredentials: true,
        }).catch(err => console.log(err))

        const data = await res.data;
        return data;
    }
    const sendRequest = async () => {
        
        const res = await axios.get('http://localhost:5000/api/user', {
            withCredentials: true,
        }).catch(err => console.log(err))

        const data = await res.data;
        console.log(data);
        return data;
    }

    useEffect(()=>{
        if(firstRender){
            firstRender = false;
            sendRequest().then((data)=>setUser(data.user))
        }

        let interval = setInterval(()=>{
            refreshToken().then(data=>setUser(data.user))
        },28000)

        return ()=> clearInterval(interval)
    },[])
  return (
    <div>
        {user && <Chat/>}
    </div>
  )
}

export default Welcome