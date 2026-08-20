import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiSearch, FiMapPin, FiPhone, FiStar, FiFilter, FiX,
  FiBriefcase, FiActivity, FiChevronDown, FiArrowRight, FiHeart, FiAward
} from 'react-icons/fi';
import { getAllDoctors } from '../../store/slices/doctorSlice';
import { selectDoctors, selectDoctorLoading, selectDoctorError } from '../../store/selectors/doctorSelectors';
import doctorImg from '../../assets/images/doctor2.jpg';
import './Doctors.css';

const Doctors = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const doctors = useSelector(selectDoctors);
  const loading = useSelector(selectDoctorLoading);
  const error = useSelector(selectDoctorError);
  const gridRef = useRef(null);

  const [filters, setFilters] = useState({
    name: '', specialization: '', experience: 0, sortBy: 'newest',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const params = {
      ...(filters.name && { name: filters.name }),
      ...(filters.specialization && { specialization: filters.specialization }),
      ...(filters.experience > 0 && { experience: filters.experience }),
      ...(filters.sortBy && { sortBy: filters.sortBy }),
    };
    dispatch(getAllDoctors(params));
  }, [dispatch, filters]);

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters(prev => ({ ...prev, name: searchQuery }));
  };

  const resetFilters = () => {
    setFilters({ name: '', specialization: '', experience: 0, sortBy: 'newest' });
    setSearchQuery('');
  };

  const hasActiveFilters = Object.entries(filters).some(
    ([key, v]) => key !== 'sortBy' && v !== 0 && v !== false && v !== ''
  );

  const renderStars = (rating) => {
    const stars = [];
    const r = Number(rating) || 0;
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FiStar
          key={i}
          className={`star ${i <= Math.round(r) ? 'star-filled' : ''}`}
        />
      );
    }
    return stars;
  };

  return (
    <div className="doc">
      {/* ====== HERO ====== */}
      <section className="doc-hero">
        <div className="doc-hero__overlay" />
        <motion.div
          className="doc-hero__content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Left: Text */}
          <div className="doc-hero__text">
            <span className="doc-hero__badge">
              <FiAward /> Trusted Medical Professionals
            </span>
            <h1>Find <span>Expert Doctors</span><br />Near You</h1>
            <p>Connect with experienced, verified healthcare professionals across 50+ specialties for personalized care.</p>

            <form onSubmit={handleSearch} className="doc-search">
              <div className="doc-search__box">
                <FiSearch className="doc-search__icon" />
                <input
                  type="text"
                  placeholder="Search by doctor name or speciality..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit">
                  Search <FiArrowRight />
                </button>
              </div>
            </form>

            <div className="doc-hero__stats">
              <div className="doc-hero__stat">
                <strong>5,000+</strong>
                <span>Doctors</span>
              </div>
              <div className="doc-hero__stat-divider" />
              <div className="doc-hero__stat">
                <strong>50+</strong>
                <span>Specialties</span>
              </div>
              <div className="doc-hero__stat-divider" />
              <div className="doc-hero__stat">
                <strong>100K+</strong>
                <span>Consultations</span>
              </div>
            </div>
          </div>

          {/* Right: Doctor Image */}
          <motion.div
            className="doc-hero__image"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="doc-hero__image-wrapper">
              <img src={doctorImg} alt="Professional Doctor" />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ====== TOOLBAR ====== */}
      <div className="doc-body">
        <motion.div
          className="doc-toolbar"
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <div className="doc-toolbar__left">
            <button
              className={`doc-toolbar__filter-btn ${showFilters ? 'active' : ''}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <FiFilter />
              <span>Filters</span>
              {hasActiveFilters && <span className="doc-toolbar__dot" />}
            </button>

            {hasActiveFilters && (
              <motion.button
                className="doc-toolbar__clear"
                onClick={resetFilters}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <FiX /> Clear All
              </motion.button>
            )}
          </div>

          <div className="doc-toolbar__right">
            <div className="doc-toolbar__sort">
              <span>Sort:</span>
              <select name="sortBy" value={filters.sortBy} onChange={handleFilterChange}>
                <option value="newest">Newest</option>
                <option value="experience">Most Experienced</option>
                <option value="name">Name A-Z</option>
              </select>
              <FiChevronDown className="doc-toolbar__sort-arrow" />
            </div>
            <span className="doc-toolbar__count">
              {doctors?.length || 0} doctors
            </span>
          </div>
        </motion.div>

        {/* ====== FILTER PANEL ====== */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              className="doc-filters"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
            >
              <div className="doc-filters__inner">
                <div className="doc-filters__group">
                  <label>Specialization</label>
                  <input 
                    type="text" 
                    name="specialization" 
                    placeholder="e.g. Cardiology" 
                    value={filters.specialization} 
                    onChange={handleFilterChange} 
                  />
                </div>
                <div className="doc-filters__group">
                  <label>Min Experience</label>
                  <select name="experience" value={filters.experience} onChange={handleFilterChange}>
                    <option value={0}>Any</option>
                    <option value={1}>1+ years</option>
                    <option value={3}>3+ years</option>
                    <option value={5}>5+ years</option>
                    <option value={10}>10+ years</option>
                  </select>
                </div>
                <button className="doc-filters__apply" onClick={() => setShowFilters(false)}>
                  Apply Filters
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ====== ERROR ====== */}
        <AnimatePresence>
          {error && (
            <motion.div className="doc-alert" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              ⚠️ {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ====== SKELETON ====== */}
        {loading && (
          <div className="doc-grid" ref={gridRef}>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="doc-skel">
                <div className="doc-skel__img" />
                <div className="doc-skel__body">
                  <div className="doc-skel__line w70" />
                  <div className="doc-skel__line w40" />
                  <div className="doc-skel__line w90" />
                  <div className="doc-skel__line w60" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ====== GRID ====== */}
        {!loading && doctors && doctors.length > 0 && (
          <motion.div
            className="doc-grid"
            ref={gridRef}
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
            }}
          >
            {doctors.map((d) => (
              <motion.article
                key={d._id}
                className="dcard"
                variants={{
                  hidden: { opacity: 0, y: 30, scale: 0.97 },
                  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
                }}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.25 }}
                onClick={() => navigate(`/doctors/${d._id}`)}
                style={{ cursor: 'pointer' }}
              >
                {/* IMAGE */}
                <div className="dcard__img-wrap">
                  <img
                    src={d.profileImage || doctorImg}
                    alt={d.userId?.name}
                    onError={(e) => { e.target.src = doctorImg; }}
                  />
                  <div className="dcard__img-overlay" />

                  {/* BADGE */}
                  <div className="dcard__badges">
                    <span className="dcard__badge dcard__badge--blue">
                      <FiBriefcase /> {d.experience}+ yrs
                    </span>
                  </div>

                  {/* FAVORITE */}
                  <button className="dcard__fav" onClick={(e) => e.stopPropagation()}>
                    <FiHeart />
                  </button>
                </div>

                {/* BODY */}
                <div className="dcard__body">
                  <h3 className="dcard__name">{d.userId?.name}</h3>

                  {d.specialization && (
                    <p className="dcard__specialty">
                      <FiBriefcase />
                      {d.specialization}
                    </p>
                  )}

                  {d.userId?.phone && (
                    <a href={`tel:${d.userId?.phone}`} className="dcard__phone" onClick={(e) => e.stopPropagation()}>
                      <FiPhone /> {d.userId?.phone}
                    </a>
                  )}

                  {/* STATS ROW */}
                  <div className="dcard__stats">
                    {d.experience && (
                      <div className="dcard__stat-chip">
                        <FiActivity />
                        <span>{d.experience} Years</span>
                      </div>
                    )}
                  </div>

                  {/* LICENSE */}
                  {d.licenseNumber && (
                    <div className="dcard__license">
                      <FiAward /> Lic: {d.licenseNumber}
                    </div>
                  )}

                  <button className="dcard__cta">
                    Book Appointment <FiArrowRight />
                  </button>
                </div>
              </motion.article>
            ))}
          </motion.div>
        )}

        {/* ====== EMPTY ====== */}
        {!loading && (!doctors || doctors.length === 0) && (
          <motion.div
            className="doc-empty"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="doc-empty__icon">👨‍⚕️</div>
            <h3>No Doctors Found</h3>
            <p>We couldn't find doctors matching your criteria. Try adjusting filters.</p>
            <button onClick={resetFilters} className="doc-empty__btn">Reset Filters</button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Doctors;
