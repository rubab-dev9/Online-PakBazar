import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import Footer from "../components/common/Footer";
import img1 from '../assets/mission.png';
import img2 from '../assets/vision.png';
import img3 from '../assets/secure-payment.png';
import img4 from '../assets/fast-delivery.png';
import img5 from '../assets/quality-product.png';
import '../css/about.css';

const About = () => {
  return (
    <div>
      {/* Hero Section */}
      <div className="about-hero d-flex align-items-center justify-content-center text-center">
        <Container>
          <h1 className="hero-title">About PakBazar</h1>
          <p className="hero-subtitle">Your trusted online marketplace in Pakistan</p>
        </Container>
      </div>

      {/* Mission & Vision */}
      <Container className="my-5">
        <Row className="text-center mb-5">
          <Col md={6} className="mb-4">
            <Card className="mission-card h-100 shadow-sm p-4 text-center">
              <Card.Body>
                <i className="bi bi-bullseye mission-icon"></i>
                <img src={img1} alt="Mission" className="img mb-3" />
                <h2 className="section-title">Our Mission</h2>
                <p>
                  Provide a seamless, secure online shopping experience with a wide range of products
                  at competitive prices.
                </p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} className="mb-4">
            <Card className="mission-card h-100 shadow-sm p-4 text-center">
              <Card.Body>
                <i className="bi bi-eye mission-icon"></i>
                <img src={img2} alt="Vision" className="img mb-3" />
                <h2 className="section-title">Our Vision</h2>
                <p>
                  Become Pakistan's most preferred online marketplace by delivering quality, trust,
                  and convenience to our customers.
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Why Choose Us */}
        <h2 className="text-center mb-4 section-heading">Why Choose PakBazar?</h2>
        <Row className="mb-5">
          <Col md={4} className="mb-4">
            <Card className="choose-card h-100 text-center p-4 shadow-sm">
              <i className="bi bi-shield-lock choose-icon"></i>
              <Card.Body>
                <img src={img3} alt="Secure Shopping" className="img mb-3" />
                <Card.Title>Secure Shopping</Card.Title>
                <Card.Text>Safe payments and top-notch data protection for every transaction.</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-4">
            <Card className="choose-card h-100 text-center p-4 shadow-sm">
              <i className="bi bi-truck choose-icon"></i>
              <Card.Body>
                <img src={img4} alt="Fast Delivery" className="img mb-3" />
                <Card.Title>Fast Delivery</Card.Title>
                <Card.Text>Reliable delivery across Pakistan within the shortest time possible.</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-4">
            <Card className="choose-card h-100 text-center p-4 shadow-sm">
              <i className="bi bi-stars choose-icon"></i>
              <Card.Body>
                <img src={img5} alt="Quality Products" className="img mb-3" />
                <Card.Title>Quality Products</Card.Title>
                <Card.Text>Verified sellers and top-quality products for peace of mind shopping.</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Call to Action */}
        <div className="text-center mb-5 cta-section">
          <h3 className="cta-title">Ready to start shopping?</h3>
          <Button href="/" className="cta-btn btn-lg mt-3">
            Browse Products
          </Button>
        </div>
      </Container>

    </div>
  );
};

export default About;