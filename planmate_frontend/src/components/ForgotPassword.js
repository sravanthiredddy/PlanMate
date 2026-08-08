import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './WelcomePage.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [showResetForm, setShowResetForm] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSendLink = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setMessage('Please enter your email address.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/users/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() })
      });

      if (response.ok) {
        const data = await response.json();
        const nextMessage =
          data.message === 'Reset feature available (email can be integrated)'
            ? ''
            : data.message || '';
        setMessage(nextMessage);
        setShowResetForm(true);
      } else {
        setMessage('Failed to process request. Please try again.');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      setMessage('Something went wrong. Please try again later.');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      setMessage('Please fill in both password fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/users/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password: newPassword })
      });

      if (response.ok) {
        setMessage('Password has been reset successfully! You can now log in.');
        setShowResetForm(false);
        setEmail('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setMessage('Failed to reset password. Please try again.');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setMessage('Something went wrong. Please try again later.');
    }
  };

  return (
    <div className="welcome-wrapper">
      <div className="welcome-right">
        <div className="login-box forgot-password-box">
          <h2 className="login-title">Forgot Password</h2>
          <p className="login-subtitle">
            {showResetForm ? 'Change your password' : 'Enter your email to continue.'}
          </p>

          {message && (
            <div
              className={`forgot-password-message ${
                message.toLowerCase().includes('success') ? 'success' : 'error'
              }`}
            >
              {message}
            </div>
          )}

          {!showResetForm ? (
            <form onSubmit={handleSendLink}>
              <input
                type="email"
                placeholder="Enter your email"
                className="input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="forgot-password-actions">
                <button type="submit" className="login-btn">Send Reset Link</button>
                <button
                  type="button"
                  className="auth-secondary-btn"
                  onClick={() => navigate('/')}
                >
                  Back to Login
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleResetPassword}>
              <input
                type="password"
                placeholder="New Password"
                className="input-field"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <input
                type="password"
                placeholder="Confirm Password"
                className="input-field"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <div className="forgot-password-actions">
                <button type="submit" className="login-btn">Change your password</button>
                <button
                  type="button"
                  className="auth-secondary-btn"
                  onClick={() => navigate('/')}
                >
                  Back to Login
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
