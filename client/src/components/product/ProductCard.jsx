import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaStar, FaEye, FaStarHalfAlt } from 'react-icons/fa';
import reviewService from '../../services/reviewService';
import '../../css/products.css';

const ProductCard = ({ product, onAddToCart }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [reviewStats, setReviewStats] = useState({
        rating: product.rating || 0,
        reviewCount: product.reviewCount || 0,
        loading: false
    });
    const [imgError, setImgError] = useState(false);

    useEffect(() => {
        fetchProductReviewStats();
    }, [product._id]);

    const fetchProductReviewStats = async () => {
        if (product.rating && product.reviewCount) {
            setReviewStats({
                rating: product.rating,
                reviewCount: product.reviewCount,
                loading: false
            });
            return;
        }

        setReviewStats(prev => ({ ...prev, loading: true }));
        try {
            const result = await reviewService.getProductReviews(product._id);
            if (result.success) {
                setReviewStats({
                    rating: result.stats.averageRating || 0,
                    reviewCount: result.stats.total || 0,
                    loading: false
                });
            }
        } catch (error) {
            console.error('Error fetching review stats:', error);
            setReviewStats(prev => ({ ...prev, loading: false }));
        }
    };

    const getCategoryBadgeColor = (category) => {
        const colors = {
            'Grocery': '#28a745',
            'Electronics': '#17a2b8',
            'Fashion': '#fd7e14',
            'Home Essentials': '#6c757d'
        };
        return colors[category] || '#2FA84F';
    };

    const renderStars = () => {
        const stars = [];
        const rating = reviewStats.rating;
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        
        for (let i = 0; i < fullStars; i++) {
            stars.push(<FaStar key={i} className="star-filled" />);
        }
        if (hasHalfStar) {
            stars.push(<FaStarHalfAlt key="half" className="star-filled" />);
        }
        const emptyStars = 5 - stars.length;
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<FaStar key={`empty-${i}`} className="star-empty" />);
        }
        return stars;
    };

    return (
        <Card 
            className={`product-card ${isHovered ? 'hovered' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Image Section */}
            <div className="product-image-wrapper">
                <img 
                    src={!imgError && product.images?.[0] ? product.images[0] : '/images/placeholder-product.jpg'} 
                    alt={product.name}
                    className="product-image"
                    onError={() => setImgError(true)}
                />
                
                {/* Category Badge on Top Right of Image */}
                <div 
                    className="category-badge-on-image"
                    style={{ backgroundColor: getCategoryBadgeColor(product.category) }}
                >
                    {product.category}
                </div>
                
                {/* Stock Badge */}
                {product.stock < 10 && product.stock > 0 && (
                    <Badge className="stock-badge low-stock">Only {product.stock} left</Badge>
                )}
                {product.stock === 0 && (
                    <Badge className="stock-badge out-of-stock">Out of Stock</Badge>
                )}
                
                {/* Overlay on Hover */}
                <div className="product-overlay">
                    <Link to={`/product/${product._id}`}>
                        <Button variant="light" className="view-btn">
                            <FaEye /> Quick View
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Content Section */}
            <Card.Body>
                <Link to={`/product/${product._id}`} className="product-link">
                    <Card.Title className="product-title">{product.name}</Card.Title>
                </Link>
                
                <Card.Text className="product-description-one-line">
                    {product.description?.substring(0, 60)}...
                </Card.Text>
                
                <div className="product-rating">
                    <div className="stars">
                        {renderStars()}
                    </div>
                    <span className="rating-value">{reviewStats.rating.toFixed(1)}</span>
                    {reviewStats.reviewCount > 0 && (
                        <span className="reviews-count">({reviewStats.reviewCount} reviews)</span>
                    )}
                </div>
                
                <div className="product-footer">
                    <div className="product-price">
                        <span className="price">Rs. {product.price.toLocaleString()}</span>
                    </div>
                    <Button 
                        variant="primary" 
                        className="add-to-cart-btn"
                        onClick={() => onAddToCart(product)}
                        disabled={product.stock === 0}
                    >
                        <FaShoppingCart /> Add
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );
};

export default ProductCard;