import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Paper,
  Button,
  Alert,
  FormControl,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { formatName } from '../utils';

// username must start with letter, followed by letter/digits/-/_ from 3 up to 23 characters.
const USER_REGEX = /^[a-zA-z][a-zA-z0-9-_]{2,23}$/;

// pwd must have at least one lower case letter, one upper case letter, one number and one special char. from 8 up to 24 characters.
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

// name can be only letters and spaces.
const NAME_REGEX = /^[a-zA-z][A-Za-z\s]+$/;

const Register = () => {
  const [user, setUser] = useState('');
  const [validUser, setValidUser] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [pwd, setPwd] = useState('');
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState('');
  const [validMatchPwd, setValidMatchPwd] = useState(false);
  const [matchPwdFocus, setMatchPwdFocus] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [validFirstName, setValidFirstName] = useState(false);
  const [firstNameFocus, setFirstNameFocus] = useState(false);

  const [lastName, setLastName] = useState('');
  const [validLastName, setValidLastName] = useState(false);
  const [lastNameFocus, setLastNameFocus] = useState(false);

  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState('');

  const [showPwd, setShowPwd] = useState(false);
  const navigate = useNavigate();

  // username validation
  useEffect(() => {
    setUserFocus(true);
    const testUser = USER_REGEX.test(user);
    setValidUser(testUser);
  }, [user]);

  // pwd + confirm pwd validation
  useEffect(() => {
    const testPwd = PWD_REGEX.test(pwd);
    setValidPwd(testPwd);
    const testMatch = pwd === matchPwd && testPwd;
    setValidMatchPwd(testMatch);
  }, [pwd, matchPwd]);

  // firstName validation
  useEffect(() => {
    const testFirst = NAME_REGEX.test(firstName);
    setValidFirstName(testFirst);
  }, [firstName]);

  // lastName validation
  useEffect(() => {
    const testLast = NAME_REGEX.test(lastName);
    console.log(testLast);
    setValidLastName(testLast);
  }, [lastName]);

  // clear error msg on any input change.
  useEffect(() => {
    setErrMsg('');
  }, [user, pwd, matchPwd, firstName, lastName]);

  //hide username hint at first render
  useEffect(() => {
    setUserFocus(false);
  }, []);
  const handleRegisterBtn = (e) => {
    e.preventDefault();

    // confirm valid form
    if (!USER_REGEX.test(user) || !PWD_REGEX.test(pwd)) {
      setErrMsg('Invalid Entry');
      return;
    }

    const formattedFirstName = formatName(firstName);
    const formattedLastName = formatName(lastName);
    axios
      .post(
        `/register`,
        {
          user: user,
          pwd: pwd,
          firstName: formattedFirstName,
          lastName: formattedLastName,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      .then((res) => {
        setSuccess(true);
        setUser('');
        setPwd('');
        setMatchPwd('');
        setFirstName('');
        setLastName('');
      })
      .catch((err) => {
        if (!err.response) {
          setErrMsg('No server response.');
        } else if (err.response?.status === 409) {
          //coflict
          setErrMsg('Username taken. try different one!');
        } else {
          setErrMsg('Registeration failed.');
        }
      });
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
          Registered successfuly!
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
          onClick={() => navigate('/login')}
        >
          CLICK HERE TO LOG IN!
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
      <Typography
        sx={{ display: 'flex' }}
        variant="h4"
        align="center"
        gutterBottom
      >
        Welcome to WORKOUTS
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
        onClick={() => navigate('/login')}
      >
        Already a user? Click here to log in!
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
        <FormControl sx={{ width: '100%', maxWidth: '300px' }}>
          {/*username input*/}
          <Container
            sx={{
              display: 'flex',
              alignItems: 'center',
              alignContent: 'start',
            }}
          >
            <TextField
              sx={{ width: '80%' }}
              autoFocus
              label="User Name"
              margin="normal"
              autoComplete="off"
              required
              value={user}
              onChange={(e) => setUser(e.target.value)}
              onFocus={() => setUserFocus(true)}
              onBlur={() => setUserFocus(false)}
            />

            {validUser ? (
              <CheckIcon sx={{ color: 'green' }}></CheckIcon>
            ) : user ? (
              <CloseIcon sx={{ color: 'red' }} />
            ) : (
              <></>
            )}
          </Container>
          {userFocus && !validUser ? (
            <Alert
              severity="info"
              sx={{
                fontSize: 14,
              }}
            >
              3 to 24 characters.
              <br />
              Must start with a letter.
              <br />
              Letters, numbers, underscores and hyphens allowed.
            </Alert>
          ) : (
            <></>
          )}

          {/*pwd input*/}
          <Container
            sx={{
              display: 'flex',
              alignItems: 'center',
              alignContent: 'start',
            }}
          >
            <TextField
              sx={{ width: '80%', marginRight: '1rem' }}
              label="Password"
              margin="normal"
              type={showPwd ? 'text' : 'password'}
              autoComplete="off"
              value={pwd}
              required
              onChange={(e) => setPwd(e.target.value)}
              onFocus={() => setPwdFocus(true)}
              onBlur={() => setPwdFocus(false)}
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
            {validPwd ? (
              <CheckIcon sx={{ color: 'green' }}></CheckIcon>
            ) : pwd ? (
              <CloseIcon sx={{ color: 'red' }} />
            ) : (
              <></>
            )}
          </Container>
          {pwdFocus && !validPwd ? (
            <Alert
              severity="info"
              sx={{
                fontSize: 14,
              }}
            >
              8 to 24 characters.
              <br />
              Must include uppercase and lowercase letters, a number and a
              special character (!@#$%)
            </Alert>
          ) : (
            <></>
          )}

          {/*confirm pwd input*/}
          <Container
            sx={{
              display: 'flex',
              alignItems: 'center',
              alignContent: 'start',
            }}
          >
            <TextField
              sx={{ width: '80%' }}
              label="Confirm Password"
              fullWidth
              margin="normal"
              autoComplete="off"
              value={matchPwd}
              type={showPwd ? 'text' : 'password'}
              required
              onChange={(e) => setMatchPwd(e.target.value)}
              onFocus={() => setMatchPwdFocus(true)}
              onBlur={() => setMatchPwdFocus(false)}
            />
            {validMatchPwd ? (
              <CheckIcon sx={{ color: 'green' }}></CheckIcon>
            ) : matchPwd ? (
              <CloseIcon sx={{ color: 'red' }} />
            ) : (
              <></>
            )}
          </Container>
          {matchPwdFocus && !validMatchPwd ? (
            <Alert
              severity="info"
              sx={{
                fontSize: 14,
              }}
            >
              Must match the chosen password.
            </Alert>
          ) : (
            <></>
          )}

          {/*first name input*/}
          <Container
            sx={{
              display: 'flex',
              alignItems: 'center',
              alignContent: 'start',
            }}
          >
            <TextField
              sx={{ width: '80%' }}
              label="First Name"
              margin="normal"
              value={firstName}
              required
              autoComplete="off"
              onChange={(e) => setFirstName(e.target.value)}
              onFocus={() => setFirstNameFocus(true)}
              onBlur={() => setFirstNameFocus(false)}
            />
            {validFirstName ? (
              <CheckIcon sx={{ color: 'green' }}></CheckIcon>
            ) : firstName ? (
              <CloseIcon sx={{ color: 'red' }} />
            ) : (
              <></>
            )}
          </Container>
          {firstNameFocus && !validFirstName ? (
            <Alert
              severity="info"
              sx={{
                fontSize: 14,
              }}
            >
              Must start with a letter, followed by letters or spaces.
            </Alert>
          ) : (
            <></>
          )}

          {/*last name input*/}
          <Container
            sx={{
              display: 'flex',
              alignItems: 'center',
              alignContent: 'start',
            }}
          >
            <TextField
              sx={{ width: '80%' }}
              label="Last Name"
              margin="normal"
              value={lastName}
              required
              autoComplete="off"
              onChange={(e) => setLastName(e.target.value)}
              onFocus={() => setLastNameFocus(true)}
              onBlur={() => setLastNameFocus(false)}
            />
            {validLastName ? (
              <CheckIcon sx={{ color: 'green' }}></CheckIcon>
            ) : lastName ? (
              <CloseIcon sx={{ color: 'red' }} />
            ) : (
              <></>
            )}
          </Container>
          {lastNameFocus && !validLastName ? (
            <Alert
              severity="info"
              sx={{
                fontSize: 14,
              }}
            >
              Must start with a letter, followed by letters or spaces.
            </Alert>
          ) : (
            <></>
          )}
          <br />
          <Button
            variant="contained"
            disabled={
              !validUser ||
              !validPwd ||
              !validMatchPwd ||
              !validFirstName ||
              !validLastName
            }
            style={{ height: '50px', minWidth: '100%' }}
            onClick={handleRegisterBtn}
          >
            Register
          </Button>
        </FormControl>
        <br />
      </Paper>
      <br />
      <br />
    </Container>
  );
};

export default Register;
