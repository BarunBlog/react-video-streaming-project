import axios from '../api/axios';

const TOKEN_REFRESH_API_URL = '/user/login/refresh/';

export const useRefreshToken = () => {
  const refreshToken = localStorage.getItem('refreshToken');

  const refresh = async () => {
    try {
      const response = await axios.post(TOKEN_REFRESH_API_URL, {
        refresh: refreshToken,
      });

      // Update the access token
      localStorage.setItem('accessToken', response.data.access);

      return response.data.access;
    } catch (err) {
      console.error('Error refreshing token: ', err);
      throw err;
    }
  };

  return refresh;
};
