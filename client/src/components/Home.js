import React from 'react';
import { Button, Container, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
const Home = () => {
  const navigate = useNavigate();
  return (
    <Container maxWidth="md">
      <br />
      <br />
      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography
          variant="h3"
          align="center"
          gutterBottom
          sx={{
            color: '#097969',
            fontWeight: '600',
            align: 'center',
            width: '300px',
            borderRadius: '6px',
          }}
        >
          WORKOUTS
        </Typography>
        <br />
        <Typography
          variant="h5"
          align="center"
          gutterBottom
          sx={{
            color: '#097969',
            fontWeight: '600',
            align: 'center',
            borderRadius: '6px',
          }}
        >
          Welcome to WORKOUTS!
        </Typography>
        <br />
        <Typography
          variant="h5"
          align="center"
          gutterBottom
          sx={{
            color: '#097969',
            fontWeight: '600',
            align: 'center',
            borderRadius: '30px',
            backgroundColor: '#d3d3d3',
          }}
        >
          <br />
          Create and edit your own workouts.
          <br />
          <br />
          Explore workouts created by others, and save them.
          <br />
          <br /> Workouts can be used as a templates for your sessions, where
          you'll be able to keep track of your progression in each exercise.
          <br />
          <br />
          Use existing exercises for you workouts and sessions, or create your
          own!
          <br />
          <br />
        </Typography>
        <br />
        <Container sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            size="small"
            sx={{
              width: '320px',
              borderRadius: '5px',
              color: 'black',
              backgroundColor: 'gold',
              ':hover': {
                color: 'gold',
                backgroundColor: '#333333',
              },
            }}
            fullWidth
            onClick={() => navigate('/workouts/add-workout')}
          >
            Create Workout
          </Button>
          <Button
            size="small"
            sx={{
              width: '320px',
              borderRadius: '5px',
              color: 'black',
              backgroundColor: 'gold',
              ':hover': {
                color: 'gold',
                backgroundColor: '#333333',
              },
            }}
            fullWidth
            onClick={() => navigate('/sessions/new-session')}
          >
            Start New Session
          </Button>
        </Container>
      </Container>
    </Container>
  );
};

export default Home;
