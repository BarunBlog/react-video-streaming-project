import React from 'react';
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import Home from './pages/home/Home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './context/AuthProvider';
import VideoDetails from './pages/VideoDetails/VideoDetails';
import UploadVideo from './pages/UploadVideo/UploadVideo';
import PrivateRoute from './components/Auth/PrivateRoute';
import SearchVideo from './pages/SearchVideo/SearchVideo';

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

          <Route
            path="/upload"
            element={
              <PrivateRoute>
                <UploadVideo />
              </PrivateRoute>
            }
          />

          <Route
            path="/search"
            element={
              <PrivateRoute>
                <SearchVideo />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
