import { createContext, useState, useContext } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useExercises } from './ExercisesProvider';
const { v4: uuidv4 } = require('uuid');

const WorkoutsContext = createContext([]);

export const useWorkouts = () => {
  return useContext(WorkoutsContext);
};
export const WorkoutsProvider = ({ children }) => {
  const axiosPrivate = useAxiosPrivate();
  const { fetchAllExercises } = useExercises();

  // STATES
  //global workouts
  const [allWorkouts, setAllWorkouts] = useState(null);

  // explore filtered by search query
  const [filteredWorkouts, setFilteredWorkouts] = useState(null);

  // user workouts and saved workouts
  const [userWorkouts, setUserWorkouts] = useState(null);
  const [savedWorkouts, setSavedWorkouts] = useState(null);

  // METHODS

  // All workouts
  const getWorkoutById = (workoutId) => {
    console.log(`getWorkoutById`);
    if (allWorkouts) {
      console.log(`AllWorkout: ${JSON.stringify(allWorkouts)}`);
      return allWorkouts.find((workout) => workout._id === workoutId);
    } else return null;
  };

  const fetchAllWorkouts = async () => {
    try {
      const response = await axiosPrivate.get(`/workouts/all`);
      setAllWorkouts(response.data.Workouts);
      setFilteredWorkouts(response.data.Workouts);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchWorkoutDetailsById = (setWorkoutDetails, workoutId) => {
    axiosPrivate
      .get(`/workouts/${workoutId}`)
      .then((response) => {
        setWorkoutDetails(response?.data?.workout);
      })
      .catch((err) => console.error(err));
  };

  // User workouts
  const fetchUserWorkouts = async () => {
    try {
      const response = await axiosPrivate.get(`/workouts`);
      setUserWorkouts(response?.data?.Workouts);
      setSavedWorkouts(response.data.savedWorkouts);
    } catch (err) {
      console.error(err);
    }
  };

  const getUserWorkoutById = (workoutId) => {
    if (userWorkouts) {
      const foundWorkout = userWorkouts.find(
        (workout) => workout._id === workoutId
      );
      if (!foundWorkout) return;
      return JSON.parse(JSON.stringify(foundWorkout)); // returns a copy.
    }
  };

  const getEditUserWorkoutById = (workoutId) => {
    // exercises in data stored with _id. return new exercises with id from uuid.
    if (userWorkouts) {
      const foundWorkout = userWorkouts.find(
        (workout) => workout._id === workoutId
      );
      if (!foundWorkout) return;
      const copiedWorkout = JSON.parse(JSON.stringify(foundWorkout));
      const newExercises = copiedWorkout.exercises.map((exercise) => {
        const { _id: _, ...newExercise } = exercise;
        return { id: uuidv4(), ...newExercise };
      });
      return { ...copiedWorkout, exercises: newExercises };
    }
  };

  const updateWorkout = async (workoutId, workout) => {
    try {
      const response = await axiosPrivate.put(`/workouts/${workoutId}`, {
        workout: workout,
      });
      // setUserWorkouts(response.data.Workouts);
      // await fetchAllExercises(); // user maybe added new exercises.
    } catch (err) {
      console.error(err);
    }
  };

  const addWorkout = async (title, note, exercises) => {
    try {
      const response = await axiosPrivate.post(`/workouts/add-workout`, {
        workout: {
          title: title,
          exercises: exercises,
          note: note,
        },
      });
      // setUserWorkouts(response.data.Workouts);
      // await fetchAllExercises(); // user maybe added new exercises.
    } catch (err) {
      console.error(err);
    }
  };

  const deleteWorkout = async (workoutId) => {
    try {
      const response = await axiosPrivate.delete(`/workouts/${workoutId}`);
      // setUserWorkouts(response.data.Workouts);
    } catch (err) {
      console.error(err);
    }
  };

  // User saved workouts
  const getSavedWorkoutById = (workoutId) => {
    if (savedWorkouts)
      return savedWorkouts.find((workout) => workout._id === workoutId);
  };
  
  const addSavedWorkout = async (workoutId) => {
    try {
      const response = await axiosPrivate.post(`/workouts/save-workout`, {
        workoutId,
      });
      setSavedWorkouts(response.data.savedWorkouts);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteSavedWorkout = async (workoutId) => {
    try {
      const response = await axiosPrivate.put(`/workouts/save-workout`, {
        workoutId,
      });
      setSavedWorkouts(response.data.savedWorkouts);
    } catch (err) {
      console.error(err);
    }
  };

  const value = {
    global: {
      allWorkouts,
      setAllWorkouts,
      getWorkoutById,
      fetchAllWorkouts,
      filteredWorkouts,
      setFilteredWorkouts,
      fetchWorkoutDetailsById,
    },
    user: {
      userWorkouts,
      setUserWorkouts,
      savedWorkouts,
      setSavedWorkouts,
      fetchUserWorkouts,
      getUserWorkoutById,
      updateWorkout,
      addWorkout,
      deleteWorkout,
      getSavedWorkoutById,
      addSavedWorkout,
      deleteSavedWorkout,
      getEditUserWorkoutById,
    },
  };

  return (
    <WorkoutsContext.Provider value={value}>
      {children}
    </WorkoutsContext.Provider>
  );
};

export default WorkoutsContext;
