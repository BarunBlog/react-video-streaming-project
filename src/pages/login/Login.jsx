import React, { useState, useRef, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import '../auth/auth.css';
import AuthContext from '../../context/AuthProvider';
import axios from '../../api/axios';

const LOGIN_URL = '/user/login/';

const Login = () => {
  const { login } = useContext(AuthContext);

  const userRef = useRef();
  const errRef = useRef();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errMessage, setErrMessage] = useState('');
  const [success, setSuccess] = useState(false);

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
      setSuccess(true);
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
    <>
      {success ? (
        <section>
          <h1>You are logged in!</h1>

          <br />

          <p>
            <a href="#">Go to Home</a>
          </p>
        </section>
      ) : (
        <section>
          <div className="auth-background">
            <div className="shape"></div>
            <div className="shape"></div>
          </div>

          <form onSubmit={handleSubmit}>
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
      )}
    </>
  );
};

export default Login;
