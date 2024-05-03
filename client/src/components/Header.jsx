import React, { useState } from 'react'
import { AppBar, Box, Tab, Tabs, Toolbar, Typography } from '@mui/material'
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { authActions } from '../store';
import axios from 'axios';
axios.defaults.withCredentials = true;

const Header = () => {
    const dispatch = useDispatch();
    const [value, setValue] = useState(0);
    const isLoggedIn = useSelector(state => state.isLoggedIn);
    const sendLogoutReq = async () =>{
        const res = await axios.post('http://localhost:5000/api/logout', null, {
            withCredentials: true
        });

        if(res.status === 200){
            return res;
        }
        return new Error("Unable to logged out. Please try again")
    }

    const handleLogOut = () =>{
        sendLogoutReq().then(()=>dispatch(authActions.logout()))
    }
  return (
    <div>
        <AppBar position='sticky'>
            <Toolbar>
                <Typography variant='h3'>Goss</Typography>
                <Box sx={{marginLeft: 'auto'}}>
                    <Tabs
                    indicatorColor='secondary'
                    onChange={(e,val)=>setValue(val)}
                    value={value}
                    textColor='inherit'>
                        {!isLoggedIn && <Tab to='/login' LinkComponent={Link} label='login'/>}
                        {!isLoggedIn && <Tab to='/signup' LinkComponent={Link} label='signup'/>}
                        {isLoggedIn && <Tab onClick={handleLogOut} to='/' LinkComponent={Link} label='Logout'/>}
                    </Tabs>
                </Box>
            </Toolbar>
        </AppBar>
    </div>
  )
}

export default Header