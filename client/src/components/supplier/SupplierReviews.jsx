import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Spinner, Button, Modal, Form } from 'react-bootstrap';
import { FaStar, FaReply, FaChartLine } from 'react-icons/fa';
import { useAuth } from '../../auth/context/AuthContext';
import api from '../../auth/Services/api';
import { toast } from 'react-toastify';
import SupplierLayout from './SupplierLayout';
import '../../css/supplier-dashboard.css';

const SupplierReviews = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState([]);
    const [stats, setStats] = useState({
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    });
    const [showReplyModal, setShowReplyModal] = useState(false);
    const [selectedReview, setSelectedReview] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const [reviewsRes, statsRes] = await Promise.all([
                api.get('/supplier/reviews'),
                api.get('/supplier/reviews/stats')
            ]);

            console.log('Reviews Response:', reviewsRes.data);
            console.log('Reviews with replies:', reviewsRes.data.reviews?.filter(r => r.supplierReply).length);

            // Log each review to see if supplierReply exists
            reviewsRes.data.reviews?.forEach(review => {
                console.log(`Review ${review._id}: hasReply = ${!!review.supplierReply}`);
            });

            setReviews(reviewsRes.data.reviews || []);
            setStats({
                averageRating: statsRes.data.stats?.averageRating || 0,
                totalReviews: statsRes.data.stats?.totalReviews || 0,
                ratingDistribution: statsRes.data.stats?.ratingDistribution || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
            });
        } catch (error) {
            console.error('Error fetching reviews:', error);
            toast.error('Failed to load reviews');
        } finally {
            setLoading(false);
        }
    };

    const handleReplySubmit = async () => {
        if (!replyText.trim()) {
            toast.error('Please enter a reply');
            return;
        }

        setSubmitting(true);
        try {
            await api.put(`/supplier/reviews/${selectedReview._id}/reply`, { reply: replyText });
            toast.success('Reply added successfully');
            setShowReplyModal(false);
            setReplyText('');
            setSelectedReview(null);
            fetchReviews();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add reply');
        } finally {
            setSubmitting(false);
        }
    };

    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <FaStar key={i} className={i < rating ? 'star-filled' : 'star-empty'} />
        ));
    };

    if (loading) {
        return (
            <SupplierLayout title="Reviews" subtitle="Manage customer reviews">
                <div className="dashboard-loader">
                    <Spinner animation="border" variant="success" size="lg" />
                </div>
            </SupplierLayout>
        );
    }

    return (
        <SupplierLayout title="Reviews" subtitle="Manage customer reviews">
            {/* Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon bg-warning">
                        <FaStar />
                    </div>
                    <div className="stat-info">
                        <h3>{stats.averageRating || 0} ★</h3>
                        <p>Average Rating</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon bg-primary">
                        <FaChartLine />
                    </div>
                    <div className="stat-info">
                        <h3>{stats.totalReviews || 0}</h3>
                        <p>Total Reviews</p>
                    </div>
                </div>
            </div>

            {/* Rating Distribution */}
            <Card className="dashboard-card mb-4">
                <div className="card-header">
                    <h5>Rating Distribution</h5>
                </div>
                <Card.Body>
                    {[5, 4, 3, 2, 1].map(star => {
                        const count = stats.ratingDistribution?.[star] || 0;
                        const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
                        return (
                            <div key={star} className="rating-distribution-item">
                                <span className="star-label">{star} ★</span>
                                <div className="progress-bar">
                                    <div className="progress-fill" style={{ width: `${percentage}%` }} />
                                </div>
                                <span className="count">{count}</span>
                            </div>
                        );
                    })}
                </Card.Body>
            </Card>

            {/* Reviews List */}
            <Card className="dashboard-card">
                <div className="card-header">
                    <h5>Customer Reviews</h5>
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

                                    {/* Product info */}
                                    <div className="review-product">
                                        <small>Product: <strong>{review.product?.name}</strong></small>
                                    </div>

                                    {/* Supplier Reply */}
                                    {review.supplierReply && review.supplierReply.text ? (
                                        <div className="supplier-reply">
                                            <strong>Your Reply:</strong>
                                            <p>{review.supplierReply.text}</p>
                                            <small>Replied on {new Date(review.supplierReply.repliedAt).toLocaleDateString()}</small>
                                        </div>
                                    ) : (
                                        <Button
                                            variant="link"
                                            size="sm"
                                            className="reply-btn"
                                            onClick={() => {
                                                setSelectedReview(review);
                                                setShowReplyModal(true);
                                            }}
                                        >
                                            <FaReply /> Reply to Review
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </Card>

            {/* Reply Modal */}
            <Modal show={showReplyModal} onHide={() => {
                setShowReplyModal(false);
                setReplyText('');
                setSelectedReview(null);
            }}>
                <Modal.Header closeButton>
                    <Modal.Title>Reply to Review</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="review-to-reply">
                        <strong>{selectedReview?.user?.name}</strong>
                        <div className="stars">{renderStars(selectedReview?.rating || 0)}</div>
                        <p>{selectedReview?.comment}</p>
                    </div>
                    <Form.Group>
                        <Form.Label>Your Reply</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={4}
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Write your reply to this customer..."
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowReplyModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="success" onClick={handleReplySubmit} disabled={submitting}>
                        {submitting ? 'Sending...' : 'Send Reply'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </SupplierLayout>
    );
};

export default SupplierReviews;