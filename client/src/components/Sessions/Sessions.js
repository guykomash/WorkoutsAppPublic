import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessions } from '../../contexts/SessionsProvider';
import {
  Button,
  Container,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import DeleteBtnWithDialog from '../DeleteBtnWithDialog';

const Sessions = () => {
  const navigate = useNavigate();
  const { sessions, fetchAllSessions } = useSessions();
  const [sessionsInPage, setSessionInPage] = useState(5);
  useEffect(() => {
    fetchAllSessions();
  }, []);

  const handleNewSessionBtn = () => {
    navigate('/sessions/new-session');
  };

  const onEditSessionClicked = (sessionId) => {
    navigate(`/sessions/${sessionId}`);
  };

  const onDeleteSessionBtn = (sessionId) => {
    console.log(`delete ${sessionId}`);
  };

  return (
    <Container maxWidth="md">
      <br />
      <Button color="primary" onClick={() => navigate(-1)}>
        <KeyboardBackspaceIcon />
        back
      </Button>
      <br />
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
            width: '300px',
            borderRadius: '6px',
          }}
        >
          Sessions
        </Typography>
        <br />
        {!sessions ? (
          <div>loading sessions</div>
        ) : sessions.length === 0 ? (
          <div>no sessions yet.</div>
        ) : (
          <Container
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
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
              Your last sessions
            </Typography>
            <Paper sx={{ padding: 2, overflow: 'auto', maxHeight: '400px' }}>
              <List>
                {sessions.toReversed().map((session, index) => {
                  return index >= sessionsInPage ? (
                    <></>
                  ) : (
                    <ListItem key={session._id} disablePadding>
                      <ListItemText
                        primary={session.title}
                        sx={{ margin: 2 }}
                      />
                      <Button
                        variant="outlined"
                        onClick={() => onEditSessionClicked(session._id)}
                      >
                        View and edit session
                      </Button>
                      <DeleteBtnWithDialog
                        title={'Delete sesion?'}
                        content={'This will delete this session permanently.'}
                        id={session._id}
                        onDelete={() => onDeleteSessionBtn(session._id)}
                      />
                    </ListItem>
                  );
                })}
              </List>
              {sessionsInPage < sessions.length ? (
                <Button
                  sx={{ display: 'flex', alignItems: 'center' }}
                  onClick={() => setSessionInPage((prev) => prev + 5)}
                >
                  Show More
                </Button>
              ) : (
                <></>
              )}
            </Paper>
          </Container>
        )}
        <Button onClick={handleNewSessionBtn}>Start New Session!</Button>
      </Container>
    </Container>
  );
};

export default Sessions;
