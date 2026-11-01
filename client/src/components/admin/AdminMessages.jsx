import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Spinner, Button, Modal, Form } from 'react-bootstrap';
import { FaEnvelope, FaEye, FaCheck, FaTrash, FaReply, FaSearch } from 'react-icons/fa';
import { useAuth } from '../../auth/context/AuthContext';
import api from '../../auth/Services/api';
import { toast } from 'react-toastify';
import AdminLayout from '../../components/admin/AdminLayout';
import '../../css/admin-dashboard.css';

const AdminMessages = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [messages, setMessages] = useState([]);
    const [filteredMessages, setFilteredMessages] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showReplyModal, setShowReplyModal] = useState(false);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchMessages();
    }, []);

    useEffect(() => {
        const filtered = messages.filter(msg =>
            msg.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            msg.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            msg.subject?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredMessages(filtered);
    }, [searchTerm, messages]);

    const fetchMessages = async () => {
        setLoading(true);
        try {
            const response = await api.get('/contact/admin/messages');
            setMessages(response.data.messages || []);
            setFilteredMessages(response.data.messages || []);
        } catch (error) {
            console.error('Error fetching messages:', error);
            toast.error('Failed to load messages');
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (messageId) => {
        try {
            await api.put(`/contact/admin/messages/${messageId}/read`);
            fetchMessages();
            toast.success('Message marked as read');
        } catch (error) {
            toast.error('Failed to mark as read');
        }
    };

    const deleteMessage = async (messageId) => {
        if (window.confirm('Are you sure you want to delete this message?')) {
            try {
                await api.delete(`/contact/admin/messages/${messageId}`);
                toast.success('Message deleted');
                fetchMessages();
            } catch (error) {
                toast.error('Failed to delete message');
            }
        }
    };

    const handleReply = async () => {
        if (!replyText.trim()) {
            toast.error('Please enter a reply');
            return;
        }

        setSubmitting(true);
        try {
            await api.post('/contact/admin/reply', {
                messageId: selectedMessage._id,
                reply: replyText,
                userEmail: selectedMessage.email,
                userName: selectedMessage.name
            });
            toast.success('Reply sent successfully!');
            setShowReplyModal(false);
            setReplyText('');
            setSelectedMessage(null);
            fetchMessages();
        } catch (error) {
            toast.error('Failed to send reply');
        } finally {
            setSubmitting(false);
        }
    };

    const getStatusBadge = (status) => {
        switch(status) {
            case 'read': return <Badge bg="secondary">Read</Badge>;
            case 'replied': return <Badge bg="success">Replied</Badge>;
            default: return <Badge bg="warning">Unread</Badge>;
        }
    };

    const getStatusIcon = (status) => {
        if (status === 'read') return <FaCheck className="text-secondary" />;
        if (status === 'replied') return <FaReply className="text-success" />;
        return <FaEnvelope className="text-warning" />;
    };

    if (loading) {
        return (
            <AdminLayout title="Contact Messages" subtitle="Manage customer inquiries">
                <div className="dashboard-loader">
                    <Spinner animation="border" variant="success" size="lg" />
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout title="Contact Messages" subtitle="Manage customer inquiries">
            {/* Search Bar */}
            <div className="search-filter-bar">
                <div className="search-box">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search by name, email or subject..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input-custom"
                    />
                </div>
            </div>

            {/* Statistics */}
            <div className="stats-grid-small" style={{ marginBottom: '20px' }}>
                <div className="stat-small-card">
                    <FaEnvelope className="stat-small-icon" />
                    <div>
                        <h4>{messages.length}</h4>
                        <span>Total Messages</span>
                    </div>
                </div>
                <div className="stat-small-card">
                    <Badge bg="warning" className="stat-small-badge">!</Badge>
                    <div>
                        <h4>{messages.filter(m => m.status === 'unread').length}</h4>
                        <span>Unread</span>
                    </div>
                </div>
                <div className="stat-small-card">
                    <FaReply className="stat-small-icon" style={{ color: '#28a745' }} />
                    <div>
                        <h4>{messages.filter(m => m.status === 'replied').length}</h4>
                        <span>Replied</span>
                    </div>
                </div>
            </div>

            {/* Messages Table */}
            <Card className="dashboard-card">
                <div className="card-header">
                    <h5><FaEnvelope /> All Messages ({filteredMessages.length})</h5>
                </div>
                <div className="card-body">
                    {filteredMessages.length === 0 ? (
                        <div className="empty-state">
                            <FaEnvelope className="empty-icon" />
                            <p>No messages found</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Status</th>
                                        <th>From</th>
                                        <th>Email</th>
                                        <th>Subject</th>
                                        <th>Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredMessages.map(msg => (
                                        <tr key={msg._id} style={{ 
                                            fontWeight: msg.status === 'unread' ? 'bold' : 'normal' 
                                        }}>
                                            <td>{getStatusBadge(msg.status)}</td>
                                            <td>{msg.name}</td>
                                            <td>{msg.email}</td>
                                            <td>{msg.subject}</td>
                                            <td>{new Date(msg.createdAt).toLocaleDateString()}</td>
                                            <td>
                                                <div className="action-buttons">
                                                    <Button 
                                                        size="sm" 
                                                        variant="info"
                                                        onClick={() => {
                                                            setSelectedMessage(msg);
                                                            setShowReplyModal(true);
                                                        }}
                                                        title="View & Reply"
                                                    >
                                                        <FaEye />
                                                    </Button>
                                                    {msg.status === 'unread' && (
                                                        <Button 
                                                            size="sm" 
                                                            variant="secondary"
                                                            onClick={() => markAsRead(msg._id)}
                                                            title="Mark as Read"
                                                        >
                                                            <FaCheck />
                                                        </Button>
                                                    )}
                                                    <Button 
                                                        size="sm" 
                                                        variant="danger"
                                                        onClick={() => deleteMessage(msg._id)}
                                                        title="Delete"
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

            {/* Reply Modal */}
            <Modal show={showReplyModal} onHide={() => {
                setShowReplyModal(false);
                setSelectedMessage(null);
                setReplyText('');
            }} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Reply to Message</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedMessage && (
                        <>
                            <div className="original-message" style={{ 
                                background: '#f8f9fa', 
                                padding: '15px', 
                                borderRadius: '8px',
                                marginBottom: '20px'
                            }}>
                                <p><strong>From:</strong> {selectedMessage.name} ({selectedMessage.email})</p>
                                <p><strong>Subject:</strong> {selectedMessage.subject}</p>
                                <p><strong>Message:</strong></p>
                                <p style={{ whiteSpace: 'pre-wrap' }}>{selectedMessage.message}</p>
                            </div>
                            
                            <Form.Group>
                                <Form.Label>Your Reply</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={6}
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    placeholder="Write your reply here..."
                                />
                            </Form.Group>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowReplyModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="success" onClick={handleReply} disabled={submitting}>
                        {submitting ? 'Sending...' : 'Send Reply'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </AdminLayout>
    );
};

export default AdminMessages;