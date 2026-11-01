import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Container, Row, Col, Button, Badge } from 'react-bootstrap';
import ProductCard from './ProductCard';
import ProductSkeleton from './ProductSkeleton';
import { useCart } from '../../context/CartContext';
import { useProducts } from '../../context/ProductContext';
import {
    FaStore,
    FaCarrot,
    FaLaptop,
    FaCouch,
    FaGem,
    FaFilter,
    FaSortAmountDown,
    FaTimes,
    FaRupeeSign,
    FaBoxes,
    FaStar,
    FaSlidersH
} from 'react-icons/fa';
import '../../css/products.css';

const ProductListing = () => {
    const {
        products,
        loading,
        filters,
        updateFilters,
        clearFilters
    } = useProducts();

    const { addToCart } = useCart();

    const [showFilters, setShowFilters] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(filters.category || 'all');
    const [showInStock, setShowInStock] = useState(false);
    const [sortBy, setSortBy] = useState(filters.sortBy || 'newest');
    const [priceRange, setPriceRange] = useState({
        min: filters.minPrice || '',
        max: filters.maxPrice || ''
    });

    // Use ref to prevent infinite loop
    const isInitialMount = useRef(true);

    // Categories with React Icons
    const categories = [
        { id: 'all', name: 'All Products', icon: <FaStore /> },
        { id: 'Grocery', name: 'Grocery', icon: <FaCarrot /> },
        { id: 'Electronics', name: 'Electronics', icon: <FaLaptop /> },
        { id: 'Home Essentials', name: 'Home Essentials', icon: <FaCouch /> },
        { id: 'Fashion', name: 'Fashion', icon: <FaGem /> }
    ];

    // Sort options
    const sortOptions = [
        { value: 'newest', label: 'Newest First', icon: <FaStar /> },
        { value: 'price-low', label: 'Price: Low to High', icon: <FaRupeeSign /> },
        { value: 'price-high', label: 'Price: High to Low', icon: <FaRupeeSign /> }
    ];

    // Update global filters only when local filters change
    useEffect(() => {
        // Skip the first mount to prevent double update
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        updateFilters({
            category: selectedCategory === 'all' ? '' : selectedCategory,
            minPrice: priceRange.min,
            maxPrice: priceRange.max,
            sortBy: sortBy
        });
    }, [selectedCategory, priceRange.min, priceRange.max, sortBy, updateFilters]);

    // Sync only external filter changes (like navbar search)
    useEffect(() => {
        if (filters.category && filters.category !== selectedCategory) {
            setSelectedCategory(filters.category);
        }

        if (filters.sortBy && filters.sortBy !== sortBy) {
            setSortBy(filters.sortBy);
        }
    }, [filters.category, filters.sortBy]);

    const clearAllFilters = () => {
        setSelectedCategory('all');
        setShowInStock(false);
        setSortBy('newest');
        setPriceRange({ min: '', max: '' });
        clearFilters();
    };

    const hasActiveFilters = selectedCategory !== 'all' || showInStock || priceRange.min || priceRange.max;

    return (
        <div className="products-page">

            <div className="hero-banner">
                <Container>
                    <h1 className="banner-title">Welcome to PakBazar</h1>
                    <p className="banner-subtitle">Browse our collection of quality products</p>
                </Container>
            </div>

            <Container className="py-4">
                {/* Filter Bar - Category Tabs Left, Actions Right */}
                <div className="filter-bar-container">
                    {/* Left Side - Category Tabs */}
                    <div className="category-tabs-wrapper">
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                className={`category-tab ${selectedCategory === cat.id ? 'active' : ''}`}
                                onClick={() => setSelectedCategory(cat.id)}
                            >
                                <span className="tab-icon">{cat.icon}</span>
                                <span className="tab-name">{cat.name}</span>
                            </button>
                        ))}
                    </div>

                    {/* Right Side - Filter & Sort Actions */}
                    <div className="filter-actions-wrapper">
                        {/* Filter Button */}
                        <button className="filter-action-btn" onClick={() => setShowFilters(true)}>
                            <FaFilter /> Filters
                            {hasActiveFilters && <span className="filter-active-dot"></span>}
                        </button>

                        {/* Sort Dropdown */}
                        <div className="sort-wrapper">
                            <FaSortAmountDown className="sort-icon" />
                            <select
                                className="sort-select-custom"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                {sortOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Active Filters Display */}
                {hasActiveFilters && (
                    <div className="active-filters-bar">
                        <span className="active-filters-label">Active Filters:</span>
                        <div className="active-filters-list">
                            {selectedCategory !== 'all' && (
                                <Badge bg="success" className="active-filter-badge">
                                    {categories.find(c => c.id === selectedCategory)?.icon}
                                    {categories.find(c => c.id === selectedCategory)?.name}
                                    <button onClick={() => setSelectedCategory('all')}>×</button>
                                </Badge>
                            )}
                            {showInStock && (
                                <Badge bg="success" className="active-filter-badge">
                                    <FaBoxes /> In Stock
                                    <button onClick={() => setShowInStock(false)}>×</button>
                                </Badge>
                            )}
                            {priceRange.min && (
                                <Badge bg="success" className="active-filter-badge">
                                    Min: <span className="currency-symbol">Rs.</span>{priceRange.min}
                                    <button onClick={() => setPriceRange({ ...priceRange, min: '' })}>×</button>
                                </Badge>
                            )}
                            {priceRange.max && (
                                <Badge bg="success" className="active-filter-badge">
                                    Max: <span className="currency-symbol">Rs.</span>{priceRange.max}
                                    <button onClick={() => setPriceRange({ ...priceRange, max: '' })}>×</button>
                                </Badge>
                            )}
                            <button className="clear-all-filters-btn" onClick={clearAllFilters}>
                                Clear All
                            </button>
                        </div>
                    </div>
                )}

                {/* Products Header with Count */}
                <div className="products-header">
                    <h5 className="products-count">
                        Found {products.length} products
                    </h5>
                </div>

                {/* Products Grid */}
                {loading ? (
                    <ProductSkeleton />
                ) : products.length === 0 ? (
                    <div className="no-products">
                        <h3>No products found</h3>
                        <p>Try adjusting your filters or search terms</p>
                        <Button variant="primary" onClick={clearAllFilters}>
                            Clear All Filters
                        </Button>
                    </div>
                ) : (
                    <Row className="g-4">
                        {products.map(product => (
                            <Col key={product._id} xl={3} lg={4} md={6} sm={12}>
                                <ProductCard product={product} onAddToCart={addToCart} />
                            </Col>
                        ))}
                    </Row>
                )}
            </Container>

            {/* Filters Sidebar */}
            <div className={`filters-overlay ${showFilters ? 'active' : ''}`} onClick={() => setShowFilters(false)}></div>
            <div className={`filters-sidebar-container ${showFilters ? 'open' : ''}`}>
                <div className="filters-sidebar">
                    <div className="filters-sidebar-header">
                        <h5>
                            <FaSlidersH /> Filters
                        </h5>

                        <button
                            onClick={() => setShowFilters(false)}
                            className="close-filters-btn"
                        >
                            <FaTimes />
                        </button>
                    </div>

                    <div className="filters-sidebar-body">

                        {/* In Stock Filter */}
                        <div className="filter-group">
                            <label className="filter-label">
                                <input
                                    type="checkbox"
                                    checked={showInStock}
                                    onChange={(e) => setShowInStock(e.target.checked)}
                                />
                                <span>In Stock Only</span>
                            </label>
                        </div>

                        {/* Price Range */}
                        <div className="filter-group">
                            <h6>Price Range</h6>

                            <div className="price-range-inputs">

                                <input
                                    type="number"
                                    placeholder="Min Price"
                                    value={priceRange.min}
                                    onChange={(e) =>
                                        setPriceRange(prev => ({
                                            ...prev,
                                            min: e.target.value
                                        }))
                                    }
                                    className="price-input"
                                />

                                <span>to</span>

                                <input
                                    type="number"
                                    placeholder="Max Price"
                                    value={priceRange.max}
                                    onChange={(e) =>
                                        setPriceRange(prev => ({
                                            ...prev,
                                            max: e.target.value
                                        }))
                                    }
                                    className="price-input"
                                />

                            </div>
                        </div>

                        <button
                            className="apply-filters-sidebar-btn"
                            onClick={() => setShowFilters(false)}
                        >
                            Apply Filters
                        </button>

                        {hasActiveFilters && (
                            <button
                                className="clear-filters-sidebar-btn"
                                onClick={clearAllFilters}
                            >
                                Clear All Filters
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductListing;