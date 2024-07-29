import React from 'react';
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import Home from './pages/home/Home';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { useContext } from 'react';
import AuthContext, { AuthProvider } from './context/AuthProvider';
import VideoDetails from './pages/VideoDetails/VideoDetails';

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
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />

          <Route
            path="videos/:videoUuid"
            element={
              <PrivateRoute>
                <VideoDetails />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
