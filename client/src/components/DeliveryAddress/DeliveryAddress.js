import React, { useEffect, useState } from "react";
import axios from "axios";
import './DeliveryAddress.css'

const DeliveryAddress = ({ user }) => {
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState('');


  const fetchAddresses = async () => {
    if (user && user.user_id) {
      try {
        const response = await axios.get(`https://localhost:3001/user/address/${user.user_id}`);
        setAddresses(response.data || []);
      } catch (error) {
        console.error('Error fetching addresses:', error);
      }
    }
  };

  useEffect(() => {
    // Fetch addresses when the component mounts
    fetchAddresses();
  }, [user]);

  const handleAddAddress = async (event) => {
    event.preventDefault();
    if (newAddress.trim() !== '') {
      try {
        await axios.post(`https://localhost:3001/user/address`, {
          userId: user.user_id,
          address: newAddress,
        });
        setNewAddress('');
        // Fetch the updated list of addresses to include the new address with its ID
        fetchAddresses();
      } catch (error) {
        console.error('Error adding address:', error);
      }
    }
  };

  const handleRemoveAddress = async (addressId) => {
    try {
      await axios.delete(`https://localhost:3001/user/address/${user.user_id}/${addressId}`);
      setAddresses(addresses.filter(address => address.address_id !== addressId));
    } catch (error) {
      console.error('Error removing address:', error);
    }
  };

  return (
    <div className="delivery-address-container">
      <h3>Saved Addresses:</h3>
      {addresses.length > 0 ? (
        <ul>
          {addresses.map(address => (
            <li key={address.address_id}>
              {address.address}
              <span 
                className="remove-address"
                onClick={() => handleRemoveAddress(address.address_id)}
              >
                ❌
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p>No saved addresses.</p>
      )}
      <form onSubmit={handleAddAddress}>
        <label>
          New Address:
          <input
            type="text"
            value={newAddress}
            onChange={(e) => setNewAddress(e.target.value)}
          />
        </label>
        <button type="submit">Add Address</button>
      </form>
    </div>
  );
};

export default DeliveryAddress;