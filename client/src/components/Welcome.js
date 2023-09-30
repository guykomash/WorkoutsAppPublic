import { Button, Container, Paper, Typography } from '@mui/material';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Welcome = () => {
  const navigate = useNavigate();
  return (
    <Container
      maxWidth="sm"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <br />
      <br />
      <Typography variant="h5" align="center" gutterBottom>
        Welcome to WORKOUTS!
      </Typography>
      <br />
      <Typography variant="h6" align="center" gutterBottom>
        Please log in to use the app.
      </Typography>
      <br />
      <br />
      <Paper
        elevation={3}
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          width: '300px',
        }}
      >
        <Button
          size="large"
          component={Link}
          to={'/login'}
          key={'welcome-login-btn'}
          sx={{
            mr: 4,
            my: 2,
            color: 'white',
            backgroundColor: '#333333',
            ':hover': { color: 'gold', backgroundColor: '#333333' },
          }}
        >
          Login
        </Button>
        <Button
          size="large"
          component={Link}
          to={'/register'}
          key={'welcome-register-btn'}
          sx={{
            mr: 4,
            my: 2,
            color: 'white',
            backgroundColor: '#333333',
            ':hover': { color: 'gold', backgroundColor: '#333333' },
          }}
        >
          Register
        </Button>
      </Paper>
    </Container>
  );
};

export default Welcome;
