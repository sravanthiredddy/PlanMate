import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './WelcomePage.css';

const SignUp = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registered, setRegistered] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8080/api/users/register', {
        name: name.trim(),
        email: email.trim(),
        username: email.trim().split('@')[0],
        password
      });

      console.log('Registration response:', response);

      if (response.status === 200 || response.status === 201 || response.status === 204) {
        setRegistered(true);
      } else {
        alert("Registration completed, but unexpected response status: " + response.status);
        setRegistered(true);
      }
    } catch (error) {
      console.error('Signup error:', error);
      alert(
        error.response?.data?.message || 'Something went wrong. Please try again.'
      );
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container auth-container-wide">
        <div className="auth-header">
          <p className="welcome-kicker">Create your workspace</p>
          <h2>Sign Up</h2>
          
        </div>

        {registered ? (
          <>
            <div className="auth-success">
              Registered successfully!
            </div>
            <button onClick={() => navigate('/')} className="auth-primary-btn">
              Back to Login
            </button>
          </>
        ) : (
          <form className="auth-form auth-grid" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" className="auth-primary-btn auth-grid-full">
              Sign Up
            </button>
          </form>
        )}

        {!registered && (
          <button onClick={() => navigate('/')} className="auth-secondary-btn">
            Back to Welcome
          </button>
        )}
      </div>
    </div>
  );
};

export default SignUp;
