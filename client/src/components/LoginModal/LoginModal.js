import React, { useState } from 'react';
import axios from 'axios';
import './LoginModal.css';
import { useNavigate } from 'react-router-dom';
import ForgotPwd from './ForgotPwd';
import Login from './Login';
import Register from './Register';

const LoginModal = ({ showModal, setShowModal, setToken }) => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        form: 'login',
    });

    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let response;
            if (formData.form === 'login') {
                response = await axios.post('http://localhost:3001/signin', {
                    username: formData.username,
                    password: formData.password,
                });

                if (response.status === 200) {
                    setToken(response.data.token);
                    localStorage.setItem('token', response.data.token);
                    setShowModal(false);
                    navigate('/account');
                } else {
                    setError(`Login Error: ${response.status} ${response.statusText}`);
                }
            } else if (formData.form === 'register') {
                response = await axios.post('http://localhost:3001/register', {
                    username: formData.username,
                    password: formData.password,
                    email: formData.email,
                });

                if (response.status === 200) {
                    console.log('Registration Successful');
                } else {
                    setError(`Registration Error: ${response.status} ${response.statusText}`);
                }
            } else if (formData.form === 'forgot') {
                response = await axios.post('http://localhost:3001/forgotpassword', {
                    email: formData.email,
                });

                if (response.status === 200) {
                    console.log('Password reset link sent to your email.');
                } else {
                    setError(`Forgot Password Error: ${response.status} ${response.statusText}`);
                }
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status === 401) {
                    setError(`${formData.form.charAt(0).toUpperCase() + formData.form.slice(1)} Error: Invalid Credentials`);
                } if (error.response.status === 409) {
                    if (error.response.data === 'Username already exists') {
                        setError('Registration Error: Username already exists!');
                    } else if (error.response.data === 'Email already exists') {
                        setError('Registration Error: Email already exists!');
                    }
                  }
            } else {
                setError(`An unexpected error occurred: ${error}`);
            }
        }
    };

    const handleForgot = (e) => {
        setFormData({
            form: 'forgot',
        });
    };

    const handleRegister = (e) => {
        setFormData({
            form: 'register',
        });
    };

    const handleLogin = (e) => {
        setFormData({
            form: 'login',
        });
    };

    const usernameAndPassword = (
        <>
            <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
        </>
    );


  return (
    showModal && (
      <div className="loginModal">
        <div className="modalContent">
          <span
            className="close"
            onClick={() => {
              setShowModal(false);
              setFormData({ form: 'login' });
              setError(null);
              
            }}
          >
            &times;
          </span>
          <h2>{formData.form === 'login' ? 'Login' : formData.form === 'forgot' ? 'Forgot Password' : 'Register'}</h2>
          <form onSubmit={handleSubmit}>
            {formData.form === 'login' && <Login usernameAndPassword={usernameAndPassword} formData={formData} handleChange={handleChange} handleForgot={handleForgot} handleRegister={handleRegister} />}
            {formData.form === 'register' && <Register usernameAndPassword={usernameAndPassword} formData={formData} handleChange={handleChange} handleLogin={handleLogin} />}
            {formData.form === 'forgot' && <ForgotPwd formData={formData} handleChange={handleChange} />}
            {error && <div className="errorText">{error}</div>}
          </form>
        </div>
      </div>
    )
  );
};

export default LoginModal;