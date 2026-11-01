import React, { useState, useEffect } from 'react';
import { Card, Badge, Spinner, Button } from 'react-bootstrap';
import { FaStar, FaTrash, FaCheckCircle } from 'react-icons/fa';
import { useAuth } from '../../auth/context/AuthContext';
import api from '../../auth/Services/api';
import { toast } from 'react-toastify';
import AdminLayout from '../../components/admin/AdminLayout';
import '../../css/admin-dashboard.css';

const AdminReviews = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const response = await api.get('/admin/reviews');
            setReviews(response.data.reviews || []);
        } catch (error) {
            console.error('Error fetching reviews:', error);
            toast.error('Failed to load reviews');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (reviewId) => {
        if (window.confirm('Are you sure you want to delete this review?')) {
            try {
                await api.delete(`/admin/reviews/${reviewId}`);
                toast.success('Review deleted');
                fetchReviews();
            } catch (error) {
                toast.error('Failed to delete review');
            }
        }
    };

    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <FaStar key={i} className={i < rating ? 'star-filled' : 'star-empty'} />
        ));
    };

    if (loading) {
        return (
            <AdminLayout title="Reviews" subtitle="Manage customer reviews">
                <div className="dashboard-loader">
                    <Spinner animation="border" variant="success" size="lg" />
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout title="Reviews" subtitle="Manage customer reviews">
            <Card className="dashboard-card">
                <div className="card-header">
                    <h5>All Reviews ({reviews.length})</h5>
                </div>
                <div className="card-body">
                    {reviews.length === 0 ? (
                        <div className="empty-state">
                            <p>No reviews yet</p>
                        </div>
                    ) : (
                        <div className="reviews-list">
                            {reviews.map(review => (
                                <div key={review._id} className="review-item">
                                    <div className="review-header">
                                        <div>
                                            <strong>{review.user?.name}</strong>
                                            <div className="stars">{renderStars(review.rating)}</div>
                                        </div>
                                        <span className="review-date">
                                            {new Date(review.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <h6>{review.title}</h6>
                                    <p>{review.comment}</p>
                                    <div className="review-product">
                                        <small>Product: <strong>{review.product?.name}</strong></small>
                                    </div>
                                    <div className="review-footer">
                                        <Button variant="danger" size="sm" onClick={() => handleDelete(review._id)}>
                                            <FaTrash /> Delete
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </Card>
        </AdminLayout>
    );
};

export default AdminReviews;