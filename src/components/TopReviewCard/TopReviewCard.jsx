import React from 'react';
import { motion } from 'framer-motion';
import { FaStar, FaStarHalfAlt, FaRegStar, FaQuoteLeft } from 'react-icons/fa';
import { FiCheck } from 'react-icons/fi';
import './TopReviewCard.css';

const AVATAR_COLORS = [
  ['#0d9488', '#14b8a6'],
  ['#7c3aed', '#a78bfa'],
  ['#db2777', '#f472b6'],
  ['#ea580c', '#fb923c'],
  ['#2563eb', '#60a5fa'],
  ['#059669', '#34d399'],
  ['#d97706', '#fbbf24'],
  ['#dc2626', '#f87171'],
];

const TopReviewCard = ({ review, isVisible = true }) => {
  if (!review) return null;

  const getRatingColor = (r) => {
    if (r >= 4) return '#059669';
    if (r >= 3) return '#d97706';
    return '#dc2626';
  };

  const getRatingLabel = (r) => {
    if (r >= 4.5) return 'Excellent';
    if (r >= 4) return 'Very Good';
    if (r >= 3.5) return 'Good';
    if (r >= 3) return 'Average';
    if (r >= 2) return 'Below Average';
    return 'Poor';
  };

  const getTimeAgo = (dateStr) => {
    const diff = Math.floor((new Date() - new Date(dateStr)) / (1000 * 60 * 60 * 24));
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    if (diff < 7) return `${diff}d ago`;
    if (diff < 30) return `${Math.floor(diff / 7)}w ago`;
    if (diff < 365) return `${Math.floor(diff / 30)}mo ago`;
    return `${Math.floor(diff / 365)}y ago`;
  };

  const getAvatarGradient = (name) => {
    const idx = (name || 'U').charCodeAt(0) % AVATAR_COLORS.length;
    return `linear-gradient(135deg, ${AVATAR_COLORS[idx][0]}, ${AVATAR_COLORS[idx][1]})`;
  };

  const renderStars = (rating, size = 16) => {
    const stars = [];
    const r = Number(rating) || 0;
    const full = Math.floor(r);
    const hasHalf = r % 1 >= 0.5;
    for (let i = 0; i < full; i++) stars.push(<FaStar key={`f-${i}`} size={size} className="trc-star trc-star--filled" />);
    if (hasHalf) stars.push(<FaStarHalfAlt key="h" size={size} className="trc-star trc-star--filled" />);
    for (let i = 0; i < 5 - full - (hasHalf ? 1 : 0); i++) stars.push(<FaRegStar key={`e-${i}`} size={size} className="trc-star trc-star--empty" />);
    return stars;
  };

  return (
    <motion.div
      className="trc"
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={isVisible ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 100, damping: 15 }}
      whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(0,0,0,0.12)' }}
    >
      {/* Top Badge */}
      <div className="trc__badge">⭐ Top Review</div>

      {/* Quote Icon */}
      <div className="trc__quote-icon">
        <FaQuoteLeft size={20} />
      </div>

      {/* Rating Pill */}
      <div className="trc__rating-pill" style={{ background: getRatingColor(review.rating) }}>
        <FaStar size={13} />
        <span>{review.rating}.0</span>
        <span className="trc__rating-label">{getRatingLabel(review.rating)}</span>
      </div>

      {/* Title */}
      <h3 className="trc__title">{review.title}</h3>

      {/* Description */}
      <p className="trc__description">
        {review.description.length > 220
          ? review.description.substring(0, 220) + '...'
          : review.description
        }
      </p>

      {/* Visit Reason */}
      {review.visitReason && (
        <div className="trc__visit-reason">
          <strong>Visit:</strong> {review.visitReason}
        </div>
      )}

      {/* Footer */}
      <div className="trc__footer">
        <div className="trc__user">
          <div className="trc__avatar" style={{ background: getAvatarGradient(review.user) }}>
            {(review.user || 'U').charAt(0).toUpperCase()}
          </div>
          <div className="trc__user-info">
            <span className="trc__user-name">
              {review.user}
              {review.isVerified && <FiCheck className="trc__verified-icon" />}
            </span>
            <span className="trc__date">{getTimeAgo(review.date)}</span>
          </div>
        </div>
        <div className="trc__stars">{renderStars(review.rating, 14)}</div>
      </div>
    </motion.div>
  );
};

export default TopReviewCard;
