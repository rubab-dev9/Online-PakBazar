import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/context/AuthContext";
import { Container, Row, Col, Card, Button, Alert, Spinner } from "react-bootstrap";
import { FaArrowLeft, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import "../../css/auth.css";

const VerifyOtp = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { verifyOtp, resendOtp } = useAuth();

  const [otp, setOtp] = useState(["", "", "", ""]); // Changed to 4 digits
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);

  const email = state?.email;

  useEffect(() => {
    if (!email) {
      navigate("/login");
    }
  }, [email, navigate]);

  useEffect(() => {
    if (timeLeft > 0 && !canResend) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !canResend) {
      setCanResend(true);
    }
  }, [timeLeft, canResend]);

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 3) { // Changed from 5 to 3
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");
    
    if (otpValue.length !== 4) { // Changed from 6 to 4
      setError("Please enter the complete 4-digit OTP");
      return;
    }

    setError("");
    setLoading(true);

    const res = await verifyOtp(email, otpValue);

    setLoading(false);

    if (res.success) {
      toast.success("Email verified successfully!", {
        position: "top-right",
        autoClose: 2000,
      });
      navigate("/");
    } else {
      setError(res.message);
      toast.error(res.message || "Invalid OTP", {
        position: "top-right",
        autoClose: 4000,
      });
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    const res = await resendOtp(email);
    setResendLoading(false);

    if (res.success) {
      setCanResend(false);
      setTimeLeft(60);
      setOtp(["", "", "", ""]); // Reset to 4 empty strings
      inputRefs.current[0].focus();
      toast.info("New OTP sent to your email", {
        position: "top-right",
        autoClose: 3000,
      });
    } else {
      toast.error(res.message || "Failed to resend OTP", {
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
                <button 
                  className="back-button"
                  onClick={() => navigate("/login")}
                >
                  <FaArrowLeft /> Back
                </button>

                <div className="text-center mb-4">
                  <div className="otp-icon mx-auto mb-3">
                    <FaCheckCircle />
                  </div>
                  <h2 className="auth-title">Verify Your Email</h2>
                  <p className="auth-subtitle">
                    We've sent a verification code to
                    <br />
                    <strong>{email}</strong>
                  </p>
                </div>

                {error && (
                  <Alert variant="danger" className="animate-slide-down">
                    <FaTimesCircle className="me-2" /> {error}
                  </Alert>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="otp-input-group otp-4digit">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => (inputRefs.current[index] = el)}
                        type="text"
                        className="otp-input"
                        maxLength="1"
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                      />
                    ))}
                  </div>

                  <Button
                    type="submit"
                    className="auth-btn-primary w-100 mt-4"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Spinner as="span" animation="border" size="sm" className="me-2" />
                        Verifying...
                      </>
                    ) : (
                      "Verify Account"
                    )}
                  </Button>
                </form>

                <div className="text-center mt-4">
                  <p className="auth-footer-text">
                    Didn't receive the code?{" "}
                    {canResend ? (
                      <button
                        onClick={handleResendOtp}
                        className="resend-link"
                        disabled={resendLoading}
                      >
                        {resendLoading ? "Sending..." : "Resend OTP"}
                      </button>
                    ) : (
                      <span className="resend-timer">Resend in {timeLeft}s</span>
                    )}
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default VerifyOtp;