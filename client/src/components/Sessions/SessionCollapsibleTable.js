import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ExerciseCreateOptionDialog from '../ExerciseCreateOptionDialog';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Container, TextField } from '@mui/material';
const { v4: uuidv4 } = require('uuid');

const SessionCollapsibleTable = ({ session, setSession }) => {
  // add exercise methods

  const handleAddExercise = () => {
    setSession((prevSession) => {
      return {
        ...prevSession,
        exercises: [
          ...prevSession.exercises,
          { id: uuidv4(), session_sets: [] },
        ],
      };
    });
  };

  return (
    <Container maxWidth={false}>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>No.</TableCell>
              <TableCell>Exercise</TableCell>
              <TableCell align="left">Sets</TableCell>
              <TableCell align="left">Reps</TableCell>
              <TableCell align="left">Rest</TableCell>
              <TableCell align="left">Tempo</TableCell>
              <TableCell align="left">RPE</TableCell>
              <TableCell align="center">Note</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {session.exercises.map((exercise, index) => (
              <SessionExercise
                key={`${exercise.title}-${index}`}
                exercise={exercise}
                index={index}
                setSession={setSession}
              />
            ))}
            <TableRow>
              <TableCell>
                <IconButton
                  aria-label="add exercise"
                  size="medium"
                  onClick={() => handleAddExercise()}
                  sx={{
                    color: 'white',
                    backgroundColor: '#097969',
                    borderRadius: '5px',
                    ':hover': { color: 'black' },
                  }}
                >
                  <AddIcon />
                  Exercise
                </IconButton>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

const SessionExercise = ({ exercise, index, setSession }) => {
  const [open, setOpen] = useState(false);
  const handleCollapseClicked = () => {
    setOpen(!open);
    console.log(exercise);
  };

  // Session state methods
  const handeDeleteExercice = (exerciseId) => {
    setSession((prevSession) => {
      return {
        ...prevSession,
        exercises: prevSession.exercises.filter((e) => e.id !== exerciseId),
      };
    });
  };

  const handleExerciseChange = (exerciseValue) => {
    // console.log(exerciseValue);
    if (exerciseValue) {
      const { id, title, type } = exerciseValue;
      if (exerciseValue?._id) {
        setSession((prevSession) => {
          return {
            ...prevSession,
            exercises: prevSession.exercises.map((e) =>
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
        setSession((prevSession) => {
          return {
            ...prevSession,
            exercises: prevSession.exercises.map((e) =>
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
    setSession((prev) => {
      return {
        ...prev,
        exercises: prev.exercises.map((e) =>
          e.id === id ? { ...e, sets: sets } : e
        ),
      };
    });
  };

  const handleExerciseRepsChange = (reps, id) => {
    setSession((prev) => {
      return {
        ...prev,
        exercises: prev.exercises.map((e) =>
          e.id === id ? { ...e, reps: reps } : e
        ),
      };
    });
  };

  const handleExerciseRestChange = (rest, id) => {
    setSession((prev) => {
      return {
        ...prev,
        exercises: prev.exercises.map((e) =>
          e.id === id ? { ...e, rest: rest } : e
        ),
      };
    });
  };

  const handleExerciseTempoChange = (tempo, id) => {
    setSession((prev) => {
      return {
        ...prev,
        exercises: prev.exercises.map((e) =>
          e.id === id ? { ...e, tempo: tempo } : e
        ),
      };
    });
  };

  const handleExerciseRPEChange = (rpe, id) => {
    setSession((prev) => {
      return {
        ...prev,
        exercises: prev.exercises.map((e) =>
          e.id === id ? { ...e, rpe: rpe } : e
        ),
      };
    });
  };

  const handleExerciseNoteChange = (note, id) => {
    setSession((prev) => {
      return {
        ...prev,
        exercises: prev.exercises.map((e) =>
          e.id === id ? { ...e, note: note } : e
        ),
      };
    });
  };

  const handleAddSessionSet = (exerciseId) => {
    setSession((prevSession) => {
      return {
        ...prevSession,
        exercises: prevSession.exercises.map((e) =>
          e.id === exerciseId
            ? {
                ...e,
                session_sets: [...e.session_sets, { id: uuidv4() }],
              }
            : e
        ),
      };
    });
  };

  const handeDeleteSessionSet = (exerciseId, sessionSetId) => {
    setSession((prevSession) => {
      return {
        ...prevSession,
        exercises: prevSession.exercises.map((e) =>
          e.id === exerciseId
            ? {
                ...e,
                session_sets: e.session_sets.filter(
                  (s) => s.id !== sessionSetId
                ),
              }
            : e
        ),
      };
    });
  };

  const handleSessionSetWeightChange = (weight, sessionId, exerciseId) => {
    setSession((prevSession) => {
      return {
        ...prevSession,
        exercises: prevSession.exercises.map((e) => {
          if (e.id === exerciseId) {
            const nextSessionSets = e.session_sets.map((set) => {
              return set.id === sessionId
                ? { ...set, set_weight: weight }
                : set;
            });
            return { ...e, session_sets: nextSessionSets };
          } else return e;
        }),
      };
    });
  };

  const handleSessionSetRepsChange = (reps, sessionId, exerciseId) => {
    setSession((prevSession) => {
      return {
        ...prevSession,
        exercises: prevSession.exercises.map((e) => {
          if (e.id === exerciseId) {
            const nextSessionSets = e.session_sets.map((set) => {
              return set.id === sessionId ? { ...set, set_reps: reps } : set;
            });
            return { ...e, session_sets: nextSessionSets };
          } else return e;
        }),
      };
    });
  };

  const handleSessionSetNoteChange = (note, sessionId, exerciseId) => {
    setSession((prevSession) => {
      return {
        ...prevSession,
        exercises: prevSession.exercises.map((e) => {
          if (e.id === exerciseId) {
            const nextSessionSets = e.session_sets.map((set) => {
              return set.id === sessionId ? { ...set, set_note: note } : set;
            });
            return { ...e, session_sets: nextSessionSets };
          } else return e;
        }),
      };
    });
  };

  return !exercise ? (
    <></>
  ) : (
    <>
      <TableRow>
        <TableCell>
          <Container>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => handleCollapseClicked()}
            >
              {open ? (
                <KeyboardArrowUpIcon sx={{ color: 'red' }} />
              ) : (
                <KeyboardArrowDownIcon sx={{ color: 'blue' }} />
              )}
            </IconButton>
          </Container>
        </TableCell>

        <TableCell key={`exercise-${exercise._id}-index`} size="small">
          {index + 1}
        </TableCell>

        <TableCell key={`exercise-${exercise._id}-title`} width={'300px'}>
          <ExerciseCreateOptionDialog
            exerciseValue={exercise}
            setExerciseValue={handleExerciseChange}
          />
        </TableCell>
        <TableCell key={`exercise-${exercise._id}-sets`} align="left">
          <TextField
            placeholder="add sets..."
            value={exercise.sets}
            onChange={(e) =>
              handleExerciseSetsChange(e.target.value, exercise.id)
            }
          ></TextField>
        </TableCell>
        <TableCell key={`exercise-${exercise._id}-reps`} align="left">
          <TextField
            placeholder="add reps..."
            value={exercise.reps}
            onChange={(e) =>
              handleExerciseRepsChange(e.target.value, exercise.id)
            }
          ></TextField>
        </TableCell>
        <TableCell key={`exercise-${exercise._id}-rest`} align="left">
          <TextField
            placeholder="add rest.."
            value={exercise.rest}
            onChange={(e) =>
              handleExerciseRestChange(e.target.value, exercise.id)
            }
          ></TextField>
        </TableCell>
        <TableCell key={`exercise-${exercise._id}-tempo`} align="left">
          <TextField
            placeholder="add tempo..."
            value={exercise.tempo}
            onChange={(e) =>
              handleExerciseTempoChange(e.target.value, exercise.id)
            }
          ></TextField>
        </TableCell>
        <TableCell key={`exercise-${exercise._id}-rpe`} align="left">
          <TextField
            placeholder="add RPE..."
            value={exercise.rpe}
            onChange={(e) =>
              handleExerciseRPEChange(e.target.value, exercise.id)
            }
          ></TextField>
        </TableCell>
        <TableCell
          key={`exercise-${exercise._id}-note`}
          sx={{ width: '200px' }}
        >
          <Container sx={{ display: 'flex', overflow: 'auto' }}></Container>
          <TextField
            overflow="auto"
            fullWidth
            maxRows={4}
            multiline
            placeholder="add Note..."
            value={exercise.note}
            onChange={(e) =>
              handleExerciseNoteChange(e.target.value, exercise.id)
            }
          ></TextField>
        </TableCell>
        <TableCell>
          <IconButton
            aria-label="add session set"
            size="small"
            onClick={() => handeDeleteExercice(exercise.id)}
          >
            <DeleteIcon color="error" />
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box
              sx={{
                margin: 1,
                width: 1,
              }}
            >
              <Typography
                variant="h5"
                gutterBottom
                sx={{
                  color: '#097969',
                  fontWeight: '600',
                  width: '500px',
                  borderRadius: '6px',
                }}
              >
                <u> Session Sets</u>
              </Typography>
              <Table sx={{ width: '100%' }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Weight</TableCell>
                    <TableCell>Reps</TableCell>
                    <TableCell align="right">Note</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {exercise.session_sets.map((set, index) => (
                    <TableRow key={`session_set-${exercise.id}-${set.id}`}>
                      <TableCell component="th" scope="row">
                        <TextField
                          placeholder="add set weight"
                          value={set.set_weight}
                          onChange={(e) =>
                            handleSessionSetWeightChange(
                              e.target.value,
                              set.id,
                              exercise.id
                            )
                          }
                        ></TextField>
                      </TableCell>
                      <TableCell>
                        <TextField
                          placeholder="add set reps"
                          value={set.set_reps}
                          onChange={(e) =>
                            handleSessionSetRepsChange(
                              e.target.value,
                              set.id,
                              exercise.id
                            )
                          }
                        ></TextField>
                      </TableCell>
                      <TableCell align="right" sx={{ width: '200px' }}>
                        <TextField
                          placeholder="add set note"
                          value={set.set_note}
                          overflow="auto"
                          fullWidth
                          maxRows={4}
                          multiline
                          onChange={(e) =>
                            handleSessionSetNoteChange(
                              e.target.value,
                              set.id,
                              exercise.id
                            )
                          }
                        ></TextField>
                      </TableCell>
                      <TableCell>
                        <IconButton
                          aria-label="add session set"
                          size="small"
                          onClick={() =>
                            handeDeleteSessionSet(exercise.id, set.id)
                          }
                        >
                          <DeleteIcon color="error" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell>
                      <IconButton
                        aria-label="add session set"
                        size="small"
                        onClick={() => handleAddSessionSet(exercise.id)}
                        sx={{
                          color: 'white',
                          backgroundColor: '#097969',
                          borderRadius: '5px',
                          ':hover': { color: 'black' },
                        }}
                      >
                        <AddIcon />
                        Session set
                      </IconButton>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default SessionCollapsibleTable;
