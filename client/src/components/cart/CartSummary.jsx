import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../../css/cart.css';

const CartSummary = ({ cartItems, cartTotal, cartCount }) => {
    const deliveryFee = 200;
    const subtotal = cartTotal;
    const total = subtotal + deliveryFee;
    const freeDeliveryThreshold = 5000;
    const remainingForFreeDelivery = freeDeliveryThreshold - subtotal;

    return (
        <Card className="cart-summary-card">
            <Card.Body>
                <h4>Order Summary</h4>
                
                {remainingForFreeDelivery > 0 && subtotal > 0 && (
                    <div className="free-delivery-progress">
                        <p>Add Rs. {remainingForFreeDelivery.toLocaleString()} more for FREE delivery!</p>
                        <div className="progress">
                            <div 
                                className="progress-bar bg-success" 
                                style={{ width: `${(subtotal / freeDeliveryThreshold) * 100}%` }}
                            />
                        </div>
                    </div>
                )}
                
                <div className="summary-items">
                    <div className="summary-row">
                        <span>Subtotal ({cartCount} items)</span>
                        <span>Rs. {subtotal.toLocaleString()}</span>
                    </div>
                    <div className="summary-row">
                        <span>Delivery Fee</span>
                        <span>{subtotal >= freeDeliveryThreshold ? 'FREE' : `Rs. ${deliveryFee.toLocaleString()}`}</span>
                    </div>
                    <div className="summary-row">
                        <span>Discount</span>
                        <span>- Rs. 0</span>
                    </div>
                    <div className="summary-divider"></div>
                    <div className="summary-row total">
                        <strong>Total Amount</strong>
                        <strong>Rs. {(subtotal >= freeDeliveryThreshold ? subtotal : total).toLocaleString()}</strong>
                    </div>
                </div>
                
                <Link to="/checkout">
                    <Button variant="primary" className="checkout-btn w-100" size="lg">
                        Proceed to Checkout
                    </Button>
                </Link>
                
                <div className="payment-methods">
                    <p>Safe & Secure Payment</p>
                    <div className="payment-icons">
                        <span>💳 Card</span>
                        <span>💵 Cash on Delivery</span>
                        <span>📱 EasyPaisa</span>
                        <span>🏦 Bank Transfer</span>
                    </div>
                </div>
                
                <div className="delivery-info">
                    <p>🏷️ Free delivery available</p>
                    <p>🔄 7-day return policy</p>
                    <p>✅ 100% secure checkout</p>
                </div>
            </Card.Body>
        </Card>
    );
};

export default CartSummary;