import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form';

axios.defaults.withCredentials = true;

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="#">
        The Goss
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}


const defaultTheme = createTheme();

export const SignUp = () => {
  const history = useNavigate();
  const [inputs, setInputs] = useState({
      name: "",
      email: "",
      password: "",
      confirmPassword: ""
  });
  
  const handleChange = (e) =>{
    setInputs(prev => ({...prev, [e.target.name] : e.target.value}))
  }

  const sendRequestLocal = async () => {
    const res = await axios.post('http://localhost:5000/api/signup', {
        name: inputs.name,
        username: inputs.username,
        email: inputs.email,
        password: inputs.password,
    })
    .catch((err)=>console.log(err));

    const data = await res.data;
    return data;
  
  }
  const sendRequestOauth = async () => {
    const res = await axios.get('http://localhost:5000/api/auth/google')
    .catch((err)=>console.log(err));

    const data = await res.data;
    return data;
  }

  const handleGoogleLogin = (e) => {
      e.preventDefault();
      sendRequestOauth().then(() => history('/user'))
  }

  const handleSubmit = (e) => {
      e.preventDefault();
        console.log(inputs)

        // validating the input

        // send the http request
        sendRequestLocal().then(()=>history('/login'));
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="given-name"
                  name="name"
                  required
                  fullWidth
                  id="firstName"
                  label="Name"
                  onChange={handleChange}
                  autoFocus
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  autoComplete="given-name"
                  name="username"
                  required
                  fullWidth
                  id="firstName"
                  label="UserName"
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  onChange={handleChange}
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  onChange={handleChange}
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  id="confirmPassword"
                  onChange={handleChange}
                  autoComplete="new-password"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Typography component="h1" variant="h6" sx={{textAlign: 'center'}}>
              or
            </Typography>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleGoogleLogin}
              >
              <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M20.1 10.229C20.1 9.51996 20.0363 8.83814 19.9182 8.18359H10.5V12.0518H15.8818C15.65 13.3018 14.9454 14.3609 13.8864 15.07V17.579H17.1182C19.0091 15.8381 20.1 13.2745 20.1 10.229Z" fill="#4285F4"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M10.491 19.9994C13.191 19.9994 15.4547 19.104 17.1092 17.5767L13.8774 15.0676C12.9819 15.6676 11.8365 16.0221 10.491 16.0221C7.8865 16.0221 5.68195 14.263 4.89559 11.8994H1.55469V14.4903C3.20014 17.7585 6.58195 19.9994 10.491 19.9994Z" fill="#34A853"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M4.90454 11.8987C4.70454 11.2987 4.5909 10.6578 4.5909 9.99872C4.5909 9.33963 4.70454 8.69872 4.90454 8.09872V5.50781H1.56363C0.886363 6.85781 0.5 8.38508 0.5 9.99872C0.5 11.6124 0.886363 13.1396 1.56363 14.4896L4.90454 11.8987Z" fill="#FBBC05"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M10.491 3.97727C11.9592 3.97727 13.2774 4.48182 14.3138 5.47273L17.1819 2.60454C15.4501 0.990909 13.1865 0 10.491 0C6.58195 0 3.20014 2.24091 1.55469 5.50909L4.89559 8.1C5.68195 5.73636 7.8865 3.97727 10.491 3.97727Z" fill="#EA4335"></path></svg>
              Continue with Google
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="#" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>

    </ThemeProvider>
  );
}