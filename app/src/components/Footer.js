// components/Footer.js

import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaMapMarkerAlt, FaPhoneAlt, FaInstagram } from 'react-icons/fa';
import Logo from '../assets/Cinema blanco (500 x 200 px).png';
import '../assets/footerStyle.css';

const Footer = () => {
  return (
    <footer className="footer mt-5">
      <Container>
        <Row className="align-items-center">
          <Col md={3} className="d-flex justify-content-center">
            <img src={Logo} alt="Cinema Oasis Logo" className="footer-logo" />
          </Col>
          <Col md={3} className="d-flex justify-content-center">
            <div className="footer-info">
              <p>
                <FaMapMarkerAlt className="footer-icon" />{' '}
                <a href="https://maps.app.goo.gl/HjFrkEEuHyPPmJNH8" target="_blank" rel="noopener noreferrer">
                  Ubicación
                </a>
              </p>
            </div>
          </Col>
          <Col md={3} className="d-flex justify-content-center">
            <div className="footer-info">
              <p>
                <FaPhoneAlt className="footer-icon" />{' '}
                <a href="tel:+18095016277">+1 809-501-6277</a>
              </p>
            </div>
          </Col>
          <Col md={3} className="d-flex justify-content-center">
            <div className="footer-info">
              <p>
                <FaInstagram className="footer-icon" />{' '}
                <a href="https://www.instagram.com/cinemaoasis" target="_blank" rel="noopener noreferrer">
                  Instagram
                </a>
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
