import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Spinner } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import {
    FaTruck,
    FaCheckCircle,
    FaClock,
    FaBox,
    FaMapMarkerAlt,
    FaCreditCard,
    FaUser,
    FaPhoneAlt,
    FaCity,
    FaMailBulk
} from 'react-icons/fa';
import orderService from '../../services/orderService';
import '../../css/orders.css';

const OrderDetails = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrderDetails();

        // Auto-refresh every 30 seconds for real-time updates
        const interval = setInterval(() => {
            fetchOrderDetails();
            console.log('Auto-refreshed order status');
        }, 30000);

        return () => clearInterval(interval);
    }, [id]);

    const fetchOrderDetails = async () => {
        const result = await orderService.getOrderDetails(id);
        if (result.success) {
            setOrder(result.order);
        }
        setLoading(false);
    };

    const getStatusStep = (status) => {
        const steps = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
        const currentIndex = steps.indexOf(status);
        return steps.map((step, index) => ({
            step,
            isActive: index <= currentIndex && status !== 'cancelled',
            isCompleted: index < currentIndex
        }));
    };

    if (loading) return (
        <div className="order-details-page">
            <Container className="py-5 text-center">
                <Spinner animation="border" variant="success" />
            </Container>
        </div>
    );

    if (!order) return (
        <div className="order-details-page">
            <Container className="py-5">
                <h3>Order not found</h3>
                <Button as={Link} to="/" variant="success">Go Home</Button>
            </Container>
        </div>
    );

    const timelineSteps = getStatusStep(order.orderStatus);

    return (
        <div className="order-details-page">
            <Container>
                {/* Header */}
                <div className="order-details-header">
                    <h4 className="order-details-title">Order #{order.orderId}</h4>
                    <p className="order-details-subtitle">
                        Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                </div>

                {/* Timeline */}
                <div className="order-timeline">
                    <div className="timeline-steps">
                        {timelineSteps.map((step, idx) => (
                            <div key={idx} className={`timeline-step ${step.isActive ? 'active' : ''}`}>
                                <div className="step-circle">
                                    {step.isCompleted ? '✓' : idx + 1}
                                </div>
                                <div className="step-label">
                                    {step.step.toUpperCase()}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <Row>
                    <Col lg={8}>
                        {/* Products Table */}
                        <div className="products-table">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Price</th>
                                        <th>Quantity</th>
                                        <th>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {order.items.map((item, idx) => (
                                        <tr key={idx}>
                                            <td data-label="Product">
                                                <div className="product-image-cell">
                                                    <img
                                                        src={item.image || '/placeholder.jpg'}
                                                        alt={item.name}
                                                    />
                                                    <span>{item.name}</span>
                                                </div>
                                            </td>
                                            <td data-label="Price">Rs. {item.price.toLocaleString()}</td>
                                            <td data-label="Quantity">{item.quantity}</td>
                                            <td data-label="Total">Rs. {(item.price * item.quantity).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Col>

                    <Col lg={4}>
                        {/* Order Info */}
                        <div className="info-card">
                            <div className="info-card-title">
                                <FaBox /> Order Summary
                            </div>
                            <div className="info-row">
                                <span className="info-label">Subtotal:</span>
                                <span className="info-value">Rs. {order.subtotal.toLocaleString()}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Shipping:</span>
                                <span className="info-value">
                                    {order.shippingFee === 0 ? 'Free' : `Rs. ${order.shippingFee}`}
                                </span>
                            </div>
                            <hr />
                            <div className="info-row">
                                <span className="info-label"><strong>Total:</strong></span>
                                <span className="info-value text-success fw-bold">
                                    Rs. {order.totalAmount.toLocaleString()}
                                </span>
                            </div>
                        </div>

                        {/* Payment Info */}
                        <div className="info-card">
                            <div className="info-card-title">
                                <FaCreditCard /> Payment Method
                            </div>
                            <div className="info-row">
                                <span className="info-label">Method:</span>
                                <span className="info-value">Cash on Delivery</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Status:</span>
                                <span className="info-value">
                                    <Badge bg="warning">Pending</Badge>
                                </span>
                            </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="info-card">
                            <div className="info-card-title">
                                <FaMapMarkerAlt /> Shipping Address
                            </div>

                            <div className="shipping-details">

                                <div className="shipping-item">
                                    <FaUser className="shipping-icon" />
                                    <span>{order.shippingAddress.fullName}</span>
                                </div>

                                <div className="shipping-item">
                                    <FaPhoneAlt className="shipping-icon" />
                                    <span>{order.shippingAddress.phone}</span>
                                </div>

                                <div className="shipping-item">
                                    <FaMapMarkerAlt className="shipping-icon" />
                                    <span>{order.shippingAddress.address}</span>
                                </div>

                                <div className="shipping-item">
                                    <FaCity className="shipping-icon" />
                                    <span>
                                        {order.shippingAddress.city} - {order.shippingAddress.postalCode}
                                    </span>
                                </div>

                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default OrderDetails;