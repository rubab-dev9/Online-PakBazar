import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import '../css/contact.css';
import api from '../auth/Services/api';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await api.post('/contact/send', formData);
            setSubmitted(true);
            setFormData({ name: '', email: '', subject: '', message: '' });

            // Auto hide success message after 5 seconds
            setTimeout(() => setSubmitted(false), 5000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send message. Please try again.');
            setTimeout(() => setError(''), 5000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {/* Hero Section - Same as About page */}
            <div className="contact-hero d-flex align-items-center justify-content-center text-center">
                <Container>
                    <h1 className="hero-title">Contact Us</h1>
                    <p className="hero-subtitle">We'd love to hear from you! Get in touch with our team.</p>
                </Container>
            </div>

            <Container className="my-5">
                <Row>
                    {/* Contact Information Cards */}
                    <Col lg={4} className="mb-4">
                        <Card className="contact-info-card h-100 text-center p-4 shadow-sm">
                            <div className="contact-icon-wrapper">
                                <FaEnvelope className="contact-icon" />
                            </div>
                            <Card.Body>
                                <h4>Email Us</h4>
                                <p>Our support team will get back to you within 24 hours.</p>
                                <strong>support@pakbazar.com</strong><br />
                                <strong>careers@pakbazar.com</strong>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col lg={4} className="mb-4">
                        <Card className="contact-info-card h-100 text-center p-4 shadow-sm">
                            <div className="contact-icon-wrapper">
                                <FaPhone className="contact-icon" />
                            </div>
                            <Card.Body>
                                <h4>Call Us</h4>
                                <p>Monday to Friday, 9 AM - 6 PM</p>
                                <strong>+92 21 12345678</strong><br />
                                <strong>+92 300 1234567</strong>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col lg={4} className="mb-4">
                        <Card className="contact-info-card h-100 text-center p-4 shadow-sm">
                            <div className="contact-icon-wrapper">
                                <FaMapMarkerAlt className="contact-icon" />
                            </div>
                            <Card.Body>
                                <h4>Visit Us</h4>
                                <p>Come say hello at our office</p>
                                <strong>123, Main Boulevard,<br />Gulberg III, Lahore, Pakistan</strong>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Contact Form & Map Section */}
                <Row className="mt-4">
                    <Col lg={7} className="mb-4">
                        <Card className="contact-form-card shadow-sm p-4">
                            <h3 className="text-center mb-4 section-heading">Send Us a Message</h3>
                            {submitted && (
                                <Alert variant="success" className="text-center">
                                    Thank you! Your message has been sent successfully.
                                </Alert>
                            )}
                            <Form onSubmit={handleSubmit}>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Your Name *</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                placeholder="Enter your full name"
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Email Address *</Form.Label>
                                            <Form.Control
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="Enter your email"
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Form.Group className="mb-3">
                                    <Form.Label>Subject *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        placeholder="What is this regarding?"
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Message *</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        name="message"
                                        rows={5}
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder="Write your message here..."
                                        required
                                    />
                                </Form.Group>
                                <div className="text-center">
                                    <Button type="submit" className="contact-submit-btn" disabled={loading}>
                                        {loading ? 'Sending...' : 'Send Message'}
                                    </Button>
                                </div>
                            </Form>
                        </Card>
                    </Col>

                    <Col lg={5} className="mb-4">
                        <Card className="contact-info-card shadow-sm p-4">
                            <h3 className="text-center mb-4 section-heading">Business Hours</h3>
                            <div className="business-hours">
                                <div className="hour-item">
                                    <FaClock className="hour-icon" />
                                    <div>
                                        <strong>Monday - Friday</strong>
                                        <p>9:00 AM - 6:00 PM</p>
                                    </div>
                                </div>
                                <div className="hour-item">
                                    <FaClock className="hour-icon" />
                                    <div>
                                        <strong>Saturday</strong>
                                        <p>10:00 AM - 4:00 PM</p>
                                    </div>
                                </div>
                                <div className="hour-item">
                                    <FaClock className="hour-icon" />
                                    <div>
                                        <strong>Sunday</strong>
                                        <p>Closed</p>
                                    </div>
                                </div>
                            </div>

                            <div className="social-links text-center mt-4">
                                <h4>Follow Us</h4>
                                <div className="social-icons">
                                    <a href="#" className="social-icon"><FaFacebook /></a>
                                    <a href="#" className="social-icon"><FaTwitter /></a>
                                    <a href="#" className="social-icon"><FaInstagram /></a>
                                    <a href="#" className="social-icon"><FaLinkedin /></a>
                                </div>
                            </div>
                        </Card>
                    </Col>
                </Row>

                {/* Map Section */}
                <Row className="mt-4">
                    <Col lg={12}>
                        <Card className="map-card shadow-sm">
                            <Card.Body className="p-0">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d217194.84356948355!2d74.20831571640624!3d31.483322349999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39190483e58107d9%3A0xc23abe6ccc7e2462!2sLahore%2C%20Punjab%2C%20Pakistan!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s"
                                    width="100%"
                                    height="300"
                                    style={{ border: 0, borderRadius: '12px' }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    title="PakBazar Location"
                                ></iframe>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Contact;