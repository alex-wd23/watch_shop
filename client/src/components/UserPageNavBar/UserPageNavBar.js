import React from 'react';
import { useUser } from '../../contexts/UserContext/UserContext';
import './UserPageNavBar.css';

export const UserPageNavBar = ({ setActiveSection }) => {
    const { logoutUser } = useUser();
    
    const logout = async () => {
        await logoutUser();
    };

    return (
        <div className='user-navbar-container'>
            <div onClick={() => setActiveSection('accountDetails')}>Account Details</div>
            <div onClick={() => setActiveSection('settings')}>Settings</div>
            <div onClick={() => setActiveSection('orders')}>Orders</div>
            <button onClick={logout}>LOGOUT</button>
        </div>
    );
};
