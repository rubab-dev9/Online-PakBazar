import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../auth/context/AuthContext";
import {
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
  FaTimesCircle,
  FaUser,
  FaStore
} from "react-icons/fa";
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import logo from "../../assets/favicon.png";
import "../../css/auth.css";

const RegisterForm = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer"
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({});

  // Password strength criteria
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });

  // Check password strength
  const checkPasswordStrength = (password) => {
    setPasswordStrength({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    });
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setFormData({ ...formData, password: newPassword });
    checkPasswordStrength(newPassword);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
  };

  const validateForm = () => {
    if (formData.name.trim().length < 2) {
      setError("Name must be at least 2 characters");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    if (formData.password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    if (!Object.values(passwordStrength).every(Boolean)) {
      setError("Please meet all password requirements");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    setLoading(true);

    const response = await register(formData);

    setLoading(false);

    if (response.success) {
      toast.success("Registration successful! Please verify your email.", {
        position: "top-right",
        autoClose: 3000,
      });
      navigate("/verify-otp", { state: { email: formData.email } });
    } else {
      setError(response.message);
      toast.error(response.message || "Registration failed", {
        position: "top-right",
        autoClose: 4000,
      });
    }
  };

  const isPasswordValid = Object.values(passwordStrength).every(Boolean);

  return (
    <div className="auth-wrapper">
      <Container fluid className="auth-container">
        <Row className="justify-content-center align-items-center min-vh-100">
          <Col lg={5} md={8} sm={10}>
            <Card className="auth-card fade-in">
              <Card.Body className="p-4 p-lg-5">
                <div className="text-center mb-4">
                  <div className="auth-logo mx-auto mb-3">
                    <img src={logo} alt="logo" />
                  </div>
                  <h2 className="auth-title">Create Account</h2>
                  <p className="auth-subtitle">Join PakBazar and start your journey</p>
                </div>

                {error && (
                  <Alert variant="danger" className="animate-slide-down">
                    <FaTimesCircle className="me-2" /> {error}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  {/* Full Name */}
                  <Form.Group className="mb-3">
                    <Form.Label className="auth-label">Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={() => handleBlur("name")}
                      className={touched.name && formData.name.length < 2 ? "is-invalid" : ""}
                      required
                    />
                    {touched.name && formData.name.length < 2 && formData.name.length > 0 && (
                      <Form.Text className="text-danger">
                        Name must be at least 2 characters
                      </Form.Text>
                    )}
                  </Form.Group>

                  {/* Email */}
                  <Form.Group className="mb-3">
                    <Form.Label className="auth-label">Email Address</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={() => handleBlur("email")}
                      className={touched.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && formData.email ? "is-invalid" : ""}
                      required
                    />
                  </Form.Group>

                  {/* Password */}
                  <Form.Group className="mb-3">
                    <Form.Label className="auth-label">Password</Form.Label>
                    <div className="password-input-wrapper">
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={handlePasswordChange}
                        onBlur={() => handleBlur("password")}
                        className={touched.password && formData.password && !isPasswordValid ? "is-invalid" : ""}
                        required
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>

                    {touched.password && formData.password && (
                      <div className="password-strength mt-2">
                        <div className="strength-item">
                          {passwordStrength.length ? <FaCheckCircle className="text-success" /> : <FaTimesCircle className="text-muted" />}
                          <span className={passwordStrength.length ? "text-success" : "text-muted"}>
                            At least 8 characters
                          </span>
                        </div>
                        <div className="strength-item">
                          {passwordStrength.uppercase ? <FaCheckCircle className="text-success" /> : <FaTimesCircle className="text-muted" />}
                          <span className={passwordStrength.uppercase ? "text-success" : "text-muted"}>
                            Uppercase letter
                          </span>
                        </div>
                        <div className="strength-item">
                          {passwordStrength.lowercase ? <FaCheckCircle className="text-success" /> : <FaTimesCircle className="text-muted" />}
                          <span className={passwordStrength.lowercase ? "text-success" : "text-muted"}>
                            Lowercase letter
                          </span>
                        </div>
                        <div className="strength-item">
                          {passwordStrength.number ? <FaCheckCircle className="text-success" /> : <FaTimesCircle className="text-muted" />}
                          <span className={passwordStrength.number ? "text-success" : "text-muted"}>
                            Number
                          </span>
                        </div>
                        <div className="strength-item">
                          {passwordStrength.special ? <FaCheckCircle className="text-success" /> : <FaTimesCircle className="text-muted" />}
                          <span className={passwordStrength.special ? "text-success" : "text-muted"}>
                            Special character
                          </span>
                        </div>
                      </div>
                    )}
                  </Form.Group>

                  {/* Confirm Password */}
                  <Form.Group className="mb-3">
                    <Form.Label className="auth-label">Confirm Password</Form.Label>
                    <div className="password-input-wrapper">
                      <Form.Control
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        onBlur={() => handleBlur("confirmPassword")}
                        className={touched.confirmPassword && confirmPassword && formData.password !== confirmPassword ? "is-invalid" : ""}
                        required
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    {touched.confirmPassword && confirmPassword && formData.password !== confirmPassword && (
                      <Form.Text className="text-danger">Passwords do not match</Form.Text>
                    )}
                  </Form.Group>

                  {/* Role Selection */}
                  <Form.Group className="mb-4">
                    <Form.Label className="auth-label">I am a</Form.Label>

                    <div className="role-selector">
                      <button
                        type="button"
                        className={`role-btn ${formData.role === "customer" ? "active" : ""}`}
                        onClick={() =>
                          setFormData({ ...formData, role: "customer" })
                        }
                      >
                        <div className="role-icon-wrapper">
                          <FaUser className="role-icon" />
                        </div>

                        <div className="role-content">
                          <span className="role-title">Customer</span>
                          <small>Shop products easily</small>
                        </div>
                      </button>

                      <button
                        type="button"
                        className={`role-btn ${formData.role === "supplier" ? "active" : ""}`}
                        onClick={() =>
                          setFormData({ ...formData, role: "supplier" })
                        }
                      >
                        <div className="role-icon-wrapper">
                          <FaStore className="role-icon" />
                        </div>

                        <div className="role-content">
                          <span className="role-title">Supplier</span>
                          <small>Sell your products</small>
                        </div>
                      </button>
                    </div>
                  </Form.Group>

                  <Button
                    type="submit"
                    className="auth-btn-primary w-100"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Spinner as="span" animation="border" size="sm" className="me-2" />
                        Creating Account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>

                  <div className="text-center mt-4">
                    <p className="auth-footer-text">
                      Already have an account?{" "}
                      <Link to="/login" className="auth-link">
                        Sign in
                      </Link>
                    </p>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default RegisterForm;