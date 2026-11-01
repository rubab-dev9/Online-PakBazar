import React, { useState, useEffect } from 'react';
import { Container, Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaBox, FaEye, FaBan, FaShoppingBag, FaReceipt } from 'react-icons/fa';
import orderService from '../../services/orderService';
import { toast } from 'react-toastify';
import '../../css/orders.css';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        const result = await orderService.getMyOrders();
        if (result.success) {
            setOrders(result.orders);
        }
        setLoading(false);
    };

    const cancelOrder = async (orderId) => {
        if (window.confirm('Are you sure you want to cancel this order?')) {
            const result = await orderService.cancelOrder(orderId);
            if (result.success) {
                toast.success('Order cancelled successfully');
                fetchOrders();
            } else {
                toast.error(result.message);
            }
        }
    };

    const getStatusClass = (status) => {
        return `order-status-badge status-${status}`;
    };

    if (loading) {
        return (
            <div className="my-orders-page">
                <Container className="py-5 text-center">
                    <Spinner animation="border" variant="success" />
                    <p className="mt-3 text-muted">Loading orders...</p>
                </Container>
            </div>
        );
    }

    return (
        <div className="my-orders-page">
            <Container>
                <div className="orders-header">
                    <h2>My Orders</h2>
                    <div className="orders-stats">
                        <span className="stat-badge">
                            <FaReceipt /> Total: {orders.length}
                        </span>
                    </div>
                </div>

                {orders.length === 0 ? (
                    <div className="empty-orders">
                        <div className="empty-orders-icon">
                            <FaShoppingBag />
                        </div>
                        <h4>No Orders Yet</h4>
                        <p>Start shopping to see your orders here</p>
                        <Button as={Link} to="/products" className="btn-primary-order">
                            Start Shopping
                        </Button>
                    </div>
                ) : (
                    orders.map((order) => (
                        <div key={order._id} className="order-card">
                            <div className="order-card-header">
                                <div className="order-id">
                                    Order #{order.orderId}
                                    <small> | {new Date(order.createdAt).toLocaleDateString()}</small>
                                </div>
                                <div className={getStatusClass(order.orderStatus)}>
                                    {order.orderStatus.toUpperCase()}
                                </div>
                            </div>

                            <div className="order-card-body">
                                <div className="order-items-preview">
                                    {order.items.slice(0, 3).map((item, idx) => (
                                        <div key={idx} className="order-item-preview">
                                            <img 
                                                src={item.image || '/placeholder.jpg'} 
                                                alt={item.name}
                                                onError={(e) => {
                                                    e.target.src = '/placeholder.jpg';
                                                }}
                                            />
                                            <span>{item.name} × {item.quantity}</span>
                                        </div>
                                    ))}
                                    {order.items.length > 3 && (
                                        <small className="text-muted">+{order.items.length - 3} more items</small>
                                    )}
                                </div>
                                <div className="order-total">
                                    <div className="label">Total Amount</div>
                                    <div className="amount">Rs. {order.totalAmount.toLocaleString()}</div>
                                </div>
                            </div>

                            <div className="order-card-footer">
                                <Button 
                                    as={Link} 
                                    to={`/orders/${order._id}`}
                                    className="btn-outline-order"
                                >
                                    <FaEye /> View Details
                                </Button>
                                {order.orderStatus === 'pending' && (
                                    <Button 
                                        className="btn-outline-danger"
                                        onClick={() => cancelOrder(order._id)}
                                    >
                                        <FaBan /> Cancel Order
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </Container>
        </div>
    );
};

export default MyOrders;