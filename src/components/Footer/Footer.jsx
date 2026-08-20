import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaHeartbeat,
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
} from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'About Us', path: '/about' },
    { name: 'Contact Us', path: '/contact' },
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Terms of Service', path: '/terms' },
  ];

  const socialLinks = [
    { icon: <FaFacebookF />, url: '#', label: 'Facebook' },
    { icon: <FaTwitter />, url: '#', label: 'Twitter' },
    { icon: <FaLinkedinIn />, url: '#', label: 'LinkedIn' },
    { icon: <FaInstagram />, url: '#', label: 'Instagram' },
  ];

  return (
    <footer className="footer">
      <div className="footer-inner">
        {/* Brand Column */}
        <div className="footer-brand-section">
          <Link to="/" className="footer-brand">
            <FaHeartbeat className="footer-brand-icon" />
            <div className="footer-brand-text">
              <span className="footer-brand-name">
                Medi<span className="footer-brand-highlight">Connect</span>
              </span>
              <span className="footer-brand-desc">Your trusted healthcare platform</span>
            </div>
          </Link>
        </div>

        {/* Quick Links */}
        <div className="footer-links-section">
          <h4 className="footer-section-title">Quick Links</h4>
          <ul className="footer-links">
            {quickLinks.map((link) => (
              <li key={link.name}>
                <Link to={link.path} className="footer-link">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Social & Copyright */}
        <div className="footer-right">
          <h4 className="footer-section-title">Follow Us</h4>
          <div className="footer-social">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.url}
                className="footer-social-link"
                aria-label={social.label}
                target="_blank"
                rel="noopener noreferrer"
              >
                {social.icon}
              </a>
            ))}
          </div>
          <p className="footer-copyright">
            © {currentYear} MediConnect<br />All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

