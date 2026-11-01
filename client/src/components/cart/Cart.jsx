import React from 'react';
import { Container, Row, Col, Card, Button, Table, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { FaTrash, FaShoppingCart, FaArrowLeft } from 'react-icons/fa';
import '../../css/cart.css';

const Cart = () => {
    const { cartItems, cartTotal, cartCount, removeFromCart, updateQuantity, clearCart } = useCart();

    if (cartItems.length === 0) {
        return (
            <div className="empty-cart">
                <Container>
                    <div className="empty-cart-content">
                        <FaShoppingCart className="empty-cart-icon" />
                        <h2>Your cart is empty</h2>
                        <p>Looks like you haven't added any items to your cart yet</p>
                        <Link to="/">
                            <Button variant="primary">Continue Shopping</Button>
                        </Link>
                    </div>
                </Container>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <Container className="py-5">
                <h1 className="cart-title">Shopping Cart ({cartCount} items)</h1>
                
                <Row>
                    <Col lg={8}>
                        <Card className="cart-items-card">
                            <div className="cart-header">
                                <div className="cart-header-product">Product</div>
                                <div className="cart-header-price">Price</div>
                                <div className="cart-header-quantity">Quantity</div>
                                <div className="cart-header-total">Total</div>
                                <div className="cart-header-action"></div>
                            </div>
                            
                            {cartItems.map(item => (
                                <div key={item._id} className="cart-item">
                                    <div className="cart-item-product">
                                        <Image 
                                            src={item.images?.[0] || '/images/placeholder-product.jpg'} 
                                            className="cart-item-image"
                                        />
                                        <div>
                                            <h6>{item.name}</h6>
                                            <small className="text-muted">{item.category}</small>
                                        </div>
                                    </div>
                                    <div className="cart-item-price">
                                        Rs. {item.price.toLocaleString()}
                                    </div>
                                    <div className="cart-item-quantity">
                                        <div className="quantity-control">
                                            <button 
                                                onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                                className="quantity-btn"
                                            >
                                                -
                                            </button>
                                            <span>{item.quantity}</span>
                                            <button 
                                                onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                                className="quantity-btn"
                                                disabled={item.quantity >= item.stock}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                    <div className="cart-item-total">
                                        Rs. {(item.price * item.quantity).toLocaleString()}
                                    </div>
                                    <div className="cart-item-action">
                                        <button 
                                            onClick={() => removeFromCart(item._id)}
                                            className="remove-item-btn"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            
                            <div className="cart-footer">
                                <Link to="/">
                                    <Button variant="light">
                                        <FaArrowLeft /> Continue Shopping
                                    </Button>
                                </Link>
                                <Button variant="danger" onClick={clearCart}>
                                    Clear Cart
                                </Button>
                            </div>
                        </Card>
                    </Col>
                    
                    <Col lg={4}>
                        <Card className="cart-summary-card">
                            <h4>Order Summary</h4>
                            <div className="summary-details">
                                <div className="summary-row">
                                    <span>Subtotal ({cartCount} items)</span>
                                    <span>Rs. {cartTotal.toLocaleString()}</span>
                                </div>
                                <div className="summary-row">
                                    <span>Delivery Fee</span>
                                    <span>Rs. 200</span>
                                </div>
                                <div className="summary-divider"></div>
                                <div className="summary-row total">
                                    <strong>Total Amount</strong>
                                    <strong>Rs. {(cartTotal + 200).toLocaleString()}</strong>
                                </div>
                            </div>
                            
                            <Link to="/checkout">
                                <Button variant="primary" className="checkout-btn">
                                    Proceed to Checkout
                                </Button>
                            </Link>
                            
                            <div className="payment-methods">
                                <p>We Accept:</p>
                                <div className="payment-icons">
                                    <span>Cash on Delivery</span>
                                    <span>Bank Transfer</span>
                                    <span>EasyPaisa</span>
                                </div>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Cart;