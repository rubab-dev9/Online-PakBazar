import React from 'react';
import { Card, Form, Button } from 'react-bootstrap';
import { FaFilter, FaTimes } from 'react-icons/fa';
import '../../css/products.css';

const ProductFilters = ({ filters, onFilterChange, onClearFilters }) => {
    const categories = ['All', 'Grocery', 'Electronics', 'Fashion', 'Home Essentials'];
    const sortOptions = [
        { value: 'newest', label: 'Newest First' },
        { value: 'price-low', label: 'Price: Low to High' },
        { value: 'price-high', label: 'Price: High to Low' },
        { value: 'popular', label: 'Most Popular' }
    ];

    return (
        <Card className="filters-card">
            <Card.Body>
                <div className="filters-header">
                    <h5><FaFilter /> Filters</h5>
                    <button className="clear-filters-btn" onClick={onClearFilters}>
                        <FaTimes /> Clear All
                    </button>
                </div>

                <div className="filter-section">
                    <h6>Categories</h6>
                    <div className="category-filter">
                        {categories.map(category => (
                            <label key={category} className="category-option">
                                <input
                                    type="radio"
                                    name="category"
                                    value={category === 'All' ? '' : category}
                                    checked={filters.category === (category === 'All' ? '' : category)}
                                    onChange={(e) => onFilterChange({ category: e.target.value })}
                                />
                                <span>{category}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="filter-section">
                    <h6>Price Range</h6>
                    <div className="price-range">
                        <Form.Control
                            type="number"
                            placeholder="Min Price"
                            value={filters.minPrice}
                            onChange={(e) => onFilterChange({ minPrice: e.target.value })}
                            className="price-input"
                        />
                        <span>-</span>
                        <Form.Control
                            type="number"
                            placeholder="Max Price"
                            value={filters.maxPrice}
                            onChange={(e) => onFilterChange({ maxPrice: e.target.value })}
                            className="price-input"
                        />
                    </div>
                </div>

                <div className="filter-section">
                    <h6>Sort By</h6>
                    <Form.Select
                        value={filters.sortBy}
                        onChange={(e) => onFilterChange({ sortBy: e.target.value })}
                        className="sort-select"
                    >
                        {sortOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </Form.Select>
                </div>

                <div className="filter-section">
                    <h6>Stock Status</h6>
                    <label className="stock-option">
                        <input
                            type="checkbox"
                            checked={filters.inStock}
                            onChange={(e) => onFilterChange({ inStock: e.target.checked })}
                        />
                        <span>In Stock Only</span>
                    </label>
                </div>

                <Button 
                    variant="primary" 
                    className="apply-filters-btn"
                    onClick={() => {}} // Filters auto-apply through state
                >
                    Apply Filters
                </Button>
            </Card.Body>
        </Card>
    );
};

export default ProductFilters;