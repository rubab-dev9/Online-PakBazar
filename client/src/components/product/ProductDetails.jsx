import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Image, Button, Badge } from 'react-bootstrap';
import { useCart } from '../../context/CartContext';
import { useProducts } from '../../context/ProductContext';
import ProductReviews from '../product/ProductReviews';
import { FaStar, FaStarHalf, FaShoppingCart, FaHeart, FaShare, FaCheckCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import '../../css/products.css';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist, getProductById } = useProducts();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState(0);
    const [isWishlisted, setIsWishlisted] = useState(false);

    useEffect(() => {
        fetchProductDetails();
    }, [id]);

    useEffect(() => {
        if (product) {
            setIsWishlisted(isInWishlist(product._id));
        }
    }, [product, isInWishlist]);

    const fetchProductDetails = async () => {
        setLoading(true);
        const productData = await getProductById(id);
        if (productData) {
            setProduct(productData);
        } else {
            toast.error('Product not found');
            navigate('/products');
        }
        setLoading(false);
    };

    const handleAddToCart = () => {
        if (quantity > product.stock) {
            toast.error(`Only ${product.stock} items available`);
            return;
        }
        addToCart(product, quantity);
        toast.success(`${quantity} x ${product.name} added to cart`);
    };

    const handleQuantityChange = (value) => {
        const newQuantity = quantity + value;
        if (newQuantity >= 1 && newQuantity <= product.stock) {
            setQuantity(newQuantity);
        }
    };

    const handleWishlistToggle = async () => {
        if (isWishlisted) {
            await removeFromWishlist(product._id);
            setIsWishlisted(false);
        } else {
            await addToWishlist(product);
            setIsWishlisted(true);
        }
    };

    const getCategoryBadgeColor = (category) => {
        const colors = {
            'Grocery': 'success',
            'Electronics': 'info',
            'Fashion': 'warning',
            'Home Essentials': 'secondary'
        };
        return colors[category] || 'primary';
    };

    if (loading) {
        return (
            <Container className="py-5">
                <div className="text-center">
                    <div className="spinner-border text-success" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </Container>
        );
    }

    if (!product) return null;

    return (
        <div className="product-details-page">
            <Container className="py-5">
                <nav className="breadcrumb-nav mb-4">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <button onClick={() => navigate('/')} className="breadcrumb-link">Home</button>
                        </li>
                        <li className="breadcrumb-item">
                            <button onClick={() => navigate('/products')} className="breadcrumb-link">Products</button>
                        </li>
                        <li className="breadcrumb-item">
                            <button onClick={() => navigate(`/products?category=${product.category}`)} className="breadcrumb-link">
                                {product.category}
                            </button>
                        </li>
                        <li className="breadcrumb-item active">{product.name}</li>
                    </ol>
                </nav>

                <Row className="g-5">
                    {/* Product Images */}
                    <Col lg={6}>
                        <div className="product-gallery">
                            <div className="main-image">
                                <Image
                                    src={product.images?.[activeImage] || '/images/placeholder-product.jpg'}
                                    fluid
                                    className="product-main-image"
                                />
                                {product.stock === 0 && (
                                    <div className="out-of-stock-overlay">
                                        <h3>Out of Stock</h3>
                                    </div>
                                )}
                            </div>
                            {product.images && product.images.length > 1 && (
                                <div className="thumbnail-gallery">
                                    {product.images.map((img, idx) => (
                                        <div
                                            key={idx}
                                            className={`thumbnail ${activeImage === idx ? 'active' : ''}`}
                                            onClick={() => setActiveImage(idx)}
                                        >
                                            <Image src={img} fluid />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </Col>

                    {/* Product Info */}
                    <Col lg={6}>
                        <div className="product-info">
                            <Badge bg={getCategoryBadgeColor(product.category)} className="category-badge">
                                {product.category}
                            </Badge>

                            <h1 className="product-title">{product.name}</h1>

                            <div className="product-rating">
                                <div className="stars">
                                    <FaStar className="star-filled" />
                                    <FaStar className="star-filled" />
                                    <FaStar className="star-filled" />
                                    <FaStar className="star-filled" />
                                    <FaStarHalf className="star-filled" />
                                </div>
                                <span className="rating-text">4.5 (128 reviews)</span>
                            </div>

                            <div className="product-price">
                                <span className="current-price">Rs. {product.price.toLocaleString()}</span>
                                {product.oldPrice && (
                                    <span className="old-price">Rs. {product.oldPrice.toLocaleString()}</span>
                                )}
                            </div>

                            <div className="product-stock">
                                {product.stock > 0 ? (
                                    <span className="in-stock">
                                        <FaCheckCircle /> In Stock ({product.stock} items available)
                                    </span>
                                ) : (
                                    <span className="out-of-stock-text">Out of Stock</span>
                                )}
                            </div>

                            <div className="product-description">
                                <h5>Description</h5>
                                <p>{product.description}</p>
                            </div>

                            <div className="supplier-info-card">
                                <h6>Sold by</h6>
                                <div className="supplier-details">
                                    <strong>{product.supplier?.name}</strong>
                                    <span className="supplier-rating">
                                        <FaStar className="star-filled" /> 4.8
                                    </span>
                                </div>
                            </div>

                            {product.stock > 0 && (
                                <div className="quantity-selector">
                                    <h6>Quantity</h6>
                                    <div className="quantity-controls">
                                        <button
                                            onClick={() => handleQuantityChange(-1)}
                                            className="quantity-btn"
                                            disabled={quantity <= 1}
                                        >
                                            -
                                        </button>
                                        <span className="quantity-value">{quantity}</span>
                                        <button
                                            onClick={() => handleQuantityChange(1)}
                                            className="quantity-btn"
                                            disabled={quantity >= product.stock}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="product-actions">
                                <Button
                                    variant="primary"
                                    className="add-to-cart-btn-lg"
                                    onClick={handleAddToCart}
                                    disabled={product.stock === 0}
                                >
                                    <FaShoppingCart /> Add to Cart
                                </Button>
                                <Button
                                    variant={isWishlisted ? "danger" : "outline-primary"}
                                    className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
                                    onClick={handleWishlistToggle}
                                >
                                    <FaHeart /> {isWishlisted ? 'Added to Wishlist' : 'Wishlist'}
                                </Button>
                            </div>

                            <div className="delivery-info">
                                <h6>Delivery Information</h6>
                                <ul>
                                    <li>Free delivery on orders over Rs. 5000</li>
                                    <li>Cash on Delivery available</li>
                                    <li>7-day return policy</li>
                                    <li>Estimated delivery: 3-5 business days</li>
                                </ul>
                            </div>
                        </div>
                    </Col>
                </Row>

                {/* Reviews Section */}
                <Row className="mt-5">
                    <Col lg={12}>
                        <ProductReviews productId={product._id} />
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default ProductDetails;