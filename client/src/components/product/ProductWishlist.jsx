import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaHeart, FaTrash, FaShoppingCart, FaRegHeart, FaStar, FaStarHalfAlt } from 'react-icons/fa';
import { useProducts } from '../../context/ProductContext';
import { useCart } from '../../context/CartContext';
import { toast } from 'react-toastify';

const Wishlist = () => {
    const { wishlistItems, wishlistLoading, removeFromWishlist, refreshWishlist, clearWishlist } = useProducts();
    const { addToCart } = useCart();
    const [removingId, setRemovingId] = useState(null);

    useEffect(() => {
        refreshWishlist();
    }, []);

    const handleRemoveFromWishlist = async (productId, productName) => {
        setRemovingId(productId);
        await removeFromWishlist(productId);
        setRemovingId(null);
    };

    const handleAddToCart = (product) => {
        if (product.stock === 0) {
            toast.error(`${product.name} is out of stock`);
            return;
        }
        addToCart(product, 1);
        toast.success(`${product.name} added to cart`);
    };

    const handleClearWishlist = async () => {
        if (window.confirm('Are you sure you want to clear your entire wishlist?')) {
            await clearWishlist();
        }
    };

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        
        for (let i = 0; i < fullStars; i++) {
            stars.push(<FaStar key={i} className="star-filled" />);
        }
        if (hasHalfStar) {
            stars.push(<FaStarHalfAlt key="half" className="star-filled" />);
        }
        return stars;
    };

    const getStockStatus = (stock) => {
        if (stock === 0) return { text: 'Out of Stock', class: 'out-of-stock' };
        if (stock < 10) return { text: `Only ${stock} left`, class: 'low-stock' };
        return { text: 'In Stock', class: 'in-stock' };
    };

    if (wishlistLoading) {
        return (
            <div className="wishlist-page">
                <Container>
                    <div className="wishlist-skeleton">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="skeleton-wishlist-card">
                                <div className="skeleton-wishlist-image"></div>
                                <div className="skeleton-wishlist-content">
                                    <div className="skeleton-wishlist-title"></div>
                                    <div className="skeleton-wishlist-text"></div>
                                    <div className="skeleton-wishlist-text"></div>
                                    <div className="skeleton-wishlist-price"></div>
                                    <div className="skeleton-wishlist-actions">
                                        <div className="skeleton-wishlist-btn"></div>
                                        <div className="skeleton-wishlist-btn"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Container>
            </div>
        );
    }

    return (
        <div className="wishlist-page">
            <Container>
                {/* Wishlist Header */}
                <div className="wishlist-header">
                    <h2>
                        <FaHeart /> My Wishlist
                        {wishlistItems.length > 0 && (
                            <span className="wishlist-count">{wishlistItems.length} Items</span>
                        )}
                    </h2>
                    {wishlistItems.length > 0 && (
                        <Button variant="outline-danger" className="clear-wishlist-btn" onClick={handleClearWishlist}>
                            <FaTrash /> Clear All
                        </Button>
                    )}
                </div>

                {/* Wishlist Stats */}
                {wishlistItems.length > 0 && (
                    <div className="wishlist-stats">
                        <div className="stat-card">
                            <div className="stat-icon">
                                <FaHeart />
                            </div>
                            <div className="stat-value">{wishlistItems.length}</div>
                            <div className="stat-label">Total Items</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">
                                <FaShoppingCart />
                            </div>
                            <div className="stat-value">
                                Rs. {wishlistItems.reduce((sum, item) => sum + item.price, 0).toLocaleString()}
                            </div>
                            <div className="stat-label">Total Value</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">
                                <FaRegHeart />
                            </div>
                            <div className="stat-value">
                                {wishlistItems.filter(item => item.stock > 0).length}
                            </div>
                            <div className="stat-label">Available Items</div>
                        </div>
                    </div>
                )}

                {/* Empty Wishlist State */}
                {!wishlistItems || wishlistItems.length === 0 ? (
                    <div className="empty-wishlist">
                        <div className="empty-wishlist-icon">
                            <FaRegHeart />
                        </div>
                        <h3>Your wishlist is empty</h3>
                        <p>Save your favorite items here and come back to them anytime!</p>
                        <Button as={Link} to="/" className="shop-now-btn">
                            Start Shopping
                        </Button>
                    </div>
                ) : (
                    <>
                        {/* Wishlist Grid */}
                        <div className="wishlist-grid">
                            {wishlistItems.map((item) => {
                                const stockStatus = getStockStatus(item.stock);
                                return (
                                    <div key={item._id} className="wishlist-card">
                                        <button
                                            className="wishlist-remove-btn"
                                            onClick={() => handleRemoveFromWishlist(item._id, item.name)}
                                            disabled={removingId === item._id}
                                        >
                                            <FaTrash />
                                        </button>
                                        
                                        <Link to={`/product/${item._id}`} className="wishlist-card-image">
                                            <img 
                                                src={item.images?.[0] || '/images/placeholder-product.jpg'} 
                                                alt={item.name}
                                                onError={(e) => {
                                                    e.target.src = '/images/placeholder-product.jpg';
                                                }}
                                            />
                                            <span className={`stock-status ${stockStatus.class}`}>
                                                {stockStatus.text}
                                            </span>
                                        </Link>
                                        
                                        <div className="wishlist-card-body">
                                            <div className="wishlist-category">
                                                <Badge bg={item.category === 'Electronics' ? 'info' : 'success'}>
                                                    {item.category}
                                                </Badge>
                                            </div>
                                            
                                            <Link to={`/product/${item._id}`} className="wishlist-card-title">
                                                {item.name}
                                            </Link>
                                            
                                            <div className="wishlist-card-description">
                                                {item.description?.substring(0, 80)}...
                                            </div>
                                            
                                            <div className="wishlist-card-rating">
                                                <div className="stars">
                                                    {renderStars(4.5)}
                                                </div>
                                                <span>({Math.floor(Math.random() * 100) + 10} reviews)</span>
                                            </div>
                                            
                                            <div className="wishlist-card-price">
                                                <span className="current-price">Rs. {item.price.toLocaleString()}</span>
                                                {item.oldPrice && (
                                                    <span className="old-price">Rs. {item.oldPrice.toLocaleString()}</span>
                                                )}
                                            </div>
                                            
                                            <div className="wishlist-card-actions">
                                                <Button
                                                    className="add-to-cart-wishlist-btn"
                                                    onClick={() => handleAddToCart(item)}
                                                    disabled={item.stock === 0}
                                                >
                                                    <FaShoppingCart /> Add to Cart
                                                </Button>
                                                <Button
                                                    variant="outline-danger"
                                                    className="remove-wishlist-btn"
                                                    onClick={() => handleRemoveFromWishlist(item._id, item.name)}
                                                    disabled={removingId === item._id}
                                                >
                                                    <FaTrash /> Remove
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </Container>
        </div>
    );
};

export default Wishlist;