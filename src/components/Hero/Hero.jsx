import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
  const navigate = useNavigate();

  // Container animation with stagger
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  // Title animation - slide in from left with rotation
  const titleVariants = {
    hidden: { opacity: 0, x: -50, rotateY: 90 },
    visible: {
      opacity: 1,
      x: 0,
      rotateY: 0,
      transition: { duration: 1, ease: 'easeOut' },
    },
  };

  // Subtitle animation - fade and slide from right
  const subtitleVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  // Button animation - scale with pulse
  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
    hover: {
      scale: 1.08,
      boxShadow: '0 15px 40px rgba(220, 38, 38, 0.3)',
      transition: { duration: 0.3 },
    },
    tap: { scale: 0.92 },
  };

  // Pulse animation for accent elements
  const pulseVariants = {
    animate: {
      boxShadow: [
        '0 0 0 0 rgba(220, 38, 38, 0.7)',
        '0 0 0 15px rgba(220, 38, 38, 0)',
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
      },
    },
  };

  // Floating icons animation
  const floatingVariants = {
    animate: {
      y: [0, -25, 0],
      rotation: [0, 5, -5, 0],
      transition: {
        duration: 5,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <motion.section
      className="hero"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Animated background with gradient mesh */}
      <div className="hero-background" />
      
      {/* Animated background blobs */}
      <motion.div 
        className="hero-blob hero-blob-1"
        animate={{
          x: [0, 50, -30, 0],
          y: [0, -50, 30, 0],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div 
        className="hero-blob hero-blob-2"
        animate={{
          x: [0, -40, 60, 0],
          y: [0, 40, -50, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      />

      {/* Decorative accent lines */}
      <motion.div className="hero-line-1" />
      <motion.div className="hero-line-2" />

      {/* Content */}
      <div className="hero-content">
        {/* Main heading */}
        <motion.h1 className="hero-title" variants={titleVariants}>
          Find Your Perfect Healthcare Provider
          <br />
          <span className="hero-highlight">Fast & Easy</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p className="hero-subtitle" variants={subtitleVariants}>
          MediConnect connects you with verified doctors and hospitals near you. Access medical records, and manage your health all in one place.
        </motion.p>

        {/* Trust badges */}
        <motion.div className="hero-trust" variants={subtitleVariants}>
          <div className="trust-badge">
            <span className="trust-number">5000+</span>
            <span className="trust-label">Verified Doctors</span>
          </div>
          <div className="trust-divider" />
          <div className="trust-badge">
            <span className="trust-number">500+</span>
            <span className="trust-label">Hospitals</span>
          </div>
          <div className="trust-divider" />
          <div className="trust-badge">
            <span className="trust-number">100K+</span>
            <span className="trust-label">Users Trust Us</span>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div className="hero-buttons" variants={subtitleVariants}>
          <motion.button
            className="btn btn-primary"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => navigate('/doctors')}
          >
            Find Doctors
          </motion.button>
          <motion.button
            className="btn btn-secondary"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => navigate('/hospitals')}
          >
            Find Hospitals
          </motion.button>
        </motion.div>

        {/* App Features */}
        <motion.div 
          className="hero-features-section" 
          variants={subtitleVariants}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.div 
            className="feature-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            whileHover={{ scale: 1.05, y: -10 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.div 
              className="feature-card-icon"
              whileHover={{ 
                scale: 1.15,
                boxShadow: "0 0 20px rgba(0, 102, 204, 0.4)"
              }}
              transition={{ duration: 0.3 }}
            >
              <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="lockGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0066CC" />
                    <stop offset="100%" stopColor="#0052A3" />
                  </linearGradient>
                </defs>
                <rect x="13" y="23" width="26" height="20" rx="2.5" fill="url(#lockGradient)"/>
                <path d="M18 23V17C18 12.6 21.6 9 26 9C30.4 9 34 12.6 34 17V23" stroke="url(#lockGradient)" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
                <circle cx="26" cy="33" r="2" fill="#F5F7FA"/>
              </svg>
            </motion.div>
            <h4>Secure & Private</h4>
            <p>Your health data is encrypted and fully protected</p>
          </motion.div>

          <motion.div 
            className="feature-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
            whileHover={{ scale: 1.05, y: -10 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.div 
              className="feature-card-icon"
              whileHover={{ 
                scale: 1.15,
                boxShadow: "0 0 20px rgba(0, 102, 204, 0.4)"
              }}
              transition={{ duration: 0.3 }}
            >
              <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="clockGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0066CC" />
                    <stop offset="100%" stopColor="#0052A3" />
                  </linearGradient>
                </defs>
                <circle cx="26" cy="26" r="18" fill="none" stroke="url(#clockGradient)" strokeWidth="2.3"/>
                <circle cx="26" cy="26" r="14" fill="none" stroke="url(#clockGradient)" strokeWidth="1.2" opacity="0.25"/>
                <circle cx="26" cy="26" r="2.2" fill="url(#clockGradient)"/>
                <path d="M26 12V26L35 35" stroke="url(#clockGradient)" strokeWidth="2.3" strokeLinecap="round"/>
              </svg>
            </motion.div>
            <h4>Instant Consultation</h4>
            <p>Get medical advice from verified doctors instantly</p>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Hero;
