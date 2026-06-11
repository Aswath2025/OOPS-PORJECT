import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import '../../styles/Layout.css';

const Footer = () => {
  return (
    <footer className="bg-dark text-white mt-5 py-4">
      <Container>
        <Row>
          <Col md={3} className="mb-3">
            <h5>ExamGuide</h5>
            <p>Your complete platform for exam preparation and scholarship discovery.</p>
          </Col>
          <Col md={3} className="mb-3">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="/exams" className="text-white-50">Exams</a></li>
              <li><a href="/scholarships" className="text-white-50">Scholarships</a></li>
              <li><a href="/materials" className="text-white-50">Study Materials</a></li>
            </ul>
          </Col>
          <Col md={3} className="mb-3">
            <h5>Support</h5>
            <ul className="list-unstyled">
              <li><a href="#faq" className="text-white-50">FAQ</a></li>
              <li><a href="#contact" className="text-white-50">Contact Us</a></li>
              <li><a href="#about" className="text-white-50">About Us</a></li>
            </ul>
          </Col>
          <Col md={3} className="mb-3">
            <h5>Legal</h5>
            <ul className="list-unstyled">
              <li><a href="#privacy" className="text-white-50">Privacy Policy</a></li>
              <li><a href="#terms" className="text-white-50">Terms of Service</a></li>
            </ul>
          </Col>
        </Row>
        <hr className="border-secondary" />
        <Row>
          <Col className="text-center">
            <p className="text-white-50 mb-0">&copy; 2024 ExamGuide. All rights reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
