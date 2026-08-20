import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  FiUser, FiCalendar, FiEdit2, FiTrash2, FiChevronDown, FiChevronUp,
  FiCheck, FiX, FiMessageSquare, FiThumbsUp, FiArrowRight
} from 'react-icons/fi';
import { FaStar, FaStarHalfAlt, FaRegStar, FaQuoteLeft } from 'react-icons/fa';
import {
  getDoctorReviews,
  addReview,
  updateReview,
  deleteReview,
  getHospitalReviews
} from '../../store/slices/reviewSlice';
import {
  selectDoctorReviews,
  selectDoctorAverageRating,
  selectDoctorTotalReviews,
  selectDoctorRatingBreakdown,
  selectHospitalReviews,
  selectHospitalAverageRating,
  selectHospitalTotalReviews,
  selectHospitalRatingBreakdown,
  selectReviewLoading,
  selectReviewError
} from '../../store/selectors/reviewSelectors';
import { selectIsLoggedIn } from '../../store/selectors/authSelectors';
import './ReviewSection.css';

const MAX_VISIBLE = 5;

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

const ReviewSection = ({ doctorId, reviewType = 'DOCTOR' }) => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  const doctorReviews = useSelector(selectDoctorReviews);
  const hospitalReviews = useSelector(selectHospitalReviews);

  const reviews = reviewType === 'DOCTOR' ? (doctorReviews || []) : (hospitalReviews || []);
  const averageRating = reviewType === 'DOCTOR'
    ? useSelector(selectDoctorAverageRating)
    : useSelector(selectHospitalAverageRating);
  const totalReviews = reviewType === 'DOCTOR'
    ? useSelector(selectDoctorTotalReviews)
    : useSelector(selectHospitalTotalReviews);
  const ratingBreakdown = reviewType === 'DOCTOR'
    ? useSelector(selectDoctorRatingBreakdown)
    : useSelector(selectHospitalRatingBreakdown);
  const loading = useSelector(selectReviewLoading);
  const error = useSelector(selectReviewError);

  const [showForm, setShowForm] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [hoverRating, setHoverRating] = useState(0);
  const [formData, setFormData] = useState({ rating: 0, title: '', description: '' });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (doctorId) {
      if (reviewType === 'DOCTOR') {
        dispatch(getDoctorReviews({ doctorId, page: 1, limit: 10, sortBy: 'recent' }));
      } else {
        dispatch(getHospitalReviews({ hospitalId: doctorId, page: 1, limit: 10, sortBy: 'recent' }));
      }
    }
  }, [doctorId, reviewType, dispatch]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'rating' ? parseInt(value) : value }));
    setFormError('');
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!isLoggedIn) { setFormError('Please login to post a review'); return; }
    if (formData.rating === 0) { setFormError('Please select a rating'); return; }
    if (!formData.title.trim() || !formData.description.trim()) { setFormError('Please fill in all fields'); return; }
    if (formData.description.length < 10) { setFormError('Description must be at least 10 characters'); return; }

    const reviewData = {

      reviewType,
      doctorId: reviewType === 'DOCTOR' ? doctorId : undefined,
      hospitalId: reviewType === 'HOSPITAL' ? doctorId : undefined,
      rating: formData.rating,
      title: formData.title,
      description: formData.description
    };

    if (editingReview) {
      dispatch(updateReview({ reviewId: editingReview._id, updateData: { rating: formData.rating, title: formData.title, description: formData.description } }));
      setEditingReview(null);
    } else {
      dispatch(addReview(reviewData));
    }
    setFormData({ rating: 0, title: '', description: '' });
    setShowForm(false);
  };

  const renderStars = (rating, size = 16) => {
    const stars = [];
    const r = Number(rating) || 0;
    const full = Math.floor(r);
    const hasHalf = r % 1 >= 0.5;
    for (let i = 0; i < full; i++) stars.push(<FaStar key={`f-${i}`} size={size} className="rv-star rv-star--filled" />);
    if (hasHalf) stars.push(<FaStarHalfAlt key="h" size={size} className="rv-star rv-star--filled" />);
    for (let i = 0; i < 5 - full - (hasHalf ? 1 : 0); i++) stars.push(<FaRegStar key={`e-${i}`} size={size} className="rv-star rv-star--empty" />);
    return stars;
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

  const getRatingLabel = (r) => {
    if (r >= 4.5) return 'Excellent';
    if (r >= 4) return 'Very Good';
    if (r >= 3.5) return 'Good';
    if (r >= 3) return 'Average';
    if (r >= 2) return 'Below Average';
    return 'Poor';
  };

  const getRatingColor = (r) => {
    if (r >= 4) return '#059669';
    if (r >= 3) return '#d97706';
    return '#dc2626';
  };

  const getAvatarGradient = (name) => {
    const idx = (name || 'U').charCodeAt(0) % AVATAR_COLORS.length;
    return `linear-gradient(135deg, ${AVATAR_COLORS[idx][0]}, ${AVATAR_COLORS[idx][1]})`;
  };

  const visibleReviews = showAll ? reviews : reviews.slice(0, MAX_VISIBLE);
  const hasMore = reviews.length > MAX_VISIBLE;

  // Animation variants
  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: {
      opacity: 1, y: 0, scale: 1,
      transition: { type: 'spring', stiffness: 100, damping: 15 }
    }
  };

  return (
    <section className="rv" ref={sectionRef}>
      {/* Section Header */}
      <motion.div
        className="rv__header"
        initial={{ opacity: 0, y: -10 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        <div className="rv__header-left">
          <div className="rv__header-icon-wrap">
            <FiMessageSquare className="rv__header-icon" />
          </div>
          <div>
            <h2 className="rv__title">Patient Reviews</h2>
            {totalReviews > 0 && (
              <p className="rv__subtitle">
                Rated <strong>{(averageRating || 0).toFixed(1)}</strong> out of 5 based on <strong>{totalReviews}</strong> {totalReviews === 1 ? 'review' : 'reviews'}
              </p>
            )}
          </div>
        </div>
        {isLoggedIn && (
          <motion.button
            className="rv__write-btn"
            onClick={() => { setEditingReview(null); setFormData({ rating: 0, title: '', description: '' }); setShowForm(!showForm); }}
            whileHover={{ scale: 1.04, boxShadow: '0 4px 20px rgba(13,148,136,0.35)' }}
            whileTap={{ scale: 0.96 }}
          >
            <FiEdit2 size={14} />
            Write a Review
          </motion.button>
        )}
      </motion.div>

      {/* Rating Summary */}
      {totalReviews > 0 && (
        <motion.div
          className="rv__summary"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <div className="rv__summary-left">
            <motion.div
              className="rv__score-circle"
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : {}}
              transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.3 }}
            >
              <span className="rv__big-rating">{(averageRating || 0).toFixed(1)}</span>
              <span className="rv__out-of">/5</span>
            </motion.div>
            <div className="rv__summary-meta">
              <div className="rv__summary-stars">{renderStars(averageRating || 0, 20)}</div>
              <span className="rv__summary-badge" style={{ background: getRatingColor(averageRating) }}>
                {getRatingLabel(averageRating)}
              </span>
            </div>
          </div>
          <div className="rv__breakdown">
            {[5, 4, 3, 2, 1].map(rating => {
              const count = (ratingBreakdown && ratingBreakdown[rating]) || 0;
              const pct = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
              return (
                <div key={rating} className="rv__bar-row">
                  <span className="rv__bar-label">{rating}</span>
                  <FaStar size={12} className="rv-star rv-star--filled" />
                  <div className="rv__bar-track">
                    <motion.div
                      className="rv__bar-fill"
                      initial={{ width: 0 }}
                      animate={isInView ? { width: `${pct}%` } : { width: 0 }}
                      transition={{ duration: 0.7, delay: 0.4 + (5 - rating) * 0.1, ease: 'easeOut' }}
                    />
                  </div>
                  <span className="rv__bar-count">{count}</span>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Top Review Cards */}
      {loading && totalReviews === 0 ? (
        <div className="rv__loading">
          <div className="rv__loading-spinner" />
          <span>Loading reviews...</span>
        </div>
      ) : !reviews || reviews.length === 0 ? (
        <motion.div
          className="rv__empty"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="rv__empty-icon">
            <FiMessageSquare size={44} />
          </div>
          <h3>No reviews yet</h3>
          <p>Be the first to share your experience!</p>
          {isLoggedIn && !showForm && (
            <motion.button
              className="rv__write-btn rv__write-btn--lg"
              onClick={() => setShowForm(true)}
              whileHover={{ scale: 1.05 }}
            >
              <FiEdit2 size={14} /> Write First Review
            </motion.button>
          )}
        </motion.div>
      ) : (
        <>
          <motion.div
            className="rv__list"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? 'show' : 'hidden'}
          >
            <AnimatePresence>
              {visibleReviews.map((review, index) => (
                <motion.div
                  key={review._id}
                  className="rv__card"
                  variants={cardVariants}
                  layout
                  whileHover={{
                    y: -4,
                    boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
                    transition: { duration: 0.2 }
                  }}
                >
                  {/* Quote accent */}
                  <div className="rv__card-quote">
                    <FaQuoteLeft size={18} />
                  </div>

                  {/* Rating pill */}
                  <div className="rv__card-rating-pill" style={{ background: getRatingColor(review.rating) }}>
                    <FaStar size={11} />
                    <span>{review.rating}.0</span>
                  </div>

                  {/* Review content */}
                  <h4 className="rv__card-title">{review.title}</h4>
                  <p className="rv__card-text">
                    {review.description.length > 180
                      ? review.description.substring(0, 180) + '...'
                      : review.description
                    }
                  </p>

                  {review.visitReason && (
                    <div className="rv__visit-reason">
                      <strong>Visit:</strong> {review.visitReason}
                    </div>
                  )}

                  {/* Card footer */}
                  <div className="rv__card-footer">
                    <div className="rv__user">
                      <div className="rv__avatar" style={{ background: getAvatarGradient(review.user) }}>
                        {(review.user || 'U').charAt(0).toUpperCase()}
                      </div>
                      <div className="rv__user-info">
                        <span className="rv__user-name">
                          {review.user}
                          {review.isVerified && (
                            <span className="rv__verified"><FiCheck size={9} /> Verified</span>
                          )}
                        </span>
                        <span className="rv__date">{getTimeAgo(review.date)}</span>
                      </div>
                    </div>
                    <div className="rv__card-stars">{renderStars(review.rating, 13)}</div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Show more / less toggle */}
          {hasMore && (
            <motion.div
              className="rv__toggle-wrap"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <motion.button
                className="rv__toggle-btn"
                onClick={() => setShowAll(!showAll)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {showAll ? (
                  <><FiChevronUp size={16} /> Show Less</>
                ) : (
                  <><FiChevronDown size={16} /> Show All {reviews.length} Reviews</>
                )}
              </motion.button>
            </motion.div>
          )}
        </>
      )}

      {/* Review Form */}
      <AnimatePresence>
        {(showForm || totalReviews === 0) && (
          <motion.div
            className="rv__form-card"
            initial={{ opacity: 0, y: 20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: 20, height: 0 }}
            transition={{ type: 'spring', stiffness: 120, damping: 18 }}
          >
            <div className="rv__form-top">
              <h3>{editingReview ? 'Edit Your Review' : '✍️ Share Your Experience'}</h3>
              {totalReviews > 0 && (
                <button className="rv__form-close" onClick={() => setShowForm(false)}>
                  <FiX size={18} />
                </button>
              )}
            </div>

            {!isLoggedIn ? (
              <div className="rv__login-prompt">
                <p>Please log in to write a review</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="rv__form">
                {formError && (
                  <motion.div
                    className="rv__form-error"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    {formError}
                  </motion.div>
                )}

                <div className="rv__form-rating">
                  <span className="rv__form-label">Your Rating</span>
                  <div className="rv__star-select">
                    {[1, 2, 3, 4, 5].map(star => (
                      <motion.button
                        key={star}
                        type="button"
                        className="rv__star-btn"
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                        whileHover={{ scale: 1.25 }}
                        whileTap={{ scale: 0.9, rotate: -15 }}
                      >
                        {star <= (hoverRating || formData.rating)
                          ? <FaStar size={24} className="rv-star rv-star--filled" />
                          : <FaRegStar size={24} className="rv-star rv-star--empty" />
                        }
                      </motion.button>
                    ))}
                    {formData.rating > 0 && (
                      <motion.span
                        className="rv__rating-text"
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        key={formData.rating}
                      >
                        {getRatingLabel(formData.rating)}
                      </motion.span>
                    )}
                  </div>
                </div>

                <div className="rv__form-fields">
                  <input type="text" name="title" value={formData.title} onChange={handleFormChange}
                    placeholder="Review title (e.g. Great experience)" maxLength={100} required className="rv__input" />
                  <textarea name="description" value={formData.description} onChange={handleFormChange}
                    placeholder="Tell us about your experience..." rows={3} maxLength={2000} required className="rv__textarea" />
                </div>

                <div className="rv__form-footer">
                  <span className="rv__char-info">{formData.description.length}/2000</span>
                  <div className="rv__form-btns">
                    {(showForm && totalReviews > 0) && (
                      <button type="button" className="rv__btn-cancel" onClick={() => { setShowForm(false); setEditingReview(null); }}>Cancel</button>
                    )}
                    <motion.button type="submit" className="rv__btn-submit" disabled={loading}
                      whileHover={{ scale: 1.03, boxShadow: '0 4px 16px rgba(13,148,136,0.35)' }}
                      whileTap={{ scale: 0.97 }}
                    >
                      {loading ? 'Posting...' : editingReview ? 'Update' : 'Post Review'}
                    </motion.button>
                  </div>
                </div>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {error && <div className="rv__error-msg">Error: {error}</div>}
    </section>
  );
};

export default ReviewSection;
