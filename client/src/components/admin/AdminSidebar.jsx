import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import {
    FaTachometerAlt, FaUsers, FaStore, FaBox, FaShoppingBag, 
    FaChartLine, FaCog, FaSignOutAlt, FaTags, FaStar, FaTruck,
    FaTimes, FaEnvelope
} from 'react-icons/fa';
import { useAuth } from '../../auth/context/AuthContext';

const AdminSidebar = ({ isOpen, onToggle }) => {
    const location = useLocation();
    const { logout } = useAuth();

    const menuItems = [
        { path: '/admin/dashboard', icon: <FaTachometerAlt />, label: 'Dashboard' },
        { path: '/admin/users', icon: <FaUsers />, label: 'Users' },
        { path: '/admin/products', icon: <FaBox />, label: 'Products' },
        { path: '/admin/orders', icon: <FaShoppingBag />, label: 'Orders' },
        { path: '/admin/messages', icon: <FaEnvelope />, label: 'Contact Messages' },
        { path: '/profile', icon: <FaCog />, label: 'Profile Settings' },
    ];

    const handleLogout = async () => {
        await logout();
        window.location.href = '/login';
    };

    return (
        <>
            <div className={`admin-sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <div className="sidebar-logo">
                        <FaStore className="logo-icon" />
                        <span>Admin Panel</span>
                    </div>
                    <button className="sidebar-close" onClick={onToggle}>
                        <FaTimes />
                    </button>
                </div>

                <div className="sidebar-user">
                    <div className="user-avatar">
                        {JSON.parse(localStorage.getItem('user'))?.name?.charAt(0).toUpperCase() || 'A'}
                    </div>
                    <div className="user-info">
                        <h6>{JSON.parse(localStorage.getItem('user'))?.name}</h6>
                        <span>Administrator</span>
                    </div>
                </div>

                {/* Navigation Menu - Takes available space */}
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

                {/* Logout Button at Bottom */}
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

export default AdminSidebar;