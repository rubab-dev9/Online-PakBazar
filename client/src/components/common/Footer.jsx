import { Container, Row, Col } from "react-bootstrap";
import logo from "../../assets/favicon.png";
import '../../css/footer.css';

const Footer = () => {
  return (
    <footer className="footer-section mt-5">
      <Container>
        <Row className="py-5 text-white">

          {/* Column 1: Logo & Tagline */}
          <Col md={4} className="mb-4 logo">
            <img src={logo} alt="PakBazar Logo" height="54" className="mb-3" />
            <span>PakBazar</span>
            <p>Your online marketplace for everything.</p>
          </Col>

          {/* Column 2: Quick Links */}
          <Col md={4} className="mb-4">
            <h5 className="footer-heading">Quick Links</h5>
            <ul className="footer-links">
              <li><a href="/">Home</a></li>
              <li><a href="/about">About</a></li>
              <li><a href="/contact">Contact us</a></li>
              <li><a href="/faqs">FAQs</a></li>
            </ul>
          </Col>

          {/* Column 3: Contact Info */}
          <Col md={4} className="mb-4">
            <h5 className="footer-heading">Contact Info</h5>
            <div className="contact">
              <p><strong>Address:</strong> Gujranwala, Pakistan</p>
              <p><strong>Phone:</strong> +92 303 8862230</p>
              <p><strong>Email:</strong> bc220401286uer@vu.edu.pk</p>
            </div>
          </Col>

        </Row>

        {/* Horizontal Line */}
        <hr className="footer-divider" />

        {/* Copyright */}
        <Row>
          <Col>
            <p className="text-center footer-bottom-text">
              &copy; {new Date().getFullYear()} PakBazar. All rights reserved.
            </p>
          </Col>
        </Row>

      </Container>
    </footer>
  );
};

export default Footer;