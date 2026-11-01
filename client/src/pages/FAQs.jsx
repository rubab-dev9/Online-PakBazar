import React, { useState } from 'react';
import { Container, Row, Col, Card, Accordion } from 'react-bootstrap';
import { FaQuestionCircle, FaShippingFast, FaUndo, FaCreditCard, FaShieldAlt, FaHeadset } from 'react-icons/fa';
import '../css/faqs.css';

const FAQs = () => {
    const faqs = [
        {
            id: '1',
            question: 'How do I place an order?',
            answer: 'Simply browse products, add items to cart, proceed to checkout, and confirm your order. You will receive a confirmation message.',
            icon: <FaQuestionCircle />
        },
        {
            id: '2',
            question: 'What payment methods are accepted?',
            answer: 'We offer Cash on Delivery (COD) across Pakistan. Online payments coming soon!',
            icon: <FaCreditCard />
        },
        {
            id: '3',
            question: 'How long does delivery take?',
            answer: 'Delivery typically takes 3-5 business days depending on your location. Major cities may get faster delivery.',
            icon: <FaShippingFast />
        },
        {
            id: '4',
            question: 'Can I cancel my order?',
            answer: 'Yes, you can cancel your order within 1 hour of placing it. Go to My Orders and click cancel.',
            icon: <FaUndo />
        },
        {
            id: '5',
            question: 'Is my payment information secure?',
            answer: 'Yes, we use secure encryption for all transactions. Your payment information is protected.',
            icon: <FaShieldAlt />
        },
        {
            id: '6',
            question: 'How to contact customer support?',
            answer: 'You can email us at support@pakbazar.com or call +92 123 4567890, Monday to Friday, 9 AM to 6 PM.',
            icon: <FaHeadset />
        }
    ];

    return (
        <div>
            {/* Hero Section */}
            <div className="faqs-hero d-flex align-items-center justify-content-center text-center">
                <Container>
                    <h1 className="hero-title">Frequently Asked Questions</h1>
                    <p className="hero-subtitle">Find answers to common questions about PakBazar</p>
                </Container>
            </div>

            <Container className="my-5">
                <Row>
                    <Col lg={8} className="mx-auto">
                        <Card className="faqs-card shadow-sm">
                            <Card.Body className="p-4">
                                <Accordion defaultActiveKey="0">
                                    {faqs.map((faq, index) => (
                                        <Accordion.Item eventKey={faq.id} key={faq.id}>
                                            <Accordion.Header>
                                                <div className="faq-question">
                                                    <span className="faq-icon">{faq.icon}</span>
                                                    <span>{faq.question}</span>
                                                </div>
                                            </Accordion.Header>
                                            <Accordion.Body>
                                                <p className="faq-answer">{faq.answer}</p>
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    ))}
                                </Accordion>
                            </Card.Body>
                        </Card>

                        {/* Still have questions */}
                        <div className="text-center mt-5 p-4 contact-cta">
                            <h4>Still have questions?</h4>
                            <p>Can't find what you're looking for? Contact our support team</p>
                            <a href="/contact" className="contact-cta-btn">Contact Us</a>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default FAQs;