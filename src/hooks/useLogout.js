import { useNavigate } from 'react-router-dom';
import useAuth from './useAuth';
import useAxiosPrivate from './useAxiosPrivate';

const LOGOUT_API = '/user/logout/blacklist/';

const useLogout = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const axiosPrivate = useAxiosPrivate();

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    try {
      console.log('Logging out the user');

      await axiosPrivate.post(LOGOUT_API, { refresh_token: refreshToken });

      console.log('User logged out successfully.');
    } catch (err) {
      console.error('Error during logout: ', err);
    }

    // Call the contexts logout function
    // Ensure logout in the frontend even if the request fails
    logout();

    // Redirect to the login page
    navigate('/login', { replace: true });
  };

  return handleLogout;
};

export default useLogout;
