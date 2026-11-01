import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from "react-bootstrap";
import { useAuth } from "../../auth/context/AuthContext";
import { FaEye, FaEyeSlash, FaLock, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import "../../css/auth.css";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { resetPassword } = useAuth();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [touched, setTouched] = useState({});

  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });

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
    setPassword(newPassword);
    checkPasswordStrength(newPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!Object.values(passwordStrength).every(Boolean)) {
      setError("Please meet all password requirements");
      return;
    }

    setLoading(true);

    const res = await resetPassword(token, password, confirmPassword);

    setLoading(false);

    if (res.success) {
      setSubmitted(true);
      toast.success("Password reset successful!", {
        position: "top-right",
        autoClose: 3000,
      });
      setTimeout(() => navigate("/login"), 2000);
    } else {
      setError(res.message);
      toast.error(res.message || "Failed to reset password", {
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
                  <div className="reset-icon mx-auto mb-3">
                    <FaLock />
                  </div>
                  <h2 className="auth-title">Reset Password</h2>
                  <p className="auth-subtitle">
                    Create a new strong password for your account
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
                      <strong>Password Reset Successful!</strong>
                      <p className="mb-0 mt-2">
                        Your password has been reset successfully.
                        Redirecting you to login...
                      </p>
                    </Alert>
                  </div>
                ) : (
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label className="auth-label">New Password</Form.Label>
                      <div className="password-input-wrapper">
                        <FaLock className="input-icon" />
                        <Form.Control
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={handlePasswordChange}
                          onBlur={() => setTouched({ ...touched, password: true })}
                          className={touched.password && password && !isPasswordValid ? "is-invalid" : "with-icon"}
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

                      {touched.password && password && (
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

                    <Form.Group className="mb-4">
                      <Form.Label className="auth-label">Confirm Password</Form.Label>
                      <div className="password-input-wrapper">
                        <FaLock className="input-icon" />
                        <Form.Control
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          onBlur={() => setTouched({ ...touched, confirmPassword: true })}
                          className={touched.confirmPassword && confirmPassword && password !== confirmPassword ? "is-invalid" : "with-icon"}
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
                      {touched.confirmPassword && confirmPassword && password !== confirmPassword && (
                        <Form.Text className="text-danger">Passwords do not match</Form.Text>
                      )}
                    </Form.Group>

                    <Button
                      type="submit"
                      className="auth-btn-primary w-100"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Spinner as="span" animation="border" size="sm" className="me-2" />
                          Resetting Password...
                        </>
                      ) : (
                        "Reset Password"
                      )}
                    </Button>

                    <div className="text-center mt-4">
                      <Link to="/login" className="auth-link">
                        ← Back to Login
                      </Link>
                    </div>
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

export default ResetPassword;