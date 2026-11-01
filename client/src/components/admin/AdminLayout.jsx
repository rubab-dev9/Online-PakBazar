import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import { FaBars, FaUser, FaUsers, FaBox, FaShoppingBag, FaKey, FaSignOutAlt, FaTachometerAlt } from 'react-icons/fa';
import { useAuth } from '../../auth/context/AuthContext';
import AdminSidebar from './AdminSidebar';
import logo from '../../assets/favicon.png';
import '../../css/admin-dashboard.css';

const AdminLayout = ({ children, title, subtitle }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const getInitial = (name) => name?.charAt(0).toUpperCase();

    return (
        <div className="admin-dashboard-layout">
            <AdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

            <div className="dashboard-main-content">
                <div className="mobile-menu-toggle" onClick={() => setSidebarOpen(true)}>
                    <FaBars />
                </div>

                {/* Sticky Navbar */}
                <Navbar expand="lg" className="dashboard-navbar" sticky="top">
                    <Container fluid>
                        <Navbar.Brand as={Link} to="/" className="brand">
                            <div className="logo-wrapper">
                                <img src={logo} alt="logo" />
                                <span className="brand-text">PakBazar</span>
                            </div>
                        </Navbar.Brand>

                        <Navbar.Toggle aria-controls="dashboard-navbar-nav" />

                        <Navbar.Collapse id="dashboard-navbar-nav">
                            <Nav className="ms-auto right-nav">
                                {user && (
                                    <NavDropdown
                                        title={
                                            <div className="profile-trigger">
                                                <div className="profile-circle">
                                                    {getInitial(user.name)}
                                                </div>
                                                <span className="profile-name">{user.name.split(' ')[0]}</span>
                                            </div>
                                        }
                                        align="end"
                                        className="custom-dropdown no-arrow"
                                        menuVariant="light"
                                    >
                                        <div className="dropdown-user-info">
                                            <div className="user-avatar-large">
                                                {getInitial(user.name)}
                                            </div>
                                            <div className="user-details">
                                                <strong>{user.name}</strong>
                                                <small className="text-muted">{user.email}</small>
                                            </div>
                                        </div>

                                        <NavDropdown.Divider />

                                        <NavDropdown.Item as={Link} to="/profile" className="dropdown-item-custom">
                                            <FaUser className="dropdown-icon" /> My Profile
                                        </NavDropdown.Item>
                                        
                                        <NavDropdown.Item as={Link} to="/admin/users" className="dropdown-item-custom">
                                            <FaUsers className="dropdown-icon" />
                                            <span>Manage Users</span>
                                        </NavDropdown.Item>

                                        <NavDropdown.Item as={Link} to="/admin/products" className="dropdown-item-custom">
                                            <FaBox className="dropdown-icon" />
                                            <span>Manage Products</span>
                                        </NavDropdown.Item>

                                        <NavDropdown.Item as={Link} to="/admin/orders" className="dropdown-item-custom">
                                            <FaShoppingBag className="dropdown-icon" />
                                            <span>Manage Orders</span>
                                        </NavDropdown.Item>

                                        <NavDropdown.Item as={Link} to="/update-password" className="dropdown-item-custom">
                                            <FaKey className="dropdown-icon" /> Update Password
                                        </NavDropdown.Item>

                                        <NavDropdown.Divider />

                                        <NavDropdown.Item onClick={handleLogout} className="dropdown-item-custom logout-item">
                                            <FaSignOutAlt className="dropdown-icon" /> Logout
                                        </NavDropdown.Item>

                                    </NavDropdown>
                                )}
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>

                {/* Content - with proper padding */}
                <div className="content-wrapper">
                    <div className="dashboard-top-bar">
                        <div className="page-title">
                            <h2>{title}</h2>
                            <p>{subtitle}</p>
                        </div>
                        <div className="date-display">
                            <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                    </div>

                    {children}
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;