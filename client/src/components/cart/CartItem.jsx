import React from 'react';
import { Image } from 'react-bootstrap';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import '../../css/cart.css';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
    return (
        <div className="cart-item">
            <div className="cart-item-image">
                <Image 
                    src={item.images?.[0] || '/images/placeholder-product.jpg'} 
                    alt={item.name}
                />
            </div>
            <div className="cart-item-details">
                <h6 className="cart-item-name">{item.name}</h6>
                <span className="cart-item-category">{item.category}</span>
            </div>
            <div className="cart-item-price">
                Rs. {item.price.toLocaleString()}
            </div>
            <div className="cart-item-quantity">
                <div className="quantity-control">
                    <button 
                        onClick={() => onUpdateQuantity(item._id, item.quantity - 1)}
                        className="qty-btn"
                    >
                        <FaMinus />
                    </button>
                    <span className="qty-value">{item.quantity}</span>
                    <button 
                        onClick={() => onUpdateQuantity(item._id, item.quantity + 1)}
                        className="qty-btn"
                        disabled={item.quantity >= item.stock}
                    >
                        <FaPlus />
                    </button>
                </div>
            </div>
            <div className="cart-item-total">
                Rs. {(item.price * item.quantity).toLocaleString()}
            </div>
            <button className="cart-item-remove" onClick={() => onRemove(item._id)}>
                <FaTrash />
            </button>
        </div>
    );
};

export default CartItem;