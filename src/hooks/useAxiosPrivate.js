// Attach the intercerptors to the request and the response of the private axios instance.
// The interceptor automatically refresh the access token in the background if a component
// receives unauthorized error

import { useEffect } from 'react';
import { axiosPrivate } from '../api/axios';
import { useRefreshToken } from './useRefreshToken';

const useAxiosPrivate = () => {

  const refresh = useRefreshToken();

  useEffect(() => {
    // Request interceptor adds access token to the request header
    const requestIntercept = axiosPrivate.interceptors.request.use(
      config => {
        if (!config.headers['Authorization']) {

          const accessToken = localStorage.getItem('accessToken');
          config.headers['Authorization'] = `Bearer ${accessToken}`;
        }

        return config;
      },
      error => Promise.reject(error)
    );

    // Response interceptor refresh the access token if got bad request initially, and retry again
    const responseIntercept = axiosPrivate.interceptors.response.use(
      response => response, // If response is ok, then return the response
      async error => {
        // If token get expried, this section will execute
        const prevRequest = error?.config;

        if (error?.response?.status === 401 && !prevRequest?.sent) {
          prevRequest.sent = true;
          const newAccessToken = await refresh();

          prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return axiosPrivate(prevRequest);
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [refresh]);

  return axiosPrivate;
};

export default useAxiosPrivate;
