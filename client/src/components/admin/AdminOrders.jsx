import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Spinner, Button, Row, Col, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaShoppingBag, FaSearch, FaEye, FaFilter } from 'react-icons/fa';
import { useAuth } from '../../auth/context/AuthContext';
import api from '../../auth/Services/api';
import { toast } from 'react-toastify';
import AdminLayout from '../../components/admin/AdminLayout';
import '../../css/admin-dashboard.css';

const AdminOrders = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [filters, setFilters] = useState({ status: 'all', search: '' });

    useEffect(() => {
        fetchOrders();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [filters, orders]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await api.get('/admin/recent-orders');
            setOrders(response.data.orders || []);
            setFilteredOrders(response.data.orders || []);
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = [...orders];
        if (filters.status !== 'all') {
            filtered = filtered.filter(o => o.orderStatus === filters.status);
        }
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            filtered = filtered.filter(o =>
                o.orderId?.toLowerCase().includes(searchLower) ||
                o.user?.name?.toLowerCase().includes(searchLower)
            );
        }
        setFilteredOrders(filtered);
    };

    const getStatusBadge = (status) => {
        const variants = {
            pending: 'warning', processing: 'info', shipped: 'primary',
            delivered: 'success', cancelled: 'danger'
        };
        return variants[status] || 'secondary';
    };

    if (loading) {
        return (
            <AdminLayout title="Orders" subtitle="Manage all orders">
                <div className="dashboard-loader">
                    <Spinner animation="border" variant="success" size="lg" />
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout title="Orders" subtitle="Manage all orders">
            <Row className="mb-4">
                <Col md={6}>
                    <div className="search-box">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search by Order ID or Customer..."
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                            className="search-input-custom"
                        />
                    </div>
                </Col>
                <Col md={6}>
                    <div className="filter-box">
                        <FaFilter className="filter-icon" />
                        <select
                            className="filter-select"
                            value={filters.status}
                            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                        >
                            <option value="all">All Orders</option>
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                </Col>
            </Row>

            <Card className="dashboard-card">
                <div className="card-header">
                    <h5><FaShoppingBag /> All Orders ({filteredOrders.length})</h5>
                </div>
                <div className="card-body">
                    {filteredOrders.length === 0 ? (
                        <div className="empty-state">
                            <p>No orders found</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Customer</th>
                                        <th>Amount</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredOrders.map(order => (
                                        <tr key={order._id}>
                                            <td><span className="order-id">#{order.orderId}</span></td>
                                            <td>{order.user?.name}</td>
                                            <td className="amount">₹{order.totalAmount?.toLocaleString()}</td>
                                            <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                            <td>
                                                <Badge bg={getStatusBadge(order.orderStatus)} className="status-badge">
                                                    {order.orderStatus}
                                                </Badge>
                                            </td>
                                            <td>
                                                <Button as={Link} to={`/orders/${order._id}`} size="sm" variant="outline-primary">
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
            </Card>
        </AdminLayout>
    );
};

export default AdminOrders;