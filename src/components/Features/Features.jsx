import React from 'react';
import { motion } from 'framer-motion';
import { FaStethoscope, FaHospital, FaTint, FaCalendarAlt, FaAmbulance, FaStar } from 'react-icons/fa';
import './Features.css';

const Features = () => {
  const features = [
    {
      id: 1,
      title: 'Find Doctors',
      description: 'Search and connect with experienced doctors by specialty, ratings, and availability.',
      icon: FaStethoscope,
      color: '#0066CC',
      gradient: 'linear-gradient(135deg, #0066CC, #0052A3)',
    },
    {
      id: 2,
      title: 'Find Hospitals',
      description: 'Discover hospitals with advanced facilities, departments, and bed availability.',
      icon: FaHospital,
      color: '#00B4D8',
      gradient: 'linear-gradient(135deg, #00B4D8, #0096C7)',
    },
    {
      id: 3,
      title: 'Find Blood Banks',
      description: 'Locate nearby blood banks quickly and request blood when you need it most.',
      icon: FaTint,
      color: '#E63946',
      gradient: 'linear-gradient(135deg, #E63946, #C1121F)',
    },


  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.15 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  };

  return (
    <section className="features-section">
      <div className="features-wrapper">
        {/* Section Header */}
        <motion.div
          className="features-header"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          viewport={{ once: true }}
        >
          <span className="features-badge">What We Offer</span>
          <h2 className="features-title">Our Core Features</h2>
          <p className="features-subtitle">
            Everything you need for better healthcare — all in one platform.
          </p>
        </motion.div>

        {/* Feature Cards Grid */}
        <motion.div
          className="features-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.id}
                className="feature-card"
                variants={cardVariants}
                whileHover={{ y: -10 }}
              >
                {/* Icon Circle */}
                <motion.div
                  className="feature-icon-wrapper"
                  style={{ background: feature.gradient }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Icon className="feature-icon" />
                </motion.div>

                {/* Text */}
                <h3 className="feature-card-title">{feature.title}</h3>
                <p className="feature-desc">{feature.description}</p>

                {/* Learn More */}
                <motion.span
                  className="feature-link"
                  style={{ color: feature.color }}
                  whileHover={{ x: 4 }}
                >
                  Learn more →
                </motion.span>

                {/* Hover Border */}
                <div className="feature-border" style={{ background: feature.gradient }} />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
