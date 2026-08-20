import React from 'react';
import { motion } from 'framer-motion';
import { FaStar, FaQuoteLeft, FaUser, FaStethoscope, FaHeartbeat, FaHospital } from 'react-icons/fa';
import './Testimonials.css';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Patient',
      icon: FaUser,
      text: 'Found a specialist in minutes. Amazing experience!',
      rating: 5,
      color: '#0066CC',
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      role: 'Cardiologist',
      icon: FaStethoscope,
      text: 'Streamlined my practice management beautifully.',
      rating: 5,
      color: '#00B4D8',
    },
    {
      id: 3,
      name: 'Priya Sharma',
      role: 'Nurse',
      icon: FaHeartbeat,
      text: 'Found nearest hospital instantly. Life-saving!',
      rating: 0,
      color: '#06D6A0',
    },
    {
      id: 4,
      name: 'James Wilson',
      role: 'Hospital Admin',
      icon: FaHospital,
      text: 'Patient intake process is now super efficient.',
      rating: 4.8,
      color: '#F77F00',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <section className="testimonials-section">
      <div className="testimonials-container">
        <div className="testimonials-bg">
          <div className="bg-circle bg-1" />
          <div className="bg-circle bg-2" />
          <div className="bg-circle bg-3" />
        </div>

        <motion.div
          className="testimonials-header"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="header-top">
            <h2 className="testimonials-title">Loved by Healthcare Heroes</h2>
            <p className="testimonials-subtitle">
              Join millions trusting MediCare for better health outcomes
            </p>
          </div>
        </motion.div>

        <motion.div
          className="testimonials-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-30px' }}
        >
          {testimonials.map((testimonial, index) => {
            const IconComponent = testimonial.icon;
            return (
              <motion.div
                key={testimonial.id}
                className="testimonial-card"
                variants={cardVariants}
                style={{ '--card-color': testimonial.color }}
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="card-bg-accent" />

                <div className="card-header">
                  <motion.div
                    className="quote-icon"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    <FaQuoteLeft size={18} />
                  </motion.div>

                  <div className="rating-stars">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
                      >
                        <FaStar
                          size={12}
                          className={i < Math.floor(testimonial.rating) ? 'star-filled' : 'star-empty'}
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>

                <p className="testimonial-text">{testimonial.text}</p>

                <div className="card-divider">
                  <motion.div
                    className="divider-dot"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                  />
                </div>

                <div className="author-section">
                  <motion.div
                    className="author-avatar"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <IconComponent size={24} />
                  </motion.div>
                  <div className="author-info">
                    <h4 className="author-name">{testimonial.name}</h4>
                    <p className="author-role">{testimonial.role}</p>
                  </div>
                </div>

                <motion.div
                  className="card-accent-line"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
