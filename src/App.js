import React from 'react';
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { useContext } from 'react';
import AuthContext, { AuthProvider } from './context/AuthProvider';

const PrivateRoute = ({ children }) => {
  const { auth } = useContext(AuthContext);
  return auth.isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route
            exact
            path="/login"
            // element={user ? <Navigate to="/" replace /> : <Login />}
            element={<Login />}
          />

          <Route
            exact
            path="/register"
            // element={user ? <Navigate to="/" replace /> : <Register />}
            element={<Register />}
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
