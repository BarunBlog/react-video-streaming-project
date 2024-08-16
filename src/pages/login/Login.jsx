import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../auth/auth.css';
import useAuth from '../../hooks/useAuth';
import axios from '../../api/axios';

const LOGIN_URL = '/user/login/';

const Login = () => {
  const { login } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const userRef = useRef();
  const errRef = useRef();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errMessage, setErrMessage] = useState('');

  // To set initial focus on the username field
  useEffect(() => {
    userRef.current.focus();
  }, []);

  // Reset the error message whenever username or password changes
  useEffect(() => {
    setErrMessage('');
  }, [username, password]);

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      const response = await axios.post(LOGIN_URL, JSON.stringify({ username: username, password: password }), {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });

      const { access, refresh } = response.data;
      login(access, refresh); // Saving tokens to localstorage

      setUsername('');
      setPassword('');

      navigate(from, { replace: true });
    } catch (err) {
      if (!err?.response) {
        setErrMessage('No Server Response');
      } else if (err.response?.status === 400) {
        setErrMessage('Missing Username or Password');
      } else if (err.response?.status === 401) {
        setErrMessage('Wrong Username or Password');
      } else {
        setErrMessage('Login Failed');
      }
    }
  };

  return (
    <section>
      <div className="auth-background">
        <div className="shape"></div>
        <div className="shape"></div>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <p ref={errRef} className={errMessage ? 'errmsg' : 'offscreen'} aria-live="assertive">
          {errMessage}
        </p>

        <h3>Login Here</h3>

        <label htmlFor="username">Username</label>
        <input
          type="text"
          placeholder="Your Username"
          id="username"
          ref={userRef}
          autoComplete="off"
          onChange={e => setUsername(e.target.value)}
          value={username}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          placeholder="Your Password"
          id="password"
          onChange={e => setPassword(e.target.value)}
          value={password}
          required
        />

        <button>Sign In</button>

        <div className="social">
          <div className="go">Google</div>
          <div className="fb">Facebook</div>
        </div>

        <br />
        <p>
          <span className="line">
            Need an Account? <Link to="/register">Sign Up</Link>
          </span>
        </p>
      </form>
    </section>
  );
};

export default Login;
