import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiMapPin, FiPhone, FiMail, FiGlobe, FiClock, FiAward, FiShoppingCart,
  FiUsers, FiActivity, FiHome, FiX, FiArrowLeft, FiCheck, FiAlertCircle,
  FiDroplet, FiZap, FiTrendingUp, FiShield, FiCalendar, FiDollarSign,
  FiArrowRight
} from 'react-icons/fi';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { getHospitalById } from '../../store/slices/hospitalSlice';
import { selectHospitalDetail, selectHospitalLoading } from '../../store/selectors/hospitalSelectors';
import { getHospitalReviews } from '../../store/slices/reviewSlice';
import { selectHospitalAverageRating, selectHospitalTotalReviews, selectTopHospitalReview } from '../../store/selectors/reviewSelectors';
import ReviewSection from '../../components/ReviewSection/ReviewSection';
import TopReviewCard from '../../components/TopReviewCard/TopReviewCard';
import './HospitalDetail.css';

const HospitalDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const hospital = useSelector(selectHospitalDetail);
  const loading = useSelector(selectHospitalLoading);
  const reviewRating = useSelector(selectHospitalAverageRating);
  const reviewCount = useSelector(selectHospitalTotalReviews);
  const topReview = useSelector(selectTopHospitalReview);
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedSection, setExpandedSection] = useState(null);

  useEffect(() => {
    if (id) {
      dispatch(getHospitalById(id));
      dispatch(getHospitalReviews({ hospitalId: id, page: 1, limit: 10, sortBy: 'recent' }));
    }
    window.scrollTo(0, 0);
  }, [id, dispatch]);

  if (loading) {
    return (
      <div className="hosp-detail">
        <div className="hosp-detail__skeleton">
          <div className="hosp-detail__skeleton-hero" />
          <div className="hosp-detail__skeleton-content">
            {[1, 2, 3].map(i => (
              <div key={i} className="hosp-detail__skeleton-block" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!hospital) {
    return (
      <div className="hosp-detail">
        <div className="hosp-detail__error">
          <FiAlertCircle />
          <h2>Hospital Not Found</h2>
          <p>We couldn't find the hospital you're looking for.</p>
          <button onClick={() => navigate('/hospitals')} className="hosp-detail__error-btn">
            <FiArrowLeft /> Back to Hospitals
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
    <div className="hosp-detail">
      {/* Back Button */}
      <motion.button
        className="hosp-detail__back"
        onClick={() => navigate('/hospitals')}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <FiArrowLeft /> Back
      </motion.button>

      {/* Hero Banner */}
      <motion.section
        className="hosp-detail__hero"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="hosp-detail__hero-overlay" />
        <div className="hosp-detail__hero-content">
          <div className="hosp-detail__hero-left">
            <span className={`hosp-detail__badge hosp-detail__badge--${hospital.type?.toLowerCase()}`}>
              {hospital.type || 'PRIVATE'}
            </span>
            <h1>{hospital.name}</h1>
            <div className="hosp-detail__rating">
              <div className="hosp-detail__stars">
                {renderStars(displayRating)}
              </div>
              <span className="hosp-detail__rating-value">{displayRating.toFixed(1)}/5</span>
              <span className="hosp-detail__review-count">({displayReviewCount} {displayReviewCount === 1 ? 'review' : 'reviews'})</span>
            </div>
            <div className="hosp-detail__quick-info">
              <div className="hosp-detail__info-item">
                <FiMapPin />
                <span>{hospital.address}</span>
              </div>
              <div className="hosp-detail__info-item">
                <FiPhone />
                <a href={`tel:${hospital.phone}`}>{hospital.phone}</a>
              </div>
              <div className="hosp-detail__info-item">
                <FiMail />
                <a href={`mailto:${hospital.email}`}>{hospital.email}</a>
              </div>
            </div>
          </div>

          <div className="hosp-detail__hero-right">
            <div className="hosp-detail__quick-stats">
              <div className="hosp-detail__stat-card">
                <FiHome />
                <div>
                  <strong>{hospital.totalBeds || 0}</strong>
                  <span>Total Beds</span>
                </div>
              </div>
              <div className="hosp-detail__stat-card">
                <FiZap />
                <div>
                  <strong>{hospital.facilities?.operationTheaters || 0}</strong>
                  <span>OT Rooms</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </motion.section>

      {/* Tabs */}
      <div className="hosp-detail__tabs">
        {['overview', 'doctors', 'facilities', 'services', 'hours', 'contact'].map(tab => (
          <motion.button
            key={tab}
            className={`hosp-detail__tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
            whileHover={{ y: -2 }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            {activeTab === tab && <motion.div className="hosp-detail__tab-indicator" layoutId="indicator" />}
          </motion.button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="hosp-detail__content"
        >
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="hosp-detail__tab-content">
              {hospital.description && (
                <div className="hosp-detail__section">
                  <h2>About Hospital</h2>
                  <p>{hospital.description}</p>
                </div>
              )}

              {/* Key Stats */}
              <div className="hosp-detail__stats-grid">
                <div className="hosp-detail__stat">
                  <FiHome />
                  <strong>{hospital.totalBeds || 0}</strong>
                  <span>Total Beds</span>
                </div>
                <div className="hosp-detail__stat">
                  <FiHome />
                  <strong>{hospital.generalBeds || 0}</strong>
                  <span>General Beds</span>
                </div>
                <div className="hosp-detail__stat">
                  <FiZap />
                  <strong>{hospital.icuBeds || 0}</strong>
                  <span>ICU Beds</span>
                </div>
                <div className="hosp-detail__stat">
                  <FiShield />
                  <strong>{hospital.ccuBeds || 0}</strong>
                  <span>CCU Beds</span>
                </div>
              </div>

              {/* Top Review Card */}
              {topReview && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  style={{ marginTop: '32px' }}
                >
                  <TopReviewCard review={topReview} isVisible={true} />
                </motion.div>
              )}

              {/* Accreditations */}
              {hospital.accreditations?.length > 0 && (
                <div className="hosp-detail__section">
                  <h3>
                    <FiAward /> Accreditations & Certifications
                  </h3>
                  <div className="hosp-detail__badge-list">
                    {hospital.accreditations.map((acc, i) => (
                      <span key={i} className="hosp-detail__accred-badge">
                        <FiCheck /> {acc}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Doctors Tab */}
          {activeTab === 'doctors' && (
            <div className="hosp-detail__tab-content">
              {hospital.doctors && hospital.doctors.length > 0 ? (
                <div className="hosp-detail__doctors-grid">
                  {hospital.doctors.map((doctor, idx) => (
                    <motion.div
                      key={doctor._id}
                      className="hosp-detail__doctor-card"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      onClick={() => navigate(`/doctor/${doctor._id}`)}
                      whileHover={{ y: -8, boxShadow: '0 12px 24px rgba(0,0,0,0.15)' }}
                    >
                      <div className="hosp-detail__doctor-image">
                        <img 
                          src={doctor.profileImage || 'https://via.placeholder.com/200?text=Dr'} 
                          alt={doctor.userId?.name}
                        />
                      </div>
                      <div className="hosp-detail__doctor-info">
                        <h4>{doctor.userId?.name}</h4>
                        <p className="hosp-detail__doctor-specialty">
                          {doctor.specialization}
                        </p>
                        {doctor.experience && (
                          <p className="hosp-detail__doctor-exp">
                            <FiTrendingUp /> {doctor.experience}+ Years Experience
                          </p>
                        )}
                        {doctor.licenseNumber && (
                          <p className="hosp-detail__doctor-license">
                            <FiAward /> Lic: {doctor.licenseNumber}
                          </p>
                        )}
                        <div className="hosp-detail__doctor-contact">
                          {doctor.userId?.phone && (
                            <a href={`tel:${doctor.userId.phone}`} className="hosp-detail__doctor-phone">
                              <FiPhone /> Call
                            </a>
                          )}

                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="hosp-detail__empty">
                  <FiUsers />
                  <h3>No Doctors Available</h3>
                  <p>No doctors are currently registered at this hospital</p>
                </div>
              )}
            </div>
          )}

          {/* Facilities Tab */}
          {activeTab === 'facilities' && (
            <div className="hosp-detail__tab-content">
              <div className="hosp-detail__facilities-grid">
                {hospital.facilities?.operationTheaters > 0 && (
                  <div className="hosp-detail__facility-card">
                    <FiZap className="hosp-detail__facility-icon" />
                    <h4>Operation Theaters</h4>
                    <p className="hosp-detail__facility-value">{hospital.facilities.operationTheaters}</p>
                  </div>
                )}

                {hospital.facilities?.ambulances > 0 && (
                  <div className="hosp-detail__facility-card">
                    <FiTrendingUp className="hosp-detail__facility-icon" />
                    <h4>Ambulances</h4>
                    <p className="hosp-detail__facility-value">{hospital.facilities.ambulances}</p>
                  </div>
                )}

                {[
                  { key: 'bloodBank', label: 'Blood Bank', icon: FiDroplet },
                  { key: 'laboratory', label: 'Laboratory', icon: FiActivity },
                  { key: 'pharmacy', label: 'Pharmacy', icon: FiShoppingCart },
                  { key: 'parking', label: 'Parking', icon: FiHome },
                  { key: 'cafeteria', label: 'Cafeteria', icon: FiShoppingCart },
                ].map(({ key, label, icon: Icon }) =>
                  hospital.facilities?.[key] ? (
                    <div key={key} className="hosp-detail__facility-card">
                      <Icon className="hosp-detail__facility-icon" />
                      <h4>{label}</h4>
                      <span className="hosp-detail__facility-available">✓ Available</span>
                    </div>
                  ) : null
                )}

                {hospital.facilities?.imaging && (
                  <div className="hosp-detail__facility-card">
                    <FiActivity className="hosp-detail__facility-icon" />
                    <h4>Imaging Services</h4>
                    <div className="hosp-detail__imaging-services">
                      {hospital.facilities.imaging?.xray && <span>X-Ray</span>}
                      {hospital.facilities.imaging?.ct && <span>CT</span>}
                      {hospital.facilities.imaging?.mri && <span>MRI</span>}
                      {hospital.facilities.imaging?.ultrasound && <span>Ultrasound</span>}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Services Tab */}
          {activeTab === 'services' && (
            <div className="hosp-detail__tab-content">
              {hospital.specializations?.length > 0 && (
                <div className="hosp-detail__section">
                  <h3>Medical Specializations</h3>
                  <div className="hosp-detail__services-grid">
                    {hospital.specializations.map((spec, i) => (
                      <div key={i} className="hosp-detail__service-tag">
                        {spec.name || 'Specialization'}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {hospital.paymentMethods?.length > 0 && (
                <div className="hosp-detail__section">
                  <h3>
                    <FiDollarSign /> Payment Methods
                  </h3>
                  <div className="hosp-detail__payment-methods">
                    {hospital.paymentMethods.map((method, i) => (
                      <span key={i} className="hosp-detail__payment-badge">{method}</span>
                    ))}
                  </div>
                </div>
              )}

              {hospital.insuranceAccepted?.length > 0 && (
                <div className="hosp-detail__section">
                  <h3>
                    <FiShield /> Insurance Accepted
                  </h3>
                  <div className="hosp-detail__insurance-list">
                    {hospital.insuranceAccepted.map((ins, i) => (
                      <span key={i} className="hosp-detail__insurance-tag">{ins}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Operating Hours Tab */}
          {activeTab === 'hours' && (
            <div className="hosp-detail__tab-content">
              <div className="hosp-detail__section">
                <h3>
                  <FiClock /> Operating Hours
                </h3>

                <div className="hosp-detail__hours-grid">
                  {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
                    <div key={day} className="hosp-detail__hour-card">
                      <strong>{day.charAt(0).toUpperCase() + day.slice(1)}</strong>
                      <p>
                        {hospital.operatingHours?.[day]?.open || 'N/A'} - {hospital.operatingHours?.[day]?.close || 'N/A'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Contact Tab */}
          {activeTab === 'contact' && (
            <div className="hosp-detail__tab-content">
              <div className="hosp-detail__contact-section">
                <div className="hosp-detail__contact-card">
                  <FiPhone />
                  <h4>Phone</h4>
                  <a href={`tel:${hospital.phone}`}>{hospital.phone}</a>
                </div>

                <div className="hosp-detail__contact-card">
                  <FiMail />
                  <h4>Email</h4>
                  <a href={`mailto:${hospital.email}`}>{hospital.email}</a>
                </div>

                <div className="hosp-detail__contact-card">
                  <FiMapPin />
                  <h4>Address</h4>
                  <p>{hospital.address}</p>
                </div>

                {hospital.website && (
                  <div className="hosp-detail__contact-card">
                    <FiGlobe />
                    <h4>Website</h4>
                    <a href={hospital.website} target="_blank" rel="noopener noreferrer">
                      {hospital.website}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* CTA Section */}
      <motion.div
        className="hosp-detail__cta-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2>Book Your Appointment</h2>
        <p>Connect with doctors at this hospital and schedule your consultation</p>
        <div className="hosp-detail__cta-buttons">

          <button className="hosp-detail__btn hosp-detail__btn--secondary">
            <FiPhone /> Call Hospital
          </button>
        </div>
      </motion.div>

      {/* Reviews Section */}
      <div className="hosp-detail__reviews-wrapper">
        <ReviewSection doctorId={id} reviewType="HOSPITAL" />
      </div>
    </div>
  );
};

export default HospitalDetail;
