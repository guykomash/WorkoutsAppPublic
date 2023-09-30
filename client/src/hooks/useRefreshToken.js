import axios from '../api/axios';
import { useAuth } from '../contexts/AuthProvider';
import useLogout from './useLogout';

const useRefreshToken = () => {
  const { auth, setAuth } = useAuth();
  const logout = useLogout();

  //refresh will update the auth context accessToken
  const refresh = async () => {
    try {
      const response = await axios.get('/refresh', { withCredentials: true });
      const accessToken = response?.data?.accessToken;
      const userId = response?.data?.userId;
      const userName = response?.data?.userName;
      const firstName = response?.data?.userFirstName;
      const lastName = response?.data?.userLastName;
      const created = response?.data?.created;
      setAuth({
        userId,
        userName,
        firstName,
        lastName,
        created,
        accessToken,
      });
      return accessToken;
    } catch (err) {
      if (err.status === 401) {
        logout();
      }
    }
  };
  return refresh; // userRefreshToken() returns the refresh function.
};

export default useRefreshToken;
