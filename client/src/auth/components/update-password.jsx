import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from "react-bootstrap";
import { useAuth } from "../../auth/context/AuthContext";
import { FaEye, FaEyeSlash, FaLock, FaCheckCircle, FaTimesCircle, FaKey, FaUserLock } from "react-icons/fa";
import { toast } from "react-toastify";
import "../../css/auth.css";

const UpdatePassword = () => {
  const navigate = useNavigate();
  const { updatePassword, logout } = useAuth();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
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

  const handleNewPasswordChange = (e) => {
    const newPasswordValue = e.target.value;
    setNewPassword(newPasswordValue);
    checkPasswordStrength(newPasswordValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate old password is not empty
    if (!oldPassword) {
      setError("Please enter your current password");
      return;
    }

    // Validate new password matches confirm password
    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match");
      return;
    }

    // Validate new password is different from old password
    if (oldPassword === newPassword) {
      setError("New password must be different from your current password");
      return;
    }

    // Validate password strength
    if (!Object.values(passwordStrength).every(Boolean)) {
      setError("Please meet all password requirements");
      return;
    }

    setLoading(true);

    const res = await updatePassword(oldPassword, newPassword, confirmPassword);

    setLoading(false);

    if (res.success) {
      setSubmitted(true);
      toast.success("Password updated successfully! Please login again.", {
        position: "top-right",
        autoClose: 3000,
      });
      
      // Logout the user after 2 seconds to force re-login with new password
      setTimeout(async () => {
        await logout();
        navigate("/login");
      }, 2000);
    } else {
      setError(res.message);
      toast.error(res.message || "Failed to update password", {
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
                    <FaUserLock />
                  </div>
                  <h2 className="auth-title">Update Password</h2>
                  <p className="auth-subtitle">
                    Change your password to keep your account secure
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
                      <strong>Password Updated Successfully!</strong>
                      <p className="mb-0 mt-2">
                        Your password has been updated successfully.
                        You will be redirected to login page...
                      </p>
                    </Alert>
                  </div>
                ) : (
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label className="auth-label">Current Password</Form.Label>
                      <div className="password-input-wrapper">
                        <FaKey className="input-icon" />
                        <Form.Control
                          type={showOldPassword ? "text" : "password"}
                          value={oldPassword}
                          onChange={(e) => setOldPassword(e.target.value)}
                          onBlur={() => setTouched({ ...touched, oldPassword: true })}
                          className="with-icon"
                          required
                          placeholder="Enter your current password"
                        />
                        <button
                          type="button"
                          className="password-toggle"
                          onClick={() => setShowOldPassword(!showOldPassword)}
                        >
                          {showOldPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label className="auth-label">New Password</Form.Label>
                      <div className="password-input-wrapper">
                        <FaLock className="input-icon" />
                        <Form.Control
                          type={showNewPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={handleNewPasswordChange}
                          onBlur={() => setTouched({ ...touched, newPassword: true })}
                          className={touched.newPassword && newPassword && !isPasswordValid ? "is-invalid" : "with-icon"}
                          required
                          placeholder="Enter new password"
                        />
                        <button
                          type="button"
                          className="password-toggle"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>

                      {touched.newPassword && newPassword && (
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
                      <Form.Label className="auth-label">Confirm New Password</Form.Label>
                      <div className="password-input-wrapper">
                        <FaLock className="input-icon" />
                        <Form.Control
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          onBlur={() => setTouched({ ...touched, confirmPassword: true })}
                          className={touched.confirmPassword && confirmPassword && newPassword !== confirmPassword ? "is-invalid" : "with-icon"}
                          required
                          placeholder="Confirm your new password"
                        />
                        <button
                          type="button"
                          className="password-toggle"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                      {touched.confirmPassword && confirmPassword && newPassword !== confirmPassword && (
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
                          Updating Password...
                        </>
                      ) : (
                        "Update Password"
                      )}
                    </Button>

                    <div className="text-center mt-4">
                      <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="auth-link bg-transparent border-0"
                      >
                        ← Go Back
                      </button>
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

export default UpdatePassword;