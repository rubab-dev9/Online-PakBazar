import React, { useState, useEffect } from 'react';
import { Card, Badge, Spinner, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import {
    FaBox, FaShoppingBag, FaRupeeSign, FaStar, 
    FaTruck, FaChartLine, FaCalendarAlt,
    FaArrowUp, FaShoppingCart, FaUsers, FaPercent
} from 'react-icons/fa';
import { useAuth } from '../../auth/context/AuthContext';
import api from '../../auth/Services/api';
import { toast } from 'react-toastify';
import SupplierLayout from './SupplierLayout';
import '../../css/supplier-dashboard.css';

const SupplierDashboard = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: 0,
        averageRating: 0,
        pendingOrders: 0
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [topProducts, setTopProducts] = useState([]);

    useEffect(() => {
        if (user?.role !== 'supplier') {
            toast.error('Access denied. Supplier only.');
        }
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const [statsRes, ordersRes, productsRes] = await Promise.all([
                api.get('/supplier/stats'),
                api.get('/supplier/recent-orders'),
                api.get('/supplier/top-products')
            ]);
            setStats(statsRes.data);
            setRecentOrders(ordersRes.data.orders || []);
            setTopProducts(productsRes.data.products || []);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            toast.error('Failed to load dashboard');
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId, status) => {
        try {
            await api.put(`/supplier/orders/${orderId}/status`, { status });
            toast.success(`Order ${status} updated`);
            fetchDashboardData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update order status');
        }
    };

    const getStatusBadge = (status) => {
        const variants = {
            pending: 'warning',
            processing: 'info',
            shipped: 'primary',
            delivered: 'success',
            cancelled: 'danger'
        };
        return variants[status] || 'secondary';
    };

    if (loading) {
        return (
            <SupplierLayout title="Dashboard" subtitle="Loading...">
                <div className="dashboard-loader">
                    <Spinner animation="border" variant="success" size="lg" />
                </div>
            </SupplierLayout>
        );
    }

    return (
        <SupplierLayout title="Dashboard" subtitle={`Welcome back, ${user?.name?.split(' ')[0]}!`}>
            {/* Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon bg-primary">
                        <FaBox />
                    </div>
                    <div className="stat-info">
                        <h3>{stats.totalProducts}</h3>
                        <p>Total Products</p>
                    </div>
                    <div className="stat-change up">
                        <FaArrowUp /> +12%
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon bg-success">
                        <FaShoppingBag />
                    </div>
                    <div className="stat-info">
                        <h3>{stats.totalOrders}</h3>
                        <p>Total Orders</p>
                    </div>
                    <div className="stat-change up">
                        <FaArrowUp /> +8%
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon bg-warning">
                        <FaRupeeSign />
                    </div>
                    <div className="stat-info">
                        <h3>₹{stats.totalRevenue?.toLocaleString()}</h3>
                        <p>Total Revenue</p>
                    </div>
                    <div className="stat-change up">
                        <FaArrowUp /> +15%
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon bg-info">
                        <FaStar />
                    </div>
                    <div className="stat-info">
                        <h3>{stats.averageRating?.toFixed(1)} ★</h3>
                        <p>Average Rating</p>
                    </div>
                    <div className="stat-change neutral">
                        {stats.averageRating?.toFixed(1)} / 5
                    </div>
                </div>
            </div>

            {/* Second Row Stats */}
            <div className="stats-grid-small">
                <div className="stat-small-card">
                    <FaShoppingCart className="stat-small-icon" />
                    <div>
                        <h4>{stats.pendingOrders}</h4>
                        <span>Pending Orders</span>
                    </div>
                </div>
                <div className="stat-small-card">
                    <FaUsers className="stat-small-icon" />
                    <div>
                        <h4>{stats.totalCustomers}</h4>
                        <span>Total Customers</span>
                    </div>
                </div>
            </div>

            {/* Recent Orders & Top Products */}
            <div className="dashboard-row">
                <div className="dashboard-col lg-8">
                    <div className="dashboard-card">
                        <div className="card-header">
                            <h5><FaTruck /> Recent Orders</h5>
                            <Link to="/supplier/orders" className="view-all-link">View All Orders →</Link>
                        </div>
                        <div className="card-body">
                            {recentOrders.length === 0 ? (
                                <div className="empty-state">
                                    <FaShoppingBag className="empty-icon" />
                                    <p>No orders yet</p>
                                </div>
                            ) : (
                                <div className="orders-list">
                                    {recentOrders.slice(0, 5).map(order => (
                                        <div key={order._id} className="order-item">
                                            <div className="order-info">
                                                <span className="order-id">#{order.orderId}</span>
                                                <span className="order-product">{order.productName}</span>
                                                <span className="order-qty">Qty: {order.quantity}</span>
                                                <span className="order-amount">₹{order.amount?.toLocaleString()}</span>
                                            </div>
                                            <div className="order-status">
                                                <Badge bg={getStatusBadge(order.status)}>
                                                    {order.status}
                                                </Badge>
                                                <select
                                                    className="status-select-small"
                                                    value={order.status}
                                                    onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="processing">Processing</option>
                                                    <option value="shipped">Shipped</option>
                                                    <option value="delivered">Delivered</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="dashboard-col lg-4">
                    <div className="dashboard-card">
                        <div className="card-header">
                            <h5><FaChartLine /> Top Products</h5>
                        </div>
                        <div className="card-body">
                            {topProducts.length === 0 ? (
                                <div className="empty-state small">
                                    <p>No products sold yet</p>
                                </div>
                            ) : (
                                <div className="top-products-list">
                                    {topProducts.map(product => (
                                        <div key={product._id} className="top-product-item">
                                            <img src={product.images?.[0] || '/placeholder.jpg'} alt={product.name} />
                                            <div className="product-details">
                                                <h6>{product.name}</h6>
                                                <span>{product.totalSold} units sold</span>
                                            </div>
                                            <div className="product-revenue">
                                                ₹{product.revenue?.toLocaleString()}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </SupplierLayout>
    );
};

export default SupplierDashboard;