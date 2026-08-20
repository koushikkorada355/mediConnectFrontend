import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiMapPin, FiPhone, FiMail, FiCalendar, FiAward, FiX, FiArrowLeft,
  FiCheck, FiAlertCircle, FiClock, FiUsers, FiTrendingUp, FiBriefcase,
  FiArrowRight, FiHeart, FiGlobe, FiLinkedin, FiTwitter, FiInstagram
} from 'react-icons/fi';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { getDoctorById } from '../../store/slices/doctorSlice';
import { selectDoctor, selectDoctorLoading } from '../../store/selectors/doctorSelectors';
import { getDoctorReviews } from '../../store/slices/reviewSlice';
import { selectDoctorAverageRating, selectDoctorTotalReviews } from '../../store/selectors/reviewSelectors';
import ReviewSection from '../../components/ReviewSection/ReviewSection';
import doctorImg from '../../assets/images/doctor2.jpg';
import './DoctorDetail.css';

const DoctorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const doctor = useSelector(selectDoctor);
  const loading = useSelector(selectDoctorLoading);
  const reviewRating = useSelector(selectDoctorAverageRating);
  const reviewCount = useSelector(selectDoctorTotalReviews);
  const [activeTab, setActiveTab] = useState('overview');
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(getDoctorById(id));
      dispatch(getDoctorReviews({ doctorId: id, page: 1, limit: 10, sortBy: 'recent' }));
    }
    window.scrollTo(0, 0);
  }, [id, dispatch]);

  if (loading) {
    return (
      <div className="doc-det">
        <div className="doc-det__skeleton">
          <div className="doc-det__skeleton-hero" />
          <div className="doc-det__skeleton-content">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="doc-det__skeleton-block" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="doc-det">
        <div className="doc-det__error">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          >
            <FiAlertCircle />
          </motion.div>
          <h2>Doctor Not Found</h2>
          <p>We couldn't find the doctor profile you're looking for.</p>
          <button onClick={() => navigate('/doctors')} className="doc-det__error-btn">
            <FiArrowLeft /> Back to Doctors
          </button>
        </div>
      </div>
    );
  }

  const renderStars = (rating) => {
    const stars = [];
    const r = Number(rating) || 0;
    const full = Math.floor(r);
    const hasHalf = r % 1 >= 0.5;
    for (let i = 0; i < full; i++) stars.push(<FaStar key={`f${i}`} className="star star-filled" />);
    if (hasHalf) stars.push(<FaStarHalfAlt key="h" className="star star-filled" />);
    const rem = 5 - full - (hasHalf ? 1 : 0);
    for (let i = 0; i < rem; i++) stars.push(<FaRegStar key={`e${i}`} className="star" />);
    return stars;
  };

  const displayRating = reviewRating || 0;
  const displayReviewCount = reviewCount || 0;

  return (
    <div className="doc-det">
      {/* Back Button */}
      <motion.button
        className="doc-det__back"
        onClick={() => navigate('/doctors')}
        whileHover={{ scale: 1.05, x: -4 }}
        whileTap={{ scale: 0.95 }}
      >
        <FiArrowLeft /> Back to Doctors   
      </motion.button>

      {/* Hero Section */}
      <motion.section
        className="doc-det__hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="doc-det__hero-overlay" />
        <div className="doc-det__hero-content">
          {/* Left: Profile Image */}
          <motion.div
            className="doc-det__profile-img-container"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <div className="doc-det__profile-img-wrapper">
              <img src={doctor.profileImage || doctorImg} alt={doctor.userId?.name} />
              <div className="doc-det__profile-overlay" />
            </div>
            <motion.button
              className={`doc-det__favorite ${isFavorite ? 'active' : ''}`}
              onClick={() => setIsFavorite(!isFavorite)}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
            >
              <FiHeart />
            </motion.button>
            <div className="doc-det__badge-info">
              <div className="doc-det__badge">
                <FiBriefcase />
                <span>{doctor.experience || 5}+ Years</span>
              </div>
            </div>
          </motion.div>

          {/* Right: Info */}
          <motion.div
            className="doc-det__hero-text"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="doc-det__header">
              <div>
                <h1>{doctor.userId?.name}</h1>
                <p className="doc-det__specialty">
                  <span className="doc-det__specialty-badge">{doctor.specialization}</span>
                </p>
              </div>
            </div>

            {/* Rating */}
            <div className="doc-det__rating">
              <div className="doc-det__stars">{renderStars(displayRating)}</div>
              <span className="doc-det__rating-value">{displayRating.toFixed(1)}/5</span>
              <span className="doc-det__review-count">({displayReviewCount} {displayReviewCount === 1 ? 'review' : 'reviews'})</span>
            </div>

            {/* Quick Info */}
            <div className="doc-det__quick-info">
              <div className="doc-det__info-item">
                <FiPhone />
                <a href={`tel:${doctor.userId?.phone}`}>{doctor.userId?.phone}</a>
              </div>
              <div className="doc-det__info-item">
                <FiMail />
                <a href={`mailto:${doctor.userId?.email}`}>{doctor.userId?.email}</a>
              </div>
              <div className="doc-det__info-item">
                <FiAward />
                <span>Lic: {doctor.licenseNumber}</span>
              </div>
            </div>

            {/* Working Hospitals */}
            {doctor.hospitals && doctor.hospitals.length > 0 && (
              <motion.div
                className="doc-det__working-hospitals"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <h4 className="doc-det__hospitals-title">Working At</h4>
                <div className="doc-det__hospitals-list">
                  {doctor.hospitals.map((hospital, idx) => (
                    <motion.div
                      key={hospital.hospitalId}
                      className="doc-det__hospital-badge"
                      whileHover={{ scale: 1.05 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <div className="doc-det__hospital-name">
                        {hospital.hospitalName}
                      </div>
                      <div className="doc-det__hospital-dept">
                        {hospital.department}
                      </div>
                      <div className="doc-det__hospital-hours">
                        {hospital.consultationHours}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* CTA Buttons */}
            <div className="doc-det__cta-group">
              <motion.button
                className="doc-det__btn doc-det__btn--secondary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiPhone /> Call Now
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Tabs */}
      <section className="doc-det__tabs">
        <div className="doc-det__tab-nav">
          {['overview', 'experience', 'services'].map(tab => (
            <motion.button
              key={tab}
              className={`doc-det__tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {activeTab === tab && <motion.div className="doc-det__tab-indicator" layoutId="indicator" />}
            </motion.button>
          ))}
        </div>
      </section>

      {/* Content Sections */}
      <div className="doc-det__container">
        <AnimatePresence mode="wait">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <motion.section
              key="overview"
              className="doc-det__section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="doc-det__section-title">About</h2>
              <div className="doc-det__grid doc-det__grid--2">
                <div className="doc-det__card">
                  <h3 className="doc-det__card-title">
                    <FiBriefcase /> Specialization
                  </h3>
                  <p>{doctor.specialization}</p>
                </div>
                <div className="doc-det__card">
                  <h3 className="doc-det__card-title">
                    <FiTrendingUp /> Experience
                  </h3>
                  <p>{doctor.experience || 5} years in medical field</p>
                </div>
                <div className="doc-det__card">
                  <h3 className="doc-det__card-title">
                    <FiAward /> License
                  </h3>
                  <p>License #: {doctor.licenseNumber}</p>
                </div>
                <div className="doc-det__card">
                  <h3 className="doc-det__card-title">
                    <FiUsers /> Total Patients
                  </h3>
                  <p>{displayReviewCount > 0 ? `${displayReviewCount}+ patients reviewed` : 'No reviews yet'}</p>
                </div>
              </div>
              <div className="doc-det__bio">
                <h3 className="doc-det__section-title">Biography</h3>
                <p>
                  Dr. {doctor.userId?.name} is a highly qualified {doctor.specialization} with extensive experience
                  in patient care and medical innovation. With {doctor.experience || 5} years of dedicated service,
                  they have established a reputation for excellence and compassion in healthcare delivery. Known for
                  personalized treatment approaches and commitment to patient satisfaction.
                </p>
              </div>
            </motion.section>
          )}

          {/* Experience Tab */}
          {activeTab === 'experience' && (
            <motion.section
              key="experience"
              className="doc-det__section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="doc-det__section-title">Professional Background</h2>
              <div className="doc-det__timeline">
                <div className="doc-det__timeline-item">
                  <div className="doc-det__timeline-dot" />
                  <div className="doc-det__timeline-content">
                    <h4>Senior {doctor.specialization}</h4>
                    <p className="doc-det__timeline-date">2022 - Present</p>
                    <p>Leading medical institution with focus on patient care and research</p>
                  </div>
                </div>
                <div className="doc-det__timeline-item">
                  <div className="doc-det__timeline-dot" />
                  <div className="doc-det__timeline-content">
                    <h4>{doctor.specialization} Specialist</h4>
                    <p className="doc-det__timeline-date">2019 - 2022</p>
                    <p>Specialized training and certification in {doctor.specialization}</p>
                  </div>
                </div>
                <div className="doc-det__timeline-item">
                  <div className="doc-det__timeline-dot" />
                  <div className="doc-det__timeline-content">
                    <h4>Medical Doctor (MBBS)</h4>
                    <p className="doc-det__timeline-date">2014 - 2019</p>
                    <p>Completed medical degree from prestigious medical college</p>
                  </div>
                </div>
              </div>
            </motion.section>
          )}

          {/* Services Tab */}
          {activeTab === 'services' && (
            <motion.section
              key="services"
              className="doc-det__section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="doc-det__section-title">Services Offered</h2>
              <div className="doc-det__services-grid">
                {[
                  'Consultation',
                  'Diagnosis',
                  'Treatment Planning',
                  'Follow-up Care',
                  'Preventive Care'
                ].map((service, idx) => (
                  <motion.div
                    key={idx}
                    className="doc-det__service-item"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <FiCheck />
                    <span>{service}</span>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

        </AnimatePresence>

        {/* Reviews Section */}
        <ReviewSection doctorId={id} reviewType="DOCTOR" />
      </div>
    </div>
  );
};

export default DoctorDetail;
