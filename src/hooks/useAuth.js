import { useContext } from 'react';
import AuthContext from '../context/AuthProvider';

// Creating this custom hook, so whenever we need useContext, we can use this hook
const useAuth = () => {
  return useContext(AuthContext);
};

export default useAuth;
