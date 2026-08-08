import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './WelcomePage.css';

const WelcomePage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (email.trim() !== '' && password.trim() !== '') {
      try {
        const response = await fetch('http://localhost:8080/api/users/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Login response:', data);

          if (data.message === 'Login successful') {
            localStorage.setItem("user", JSON.stringify(data.user));
            alert('Login successful!');
            navigate('/dashboard');
          } else {
            alert(data.message);
          }
        } else {
          alert('Invalid credentials. Please try again.');
        }
      } catch (error) {
        console.error('Login error:', error);
        alert('Something went wrong. Please try later.');
      }
    } else {
      alert('Please enter both email and password.');
    }
  };

  return (
    <div className="welcome-wrapper">
      <div className="welcome-left">
        <h1 className="brand">PLANMATE</h1>
        <p className="welcome-copy">
             PlanMate helps you manage and organize your tasks effectively.
        </p>
      </div>
      <div className="welcome-right">
        <div className="login-box">
          
          <h4 className="login-subtitle">
            Sign in to continue building your day with clarity.
          </h4>
          <input
            type="email"
            placeholder="Email address"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="login-btn" onClick={handleLogin}>
            Log In
          </button>
          <Link to="/forgot" className="forgot-link">
            Forgotten password?
          </Link>
          <hr />
          <Link to="/signup" className="create-btn">
            Create new account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
