import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Button,
  Container,
  Grid,
  Paper,
  Typography,
  List,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  TextField,
} from '@mui/material';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';

import { useWorkouts } from '../../contexts/WorkoutsProvider';

const WorkoutDetails = () => {
  const { workoutId } = useParams();
  const { fetchWorkoutDetailsById } = useWorkouts().global;
  const [workoutDetails, setWorkoutDetails] = useState(null);

  useEffect(() => {
    fetchWorkoutDetailsById(setWorkoutDetails, workoutId);
  }, []);

  const navigate = useNavigate();

  const onWorkoutsBtn = () => {
    navigate(-1);
  };

  const renderExercises = (exercises) => {
    if (!exercises) return;
    return exercises.length === 0 ? (
      'No exercises'
    ) : (
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>No.</TableCell>
              <TableCell>Exercise</TableCell>
              <TableCell align="right">Sets</TableCell>
              <TableCell align="right">Reps</TableCell>
              <TableCell align="right">Rest</TableCell>
              <TableCell align="right">Tempo</TableCell>
              <TableCell align="right">RPE</TableCell>
              <TableCell align="center">Note</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {exercises.map((exercise, index) => (
              <TableRow
                key={`exercise-${exercise._id}-row`}
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                }}
              >
                <TableCell key={`exercise-${exercise._id}-index`}>
                  {index + 1}
                </TableCell>
                <TableCell key={`exercise-${exercise._id}-title`}>
                  {exercise.title}
                </TableCell>
                <TableCell key={`exercise-${exercise._id}-sets`} align="right">
                  {exercise.sets}
                </TableCell>
                <TableCell key={`exercise-${exercise._id}-reps`} align="right">
                  {exercise.reps}
                </TableCell>
                <TableCell key={`exercise-${exercise._id}-rest`} align="right">
                  {exercise.rest}
                </TableCell>
                <TableCell key={`exercise-${exercise._id}-tempo`} align="right">
                  {exercise.tempo}
                </TableCell>
                <TableCell key={`exercise-${exercise._id}-rpe`} align="right">
                  {exercise.rpe}
                </TableCell>
                <TableCell key={`exercise-${exercise._id}-note`}>
                  {exercise.note}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <Container maxWidth="md">
      <br />
      <Button color="primary" onClick={onWorkoutsBtn}>
        <KeyboardBackspaceIcon />
        Back
      </Button>
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
            width: '300px',
            borderRadius: '6px',
          }}
        >
          Workout Details
        </Typography>
      </Container>
      <br />
      {!workoutDetails ? (
        <Typography variant="body1" align="center">
          Loading workout details...
        </Typography>
      ) : workoutDetails.length === 0 ? (
        <Typography variant="body1" align="center">
          No workout found.
        </Typography>
      ) : (
        <Paper elevation={4} sx={{ p: 2 }}>
          <Grid>
            <Grid>
              <Typography
                variant="h5"
                sx={{ fontWeight: '800', color: '#097969' }}
                align="center"
              >
                <u> {workoutDetails.title}</u>
              </Typography>
            </Grid>
            <Grid align="center">
              <Typography
                margin={1}
                sx={{
                  // fontStyle: 'italic',
                  color: '#097969',
                  fontWeight: '700',
                  fontSize: 16,
                }}
              >
                {`${workoutDetails?.author?.firstname} ${workoutDetails?.author?.lastname}`}
              </Typography>
            </Grid>
            {workoutDetails.note ? (
              <Typography
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}
                border={1}
                borderColor={'#097969'}
                borderRadius={'6px'}
                padding={2}
                margin={1}
              >
                {workoutDetails.note}
              </Typography>
            ) : (
              <></>
            )}
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6"></Typography>
            <List variant="body1">
              {renderExercises(workoutDetails.exercises)}
            </List>
          </Grid>
          <Grid
            item
            xs={12}
            align="left"
            sx={{ fontStyle: 'italic', fontSize: 14, color: 'blue' }}
          >
            <Typography
              display={'inline'}
              sx={{ color: '#009C4E', fontSize: 14 }}
            >
              Last updated
            </Typography>
            <Typography
              display={'inline'}
              padding={1}
              sx={{ color: '#009C4E', fontSize: 14 }}
            >
              {workoutDetails.lastUpdated}
            </Typography>
          </Grid>
        </Paper>
      )}
      <br />
      <br />
      <br />
      <br />
    </Container>
  );
};

export default WorkoutDetails;
