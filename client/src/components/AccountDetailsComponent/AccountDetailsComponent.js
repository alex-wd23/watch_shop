import React from 'react'
import DeliveryAddress from '../DeliveryAddress/DeliveryAddress';
import './AccountDetailsComponent.css';


const AccountDetailsComponent = ({ user }) => (
    <div className='account-details-container'>
      <h3>Account Details</h3>
      <div>Username: {user.username}</div>
      <div>Email: {user.email}</div>
      <div>Phone: {user.phone}</div>
      <DeliveryAddress user={user}/>
    </div>
  );

export default AccountDetailsComponent;
