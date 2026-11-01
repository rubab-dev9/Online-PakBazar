import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Badge, Spinner, Button, Row, Col, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaEye, FaTruck, FaSearch, FaFilter, FaSyncAlt } from 'react-icons/fa';
import { useAuth } from '../../auth/context/AuthContext';
import api from '../../auth/Services/api';
import { toast } from 'react-toastify';
import SupplierLayout from './SupplierLayout';
import '../../css/supplier-dashboard.css';

const SupplierOrders = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [filters, setFilters] = useState({
        status: 'all',
        search: ''
    });

    useEffect(() => {
        if (user?.role !== 'supplier') {
            toast.error('Access denied. Supplier only.');
        }
        fetchOrders();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [filters, orders]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await api.get('/supplier/recent-orders');
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

        // Status filter
        if (filters.status !== 'all') {
            filtered = filtered.filter(order => order.status === filters.status);
        }

        // Search filter
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            filtered = filtered.filter(order =>
                order.orderId?.toLowerCase().includes(searchLower) ||
                order.productName?.toLowerCase().includes(searchLower) ||
                order.customer?.toLowerCase().includes(searchLower)
            );
        }

        setFilteredOrders(filtered);
    };

    const updateOrderStatus = async (orderId, status) => {
        try {
            await api.put(`/supplier/orders/${orderId}/status`, { status });
            toast.success(`Order ${status} updated`);
            fetchOrders();
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

    const getStatusCount = (status) => {
        if (status === 'all') return orders.length;
        return orders.filter(order => order.status === status).length;
    };

    if (loading) {
        return (
            <SupplierLayout title="My Orders" subtitle="Manage your orders">
                <div className="text-center py-5">
                    <div className="dashboard-loader">
                        <Spinner animation="border" variant="success" size="lg" />
                    </div>
                </div>
            </SupplierLayout>
        );
    }

    return (
        <SupplierLayout title="My Orders" subtitle="Manage your orders">
            <div className="supplier-dashboard">
                <Container fluid className="px-4">
                    {/* Header */}
                    <div className="dashboard-header">
                        <div>
                            <h2>All Orders</h2>
                            <p>Manage and track all your customer orders</p>
                        </div>
                        <Button variant="outline-success" onClick={fetchOrders}>
                            <FaSyncAlt /> Refresh
                        </Button>
                    </div>

                    {/* Stats Summary */}
                    <Row className="stats-row mb-4">
                        <Col>
                            <div className="stat-summary" onClick={() => setFilters({ ...filters, status: 'all' })}>
                                <h4>{orders.length}</h4>
                                <span>Total Orders</span>
                            </div>
                        </Col>
                        <Col>
                            <div className="stat-summary pending" onClick={() => setFilters({ ...filters, status: 'pending' })}>
                                <h4>{getStatusCount('pending')}</h4>
                                <span>Pending</span>
                            </div>
                        </Col>
                        <Col>
                            <div className="stat-summary processing" onClick={() => setFilters({ ...filters, status: 'processing' })}>
                                <h4>{getStatusCount('processing')}</h4>
                                <span>Processing</span>
                            </div>
                        </Col>
                        <Col>
                            <div className="stat-summary shipped" onClick={() => setFilters({ ...filters, status: 'shipped' })}>
                                <h4>{getStatusCount('shipped')}</h4>
                                <span>Shipped</span>
                            </div>
                        </Col>
                        <Col>
                            <div className="stat-summary delivered" onClick={() => setFilters({ ...filters, status: 'delivered' })}>
                                <h4>{getStatusCount('delivered')}</h4>
                                <span>Delivered</span>
                            </div>
                        </Col>
                        <Col>
                            <div className="stat-summary cancelled" onClick={() => setFilters({ ...filters, status: 'cancelled' })}>
                                <h4>{getStatusCount('cancelled')}</h4>
                                <span>Cancelled</span>
                            </div>
                        </Col>
                    </Row>

                    {/* Filters */}
                    <Card className="dashboard-card mb-4">
                        <Card.Body>
                            <Row>
                                <Col md={6}>
                                    <div className="search-box">
                                        <FaSearch className="search-icon" />
                                        <input
                                            type="text"
                                            placeholder="Search by Order ID, Product or Customer..."
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
                        </Card.Body>
                    </Card>

                    {/* Orders Table */}
                    <Card className="dashboard-card">
                        <div className="card-header">
                            <h5><FaTruck /> All Orders ({filteredOrders.length})</h5>
                        </div>
                        <div className="card-body">
                            {filteredOrders.length === 0 ? (
                                <div className="empty-state">
                                    <FaTruck className="empty-icon" />
                                    <p>No orders found</p>
                                    <span>Try changing your filters</span>
                                </div>
                            ) : (
                                <div className="orders-table">
                                    <table className="data-table">
                                        <thead>
                                            <tr>
                                                <th>Order ID</th>
                                                <th>Product</th>
                                                <th>Customer</th>
                                                <th>Qty</th>
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
                                                    <td>{order.productName}</td>
                                                    <td>{order.customer || 'N/A'}</td>
                                                    <td>{order.quantity}</td>
                                                    <td className="amount">₹{order.amount?.toLocaleString()}</td>
                                                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                                    <td>
                                                        <Badge bg={getStatusBadge(order.status)} className="status-badge">
                                                            {order.status}
                                                        </Badge>
                                                    </td>
                                                    <td>
                                                        <select
                                                            className="status-select"
                                                            value={order.status}
                                                            onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                                        >
                                                            <option value="pending">Pending</option>
                                                            <option value="processing">Processing</option>
                                                            <option value="shipped">Shipped</option>
                                                            <option value="delivered">Delivered</option>
                                                            <option value="cancelled">Cancelled</option>
                                                        </select>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </Card>
                </Container>
            </div>
        </SupplierLayout>
    );
};

export default SupplierOrders;