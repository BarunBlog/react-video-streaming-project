import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaInfoCircle } from 'react-icons/fa';
import { FaCheck } from 'react-icons/fa';
import { FaTimes } from 'react-icons/fa';
import '../auth/auth.css';
import axios from '../../api/axios';

const REGISTRATION_URL = '/user/register/';

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Register = () => {
  const userRef = useRef();
  const errRef = useRef();

  const [username, setUsername] = useState('');
  const [validUsername, setValidUsername] = useState(false);
  const [usernameFocus, setUsernameFocus] = useState(false);

  const [email, setEmail] = useState('');
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [password, setPassword] = useState('');
  const [validPassword, setValidPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  const [errMessage, setErrMessage] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  // Validate the username field whenever it changes
  useEffect(() => {
    setValidUsername(USER_REGEX.test(username));
  }, [username]);

  // Validate the email field
  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(email));
  }, [email]);

  // Validate the password field
  useEffect(() => {
    setValidPassword(PWD_REGEX.test(password));
  }, [password]);

  // Setting error message ------------------------------------------------------------------------
  useEffect(() => {
    setErrMessage('');
  }, [username, email, password]);

  const handleSubmit = async e => {
    e.preventDefault();

    const v1 = USER_REGEX.test(username);
    const v2 = EMAIL_REGEX.test(email);
    const v3 = PWD_REGEX.test(password);

    if (!v1 || !v2 || !v3) {
      setErrMessage('Invalid Entry');
      return;
    }

    try {
      const response = await axios.post(
        REGISTRATION_URL,
        JSON.stringify({ username: username, email: email, password: password }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );

      console.log(JSON.stringify(response));

      setSuccess(true);
      //clear state and controlled inputs
      //need value attrib on inputs for this
      setUsername('');
      setEmail('');
      setPassword('');
    } catch (err) {
      if (!err?.response) {
        setErrMessage('No Server Response');
      } else if (err.response?.status === 400) {
        setErrMessage(err.response.data?.username);
      } else {
        setErrMessage('Registration Failed');
      }
      errRef.current.focus();
    }
  };

  return (
    <>
      {success ? (
        <div className="success-msg">
          <h1>Success!</h1>

          <p>
            <Link to="/login">Login</Link>
          </p>
        </div>
      ) : (
        <section>
          <div className="auth-background">
            <div className="shape"></div>
            <div className="shape"></div>
          </div>

          <div className="form-container">
            <form onSubmit={handleSubmit}>
              <p ref={errRef} className={errMessage ? 'errmsg' : 'offscreen'} aria-live="assertive">
                {errMessage}
              </p>

              <h3>Register Here</h3>

              <label htmlFor="username">
                Username:
                <FaCheck className={validUsername ? 'valid' : 'hide'} />
                <FaTimes className={validUsername || !username ? 'hide' : 'invalid'} />
              </label>

              <input
                type="text"
                placeholder="Your Username"
                id="username"
                ref={userRef}
                autoComplete="off"
                onChange={e => setUsername(e.target.value)}
                required
                aria-invalid={validUsername ? 'false' : 'true'}
                aria-describedby="uidnote"
                onFocus={() => setUsernameFocus(true)}
                onBlur={() => setUsernameFocus(false)}
              />

              <p id="uidnote" className={usernameFocus && username && !validUsername ? 'instructions' : 'offscreen'}>
                <FaInfoCircle />
                4 to 24 characters.
                <br />
                Must begin with a letter.
                <br />
                Letters, numbers, underscores, hyphens allowed.
              </p>

              <label htmlFor="email">
                Email:
                <FaCheck className={validEmail ? 'valid' : 'hide'} />
                <FaTimes className={validEmail || !email ? 'hide' : 'invalid'} />
              </label>

              <input
                type="email"
                placeholder="Your Email"
                id="email"
                autoComplete="off"
                onChange={e => setEmail(e.target.value)}
                required
                aria-invalid={validEmail ? 'false' : 'true'}
                aria-describedby="emailnote"
                onFocus={() => setEmailFocus(true)}
                onBlur={() => setEmailFocus(false)}
              />

              <label htmlFor="password">
                Password:
                <FaCheck className={validPassword ? 'valid' : 'hide'} />
                <FaTimes className={validPassword || !password ? 'hide' : 'invalid'} />
              </label>

              <input
                type="password"
                placeholder="Your Password"
                id="password"
                onChange={e => setPassword(e.target.value)}
                required
                aria-invalid={validUsername ? 'false' : 'true'}
                aria-describedby="pwdnote"
                onFocus={() => setPasswordFocus(true)}
                onBlur={() => setPasswordFocus(false)}
              />

              <p id="pwdnote" className={passwordFocus && !validPassword ? 'instructions' : 'offscreen'}>
                <FaInfoCircle />
                8 to 24 characters.
                <br />
                Must include uppercase and lowercase letters, a number and a special character.
                <br />
                Allowed special characters: <span aria-label="exclamation mark">!</span>{' '}
                <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span>{' '}
                <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
              </p>

              <button disabled={!validUsername || !validPassword || !validEmail ? true : false}>Sign Up</button>

              <div className="social">
                <div className="go">Google</div>
                <div className="fb">Facebook</div>
              </div>

              <br />
              <p>
                <span className="line">
                  Already registered? <Link to="/login">Login</Link>
                </span>
              </p>
            </form>
          </div>
        </section>
      )}
    </>
  );
};

export default Register;
