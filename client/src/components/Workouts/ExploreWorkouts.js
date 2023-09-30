import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Container,
  Input,
  Grid,
  Paper,
} from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import { useWorkouts } from '../../contexts/WorkoutsProvider';
import { useAuth } from '../../contexts/AuthProvider';

const ExploreWorkouts = () => {
  const navigate = useNavigate();
  // const { user, global } = useWorkouts();

  const {
    savedWorkouts,
    addSavedWorkout,
    deleteSavedWorkout,
    fetchUserWorkouts,
  } = useWorkouts().user;

  const {
    allWorkouts,
    fetchAllWorkouts,
    filteredWorkouts,
    setFilteredWorkouts,
  } = useWorkouts().global;

  const { auth } = useAuth();
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchUserWorkouts();
    fetchAllWorkouts();
  }, []);

  useEffect(() => {
    const searchWords = search.toLowerCase().split(' ');
    setFilteredWorkouts(
      !allWorkouts
        ? allWorkouts
        : allWorkouts.filter((w) => {
            let found = false;
            for (const word of searchWords) {
              if (
                w.title.toLowerCase().includes(word) ||
                w.author.firstname.toLowerCase().includes(word) ||
                w.author.lastname.toLowerCase().includes(word) ||
                w.exercises.find((e) => e.title.toLowerCase().includes(word))
              )
                found = true;
            }
            return found;
          })
    );
  }, [search]);

  const onViewDetailsClicked = (workoutId) => {
    navigate(`/workouts/${workoutId}`);
  };

  const onSaveWorkoutClicked = async (workoutId) => {
    addSavedWorkout(workoutId);
  };

  const onUnsaveWorkoutClicked = async (workoutId) => {
    deleteSavedWorkout(workoutId);
  };

  return (
    <Container maxWidth="md" overflow="true">
      <br />
      <br />
      <Container sx={{ display: 'flex', justifyContent: 'center' }}>
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{
            color: '#097969',
            fontWeight: '600',
            align: 'center',
            width: '600px',
            borderRadius: '6px',
          }}
        >
          Explore all workouts
        </Typography>
      </Container>
      <br />

      <Grid sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <SearchIcon
          fontSize="large"
          sx={{
            marginRight: 1,
            color: '#3f50b5',
          }}
        />
        <Input
          sx={{
            fontWeight: 'bold',
            '&:hover': {
              color: '#3f50b5',
            },
            '&.Mui-focused': {
              color: '#3f50b5',
            },
          }}
          fullWidth
          placeholder={'Search workouts, exercises or people'}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          inputProps={{ 'aria-label': 'search' }}
        />
      </Grid>
      <br />

      <Paper elevation={3} sx={{ p: 2, maxHeight: '400px', overflow: 'auto' }}>
        {!filteredWorkouts ? (
          <Typography variant="body1" align="center">
            Loading workout details...
          </Typography>
        ) : filteredWorkouts.length === 0 ? (
          <Typography variant="body1" align="center">
            No workouts available.
          </Typography>
        ) : (
          <List sx={{ overflow: 'auto' }}>
            {filteredWorkouts.map((workout) => (
              <ListItem key={workout._id} disablePadding>
                <ListItemText
                  primary={workout.title}
                  secondary={`${workout.author.firstname} ${workout.author.lastname}`}
                />
                {savedWorkouts &&
                savedWorkouts.find((sw) => sw._id === workout._id) ? (
                  <Button
                    sx={{
                      color: 'red',
                      '&:hover': {
                        backgroundColor: 'red',
                        color: 'white',
                      },
                    }}
                    onClick={() => onUnsaveWorkoutClicked(workout._id)}
                  >
                    UNSAVE
                  </Button>
                ) : workout.user_id !== auth.userId ? (
                  <Button
                    sx={{
                      color: 'green',
                      '&:hover': {
                        backgroundColor: 'green',
                        color: 'white',
                      },
                    }}
                    onClick={() => onSaveWorkoutClicked(workout._id)}
                  >
                    Save
                  </Button>
                ) : (
                  <></>
                )}
                <Button
                  variant="outlined"
                  onClick={() => onViewDetailsClicked(workout._id)}
                >
                  View Details
                </Button>
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
      <br />
      <br />
    </Container>
  );
};

export default ExploreWorkouts;
