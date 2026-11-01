import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Spinner, Button, Modal } from 'react-bootstrap';
import { FaUsers, FaSearch, FaTrash, FaUserCheck, FaUserTimes, FaExclamationTriangle } from 'react-icons/fa';
import { useAuth } from '../../auth/context/AuthContext';
import api from '../../auth/Services/api';
import { toast } from 'react-toastify';
import AdminLayout from '../../components/admin/AdminLayout';
import '../../css/admin-dashboard.css';

const AdminUsers = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        const filtered = users.filter(u => 
            u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredUsers(filtered);
    }, [searchTerm, users]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await api.get('/admin/users');
            setUsers(response.data.users || []);
            setFilteredUsers(response.data.users || []);
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async () => {
        if (!selectedUser) return;
        
        setDeleting(true);
        try {
            await api.delete(`/admin/users/${selectedUser._id}`);
            toast.success(`${selectedUser.name} has been deleted successfully`);
            setShowDeleteModal(false);
            setSelectedUser(null);
            fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
            toast.error(error.response?.data?.message || 'Failed to delete user');
        } finally {
            setDeleting(false);
        }
    };

    const getRoleBadge = (role) => {
        const variants = {
            admin: 'danger',
            supplier: 'warning',
            customer: 'success'
        };
        return variants[role] || 'secondary';
    };

    if (loading) {
        return (
            <AdminLayout title="Users" subtitle="Manage all users">
                <div className="dashboard-loader">
                    <Spinner animation="border" variant="success" size="lg" />
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout title="Users" subtitle="Manage all users">
            <div className="search-filter-bar">
                <div className="search-box">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input-custom"
                    />
                </div>
            </div>

            <Card className="dashboard-card">
                <div className="card-header">
                    <h5><FaUsers /> All Users ({filteredUsers.length})</h5>
                </div>
                <div className="card-body">
                    {filteredUsers.length === 0 ? (
                        <div className="empty-state">
                            <p>No users found</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>User</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Joined</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map(u => (
                                        <tr key={u._id}>
                                            <td>
                                                <div className="user-cell">
                                                    <div className="user-avatar-small">
                                                        {u.name?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <strong>{u.name}</strong>
                                                </div>
                                            </td>
                                            <td>{u.email}</td>
                                            <td>
                                                <Badge bg={getRoleBadge(u.role)} className="role-badge">
                                                    {u.role}
                                                </Badge>
                                            </td>
                                            <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                                            <td>
                                                <div className="action-buttons">
                                                    <Button 
                                                        size="sm" 
                                                        variant="danger"
                                                        onClick={() => {
                                                            setSelectedUser(u);
                                                            setShowDeleteModal(true);
                                                        }}
                                                        disabled={u.role === 'admin' && u._id === user?._id}
                                                        title={u.role === 'admin' && u._id === user?._id ? "Cannot delete your own account" : "Delete user"}
                                                    >
                                                        <FaTrash />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </Card>

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <FaExclamationTriangle className="text-danger me-2" />
                        Confirm Delete
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to delete user <strong>"{selectedUser?.name}"</strong>?</p>
                    <p className="text-danger mb-0">This action cannot be undone. All data associated with this user will be permanently removed.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDeleteUser} disabled={deleting}>
                        {deleting ? 'Deleting...' : 'Yes, Delete User'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </AdminLayout>
    );
};

export default AdminUsers;