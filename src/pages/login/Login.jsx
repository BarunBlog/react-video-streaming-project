import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../auth/auth.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    // Handle login logic here
  };

  return (
    <section>
      <div className="auth-background">
        <div className="shape"></div>
        <div className="shape"></div>
      </div>

      <form action="">
        <h3>Login Here</h3>

        <label htmlFor="username">Username</label>
        <input type="text" placeholder="Your Username" id="username" />

        <label htmlFor="password">Password</label>
        <input type="password" placeholder="Password" id="password" />

        <button>Log In</button>

        <div className="social">
          <div className="go">Google</div>
          <div className="fb">Facebook</div>
        </div>
      </form>
    </section>
  );
};

export default Login;
