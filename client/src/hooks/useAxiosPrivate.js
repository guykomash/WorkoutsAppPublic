//This hook attach axios interceptors to the axiosPrivate instance. //

import { axiosPrivate } from '../api/axios';
import { useEffect } from 'react';
import useRefreshToken from './useRefreshToken';
import { useAuth } from '../contexts/AuthProvider';

const useAxiosPrivate = () => {
  // refresh() returns a new accessToken
  const refresh = useRefreshToken();
  const { auth } = useAuth();
  useEffect(() => {
    const requestInterceptor = axiosPrivate.interceptors.request.use(
      (config) => {
        // if no access token attached => attach access token to request.
        if (!config.headers['Authorization']) {
          config.headers['Authorization'] = `Bearer ${auth.accessToken}`;
        }
        return config;
      },
      (err) => Promise.reject(err)
    );

    const responseInterceptor = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (err) => {
        // check if accessToken expired -> call refersh()
        const prevRequest = err?.config;

        if (err?.response?.status === 403 && !prevRequest.sent) {
          prevRequest.sent = true;
          const newAccessToken = await refresh();
          prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return axiosPrivate(prevRequest); // make the previous request , coupled with a new  access token.
        }
        return Promise.reject(err);
      }
    );

    // clean up function: remove interceptors
    return () => {
      axiosPrivate.interceptors.request.eject(requestInterceptor);
      axiosPrivate.interceptors.response.eject(responseInterceptor);
    };
  }, [auth, refresh]);

  // return the axiosPrivate instance with the attached interceptors to request & response
  return axiosPrivate;
};

export default useAxiosPrivate;
