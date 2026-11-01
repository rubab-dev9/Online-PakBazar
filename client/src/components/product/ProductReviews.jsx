import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Form, Modal, Spinner } from 'react-bootstrap';
import { FaStar, FaStarHalfAlt, FaThumbsUp, FaCalendar, FaTrash, FaStar as FaStarSolid, FaReply } from 'react-icons/fa';
import { useAuth } from '../../auth/context/AuthContext';
import reviewService from '../../services/reviewService';
import { toast } from 'react-toastify';
import '../../css/reviews.css';

const ProductReviews = ({ productId, onReviewAdded }) => {
    const { isAuthenticated, user } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [stats, setStats] = useState({ total: 0, averageRating: 0, distribution: {} });
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        rating: 5,
        title: '',
        comment: ''
    });
    const [hoverRating, setHoverRating] = useState(0);

    useEffect(() => {
        fetchReviews();
    }, [productId]);

    const fetchReviews = async () => {
        setLoading(true);
        const result = await reviewService.getProductReviews(productId);
        if (result.success) {
            setReviews(result.reviews);
            setStats(result.stats);
        }
        setLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        
        const result = await reviewService.addReview({
            productId,
            ...formData
        });
        
        if (result.success) {
            toast.success('Review added successfully!');
            setShowModal(false);
            setFormData({ rating: 5, title: '', comment: '' });
            fetchReviews();
            if (onReviewAdded) onReviewAdded();
        } else {
            toast.error(result.message);
        }
        setSubmitting(false);
    };

    const handleDelete = async (reviewId) => {
        if (window.confirm('Are you sure you want to delete this review?')) {
            const result = await reviewService.deleteReview(reviewId);
            if (result.success) {
                toast.success('Review deleted');
                fetchReviews();
            } else {
                toast.error(result.message);
            }
        }
    };

    const handleHelpful = async (reviewId) => {
        if (!isAuthenticated) {
            toast.info('Please login to mark reviews as helpful');
            return;
        }
        await reviewService.markHelpful(reviewId);
        fetchReviews();
    };

    // Custom Rating Stars Component
    const RatingStars = ({ rating, onRatingChange, onHover, hoverRating, size = 'large' }) => {
        const [tempRating, setTempRating] = useState(0);
        
        const handleClick = (value) => {
            if (onRatingChange) {
                onRatingChange(value);
            }
        };
        
        const handleMouseEnter = (value) => {
            if (onHover) {
                onHover(value);
            }
            setTempRating(value);
        };
        
        const handleMouseLeave = () => {
            if (onHover) {
                onHover(0);
            }
            setTempRating(0);
        };
        
        const displayRating = hoverRating || tempRating || rating;
        
        return (
            <div className="rating-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                    <FaStarSolid
                        key={star}
                        className={`star ${star <= displayRating ? 'filled' : 'empty'} ${size}`}
                        onClick={() => handleClick(star)}
                        onMouseEnter={() => handleMouseEnter(star)}
                        onMouseLeave={handleMouseLeave}
                    />
                ))}
            </div>
        );
    };

    // Read-only rating display
    const DisplayStars = ({ rating }) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        
        return (
            <div className="display-stars">
                {[...Array(5)].map((_, i) => {
                    if (i < fullStars) {
                        return <FaStar key={i} className="star-filled" />;
                    } else if (i === fullStars && hasHalfStar) {
                        return <FaStarHalfAlt key={i} className="star-filled" />;
                    } else {
                        return <FaStar key={i} className="star-empty" />;
                    }
                })}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="text-center py-4">
                <Spinner animation="border" variant="success" />
            </div>
        );
    }

    return (
        <div className="product-reviews">
            {/* Rating Summary */}
            <div className="reviews-summary">
                <Row>
                    <Col md={4} className="text-center">
                        <div className="average-rating">
                            <h1>{stats.averageRating?.toFixed(1) || 0}</h1>
                            <DisplayStars rating={stats.averageRating || 0} />
                            <span>Based on {stats.total || 0} reviews</span>
                        </div>
                    </Col>
                    <Col md={8}>
                        <div className="rating-distribution">
                            {[5, 4, 3, 2, 1].map(star => {
                                const count = stats.distribution?.[star] || 0;
                                const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
                                return (
                                    <div key={star} className="rating-bar-item">
                                        <span className="star-label">{star} ★</span>
                                        <div className="progress-bar">
                                            <div 
                                                className="progress-fill"
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                        <span className="count">{count}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </Col>
                </Row>
            </div>

            {/* Write Review Button */}
            {isAuthenticated && (
                <div className="write-review-btn-container">
                    <Button variant="success" onClick={() => setShowModal(true)}>
                        Write a Review
                    </Button>
                </div>
            )}

            {/* Reviews List */}
            <div className="reviews-list">
                {reviews.length === 0 ? (
                    <Card className="text-center p-5">
                        <p className="text-muted">No reviews yet. Be the first to review!</p>
                    </Card>
                ) : (
                    reviews.map(review => (
                        <Card key={review._id} className="review-card">
                            <Card.Body>
                                <div className="review-header">
                                    <div className="reviewer-info">
                                        <div className="reviewer-avatar">
                                            {review.user?.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <strong>{review.user?.name}</strong>
                                            <DisplayStars rating={review.rating} />
                                        </div>
                                    </div>
                                    <div className="review-date">
                                        <FaCalendar /> {new Date(review.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                                
                                <h6 className="review-title">{review.title}</h6>
                                <p className="review-comment">{review.comment}</p>
                                
                                {/* ✅ Supplier Reply - Show if exists */}
                                {review.supplierReply && review.supplierReply.text && (
                                    <div className="supplier-reply-box">
                                        <div className="supplier-reply-header">
                                            <FaReply className="supplier-reply-icon" />
                                            <strong>Seller Response</strong>
                                        </div>
                                        <p className="supplier-reply-text">{review.supplierReply.text}</p>
                                        <small className="supplier-reply-date">
                                            Replied on {new Date(review.supplierReply.repliedAt).toLocaleDateString()}
                                        </small>
                                    </div>
                                )}
                                
                                <div className="review-footer">
                                    <Button 
                                        variant="light" 
                                        size="sm"
                                        onClick={() => handleHelpful(review._id)}
                                    >
                                        <FaThumbsUp /> Helpful ({review.helpful?.length || 0})
                                    </Button>
                                    
                                    {isAuthenticated && user?._id === review.user?._id && (
                                        <div className="review-actions">
                                            <Button variant="link" size="sm" className="text-danger" onClick={() => handleDelete(review._id)}>
                                                <FaTrash /> Delete
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </Card.Body>
                        </Card>
                    ))
                )}
            </div>

            {/* Add Review Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Write a Review</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Rating *</Form.Label>
                            <RatingStars
                                rating={formData.rating}
                                onRatingChange={(value) => setFormData({ ...formData, rating: value })}
                                onHover={setHoverRating}
                                hoverRating={hoverRating}
                                size="large"
                            />
                        </Form.Group>
                        
                        <Form.Group className="mb-3">
                            <Form.Label>Review Title *</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Summarize your experience"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                        </Form.Group>
                        
                        <Form.Group className="mb-3">
                            <Form.Label>Your Review *</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={5}
                                placeholder="Share your experience with this product..."
                                value={formData.comment}
                                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="success" disabled={submitting}>
                            {submitting ? 'Submitting...' : 'Submit Review'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );
};

export default ProductReviews;