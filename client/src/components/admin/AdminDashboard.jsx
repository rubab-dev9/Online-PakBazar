import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Table, Badge, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import {
    FaUsers, FaBox, FaShoppingBag, FaRupeeSign, FaEye, FaCheckCircle, 
    FaStore, FaClock, FaUserPlus, FaTruck, FaCalendarAlt
} from 'react-icons/fa';
import { useAuth } from '../../auth/context/AuthContext';
import api from '../../auth/Services/api';
import { toast } from 'react-toastify';
import AdminLayout from '../../components/admin/AdminLayout';
import '../../css/admin-dashboard.css';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalSuppliers: 0,
        totalCustomers: 0,
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: 0,
        pendingOrders: 0
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [pendingSuppliersList, setPendingSuppliersList] = useState([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const [statsRes, ordersRes, suppliersRes] = await Promise.all([
                api.get('/admin/stats'),
                api.get('/admin/recent-orders'),
                api.get('/admin/pending-suppliers')
            ]);
            setStats(statsRes.data);
            setRecentOrders(ordersRes.data.orders || []);
            setPendingSuppliersList(suppliersRes.data.suppliers || []);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            toast.error('Failed to load dashboard');
        } finally {
            setLoading(false);
        }
    };

    const approveSupplier = async (supplierId) => {
        try {
            await api.put(`/admin/approve-supplier/${supplierId}`);
            toast.success('Supplier approved successfully');
            fetchDashboardData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to approve supplier');
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
            <AdminLayout title="Dashboard" subtitle="Loading...">
                <div className="dashboard-loader">
                    <Spinner animation="border" variant="success" size="lg" />
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout title="Dashboard" subtitle={`Welcome back, ${user?.name?.split(' ')[0]}!`}>
            {/* Stats Grid */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#3b82f6' }}>
                        <FaUsers />
                    </div>
                    <div className="stat-info">
                        <h3>{stats.totalUsers}</h3>
                        <p>Total Users</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#10b981' }}>
                        <FaStore />
                    </div>
                    <div className="stat-info">
                        <h3>{stats.totalSuppliers}</h3>
                        <p>Suppliers</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#8b5cf6' }}>
                        <FaBox />
                    </div>
                    <div className="stat-info">
                        <h3>{stats.totalProducts}</h3>
                        <p>Products</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#f59e0b' }}>
                        <FaShoppingBag />
                    </div>
                    <div className="stat-info">
                        <h3>{stats.totalOrders}</h3>
                        <p>Orders</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#ef4444' }}>
                        <FaRupeeSign />
                    </div>
                    <div className="stat-info">
                        <h3>₹{stats.totalRevenue?.toLocaleString()}</h3>
                        <p>Revenue</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#06b6d4' }}>
                        <FaClock />
                    </div>
                    <div className="stat-info">
                        <h3>{stats.pendingOrders}</h3>
                        <p>Pending Orders</p>
                    </div>
                </div>
            </div>

            <div className="dashboard-row">
                {/* Recent Orders Table */}
                <div className="dashboard-col lg-8">
                    <div className="dashboard-card">
                        <div className="card-header">
                            <h5><FaTruck /> Recent Orders</h5>
                            <Link to="/admin/orders" className="view-all-link">View All →</Link>
                        </div>
                        <div className="card-body">
                            {recentOrders.length === 0 ? (
                                <div className="empty-state">
                                    <p>No orders yet</p>
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="data-table">
                                        <thead>
                                            <tr>
                                                <th>Order ID</th>
                                                <th>Customer</th>
                                                <th>Amount</th>
                                                <th>Status</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {recentOrders.map(order => (
                                                <tr key={order._id}>
                                                    <td><span className="order-id">#{order.orderId}</span></td>
                                                    <td>{order.user?.name}</td>
                                                    <td className="amount">₹{order.totalAmount?.toLocaleString()}</td>
                                                    <td>
                                                        <Badge bg={getStatusBadge(order.orderStatus)} className="status-badge">
                                                            {order.orderStatus}
                                                        </Badge>
                                                    </td>
                                                    <td>
                                                        <Button as={Link} to={`/orders/${order._id}`} variant="link" className="view-btn">
                                                            <FaEye /> View
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Pending Suppliers */}
                <div className="dashboard-col lg-4">
                    <div className="dashboard-card">
                        <div className="card-header">
                            <h5><FaUserPlus /> Pending Approval</h5>
                        </div>
                        <div className="card-body">
                            {pendingSuppliersList.length === 0 ? (
                                <div className="empty-state">
                                    <FaCheckCircle className="empty-icon" />
                                    <p>No pending suppliers</p>
                                </div>
                            ) : (
                                <div className="suppliers-list">
                                    {pendingSuppliersList.map(supplier => (
                                        <div key={supplier._id} className="supplier-item">
                                            <div className="supplier-avatar">
                                                {supplier.name?.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="supplier-details">
                                                <h6>{supplier.name}</h6>
                                                <span>{supplier.email}</span>
                                            </div>
                                            <Button 
                                                size="sm" 
                                                className="approve-btn"
                                                onClick={() => approveSupplier(supplier._id)}
                                            >
                                                <FaCheckCircle /> Approve
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;