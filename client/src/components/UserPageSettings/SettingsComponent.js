import React, { useState } from 'react';
import './SettingsComponent.css'

const SettingsComponent = ({ onUpdateSettings }) => {
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showUsernameForm, setShowUsernameForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  return (
      <div className='settings-options'>
          <p onClick={() => setShowEmailForm(!showEmailForm)}>Change Email</p>
          {showEmailForm && <ChangeEmailForm onUpdateSettings={onUpdateSettings} />}
          
          <p onClick={() => setShowUsernameForm(!showUsernameForm)}>Change Username</p>
          {showUsernameForm && <ChangeUsernameForm onUpdateSettings={onUpdateSettings} />}
          
          <p onClick={() => setShowPasswordForm(!showPasswordForm)}>Change Password</p>
          {showPasswordForm && <ChangePasswordForm onUpdateSettings={onUpdateSettings} />}
      </div>
  );
};


// ChangeEmailForm Component (similar for Username and Password)
const ChangeEmailForm = ({ onUpdateSettings }) => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState({ type: '', content: '' });

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            setMessage({ type: 'error', content: 'Invalid email format.' });
            return;
        }

        try {
            await onUpdateSettings({ type: 'email', email });
            setMessage({ type: 'success', content: 'Email updated successfully!' });
        } catch (error) {
            setMessage({ type: 'error', content: 'Error updating email.' });
        }
    };

    return (
        <div className="settingsContainer">
            <form onSubmit={handleSubmit}>
                <label>
                    New Email:
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </label>
                {message.content && (
                    <div className={message.type === 'error' ? 'errorText' : 'successText'}>{message.content}</div>
                )}
                <button type="submit">Change Email</button>
            </form>
        </div>
    );
};
// ChangeUsernameForm Component
const ChangeUsernameForm = ({ onUpdateSettings }) => {
    const [username, setUsername] = useState('');
    const [message, setMessage] = useState({ type: '', content: '' });

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!/^[A-Za-z0-9.]{7,}$/.test(username)) {
            setMessage({ type: 'error', content: 'Username must be more than 6 characters and can include letters, numbers, and the dot character.' });
            return;
        }

        try {
            await onUpdateSettings({ type: 'username', username });
            setMessage({ type: 'success', content: 'Username updated successfully!' });
        } catch (error) {
            setMessage({ type: 'error', content: 'Error updating username.' });
        }
    };

    return (
        <div className="settingsContainer">
            <form onSubmit={handleSubmit}>
                <label>
                    New Username:
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                </label>
                {message.content && (
                    <div className={message.type === 'error' ? 'errorText' : 'successText'}>{message.content}</div>
                )}
                <button type="submit">Change Username</button>
            </form>
        </div>
    );
};

// ChangePasswordForm Component
const ChangePasswordForm = ({ onUpdateSettings }) => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState({ type: '', content: '' });

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (newPassword !== confirmPassword) {
            setMessage({ type: 'error', content: 'New password and confirmation do not match.' });
            return;
        }

        if (newPassword.length < 8 || !/^[A-Za-z0-9]+$/.test(newPassword)) {
            setMessage({ type: 'error', content: 'Password must be at least 8 characters long and must include both letters and numbers.' });
            return;
        }

        try {
            const response = await onUpdateSettings({ type: 'password', oldPassword, newPassword });
            setMessage({ type: 'success', content: 'Password updated successfully!' });
        } catch (error) {
            setMessage({ type: 'error', content: 'Error updating password. Make sure your old password is correct.' });
        }
    };

    return (
        <div className="settingsContainer">
            <form onSubmit={handleSubmit}>
                <label>
                    Old Password:
                    <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
                </label>
                <label>
                    New Password:
                    <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                </label>
                <label>
                    Confirm New Password:
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                </label>
                {message.content && (
                    <div className={message.type === 'error' ? 'errorText' : 'successText'}>{message.content}</div>
                )}
                <button type="submit">Change Password</button>
            </form>
        </div>
    );
};

export default SettingsComponent;