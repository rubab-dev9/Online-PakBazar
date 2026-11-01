import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import {
    FaTachometerAlt, FaBox, FaShoppingBag, FaChartLine, 
    FaStore, FaStar, FaCog, FaSignOutAlt, FaTags, FaTimes
} from 'react-icons/fa';
import { useAuth } from '../../auth/context/AuthContext';

const SupplierSidebar = ({ isOpen, onToggle }) => {
    const location = useLocation();
    const { logout } = useAuth();

    const menuItems = [
        { path: '/supplier/dashboard', icon: <FaTachometerAlt />, label: 'Dashboard' },
        { path: '/supplier/products', icon: <FaBox />, label: 'My Products' },
        { path: '/supplier/orders', icon: <FaShoppingBag />, label: 'Orders' },
        { path: '/supplier/reviews', icon: <FaStar />, label: 'Reviews' },
        { path: '/profile', icon: <FaCog />, label: 'Account Settings' },
    ];

    const handleLogout = async () => {
        await logout();
        window.location.href = '/login';
    };

    return (
        <>
            <div className={`supplier-sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <div className="sidebar-logo">
                        <FaStore className="logo-icon" />
                        <span>Supplier Panel</span>
                    </div>
                    <button className="sidebar-close" onClick={onToggle}>
                        <FaTimes />
                    </button>
                </div>

                <div className="sidebar-user">
                    <div className="user-avatar">
                        {JSON.parse(localStorage.getItem('user'))?.name?.charAt(0).toUpperCase() || 'S'}
                    </div>
                    <div className="user-info">
                        <h6>{JSON.parse(localStorage.getItem('user'))?.name}</h6>
                        <span>Supplier</span>
                    </div>
                </div>

                <Nav className="sidebar-nav flex-column">
                    {menuItems.map((item, index) => (
                        <Nav.Link
                            key={index}
                            as={Link}
                            to={item.path}
                            className={`sidebar-nav-item ${location.pathname === item.path ? 'active' : ''}`}
                            onClick={() => onToggle && onToggle()}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            <span className="nav-label">{item.label}</span>
                        </Nav.Link>
                    ))}
                </Nav>

                <div className="sidebar-footer">
                    <button className="logout-btn" onClick={handleLogout}>
                        <FaSignOutAlt /> Logout
                    </button>
                </div>
            </div>
            {isOpen && <div className="sidebar-overlay" onClick={onToggle}></div>}
        </>
    );
};

export default SupplierSidebar;