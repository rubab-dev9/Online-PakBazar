import React, { useEffect, useState } from 'react';
import { Container, Card, Button, Spinner } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import { FaCheckCircle, FaBox, FaHome, FaPrint, FaReceipt } from 'react-icons/fa';
import api from '../../auth/Services/api';
import '../../css/orders.css';

const OrderSuccess = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrderDetails();
    }, [orderId]);

    const fetchOrderDetails = async () => {
        try {
            const { data } = await api.get(`/orders/${orderId}`);
            setOrder(data.order);
        } catch (error) {
            console.error('Error fetching order:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return (
            <div className="order-success-page">
                <Container className="py-5 text-center">
                    <Spinner animation="border" variant="success" />
                    <p className="mt-3">Loading order details...</p>
                </Container>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="order-success-page">
                <Container className="py-5 text-center">
                    <h3>Order not found</h3>
                    <Button as={Link} to="/" variant="success">
                        Go Home
                    </Button>
                </Container>
            </div>
        );
    }

    return (
        <div className="order-success-page">
            <Container>
                <div className="success-animation">
                    <div className="success-icon">
                        <FaCheckCircle />
                    </div>
                    <h1 className="success-title">Order Placed Successfully!</h1>
                    <p className="success-message">
                        Thank you for your order. Your order ID is: <strong>{order.orderId}</strong>
                    </p>
                </div>

                <Card className="order-summary-card mx-auto" style={{ maxWidth: '600px' }}>
                    <Card.Body>
                        <h5 className="mb-3">Order Summary</h5>
                        
                        <div className="order-info-row">
                            <span className="order-info-label">Order ID:</span>
                            <span className="order-info-value"><strong>{order.orderId}</strong></span>
                        </div>
                        
                        <div className="order-info-row">
                            <span className="order-info-label">Total Amount:</span>
                            <span className="order-info-value"><strong className="text-success">Rs. {order.totalAmount?.toLocaleString()}</strong></span>
                        </div>
                        
                        <div className="order-info-row">
                            <span className="order-info-label">Payment Method:</span>
                            <span className="order-info-value"><strong>Cash on Delivery</strong></span>
                        </div>
                        
                        <div className="order-info-row">
                            <span className="order-info-label">Order Status:</span>
                            <span className="order-info-value">
                                <strong className="text-warning">{order.orderStatus?.toUpperCase()}</strong>
                            </span>
                        </div>
                        
                        <div className="order-info-row">
                            <span className="order-info-label">Delivery Address:</span>
                            <span className="order-info-value">
                                <strong>{order.shippingAddress?.city}, {order.shippingAddress?.address}</strong>
                            </span>
                        </div>
                    </Card.Body>
                </Card>

                <div className="success-action-buttons">
                    <Button onClick={handlePrint} className="btn-outline-order">
                        <FaPrint /> Print Receipt
                    </Button>
                    <Button as={Link} to="/orders/my-orders" className="btn-outline-order">
                        <FaReceipt /> My Orders
                    </Button>
                    <Button as={Link} to="/" className="btn-primary-order">
                        <FaHome /> Continue Shopping
                    </Button>
                </div>
            </Container>
        </div>
    );
};

export default OrderSuccess;