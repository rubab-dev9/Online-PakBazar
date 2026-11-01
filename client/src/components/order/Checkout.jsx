import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../auth/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../auth/Services/api';
import '../../css/orders.css';

const Checkout = () => {
    const { cartItems, cartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [address, setAddress] = useState({
        fullName: user?.name || '',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
        landmark: ''
    });

    const [paymentMethod, setPaymentMethod] = useState('cod');

    const subtotal = cartTotal;
    const shippingFee = subtotal > 5000 ? 0 : 150;
    const totalAmount = subtotal + shippingFee;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!address.phone || !address.address || !address.city) {
            toast.error('Please fill all required fields');
            return;
        }

        setLoading(true);

        const orderData = {
            items: cartItems.map(item => ({
                product: item._id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.images?.[0]
            })),
            shippingAddress: address,
            paymentMethod,
            totalAmount
        };

        try {
            const { data } = await api.post('/orders/create', orderData);
            toast.success('Order placed successfully!');
            clearCart();
            navigate(`/order-success/${data.order._id}`);
        } catch (error) {
            console.error('Order error:', error);
            toast.error(error.response?.data?.message || 'Failed to place order');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="checkout-page">
            <Container className="py-5">
                {/* Checkout Header */}
                <div className="checkout-header">
                    <h3>Secure Checkout</h3>
                    <p>Complete your order with confidence</p>
                </div>

                <Row>
                    <Col lg={8}>
                        {/* Shipping Address Card */}
                        <Card className="checkout-card mb-4">
                            <Card.Header className="checkout-card-header">
                                <h5 className="mb-0">📦 Shipping Address</h5>
                            </Card.Header>
                            <Card.Body>
                                <Form className="checkout-form">
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Full Name *</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={address.fullName}
                                                    onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Phone Number *</Form.Label>
                                                <Form.Control
                                                    type="tel"
                                                    value={address.phone}
                                                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={12}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Address *</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="House No, Street, Area"
                                                    value={address.address}
                                                    onChange={(e) => setAddress({ ...address, address: e.target.value })}
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>City *</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={address.city}
                                                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Postal Code</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={address.postalCode}
                                                    onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </Form>
                            </Card.Body>
                        </Card>

                        {/* Payment Method Card */}
                        <Card className="checkout-card">
                            <Card.Header className="checkout-card-header">
                                <h5 className="mb-0">💳 Payment Method</h5>
                            </Card.Header>
                            <Card.Body>
                                <div className={`payment-method-card ${paymentMethod === 'cod' ? 'active' : ''}`}>
                                    <Form.Check
                                        type="radio"
                                        label="Cash on Delivery (COD)"
                                        name="payment"
                                        value="cod"
                                        checked={paymentMethod === 'cod'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                    />
                                    <small className="text-muted">Pay with cash when your order is delivered</small>
                                </div>
                                
                                <div className={`payment-method-card ${paymentMethod === 'bank_transfer' ? 'active' : ''}`}>
                                    <Form.Check
                                        type="radio"
                                        label="Bank Transfer (Manual)"
                                        name="payment"
                                        value="bank_transfer"
                                        checked={paymentMethod === 'bank_transfer'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                    />
                                    <small className="text-muted">Transfer payment to our bank account</small>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col lg={4}>
                        <div className="order-summary-card">
                            <div className="card-body">
                                <h5 className="summary-title">Order Summary</h5>

                                {cartItems.map(item => (
                                    <div key={item._id} className="summary-item">
                                        <span className="summary-item-name">
                                            {item.name} × {item.quantity}
                                        </span>
                                        <span className="summary-item-price">
                                            Rs. {(item.price * item.quantity).toLocaleString()}
                                        </span>
                                    </div>
                                ))}

                                <div className="summary-divider"></div>

                                <div className="summary-item">
                                    <span>Subtotal</span>
                                    <span>Rs. {subtotal.toLocaleString()}</span>
                                </div>

                                <div className="summary-item">
                                    <span>Shipping Fee</span>
                                    <span>
                                        {shippingFee === 0 ? 'Free' : `Rs. ${shippingFee.toLocaleString()}`}
                                    </span>
                                </div>

                                <div className="summary-divider"></div>

                                <div className="summary-total">
                                    <span>Total Amount</span>
                                    <span>Rs. {totalAmount.toLocaleString()}</span>
                                </div>

                                <button
                                    className="place-order-btn w-100"
                                    onClick={handleSubmit}
                                    disabled={loading || cartItems.length === 0}
                                >
                                    {loading ? 'Placing Order...' : 'Place Order (COD)'}
                                </button>

                                {subtotal < 5000 && (
                                    <small className="text-muted d-block text-center mt-3">
                                        Add Rs. {(5000 - subtotal).toLocaleString()} more for free delivery
                                    </small>
                                )}
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Checkout;