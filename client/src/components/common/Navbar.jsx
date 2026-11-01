import React, { useState } from "react";
import {
  Navbar,
  Nav,
  Container,
  Form,
  Button,
  NavDropdown,
  InputGroup,
  Badge,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import {
  FaShoppingCart,
  FaHeart,
  FaSearch,
  FaUserCircle,
  FaStore,
  FaCog,
  FaKey,
  FaUser,
  FaSignOutAlt,
  FaBox,
  FaShoppingBag,
  FaUsers,
  FaHome,
  FaInfoCircle,
  FaPhoneAlt,
  FaHeadset,
} from "react-icons/fa";
import { useCart } from "../../context/CartContext";
import { useProducts } from "../../context/ProductContext";
import logo from "../../assets/favicon.png";
import "../../css/navbar.css";
import { useAuth } from "../../auth/context/AuthContext";

const NavigationBar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount, updateFilters } = useProducts();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const getInitial = (name) => name?.charAt(0).toUpperCase();

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      updateFilters({ search: search });
      navigate("/products");
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <Navbar expand="lg" sticky="top" className="modern-navbar shadow-sm">
      <Container fluid>
        <Navbar.Brand as={Link} to="/" className="brand">
          <div className="logo-wrapper">
            <img src={logo} alt="logo" />
            <span className="brand-text">PakBazar</span>
          </div>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbar-nav" />

        <Navbar.Collapse id="navbar-nav" className="navbar-content">
          {/* Left Links */}
          <Nav className="nav-links">
            <Nav.Link as={Link} to="/" className="nav-link-custom">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/about" className="nav-link-custom">
              About
            </Nav.Link>
            <Nav.Link as={Link} to="/contact" className="nav-link-custom">
              Contact
            </Nav.Link>
          </Nav>

          {/* Search Bar - Show for all authenticated users and guests */}
          <div className="search-container">
            <Form className="search-wrapper" onSubmit={handleSearch}>
              <InputGroup className="search-input-group">
                <Form.Control
                  type="text"
                  placeholder="Search for products, brands, categories..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="search-input"
                />
                <Button type="submit" className="search-btn">
                  <FaSearch />
                </Button>
              </InputGroup>
            </Form>
          </div>

          <Nav className="right-nav">
            {/* Wishlist - Show for all authenticated users (Customers & Suppliers) */}
            {isAuthenticated && (
              <Nav.Link as={Link} to="/wishlist" className="nav-icon-link wishlist-link">
                <div className="icon-wrapper">
                  <FaHeart />
                  {wishlistCount > 0 && (
                    <Badge pill bg="danger" className="wishlist-badge">
                      {wishlistCount > 99 ? "99+" : wishlistCount}
                    </Badge>
                  )}
                </div>
                <span className="icon-label">Wishlist</span>
              </Nav.Link>
            )}

            {/* Cart - Show for all authenticated users (Customers & Suppliers) */}
            {isAuthenticated && (
              <Nav.Link as={Link} to="/cart" className="nav-icon-link cart-link">
                <div className="icon-wrapper">
                  <FaShoppingCart />
                  {cartCount > 0 && (
                    <Badge pill bg="danger" className="cart-badge">
                      {cartCount > 99 ? "99+" : cartCount}
                    </Badge>
                  )}
                </div>
                <span className="icon-label">Cart</span>
              </Nav.Link>
            )}

            {/* Profile Dropdown */}
            {isAuthenticated && user ? (
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

                {/* My Profile - Show for all users */}
                <NavDropdown.Item as={Link} to="/profile" className="dropdown-item-custom">
                  <FaUser className="dropdown-icon" />
                  <span>My Profile</span>
                </NavDropdown.Item>

                {/* My Orders - Show for Customers only */}
                {user.role === "customer" && (
                  <NavDropdown.Item as={Link} to="/orders/my-orders" className="dropdown-item-custom">
                    <FaShoppingCart className="dropdown-icon" />
                    <span>My Orders</span>
                  </NavDropdown.Item>
                )}

                {/* My Wishlist - Show for Customers only */}
                {user.role === "customer" && (
                  <NavDropdown.Item as={Link} to="/wishlist" className="dropdown-item-custom">
                    <FaHeart className="dropdown-icon" />
                    <span>My Wishlist</span>
                  </NavDropdown.Item>
                )}

                {/* Supplier Dashboard - Show for Suppliers only */}
                {user.role === "supplier" && (
                  <>
                    <NavDropdown.Item as={Link} to="/supplier/dashboard" className="dropdown-item-custom">
                      <FaStore className="dropdown-icon" />
                      <span>Supplier Dashboard</span>
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/supplier/products" className="dropdown-item-custom">
                      <FaBox className="dropdown-icon" />
                      <span>My Products</span>
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/supplier/orders" className="dropdown-item-custom">
                      <FaShoppingBag className="dropdown-icon" />
                      <span>My Orders</span>
                    </NavDropdown.Item>
                  </>
                )}

                {/* Admin Dashboard - Show for Admin only */}
                {user.role === "admin" && (
                  <>
                    <NavDropdown.Item as={Link} to="/admin/dashboard" className="dropdown-item-custom">
                      <FaStore className="dropdown-icon" />
                      <span>Admin Dashboard</span>
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
                  </>
                )}

                {/* Update Password - Show for all users */}
                <NavDropdown.Item as={Link} to="/update-password" className="dropdown-item-custom">
                  <FaKey className="dropdown-icon" />
                  <span>Update Password</span>
                </NavDropdown.Item>

                <NavDropdown.Divider />

                {/* Logout - Show for all users */}
                <NavDropdown.Item onClick={handleLogout} className="dropdown-item-custom logout-item">
                  <FaSignOutAlt className="dropdown-icon" />
                  <span>Logout</span>
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Button as={Link} to="/login" className="login-btn">
                <FaUserCircle className="me-2" />
                Login
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;