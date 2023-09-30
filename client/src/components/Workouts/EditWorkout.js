import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  Button,
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
} from '@mui/material';

import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useExercises } from '../../contexts/ExercisesProvider';
import { useWorkouts } from '../../contexts/WorkoutsProvider';
import ExerciseCreateOptionDialog from '../ExerciseCreateOptionDialog';
const { v4: uuidv4 } = require('uuid');

const EditWorkout = () => {
  const navigate = useNavigate();
  const { workoutId } = useParams();
  const { getEditUserWorkoutById, updateWorkout } = useWorkouts().user;
  const { moveExerciseIndex, fetchAllExercises } = useExercises();
  const [workout, setWorkout] = useState(getEditUserWorkoutById(workoutId));

  useEffect(() => {
    fetchAllExercises();
  }, []);

  const getExerciseIndexById = (id) => {
    const index = workout.exercises.findIndex((exercise) => {
      return exercise.id === id;
    });
    return index;
  };

  const handleMoveUpExercise = (id) => {
    const fromIndex = getExerciseIndexById(id);
    // console.log(`fromIndex ${fromIndex}`);
    if (fromIndex === 0) {
      return;
    } else {
      const nextWorkout = moveExerciseIndex(workout, fromIndex, fromIndex - 1);
      setWorkout(nextWorkout);
    }
  };

  const handleMoveDownExercise = (id) => {
    const fromIndex = getExerciseIndexById(id);
    // console.log(`fromIndex ${fromIndex}`);
    if (fromIndex === workout.exercises.length - 1) {
      return;
    } else {
      const nextWorkout = moveExerciseIndex(workout, fromIndex, fromIndex + 1);
      setWorkout(nextWorkout);
    }
  };

  const onWorkoutsBtn = () => {
    navigate('/workouts');
  };

  const handleTitleChange = (title) => {
    setWorkout((prev) => {
      return { ...prev, title: title };
    });
  };

  const handleWorkoutsNoteChange = (note) => {
    setWorkout((prev) => {
      return { ...prev, note: note };
    });
  };

  const handleExerciseDelete = (id) => {
    if (workout.exercises.length > 1) {
      const nextExercises = workout.exercises.filter((e) => e.id !== id);
      setWorkout((prev) => {
        return { ...prev, exercises: nextExercises };
      });
    }
  };

  const handleExerciseChange = (exerciseValue) => {
    // console.log(exerciseValue);
    if (exerciseValue) {
      const { id, title, type } = exerciseValue;
      if (exerciseValue?._id) {
        setWorkout((prevWorkout) => {
          return {
            ...prevWorkout,
            exercises: prevWorkout.exercises.map((e) =>
              e.id === id
                ? {
                    ...e,
                    title: title,
                    type: type,
                    exercise_id: exerciseValue._id,
                  }
                : e
            ),
          };
        });
      } else {
        // User added a new exercise. no need to insert exercise_id.
        setWorkout((prevWorkout) => {
          return {
            ...prevWorkout,
            exercises: prevWorkout.exercises.map((e) =>
              e.id === id
                ? {
                    ...e,
                    title: title,
                    type: type,
                  }
                : e
            ),
          };
        });
      }
    }
  };

  const handleExerciseSetsChange = (sets, id) => {
    setWorkout((prev) => {
      return {
        ...prev,
        exercises: prev.exercises.map((e) =>
          e.id === id ? { ...e, sets: sets } : e
        ),
      };
    });
  };

  const handleExerciseRepsChange = (reps, id) => {
    setWorkout((prev) => {
      return {
        ...prev,
        exercises: prev.exercises.map((e) =>
          e.id === id ? { ...e, reps: reps } : e
        ),
      };
    });
  };

  const handleExerciseRestChange = (rest, id) => {
    setWorkout((prev) => {
      return {
        ...prev,
        exercises: prev.exercises.map((e) =>
          e.id === id ? { ...e, rest: rest } : e
        ),
      };
    });
  };

  const handleExerciseTempoChange = (tempo, id) => {
    setWorkout((prev) => {
      return {
        ...prev,
        exercises: prev.exercises.map((e) =>
          e.id === id ? { ...e, tempo: tempo } : e
        ),
      };
    });
  };

  const handleExerciseRPEChange = (rpe, id) => {
    setWorkout((prev) => {
      return {
        ...prev,
        exercises: prev.exercises.map((e) =>
          e.id === id ? { ...e, rpe: rpe } : e
        ),
      };
    });
  };

  const handleExerciseNoteChange = (note, id) => {
    setWorkout((prev) => {
      return {
        ...prev,
        exercises: prev.exercises.map((e) =>
          e.id === id ? { ...e, note: note } : e
        ),
      };
    });
  };

  const handleAddExercise = () => {
    setWorkout((prev) => {
      return {
        ...prev,
        exercises: [...prev.exercises, { id: uuidv4() }],
      };
    });
  };

  const checkValidForm = () => {
    let isValid = true;
    if (!workout.title || !workout.exercises.length) {
      return (isValid = false);
    } else {
      workout.exercises.forEach((e) => {
        if (!e.title || e.title === '' || !e.type || e.type === '') {
          return (isValid = false);
        }
      });
    }
    return isValid;
  };

  const handleUpdateWorkout = () => {
    if (!checkValidForm()) return alert('one or more empty fields');

    // remove ids from exercises. (worst case -> there all uuid)
    const formattedExercises = workout.exercises.map((exercise) => {
      const newExercise = {
        title: exercise.title,
        type: exercise.type,
      };
      if (exercise.exercise_id) newExercise.exercise_id = exercise.exercise_id;
      if (exercise?.sets) newExercise.sets = exercise.sets;
      if (exercise?.reps) newExercise.reps = exercise.reps;
      if (exercise?.rest) newExercise.rest = exercise.rest;
      if (exercise?.tempo) newExercise.tempo = exercise.tempo;
      if (exercise?.rpe) newExercise.rpe = exercise.rpe;
      if (exercise?.note) newExercise.note = exercise.note;
      return newExercise;
    });

    const formattedWorkout = {
      user_id: workout.user_id,
      title: workout.title,
      note: workout.note,
      exercises: formattedExercises,
    };
    // console.log(formattedWorkout);
    updateWorkout(workoutId, formattedWorkout);
    navigate('/workouts');
  };

  return (
    <Container maxWidth="md">
      <br />
      <Button color="primary" onClick={() => onWorkoutsBtn()}>
        <KeyboardBackspaceIcon />
        back
      </Button>
      <br />

      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography
          fullWidth
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
          Edit Workout
        </Typography>
      </Container>
      <br />
      <Paper elevation={2} sx={{ p: 2 }}>
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ fontWeight: '700', color: '#3f50b5' }}>
            Title
          </Typography>
          <TextField
            label="Workout Title"
            value={workout.title}
            variant="filled"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            onChange={(e) => handleTitleChange(e.target.value)}
          />
          <br />
          <Typography variant="h6" sx={{ fontWeight: '700', color: '#3f50b5' }}>
            Note
          </Typography>
          <TextField
            variant="filled"
            fullWidth
            label="Workout Note"
            margin="normal"
            multiline
            rows={3}
            value={workout.note}
            onChange={(e) => handleWorkoutsNoteChange(e.target.value)}
          />
          <br />
          <br />
          {workout.exercises &&
            workout.exercises.map((exercise, index) => (
              <Paper
                key={exercise.id}
                elevation={4}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  p: 2,
                  mr: 2,
                  marginBottom: 2,
                }}
              >
                <Container
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 16,
                      fontWeight: '700',
                      color: '#3f50b5',
                    }}
                  >{`Exercise ${index + 1}`}</Typography>

                  <Button
                    sx={{ color: 'green' }}
                    onClick={() => handleMoveUpExercise(exercise.id)}
                  >
                    <ArrowUpwardIcon></ArrowUpwardIcon>
                  </Button>
                  <Button
                    sx={{ color: 'green' }}
                    onClick={() => handleMoveDownExercise(exercise.id)}
                  >
                    <ArrowDownwardIcon></ArrowDownwardIcon>
                  </Button>
                  <Button
                    color="error"
                    onClick={() => handleExerciseDelete(exercise.id)}
                  >
                    <DeleteIcon></DeleteIcon>
                  </Button>
                </Container>
                <br />
                <br />
                <ExerciseCreateOptionDialog
                  exerciseValue={exercise}
                  setExerciseValue={handleExerciseChange}
                />
                <br />
                <Container sx={{ display: 'flex', justifyContent: 'center' }}>
                  <TextField
                    label="Exercise Note"
                    margin="normal"
                    variant="filled"
                    fullWidth
                    multiline
                    rows={3}
                    value={exercise.note}
                    onChange={(e) =>
                      handleExerciseNoteChange(e.target.value, exercise.id)
                    }
                  />
                </Container>

                <Container
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2,auto)',
                    columnGap: 2,
                    rowGap: 2,
                  }}
                >
                  <TextField
                    label="Sets"
                    variant="filled"
                    value={exercise.sets}
                    margin="normal"
                    onChange={(e) =>
                      handleExerciseSetsChange(e.target.value, exercise.id)
                    }
                  />
                  <TextField
                    label="Reps"
                    variant="filled"
                    margin="normal"
                    value={exercise.reps}
                    onChange={(e) =>
                      handleExerciseRepsChange(e.target.value, exercise.id)
                    }
                  />

                  <TextField
                    label="Rest"
                    variant="filled"
                    value={exercise.rest}
                    margin="normal"
                    onChange={(e) =>
                      handleExerciseRestChange(e.target.value, exercise.id)
                    }
                  />
                  <TextField
                    label="Tempo"
                    variant="filled"
                    margin="normal"
                    value={exercise.tempo}
                    onChange={(e) =>
                      handleExerciseTempoChange(e.target.value, exercise.id)
                    }
                  />
                  <TextField
                    label="RPE"
                    variant="filled"
                    margin="normal"
                    value={exercise.rpe}
                    onChange={(e) =>
                      handleExerciseRPEChange(e.target.value, exercise.id)
                    }
                  />
                  <br />
                </Container>
              </Paper>
            ))}
          <br />
          <Container
            sx={{
              display: 'flex',
              width: '300px',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <Button
              color="primary"
              aria-label="add"
              sx={{
                color: 'white',
                backgroundColor: 'green',
                ':hover': { backgroundColor: 'white', color: 'green' },
              }}
              onClick={() => handleAddExercise()}
            >
              <AddIcon label="add" />
              Add Exercise
            </Button>
          </Container>
        </Grid>
      </Paper>
      <br />
      <Button
        fullWidth
        variant="outlined"
        color="primary"
        sx={{
          height: '50px',
          color: 'white',
          backgroundColor: '#333333',
          '&:hover': {
            backgroundColor: '#333333',
            color: 'gold',
          },
        }}
        onClick={() => {
          handleUpdateWorkout();
        }}
      >
        Update Workout
      </Button>
      <br />
      <br />
      <br />
      <br />
    </Container>
  );
};

export default EditWorkout;
