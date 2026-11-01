import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Spinner, Button, Modal } from 'react-bootstrap';
import { FaStore, FaSearch, FaCheckCircle, FaTimesCircle, FaEye } from 'react-icons/fa';
import { useAuth } from '../../auth/context/AuthContext';
import api from '../../auth/Services/api';
import { toast } from 'react-toastify';
import AdminLayout from '../../components/admin/AdminLayout';
import '../../css/admin-dashboard.css';

const AdminSuppliers = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [suppliers, setSuppliers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredSuppliers, setFilteredSuppliers] = useState([]);

    useEffect(() => {
        fetchSuppliers();
    }, []);

    useEffect(() => {
        const filtered = suppliers.filter(s => 
            s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.email?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredSuppliers(filtered);
    }, [searchTerm, suppliers]);

    const fetchSuppliers = async () => {
        setLoading(true);
        try {
            const [allSuppliers, pendingRes] = await Promise.all([
                api.get('/admin/users'),
                api.get('/admin/pending-suppliers')
            ]);
            const allUsers = allSuppliers.data.users || [];
            const suppliersList = allUsers.filter(u => u.role === 'supplier');
            setSuppliers(suppliersList);
            setFilteredSuppliers(suppliersList);
        } catch (error) {
            console.error('Error fetching suppliers:', error);
            toast.error('Failed to load suppliers');
        } finally {
            setLoading(false);
        }
    };

    const approveSupplier = async (supplierId) => {
        try {
            await api.put(`/admin/approve-supplier/${supplierId}`);
            toast.success('Supplier approved successfully');
            fetchSuppliers();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to approve supplier');
        }
    };

    if (loading) {
        return (
            <AdminLayout title="Suppliers" subtitle="Manage all suppliers">
                <div className="dashboard-loader">
                    <Spinner animation="border" variant="success" size="lg" />
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout title="Suppliers" subtitle="Manage all suppliers">
            <div className="search-filter-bar">
                <div className="search-box">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search suppliers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input-custom"
                    />
                </div>
            </div>

            <Card className="dashboard-card">
                <div className="card-header">
                    <h5><FaStore /> All Suppliers ({filteredSuppliers.length})</h5>
                </div>
                <div className="card-body">
                    {filteredSuppliers.length === 0 ? (
                        <div className="empty-state">
                            <p>No suppliers found</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Supplier</th>
                                        <th>Email</th>
                                        <th>Status</th>
                                        <th>Products</th>
                                        <th>Joined</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredSuppliers.map(s => (
                                        <tr key={s._id}>
                                            <td>
                                                <div className="supplier-cell">
                                                    <div className="supplier-avatar-small">
                                                        {s.name?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <strong>{s.name}</strong>
                                                </div>
                                            </td>
                                            <td>{s.email}</td>
                                            <td>
                                                {s.isApproved ? (
                                                    <Badge bg="success">Approved</Badge>
                                                ) : (
                                                    <Badge bg="warning">Pending</Badge>
                                                )}
                                            </td>
                                            <td>{s.productCount || 0}</td>
                                            <td>{new Date(s.createdAt).toLocaleDateString()}</td>
                                            <td>
                                                {!s.isApproved && (
                                                    <Button 
                                                        size="sm" 
                                                        variant="success"
                                                        onClick={() => approveSupplier(s._id)}
                                                    >
                                                        <FaCheckCircle /> Approve
                                                    </Button>
                                                )}
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

export default AdminSuppliers;