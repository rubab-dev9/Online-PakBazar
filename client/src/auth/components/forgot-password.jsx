import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth/context/AuthContext";
import { FaEnvelope, FaArrowLeft, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import "../../css/auth.css";

const ForgotPassword = () => {
  const { forgotPassword } = useAuth();

  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await forgotPassword(email);

    setLoading(false);

    if (res.success) {
      setSubmitted(true);
      toast.success(res.message, {
        position: "top-right",
        autoClose: 4000,
      });
    } else {
      setError(res.message);
      toast.error(res.message || "Failed to send reset link", {
        position: "top-right",
        autoClose: 4000,
      });
    }
  };

  return (
    <div className="auth-wrapper">
      <Container fluid className="auth-container">
        <Row className="justify-content-center align-items-center min-vh-100">
          <Col lg={5} md={8} sm={10}>
            <Card className="auth-card fade-in">
              <Card.Body className="p-4 p-lg-5">
                <Link to="/login" className="back-button">
                  <FaArrowLeft /> Back to Login
                </Link>

                <div className="text-center mb-4">
                  <div className="forgot-icon mx-auto mb-3">
                    <FaEnvelope />
                  </div>
                  <h2 className="auth-title">Forgot Password?</h2>
                  <p className="auth-subtitle">
                    Enter your email address and we'll send you a link to reset your password.
                  </p>
                </div>

                {error && (
                  <Alert variant="danger" className="animate-slide-down">
                    <FaTimesCircle className="me-2" /> {error}
                  </Alert>
                )}

                {submitted ? (
                  <div className="success-animation text-center">
                    <div className="success-icon mb-3">
                      <FaCheckCircle />
                    </div>
                    <Alert variant="success" className="mt-3">
                      <strong>Check your email!</strong>
                      <p className="mb-0 mt-2">
                        We've sent a password reset link to <strong>{email}</strong>.
                        Please check your inbox and follow the instructions.
                      </p>
                    </Alert>
                    <Link to="/login" className="auth-btn-primary w-100 mt-3 d-inline-block text-center">
                      Return to Login
                    </Link>
                  </div>
                ) : (
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-4">
                      <Form.Label className="auth-label">Email Address</Form.Label>
                      <div className="input-icon-wrapper">
                        <FaEnvelope className="input-icon" />
                        <Form.Control
                          type="email"
                          placeholder="Enter your registered email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="with-icon"
                          required
                        />
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
                          Sending Reset Link...
                        </>
                      ) : (
                        "Send Reset Link"
                      )}
                    </Button>
                  </Form>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ForgotPassword;