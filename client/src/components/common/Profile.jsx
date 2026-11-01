import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { Container, Row, Col, Card, Form, Button, Badge, Spinner } from 'react-bootstrap';
import { useAuth } from '../../auth/context/AuthContext';
import { useProducts } from '../../context/ProductContext';
import { FaUser, FaEnvelope, FaPhone, FaMapMarker, FaSave, FaEdit, FaTimes, FaShoppingBag, FaHeart, FaStar, FaBox } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../../auth/Services/api';
import orderService from '../../services/orderService';
import '../../css/profile.css';

const Profile = () => {
    const { user, updateUser } = useAuth();
    const { wishlistCount } = useProducts(); // Get wishlist count from context
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [ordersCount, setOrdersCount] = useState(0);
    const [reviewsCount, setReviewsCount] = useState(0);
    const [ordersLoading, setOrdersLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        postalCode: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                address: user.address || '',
                city: user.city || '',
                postalCode: user.postalCode || ''
            });
        }
        fetchUserStats();
    }, [user]);

    const fetchUserStats = async () => {
        setLoading(true);
        try {
            // Fetch orders count
            const ordersResult = await orderService.getMyOrders();
            if (ordersResult.success) {
                setOrdersCount(ordersResult.orders.length);
            }
            
            // Reviews count - you can add this from your review service
            // const reviewsResult = await reviewService.getMyReviews();
            // if (reviewsResult.success) {
            //     setReviewsCount(reviewsResult.reviews.length);
            // }
            
            // For now, set a placeholder
            setReviewsCount(0);
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const { data } = await api.put('/users/profile', formData);
            updateUser(data.user);
            toast.success('Profile updated successfully!');
            setIsEditing(false);
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const getInitial = (name) => name?.charAt(0).toUpperCase();

    if (loading) {
        return (
            <div className="profile-page">
                <Container className="py-5">
                    <div className="text-center py-5">
                        <Spinner animation="border" variant="success" size="lg" />
                        <p className="mt-3 text-muted">Loading profile...</p>
                    </div>
                </Container>
            </div>
        );
    }

    return (
        <div className="profile-page">
            <Container className="py-5">
                <div className="profile-header">
                    <h2>My Profile</h2>
                    <p>Manage your account information</p>
                </div>

                <Row>
                    {/* Left Sidebar - Profile Card */}
                    <Col lg={4}>
                        <Card className="profile-sidebar">
                            <div className="profile-avatar-wrapper">
                                <div className="profile-avatar">
                                    {getInitial(formData.name)}
                                </div>
                            </div>
                            <div className="profile-user-info">
                                <h3>{formData.name}</h3>
                                <p className="user-email">{formData.email}</p>
                                <Badge className="user-role-badge">
                                    {user?.role?.toUpperCase()}
                                </Badge>
                            </div>
                            
                            {/* Clickable Stats - Now showing real data */}
                            <div className="profile-stats">
                                <Link to="/orders/my-orders" className="stat-card">
                                    <FaBox className="stat-icon" />
                                    <div className="stat-number">{ordersCount}</div>
                                    <div className="stat-text">Orders</div>
                                </Link>
                                <Link to="/wishlist" className="stat-card">
                                    <FaHeart className="stat-icon" />
                                    <div className="stat-number">{wishlistCount || 0}</div>
                                    <div className="stat-text">Wishlist</div>
                                </Link>
                                <div className="stat-card">
                                    <FaStar className="stat-icon" />
                                    <div className="stat-number">{reviewsCount}</div>
                                    <div className="stat-text">Reviews</div>
                                </div>
                            </div>
                        </Card>
                    </Col>

                    {/* Right Side - Profile Information */}
                    <Col lg={8}>
                        <Card className="profile-info-card">
                            <div className="card-header-custom">
                                <div className="header-left">
                                    <FaUser className="header-icon" />
                                    <h5>Profile Information</h5>
                                </div>
                                {!isEditing && (
                                    <Button 
                                        variant="outline-primary" 
                                        size="sm"
                                        onClick={() => setIsEditing(true)}
                                        className="edit-btn"
                                    >
                                        <FaEdit /> Edit Profile
                                    </Button>
                                )}
                            </div>

                            <div className="card-body-custom">
                                {isEditing ? (
                                    <Form onSubmit={handleSubmit} className="profile-form">
                                        <Row>
                                            <Col md={12}>
                                                <Form.Group className="form-group-custom">
                                                    <Form.Label>Full Name</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="name"
                                                        value={formData.name}
                                                        onChange={handleChange}
                                                        placeholder="Enter your full name"
                                                        required
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={12}>
                                                <Form.Group className="form-group-custom">
                                                    <Form.Label>Email Address</Form.Label>
                                                    <Form.Control
                                                        type="email"
                                                        name="email"
                                                        value={formData.email}
                                                        disabled
                                                        className="disabled-input"
                                                    />
                                                    <small className="form-hint">Email cannot be changed</small>
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group className="form-group-custom">
                                                    <Form.Label>Phone Number</Form.Label>
                                                    <Form.Control
                                                        type="tel"
                                                        name="phone"
                                                        value={formData.phone}
                                                        onChange={handleChange}
                                                        placeholder="Enter phone number"
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group className="form-group-custom">
                                                    <Form.Label>City</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="city"
                                                        value={formData.city}
                                                        onChange={handleChange}
                                                        placeholder="Enter city"
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={12}>
                                                <Form.Group className="form-group-custom">
                                                    <Form.Label>Address</Form.Label>
                                                    <Form.Control
                                                        as="textarea"
                                                        rows={3}
                                                        name="address"
                                                        value={formData.address}
                                                        onChange={handleChange}
                                                        placeholder="Enter your complete address"
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group className="form-group-custom">
                                                    <Form.Label>Postal Code</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="postalCode"
                                                        value={formData.postalCode}
                                                        onChange={handleChange}
                                                        placeholder="Enter postal code"
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <div className="form-actions">
                                            <Button type="submit" variant="success" disabled={loading} className="save-btn">
                                                <FaSave /> {loading ? 'Saving...' : 'Save Changes'}
                                            </Button>
                                            <Button 
                                                variant="light" 
                                                onClick={() => {
                                                    setIsEditing(false);
                                                    setFormData({
                                                        name: user?.name || '',
                                                        email: user?.email || '',
                                                        phone: user?.phone || '',
                                                        address: user?.address || '',
                                                        city: user?.city || '',
                                                        postalCode: user?.postalCode || ''
                                                    });
                                                }}
                                                className="cancel-btn"
                                            >
                                                <FaTimes /> Cancel
                                            </Button>
                                        </div>
                                    </Form>
                                ) : (
                                    <div className="profile-info-display">
                                        <div className="info-section">
                                            <div className="info-item">
                                                <div className="info-icon">
                                                    <FaUser />
                                                </div>
                                                <div className="info-content">
                                                    <label>Full Name</label>
                                                    <p>{formData.name}</p>
                                                </div>
                                            </div>
                                            <div className="info-item">
                                                <div className="info-icon">
                                                    <FaEnvelope />
                                                </div>
                                                <div className="info-content">
                                                    <label>Email Address</label>
                                                    <p>{formData.email}</p>
                                                </div>
                                            </div>
                                            <div className="info-item">
                                                <div className="info-icon">
                                                    <FaPhone />
                                                </div>
                                                <div className="info-content">
                                                    <label>Phone Number</label>
                                                    <p>{formData.phone || 'Not provided'}</p>
                                                </div>
                                            </div>
                                            <div className="info-item">
                                                <div className="info-icon">
                                                    <FaMapMarker />
                                                </div>
                                                <div className="info-content">
                                                    <label>Address</label>
                                                    <p>
                                                        {formData.address || 'Not provided'}
                                                        {formData.city && `, ${formData.city}`}
                                                        {formData.postalCode && ` - ${formData.postalCode}`}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Profile;