import React, { useState, useEffect } from 'react';
import './CartModal.css';

const dummyProducts = [
  { id: 1, name: "Product 1", price: 10.99, quantity: 2, image_url: "path/to/image1.jpg" },
  { id: 2, name: "Product 2", price: 15.49, quantity: 1, image_url: "path/to/image2.jpg" },
  { id: 3, name: "Product 3", price: 7.99, quantity: 3, image_url: "path/to/image3.jpg" }
];

const CartModal = ({ setShowCart }) => {
    const [closing, setClosing] = useState(false);
    const [cartItems, setCartItems] = useState(dummyProducts); // Using dummy products

    const onClose = () => {
        setClosing(true);
        setTimeout(() => {
            setShowCart(false);
        }, 500);
    };

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.keyCode === 27) {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    const calculateSubtotal = (item) => item.price * item.quantity;
    const calculateTotal = () => cartItems.reduce((total, item) => total + calculateSubtotal(item), 0);

    return (
        <div className='cart-modal-container'>
            <div className={`cart-modal-content ${closing ? 'slide-out' : ''}`}>
                <span className="close-modal" onClick={onClose}>&times;</span>
                <div className="cart-products">
                    {cartItems.map(item => (
                        <div className="cart-item" key={item.id}>
                            {/* Image and details */}
                            <div className="cart-item-details">
                                <div className="cart-item-name">{item.name}</div>
                                <div className="cart-item-price">${item.price}</div>
                                <div className="cart-item-quantity">Qty: {item.quantity}</div>
                                <div className="cart-item-subtotal">${calculateSubtotal(item)}</div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="cart-total">Total: ${calculateTotal().toFixed(2)}</div>
                <button className='button-87'>Finish Order</button>
            </div>
        </div>
    );
};

export default CartModal;