import { createContext, useState } from 'react';
import { useContext } from 'react';
import { axiosPrivate } from '../api/axios';
const { v4: uuidv4 } = require('uuid');

const SessionsContext = createContext({});

export const useSessions = () => {
  return useContext(SessionsContext);
};

export const SessionsProvider = ({ children }) => {
  const [sessions, setSessions] = useState(null);

  const fetchAllSessions = async () => {
    console.log('fetchAllSessions');
    try {
      const response = await axiosPrivate.get(`/sessions`);
      setSessions(response?.data?.sessions);
      console.log('getUserSessions...');
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSession = async (setSession, sessionId) => {
    console.log('fetchSession');
    const localStorageSession = localStorage.getItem(
      `editSession-${sessionId}`
    );
    if (localStorageSession) {
      setSession(JSON.parse(localStorageSession));
    } else {
      // no session in local storage. fetch session from DB
      try {
        const response = await axiosPrivate.get(`/sessions/${sessionId}`);
        // add id to sessions for editing.

        const editExercises = response?.data?.session?.exercises.map(
          (exercise) => {
            const editSessionSets = exercise.session_sets.map((set) => {
              return { ...set, id: uuidv4() };
            });
            return { id: uuidv4(), ...exercise, session_sets: editSessionSets };
          }
        );
        const editSession = {
          ...response?.data?.session,
          exercises: editExercises,
        };
        // console.log(editSession);
        setSession(editSession);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const createSession = async (workoutId) => {
    console.log('CreateSession');
    try {
      const response = await axiosPrivate.post(`/sessions/create-session`, {
        workoutId,
      });
      console.log(response?.data);
      return response?.data?.sessionId;
    } catch (err) {
      console.error(err);
    }
  };

  const updateSession = async (sessionId, updatedSession) => {
    try {
      const response = await axiosPrivate.put(`/sessions/${sessionId}`, {
        session: updatedSession,
      });
      console.log(response);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteSession = async (sessionId) => {
    try {
      const response = await axiosPrivate.delete(`/sessions/${sessionId}`);
      console.log(response);
    } catch (err) {
      console.error(err);
    }
  };

  const value = {
    sessions,
    setSessions,
    fetchAllSessions,
    createSession,
    fetchSession,
    updateSession,
    deleteSession,
  };

  return (
    <SessionsContext.Provider value={value}>
      {children}
    </SessionsContext.Provider>
  );
};

export default SessionsContext;
