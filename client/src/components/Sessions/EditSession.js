import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSessions } from '../../contexts/SessionsProvider';
import { useExercises } from '../../contexts/ExercisesProvider';
import { Button, Container, Paper, Typography } from '@mui/material';
import SessionCollapsibleTable from './SessionCollapsibleTable';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';

const EditSession = () => {
  const { sessionId } = useParams();
  const [editSession, setEditSession] = useState(null);
  const { fetchSession, updateSession } = useSessions();
  const { fetchAllExercises } = useExercises();
  const navigate = useNavigate();

  useEffect(() => {
    fetchSession(setEditSession, sessionId);
    fetchAllExercises();
  }, []);

  // store the session in local storage on change.
  useEffect(() => {
    if (editSession)
      localStorage.setItem(
        `editSession-${editSession._id}`,
        JSON.stringify(editSession)
      );
  }, [editSession]);

  const handleSaveSesssion = () => {
    // update session in db. clear localStorge.?
    const session = localStorage.getItem(`editSession-${editSession._id}`);
    if (!session) {
      console.log('session is not in local storage.');
    } else {
      const updatedSession = JSON.parse(session);
      updateSession(editSession._id, updatedSession);
      localStorage.removeItem(`editSession-${editSession._id}`);
      navigate('/sessions');
    }
  };

  const handleBackBtn = () => {
    navigate(-1);
  };

  return (
    <Container maxWidth={'xl'} sx={{ overflow: 'auto' }}>
      <br />
      <Button color="primary" onClick={() => handleBackBtn()}>
        <KeyboardBackspaceIcon />
        back
      </Button>
      <Container
        sx={{
          display: 'flex',
          justifyContent: 'center',
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
            width: '500px',
            borderRadius: '6px',
          }}
        >
          Edit Session
        </Typography>
      </Container>
      <br />
      {!editSession ? (
        <Container sx={{ display: 'flex', justifyContent: 'center' }}>
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
            Loading session...
          </Typography>
        </Container>
      ) : (
        <>
          <Container sx={{ display: 'flex', justifyContent: 'center' }}>
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
              <u>{editSession.title}</u>
            </Typography>
          </Container>
          <Paper elevation={4} sx={{ padding: 3, margin: 2 }}>
            <SessionCollapsibleTable
              session={editSession}
              setSession={setEditSession}
            />
          </Paper>
          <br />

          <Container
            sx={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Button
              variant="outlined"
              color="primary"
              sx={{
                borderRadius: '6px',
                width: '70%',
                height: '50px',
                color: 'white',
                backgroundColor: '#333333',
                '&:hover': {
                  backgroundColor: '#333333',
                  color: 'gold',
                },
              }}
              onClick={() => {
                handleSaveSesssion();
              }}
            >
              Save Session
            </Button>
          </Container>
          <br />
          <br />
          <br />
        </>
      )}
    </Container>
  );
};

export default EditSession;
