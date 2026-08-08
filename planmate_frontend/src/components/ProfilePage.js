import React from 'react';
import './ProfilePage.css';

function ProfilePage({ user }) {
  if (!user) {
    return <div className="profile-empty">No user info found.</div>;
  }

  const profileInitial = (user.name || user.username || user.email || "U").charAt(0).toUpperCase();

  return (
    <section className="profile-shell">
      <div className="profile-card">
        <div className="profile-card-header">
          <div className="profile-card-avatar">
            <span>{profileInitial}</span>
            <i className="fas fa-user profile-card-icon"></i>
          </div>
          <div>
            <p className="profile-kicker">Account overview</p>
            <h2>Profile Details</h2>
          </div>
        </div>

        <div className="profile-grid">
          <div className="profile-field">
            <span className="profile-label">Username</span>
            <strong>{user.username || 'Not available'}</strong>
          </div>
          <div className="profile-field">
            <span className="profile-label">Name</span>
            <strong>{user.name || 'Not available'}</strong>
          </div>
          <div className="profile-field profile-field-wide">
            <span className="profile-label">Email</span>
            <strong>{user.email || 'Not available'}</strong>
          </div>
        </div>

        <button
          className="profile-logout-btn"
          onClick={() => {
            localStorage.removeItem("user");
            window.location.href = "/";
          }}
        >
          Logout
        </button>
      </div>
    </section>
  );
}

export default ProfilePage;
