import { React, useState, useEffect } from 'react';
import axios from 'axios';
import './LoginModal.css';
import { useNavigate, useParams } from 'react-router-dom';
import ForgotPwd from './ForgotPwd';
import Login from './Login';
import Register from './Register';
import ResetPwd from './ResetPwd';

const LoginModal = ({ showModal, setShowModal, setToken }) => {
    const navigate = useNavigate();
    const { resetToken } = useParams();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        newPassword: '',
        confirmPassword:'',
        email: '',
        form: 'login',
        resetToken: ''
    });
    
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    useEffect(() => {
        const verifyToken = async () => {
          if (resetToken) {
            try {
              const response = await axios.get(`http://localhost:3001/verifyresettoken/${resetToken}`);
              if (response.status === 200) {
                // If the token is valid, proceed to show the reset form
                setShowModal(true);
                setFormData({ ...formData, form: 'reset', resetToken: resetToken });
              }
            } catch (error) {
              // If the token is not valid, handle the error, maybe redirect or show a message
              console.error('Token verification failed:', error);
            }
          }
        };
      
        verifyToken();
      }, [resetToken, setShowModal]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(null);
        setSuccessMessage(null);
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
                    setError(`Login error: ${response.status} ${response.statusText}`);
                }
            } else if (formData.form === 'register') {
                response = await axios.post('http://localhost:3001/register', {
                    username: formData.username,
                    password: formData.password,
                    email: formData.email,
                });

                if (response.status === 200) {
                    setSuccessMessage('Account created.');
                    setFormData({
                        ...formData,
                        username: '',
                        password: '',
                        email: '',
                        form: 'login',
                    });
                } else {
                    setError(`Registration Error: ${response.status} ${response.statusText}`);
                }
            } else if (formData.form === 'forgot') {
                response = await axios.post('http://localhost:3001/forgotpassword', {
                    email: formData.email,
                });

                if (response.status === 200) {
                    setSuccessMessage("Password reset link sent.");
                    setFormData({...formData, form: 'forgot', email:""});
                } else {
                    setError(`Forgot Password Error: ${response.status} ${response.statusText}`);
                }
            } else if (formData.form === 'reset') {
                response = await axios.post('http://localhost:3001/resetpassword', {
                    newPassword: formData.newPassword,
                    confirmPassword: formData.confirmPassword,
                    resetToken: formData.resetToken
                });
                

                if (response.status === 200) {
                    setSuccessMessage("Password succesfully changed.")
                    setFormData({...formData, form: 'login'});
                    setError(null);
                } else {
                    setError(`Reset Password Error: ${response.status} ${response.statusText}`);
                }
            }

        } catch (error) {
            if (error.response) {
                if (error.response.status === 401) {
                    setError(`${formData.form.charAt(0).toUpperCase() + formData.form.slice(1)} Error: Invalid credentials.`);
                }
                
                if (error.response.status === 409) {
                    if (error.response.data === 'Username already exists') {
                        setError('Registration error: username already exists.');
                    } else if (error.response.data === 'Email already exists') {
                        setError('Registration error: email already exists.');
                    }
                  }

                if (error.response.status === 404) {
                    setError("E-mail not found.")
                }

                if (error.response.status === 400) {
                    setError("Passwords do not match.")
                }

                if (error.response.status === 409 && error.response.data === "The new password cannot be the same as your current password.") {
                    setError("New password must be different from the current password.");
                }

            } else {
                setError(`An unexpected error occurred: ${error}`);
            }
        }
    };


    const handleForgot = (e) => {
        setFormData({
            ...formData,
            form: 'forgot',
        });
        setError(null);
        setSuccessMessage(null);
    };

    const handleRegister = (e) => {
        setFormData({
            ...formData,
            form: 'register',
        });
        setError(null);
        setSuccessMessage(null);
    };

    const handleLogin = (e) => {
        setFormData({
            ...formData,
            form: 'login',
        });
        setError(null);
        setSuccessMessage(null);
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
                setFormData({
                  username: '',
                  password: '',
                  newPassword: '',
                  confirmPassword: '',
                  email: '',
                  form: 'login',
                  resetToken: ''
                });
                setShowModal(false);
                setError(null);
                setSuccessMessage(null);
              }}
          >
            &times;
          </span>
          <h2>{formData.form === 'login' ? 'Login' : formData.form === 'forgot' ? 'Forgot Password' : formData.form === 'reset' ? "Reset Password" : 'Register'}</h2>
          <form onSubmit={handleSubmit}>
            {formData.form === 'login' && <Login usernameAndPassword={usernameAndPassword} formData={formData} handleChange={handleChange} handleForgot={handleForgot} handleRegister={handleRegister} />}
            {formData.form === 'register' && <Register usernameAndPassword={usernameAndPassword} formData={formData} handleChange={handleChange} handleLogin={handleLogin} />}
            {formData.form === 'forgot' && <ForgotPwd formData={formData} handleChange={handleChange} />}
            {formData.form === 'reset' && <ResetPwd formData={formData} handleChange={handleChange} />}
            {error && <div className="errorText">{error}</div>}
            {successMessage && <div className="successText">{successMessage}</div>}
          </form>
        </div>
      </div>
    )
  );
};

export default LoginModal;