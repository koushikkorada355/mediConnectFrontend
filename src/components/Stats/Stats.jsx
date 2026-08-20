import React from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaHospital, FaHeartbeat, FaAward } from 'react-icons/fa';
import './Stats.css';

const Stats = () => {
  const stats = [
    {
      id: 1,
      icon: FaUsers,
      value: '2.5M+',
      label: 'Active Users',
      color: '#0066CC',
    },
    {
      id: 2,
      icon: FaHospital,
      value: '500+',
      label: 'Hospitals',
      color: '#00B4D8',
    },
    {
      id: 3,
      icon: FaHeartbeat,
      value: '10M+',
      label: 'Services',
      color: '#06D6A0',
    },
    {
      id: 4,
      icon: FaAward,
      value: '4.9/5',
      label: 'Rating',
      color: '#F77F00',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section className="stats-section">
      <div className="stats-wrapper">
        {/* Header */}
        <motion.div
          className="stats-header"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="stats-title">Healthcare at Scale</h2>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          className="stats-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-30px' }}
        >
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.id}
                className="stat-card"
                style={{ '--stat-color': stat.color }}
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
                {/* Icon */}
                <motion.div
                  className="stat-icon"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Icon size={24} />
                </motion.div>

                {/* Value */}
                <h3 className="stat-value">{stat.value}</h3>

                {/* Label */}
                <p className="stat-label">{stat.label}</p>

                {/* Accent Line */}
                <motion.div
                  className="stat-line"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  transition={{ duration: 0.6, delay: stat.id * 0.1 }}
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

export default Stats;
