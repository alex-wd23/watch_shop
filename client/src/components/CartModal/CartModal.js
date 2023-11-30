import React from 'react'
import './CartModal.css'

const CartModal = ( {setShowCart} ) => {

  const onClose = () => {
    setShowCart(false);
  }

  return (
    <div className='cart-modal-container'>
      <div className="cart-modal-content">
        <span className="close-modal" onClick={onClose}>&times;</span>
        {/* Add your cart modal content here */}
      </div>
    </div>
  )
}

export default CartModal