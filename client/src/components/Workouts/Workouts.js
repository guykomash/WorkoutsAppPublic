import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Container,
  Paper,
} from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';

import DeleteBtnWithDialog from '../DeleteBtnWithDialog';

import { useWorkouts } from '../../contexts/WorkoutsProvider';

const Workouts = () => {
  const { user } = useWorkouts();
  const navigate = useNavigate();
  const { userWorkouts, deleteWorkout, savedWorkouts, deleteSavedWorkout } =
    useWorkouts().user;

  const onViewDetailsClicked = (workoutId) => {
    navigate(`/workouts/${workoutId}`);
  };

  const onAddWorkoutsBtn = () => {
    navigate('/workouts/add-workout');
  };

  const onDeleteWorkoutBtn = (workoutId) => {
    deleteWorkout(workoutId);
  };

  const onEditWorkoutBtn = (workoutId) => {
    navigate(`/workouts/edit/${workoutId}`);
  };

  const onUnsaveBtn = (workoutId) => {
    console.log(workoutId);
    deleteSavedWorkout(workoutId);
  };

  useEffect(() => {
    user.fetchUserWorkouts();
  }, []);

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
          variant="h4"
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
          Workouts
        </Typography>
        <Typography
          variant="h5"
          align="center"
          gutterBottom
          sx={{
            color: '#097969',
            fontWeight: '600',
            align: 'center',
            width: '500px',
            borderRadius: '6px',
          }}
        >
          My Workouts
        </Typography>
      </Container>
      <Container sx={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          // style={{ minWidth: '100%' }}
          // variant="outlined"
          color="primary"
          sx={{
            width: '200px',
            color: 'green',
            '&:hover': {
              backgroundColor: 'green',
              color: 'white',
            },
          }}
          onClick={onAddWorkoutsBtn}
        >
          <AddIcon label="add" />
          create Workout
        </Button>
      </Container>

      <br />
      <Paper elevation={2} sx={{ p: 2, maxHeight: '280px', overflow: 'auto' }}>
        {!userWorkouts ? (
          <Typography variant="body1" align="center">
            Loading workout details...
          </Typography>
        ) : userWorkouts.length === 0 ? (
          <Typography variant="body1" align="center">
            You haven't created any workouts.
          </Typography>
        ) : (
          <List>
            {userWorkouts.map((workout) => (
              <ListItem key={workout._id} disablePadding>
                <ListItemText
                  primary={workout.title}
                  secondary={`${workout.author.firstname} ${workout.author.lastname}`}
                />
                <Button
                  variant="outlined"
                  onClick={() => onViewDetailsClicked(workout._id)}
                >
                  View Details
                </Button>

                <DeleteBtnWithDialog
                  title={'Delete workout?'}
                  content={'This will delete this workout permanently.'}
                  id={workout._id}
                  onDelete={() => onDeleteWorkoutBtn(workout._id)}
                />
                <Button onClick={() => onEditWorkoutBtn(workout._id)}>
                  <EditIcon></EditIcon>
                </Button>
              </ListItem>
            ))}
          </List>
        )}
      </Paper>

      <br />
      <br />
      <List>
        <Container
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Typography
            variant="h5"
            align="center"
            gutterBottom
            sx={{
              color: '#097969',
              fontWeight: '600',
              width: '500px',
              borderRadius: '6px',
            }}
          >
            Saved Workouts
          </Typography>
        </Container>
        <br />
        <Paper
          elevation={2}
          sx={{ p: 2, maxHeight: '280px', overflow: 'auto' }}
        >
          {!savedWorkouts ? (
            <Typography variant="body1" align="center">
              Loading saved workouts...
            </Typography>
          ) : savedWorkouts.length === 0 ? (
            <Typography variant="body1" align="center">
              You haven't saved any workouts.
            </Typography>
          ) : (
            savedWorkouts.map((workout) => (
              <ListItem key={workout._id} disablePadding>
                <ListItemText
                  primary={workout.title}
                  secondary={`${workout.author.firstname} ${workout.author.lastname}`}
                />
                <Button color="error" onClick={() => onUnsaveBtn(workout._id)}>
                  Unsave
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => onViewDetailsClicked(workout._id)}
                >
                  View Details
                </Button>
              </ListItem>
            ))
          )}
        </Paper>
      </List>
      <br />
      <br />
      <br />
    </Container>
  );
};

export default Workouts;
