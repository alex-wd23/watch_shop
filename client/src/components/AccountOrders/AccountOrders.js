// OrdersComponent.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AccountOrders.css'

const AccountOrders = ({ user }) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`https://localhost:3001/user/orders/${user.user_id}`);
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    if (user.user_id) {
      fetchOrders();
    }
    
  }, [user.user_id]);

  const removeOrder = async (orderId) => {
    try {
      const response = await axios.put(`https://localhost:3001/user/orders/cancel/${orderId}`);
      if (response.data && response.data.order) {
        setOrders(orders.map(order => 
          order.order_id === orderId ? { ...order, status: 'Canceled' } : order
        ));
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
    }
  };
  

  return (
    <div className="ordersContainer">
      <h2>Orders</h2>
      <table className="ordersTable">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Date</th>
            <th>Status</th>
            <th>Products</th>
            <th>Total</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.order_id} className={order.status === 'Canceled' ? 'canceledOrder' : ''}>
              <td>{order.order_id}</td>
              <td>{new Date(order.order_date).toLocaleDateString()}</td>
              <td>{order.status}</td>
              <td>
                {order.products.map((product, index) => (
                  <div key={index}>{product.name} (x{product.quantity})</div>
                ))}
              </td>
              <td>${order.total}</td>
              <td>
                {order.status !== 'Canceled' && (
                  <button onClick={() => removeOrder(order.order_id)} className="cancelButton">Cancel Order</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AccountOrders;

