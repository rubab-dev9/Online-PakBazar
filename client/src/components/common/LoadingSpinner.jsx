import React from 'react';
import { Spinner } from 'react-bootstrap';
import '../../css/common.css';

const LoadingSpinner = ({ size = 'lg', text = 'Loading...', fullPage = false }) => {
    if (fullPage) {
        return (
            <div className="fullpage-loader">
                <div className="loader-content">
                    <Spinner animation="border" variant="success" size={size} />
                    <p className="mt-3">{text}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="inline-loader">
            <Spinner animation="border" variant="success" size={size} />
            {text && <span className="ms-2">{text}</span>}
        </div>
    );
};

export default LoadingSpinner;