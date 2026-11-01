import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaTimesCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import logo from "../../assets/favicon.png";
import "../../css/auth.css";

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await login(email, password, rememberMe);

    if (result.success) {
      toast.success("Welcome back! Login successful.", {
        position: "top-right",
        autoClose: 2000,
      });

      if (result.requiresOtp) {
        navigate("/verify-otp", { state: { email } });
      } else {
        // Role-based redirect
        const userRole = result.user?.role;

        if (userRole === 'admin') {
          navigate('/admin/dashboard');
        } else if (userRole === 'supplier') {
          navigate('/supplier/dashboard');
        } else {
          navigate('/');
        }
      }
    } else {
      setError(result.message);
      toast.error(result.message || "Login failed", {
        position: "top-right",
        autoClose: 4000,
      });
    }

    setLoading(false);
  };

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
                  <h2 className="auth-title">Welcome Back</h2>
                  <p className="auth-subtitle">Sign in to continue to PakBazar</p>
                </div>

                {error && (
                  <Alert variant="danger" className="animate-slide-down">
                    <FaTimesCircle className="me-2" /> {error}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label className="auth-label">Email Address</Form.Label>
                    <div className="input-icon-wrapper">
                      <FaEnvelope className="input-icon" />
                      <Form.Control
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="with-icon"
                        required
                      />
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="auth-label">Password</Form.Label>
                    <div className="password-input-wrapper">
                      <FaLock className="input-icon" />
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="with-icon"
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
                  </Form.Group>

                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <Form.Check
                      type="checkbox"
                      label="Remember me"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="auth-checkbox"
                    />
                    <Link to="/forgot-password" className="auth-link-small">
                      Forgot Password?
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    className="auth-btn-primary w-100"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Spinner as="span" animation="border" size="sm" className="me-2" />
                        Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>

                  <div className="text-center mt-4">
                    <p className="auth-footer-text">
                      Don't have an account?{" "}
                      <Link to="/register" className="auth-link">
                        Create Account
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

export default LoginForm;