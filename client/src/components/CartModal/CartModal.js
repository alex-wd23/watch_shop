import React, { useState, useEffect } from 'react';
import './CartModal.css';
import { useCart } from '../../contexts/CartContext/CartContext.js';
import { useNavigate } from 'react-router-dom';

const dummyProducts = [
  { id: 1, name: "Product 1", price: 10.99, quantity: 2, image_url: "path/to/image1.jpg" },
  { id: 2, name: "Product 2", price: 15.49, quantity: 1, image_url: "path/to/image2.jpg" },
  { id: 3, name: "Product 3", price: 7.99, quantity: 3, image_url: "path/to/image3.jpg" }
];

const CartModal = ({ setShowCart }) => {

    
    const [closing, setClosing] = useState(false);
    // const [cartItems, setCartItems] = useState(dummyProducts); // Using dummy products
    const { cart } = useCart();
    const { dispatch } = useCart();
    const navigate = useNavigate();

    const handleCheckout = () => {
        navigate('/checkout'); // Navigate to the checkout page
      };
    

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

    const addToCart = (itemId) => {
        // Find the full product object based on itemId
        const productToAdd = cart.items.find(product => product.id === itemId);
        if (productToAdd) {
            dispatch({ type: 'ADD_ITEM', payload: productToAdd });
        }
    };
    

    const removeFromCart = (itemId) => {
        dispatch({ type: 'REMOVE_ITEM', payload: itemId });
      };
    
    useEffect(() => {
        if (cart.items.length === 0) {
            onClose();  
        }
    }, [cart.items.length, onClose]);

    const hasItemsInCart = cart.items && cart.items.length > 0;
    const calculateTotal = () => cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);

    return (
        <div className='cart-modal-container'>
            <div className={`cart-modal-content ${closing ? 'slide-out' : ''}`}>
                <span className="close-modal" onClick={onClose}>&times;</span>
                <div className="cart-products">
                {cart.items.map(item => (
                <div className="cart-item" key={item.id}>
                    <img src={item.image_url} alt={item.name} className="cart-item-image" />
                    <div className="cart-item-details">
                        <div className="cart-item-name">{item.name}</div>
                        <div className="cart-item-description">{item.description}</div> {/* Assuming description is a field in your product object */}
                        <div className="cart-item-price">${(item.price * item.quantity).toFixed(2)}</div>
                        <div className="quantity-control">
                        <p className="quantity-button" onClick={() => removeFromCart(item.id)}>-</p>
                        <div className="quantity-display">{item.quantity}</div>
                        <p className="quantity-button" onClick={() => addToCart(item.id)}>+</p>
                        </div>
                    </div>
                </div>
                ))}
                </div>
                <div className="cart-total">Total: ${calculateTotal().toFixed(2)}</div>
                <button className='button-87' onClick={handleCheckout}>Checkout</button>
            </div>
        </div>
    );
};

export default CartModal;