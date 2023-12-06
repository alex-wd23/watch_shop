import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM':
      const existingAddItem = state.items.find(item => item.id === action.payload.id);
      if (existingAddItem) {
        // Increase the quantity of the existing item
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id ? { ...item, quantity: item.quantity + 1 } : item
          )
        };
      } else {
        // Add a new item with a quantity of 1
        return {
          ...state,
          items: [...state.items, { ...action.payload, quantity: 1 }]
        };
      }

    case 'REMOVE_ITEM':
      const existingRemoveItem = state.items.find(item => item.id === action.payload);
      if (existingRemoveItem && existingRemoveItem.quantity > 1) {
        // Decrease the quantity if more than 1
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload ? { ...item, quantity: item.quantity - 1 } : item
          )
        };
      } else {
        // Remove the item entirely if quantity is 1
        return {
          ...state,
          items: state.items.filter(item => item.id !== action.payload)
        };
      }

    // ... other actions
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {

  const [cart, dispatch] = useReducer(cartReducer, { items: [] }, () => {
    // Load the cart from local storage
    const localData = localStorage.getItem('cart');
    return localData ? JSON.parse(localData) : { items: [] };
  });

  useEffect(() => {
      // Save the cart to local storage
      localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  return (
    <CartContext.Provider value={{ cart, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);