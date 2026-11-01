import React from 'react';
import { Row, Col } from 'react-bootstrap';
import '../../css/products.css';

const ProductSkeleton = () => {
    return (
        <Row className="g-4">
            {[1, 2, 3, 4, 5, 6].map((item) => (
                <Col key={item} lg={4} md={6}>
                    <div className="skeleton-card">
                        <div className="skeleton-image shimmer"></div>
                        <div className="skeleton-content">
                            <div className="skeleton-title shimmer"></div>
                            <div className="skeleton-text shimmer"></div>
                            <div className="skeleton-text shimmer"></div>
                            <div className="skeleton-price shimmer"></div>
                            <div className="skeleton-button shimmer"></div>
                        </div>
                    </div>
                </Col>
            ))}
        </Row>
    );
};

export default ProductSkeleton;