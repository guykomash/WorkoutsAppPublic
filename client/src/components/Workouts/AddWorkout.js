import { React, useEffect, useState } from 'react';
import {
  Grid,
  Typography,
  TextField,
  Button,
  Container,
  Paper,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';

import { useNavigate } from 'react-router-dom';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useWorkouts } from '../../contexts/WorkoutsProvider';
import { v4 as uuidv4 } from 'uuid';
import { useExercises } from '../../contexts/ExercisesProvider';
import ExerciseCreateOptionDialog from '../ExerciseCreateOptionDialog';

const AddWorkout = () => {
  // Add Workout form
  const { addWorkout } = useWorkouts().user;
  const { fetchAllExercises, moveExerciseIndex } = useExercises();
  const [newTitle, setNewTitle] = useState('');
  const [newExercises, setNewExercises] = useState([{ id: uuidv4() }]);
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    fetchAllExercises();
  }, []);

  const navigate = useNavigate();
  
  const getExerciseIndexById = (id) => {
    const index = newExercises.findIndex((exercise) => {
      return exercise.id === id;
    });
    return index;
  };

  const handleMoveUpExercise = (id) => {
    const fromIndex = getExerciseIndexById(id);
    if (fromIndex === 0) {
      return;
    } else {
      setNewExercises((prev) => {
        return moveExerciseIndex(
          { exercises: prev },
          fromIndex,
          fromIndex - 1
        ).exercises.slice();
      });
    }
  };

  const handleMoveDownExercise = (id) => {
    const fromIndex = getExerciseIndexById(id);
    if (fromIndex === newExercises.length - 1) {
      return;
    } else {
      setNewExercises((prev) => {
        return moveExerciseIndex(
          { exercises: prev },
          fromIndex,
          fromIndex + 1
        ).exercises.slice();
      });
    }
  };

  const sumbitWorkout = () => {
    let isValid = true;

    if (!newTitle) {
      alert('workout title missing');
      isValid = false;
    }
    let noEmptyExercises = [];
    if (newExercises) {
      noEmptyExercises = newExercises.filter((exercise) => {
        if (!exercise.title || !exercise.type) {
          return false;
        } else return true;
      });

      console.log(noEmptyExercises);
    } else {
      alert('exercises missing');
      isValid = false;
    }

    if (isValid) {
      const formattedExercises = noEmptyExercises.map((exercise) => {
        const newExercise = {
          title: exercise.title,
          type: exercise.type,
        };
        // only sets and reps.
        if (exercise?.exercise_id)
          newExercise.exercise_id = exercise.exercise_id;
        if (exercise?.sets) newExercise.sets = exercise.sets;
        if (exercise?.reps) newExercise.reps = exercise.reps;
        // only distance and duration
        if (exercise?.rest) newExercise.rest = exercise.rest;
        if (exercise?.tempo) newExercise.tempo = exercise.tempo;
        if (exercise?.rpe) newExercise.rpe = exercise.rpe;
        if (exercise?.note) newExercise.note = exercise.note;
        // new exercise template

        return newExercise;
      });

      addWorkout(newTitle, newNote, formattedExercises);
      setNewTitle('');
      setNewNote('');
      setNewExercises([{}]);
      navigate('/workouts');
    }
  };

  const onWorkoutsBtn = () => {
    navigate('/workouts');
  };

  const handleTitleChange = (nextTitle) => {
    setNewTitle(nextTitle);
  };
  const handleWorkoutsNoteChange = (nextNote) => {
    setNewNote(nextNote);
  };

  const handleExerciseChange = (exerciseValue) => {
    // console.log(exerciseValue);
    if (exerciseValue) {
      const { id, title, type } = exerciseValue;
      if (exerciseValue?._id) {
        setNewExercises((prev) =>
          prev.map((e, i) =>
            e.id === id
              ? {
                  ...e,
                  title: title,
                  type: type,
                  exercise_id: exerciseValue._id,
                }
              : e
          )
        );
      } else {
        // new Exercise. np need to insert exercise_id.
        setNewExercises((prev) =>
          prev.map((e, i) =>
            e.id === id
              ? {
                  ...e,
                  title: title,
                  type: type,
                }
              : e
          )
        );
      }
    }
  };

  const handleExerciseSetsChange = (sets, id) => {
    setNewExercises((prev) =>
      prev.map((e) => (e.id === id ? { ...e, sets: sets } : e))
    );
  };

  const handleExerciseRepsChange = (reps, id) => {
    setNewExercises((prev) =>
      prev.map((e, i) => (e.id === id ? { ...e, reps: reps } : e))
    );
  };

  const handleExerciseRestChange = (rest, id) => {
    setNewExercises((prev) =>
      prev.map((e, i) => (e.id === id ? { ...e, rest: rest } : e))
    );
  };

  const handleExerciseTempoChange = (tempo, id) => {
    setNewExercises((prev) =>
      prev.map((e, i) => (e.id === id ? { ...e, tempo: tempo } : e))
    );
  };
  const handleExerciseRPEChange = (rpe, id) => {
    setNewExercises((prev) =>
      prev.map((e, i) => (e.id === id ? { ...e, rpe: rpe } : e))
    );
  };
  const handleExerciseNoteChange = (note, id) => {
    setNewExercises((prev) =>
      prev.map((e, i) => (e.id === id ? { ...e, note: note } : e))
    );
  };

  const handleAddExercise = () => {
    setNewExercises((prev) => [...prev, { id: uuidv4() }]);
  };

  const handleExerciseDelete = (id) => {
    if (newExercises.length > 1) {
      const nextExercises = newExercises.filter((e) => e.id !== id);
      setNewExercises(nextExercises);
      console.log(nextExercises);
    }
  };

  return (
    <Container maxWidth="md">
      <br />
      <Button color="primary" onClick={() => onWorkoutsBtn()}>
        <KeyboardBackspaceIcon />
        back
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
          Create Workout
        </Typography>
        <br />
      </Container>
      <Paper elevation={2} sx={{ p: 2 }}>
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ fontWeight: '700', color: '#3f50b5' }}>
            Title
          </Typography>
          <TextField
            label="Workout Title"
            value={newTitle}
            fullWidth
            margin="normal"
            onChange={(e) => handleTitleChange(e.target.value)}
          />
          <br />
          <Typography variant="h6" sx={{ fontWeight: '700', color: '#3f50b5' }}>
            Note
          </Typography>
          <TextField
            label="Workout Note"
            sx={{ width: '90%' }}
            margin="normal"
            multiline
            rows={3}
            value={newNote}
            onChange={(e) => handleWorkoutsNoteChange(e.target.value)}
          />
          <br />
          <br />
          {newExercises.map((exercise, index) => (
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
                  value={exercise.sets}
                  margin="normal"
                  onChange={(e) =>
                    handleExerciseSetsChange(e.target.value, exercise.id)
                  }
                />
                <TextField
                  label="Reps"
                  margin="normal"
                  value={exercise.reps}
                  onChange={(e) =>
                    handleExerciseRepsChange(e.target.value, exercise.id)
                  }
                />

                <TextField
                  label="Rest"
                  value={exercise.rest}
                  margin="normal"
                  onChange={(e) =>
                    handleExerciseRestChange(e.target.value, exercise.id)
                  }
                />
                <TextField
                  label="Tempo"
                  margin="normal"
                  defaultValue={''}
                  value={exercise.tempo}
                  onChange={(e) =>
                    handleExerciseTempoChange(e.target.value, exercise.id)
                  }
                />
                <TextField
                  label="RPE"
                  margin="normal"
                  defaultValue={''}
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
              Exercise
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
        onClick={(e) => {
          sumbitWorkout(e.target.value);
        }}
      >
        Submit Workout
      </Button>
      <br />
      <br />
      <br />
      <br />
    </Container>
  );
};

export default AddWorkout;
