import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useRefreshToken from '../hooks/useRefreshToken';
import { useAuth } from '../contexts/AuthProvider';
import { useWorkouts } from '../contexts/WorkoutsProvider';
import { useExercises } from '../contexts/ExercisesProvider';
import { Typography } from '@mui/material';
const PersistLogin = () => {
  const { user, global } = useWorkouts();
  const { fetchAllExercises } = useExercises();
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();
  const { auth } = useAuth();

  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        await refresh(); // new accessToken will be saved to auth context. this will prevent RequireAuth componenet to 'kick' out.
      } catch (err) {
        console.log(`refresh err response.status = ${err.status}`);
        // console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    // run verifyRefreshToken only when there is no accessToken in auth.
    if (!auth?.accessToken) {
      verifyRefreshToken();
    } else setIsLoading(false);
  }, []);

  // for debugging.
  // useEffect(() => {
  //   console.log(`isLoading: ${isLoading}`);
  //   console.log(`aT: ${JSON.stringify(auth?.accessToken)}`);
  //   console.log(auth);
  // }, [isLoading]);

  return (
    <>
      {isLoading ? (
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{
            color: '#097969',
            fontWeight: '600',
            align: 'center',
            width: '500px',
          }}
        >
          Loading...
        </Typography>
      ) : (
        <Outlet />
      )}
    </>
  );
};

export default PersistLogin;
