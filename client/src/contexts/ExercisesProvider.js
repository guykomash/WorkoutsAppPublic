import { createContext, useState, useContext } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

const ExerciseContext = createContext([]);

export const useExercises = () => {
  return useContext(ExerciseContext);
};
export const ExerciseProvider = ({ children }) => {
  const axiosPrivate = useAxiosPrivate();
  const [exercises, setExercises] = useState(null);

  const fetchAllExercises = async () => {
    try {
      const response = await axiosPrivate.get('/exercises');
      setExercises(response.data.exercises);
    } catch (err) {
      console.error(err);
    }
  };

  const addExercise = async (title, type) => {
    try {
      const response = await axiosPrivate.post('/exercises', {
        exercise: {
          title: title,
          type: type,
        },
      });
      setExercises(response.data.exercises);
    } catch (err) {
      console.error(err);
    }
  };

  const moveExerciseIndex = (workoutObject, fromIndex, toIndex) => {
    console.log('moveExerciseIndex');
    const newExercises = workoutObject.exercises;
    const exercise = newExercises[fromIndex];
    newExercises.splice(fromIndex, 1);
    newExercises.splice(toIndex, 0, exercise);
    return { ...workoutObject, exercises: newExercises };
  };

  const value = {
    fetchAllExercises,
    addExercise,
    exercises,
    setExercises,
    moveExerciseIndex,
  };

  return (
    <ExerciseContext.Provider value={value}>
      {children}
    </ExerciseContext.Provider>
  );
};

export default ExerciseContext;
