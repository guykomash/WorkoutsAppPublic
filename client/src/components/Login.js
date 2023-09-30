import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthProvider';
import { useWorkouts } from '../contexts/WorkoutsProvider';
import { useExercises } from '../contexts/ExercisesProvider';
import {
  Container,
  Typography,
  TextField,
  Paper,
  Button,
  FormControl,
  Alert,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

import axios from '../api/axios';

export const LoginUser = async () => Paper;

const Login = () => {
  const [user, setUser] = useState('');
  const [pwd, setPwd] = useState('');
  const navigate = useNavigate();
  const { auth, setAuth } = useAuth();
  const [isLoadingRequest, setIsLoadingRequest] = useState(false);

  const [errMsg, setErrMsg] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [success, setSuccess] = useState(auth.accessToken ? true : false);

  useEffect(() => {
    setErrMsg('');
  }, [user, pwd]);

  useEffect(() => {
    const keyDownHandler = (e) => {
      console.log(`pressed :${e.key}`);

      if (e.key === 'Enter') {
        console.log('Enter!');
        e.preventDefault();

        if (user && pwd) {
          console.log('send?');
          handleLoginBtn();
        } else {
          console.log(user, pwd);
          console.log('no?');
        }
      } else console.log(e.key);
    };

    document.addEventListener('keydown', keyDownHandler);

    return () => {
      document.removeEventListener('keydown', keyDownHandler);
    };
  });

  const handleLoginBtn = async () => {
    try {
      const res = await axios.post(
        `/auth`,
        {
          user: user,
          pwd: pwd,
        },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );

      const accessToken = res?.data?.accessToken;
      const userId = res?.data?.userId;
      const userName = res?.data?.userName;
      const firstName = res?.data?.userFirstName;
      const lastName = res?.data?.userLastName;
      const created = res?.data?.created;
      setSuccess(true);
      setAuth({ userId, userName, firstName, lastName, created, accessToken });
      setUser('');
      setPwd('');
    } catch (err) {
      if (err?.response?.status === 403) {
        console.log('403');
      } else if (err?.response?.status === 400) {
        setErrMsg('Missing username or password.');
      } else if (err?.response?.status === 401) {
        setErrMsg('Wrong username or password.');
        console.log(err);
      } else if (!err.response) {
        setErrMsg('No server response.');
      } else {
        setErrMsg('Login Failed');
      }
    }
  };

  return success ? (
    <Container maxWidth="sm">
      <br />
      <br />
      <Paper
        elevation={2}
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minWidth: '300px',
        }}
      >
        <br />
        <Typography variant="h5" align="center" gutterBottom>
          Login successful!
        </Typography>
        <br />
        <br />
        <Button
          size="small"
          sx={{
            width: '320px',
            borderRadius: '15px',
            color: 'black',
            backgroundColor: 'gold',
            ':hover': {
              color: 'gold',
              backgroundColor: '#333333',
            },
          }}
          fullWidth
          onClick={() => navigate('/')}
        >
          Go to home page
        </Button>
      </Paper>
    </Container>
  ) : (
    <Container
      maxWidth="sm"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minWidth: '450px',
      }}
    >
      <br />
      <Typography variant="h4" align="center" gutterBottom>
        Login
      </Typography>
      <br />
      <Button
        size="small"
        sx={{
          width: '320px',
          borderRadius: '15px',
          color: 'black',
          backgroundColor: 'gold',
          ':hover': {
            color: 'gold',
            backgroundColor: '#333333',
          },
        }}
        fullWidth
        onClick={() => navigate('/register')}
      >
        Not a user? Click here to register!
      </Button>
      <br />
      {errMsg ? (
        <>
          <Alert severity="error" variant="filled">
            {errMsg}
          </Alert>
          <br />
        </>
      ) : (
        <></>
      )}
      <Paper
        elevation={2}
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minWidth: '300px',
        }}
      >
        <FormControl>
          <Container
            sx={{
              display: 'flex',
              alignItems: 'center',
              alignContent: 'start',
            }}
          >
            <TextField
              sx={{ width: '80%', autoComplete: 'off' }}
              disabled={isLoadingRequest}
              label="User Name"
              margin="normal"
              type="text"
              autoComplete="false"
              value={user}
              required
              onChange={(e) => setUser(e.target.value)}
            />
          </Container>
          <Container sx={{ display: 'flex', alignItems: 'center' }}>
            <TextField
              sx={{ width: '80%', marginRight: '1rem' }}
              disabled={isLoadingRequest}
              type={showPwd ? 'text' : 'password'}
              label="Password"
              required
              margin="normal"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
            />
            {!showPwd ? (
              <VisibilityOffIcon
                sx={{
                  alignSelf: 'right',
                  color: 'grey',
                }}
                onClick={() => setShowPwd(true)}
              />
            ) : (
              <VisibilityIcon
                sx={{
                  alignSelf: 'center',
                  color: 'grey',
                }}
                onClick={() => setShowPwd(false)}
              />
            )}
          </Container>
          <br />
          <Button
            variant="contained"
            disabled={!user || !pwd}
            style={{ height: '50px', minWidth: '100%' }}
            onClick={handleLoginBtn}
          >
            Login
          </Button>
        </FormControl>
      </Paper>
    </Container>
  );
};

export default Login;
