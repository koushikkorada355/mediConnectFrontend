import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiSearch, FiMapPin, FiPhone, FiStar, FiFilter, FiX,
  FiClock, FiActivity, FiChevronDown, FiArrowRight, FiHeart, FiShield, FiNavigation
} from 'react-icons/fi';
import { getAllHospitals, getHospitalsByLocation } from '../../store/slices/hospitalSlice';
import { getHospitalReviews } from '../../store/slices/reviewSlice';
import { selectHospitals, selectLoading, selectError } from '../../store/selectors/hospitalSelectors';
import { selectTopHospitalReview } from '../../store/selectors/reviewSelectors';
import TopReviewCard from '../../components/TopReviewCard/TopReviewCard';
import hospitalImg from '../../assets/images/hospital1.jpeg';
import './Hospitals.css';

const Hospitals = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const hospitals = useSelector(selectHospitals);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const gridRef = useRef(null);

  const [filters, setFilters] = useState({
    name: '', city: '', state: '',
    minRating: 0, hasEmergency: false, hasBeds: false, sortBy: 'name',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeView, setActiveView] = useState('grid');
  const [userLocation, setUserLocation] = useState(null);
  const [locatingNearby, setLocatingNearby] = useState(false);
  const [locationError, setLocationError] = useState(null);

  useEffect(() => {
    const params = {
      ...(filters.name && { name: filters.name }),
      ...(filters.city && { city: filters.city }),
      ...(filters.state && { state: filters.state }),
      ...(filters.minRating > 0 && { minRating: filters.minRating }),
      ...(filters.hasEmergency && { hasEmergency: true }),
      ...(filters.hasBeds && { hasBeds: true }),
      ...(filters.sortBy && { sortBy: filters.sortBy }),
    };
    dispatch(getAllHospitals(params));
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
    setFilters({ name: '', city: '', state: '', minRating: 0, hasEmergency: false, hasBeds: false, sortBy: 'name' });
    setSearchQuery('');
  };

  // Find Nearby Hospitals
  const handleFindNearby = () => {
    setLocatingNearby(true);
    setLocationError(null);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          dispatch(getHospitalsByLocation({ lat: latitude, lng: longitude, maxDistance: 50000 }));
          setLocatingNearby(false);
        },
        (error) => {
          setLocationError('Unable to access your location. Please enable location services.');
          setLocatingNearby(false);
          console.error('Geolocation error:', error);
        }
      );
    } else {
      setLocationError('Geolocation is not supported by your browser.');
      setLocatingNearby(false);
    }
  };

  // Featured Hospitals Component with Top Reviews
  const FeaturedHospitalsSection = ({ hospitals, dispatch, navigate }) => {
    const topHospitals = hospitals.filter(h => h.hospitalRating && h.hospitalRating >= 4).slice(0, 3);
    if (topHospitals.length === 0) return null;

    return (
      <motion.section
        className="hp-featured"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="hp-featured__header">
          <h2>⭐ Top-Rated Hospitals</h2>
          <p>Highly praised by patients with excellent reviews</p>
        </div>

        <motion.div
          className="hp-featured__grid"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
          }}
        >
          {topHospitals.map(h => (
            <FeaturedHospitalCard key={h._id} hospital={h} dispatch={dispatch} navigate={navigate} />
          ))}
        </motion.div>
      </motion.section>
    );
  };

  // Featured Hospital Card with Top Review
  const FeaturedHospitalCard = ({ hospital, dispatch, navigate }) => {
    const topReview = useSelector(selectTopHospitalReview);
    
    useEffect(() => {
      if (hospital._id) {
        dispatch(getHospitalReviews({ hospitalId: hospital._id, page: 1, limit: 5, sortBy: 'recent' }));
      }
    }, [hospital._id, dispatch]);

    return (
      <motion.article
        className="hp-featured__card"
        variants={{
          hidden: { opacity: 0, y: 20, scale: 0.95 },
          visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5 } }
        }}
        whileHover={{ y: -8 }}
      >
        <div className="hp-featured__card-img" onClick={() => navigate(`/hospitals/${hospital._id}`)}>
          <img src={hospital.hospitalImage || hospitalImg} alt={hospital.name} onError={(e) => { e.target.src = hospitalImg; }} />
          <div className="hp-featured__card-overlay" />
          <div className="hp-featured__card-badge">{hospital.hospitalRating?.toFixed(1)} ⭐</div>
        </div>

        <div className="hp-featured__card-content">
          <h3 onClick={() => navigate(`/hospitals/${hospital._id}`)} style={{ cursor: 'pointer' }}>
            {hospital.name}
          </h3>
          <p className="hp-featured__location">
            <FiMapPin size={14} /> {hospital.address?.substring(0, 40)}...
          </p>

          {topReview && (
            <div className="hp-featured__review">
              <TopReviewCard review={topReview} isVisible={true} />
            </div>
          )}

          <motion.button
            className="hp-featured__cta"
            onClick={() => navigate(`/hospitals/${hospital._id}`)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View Hospital <FiArrowRight />
          </motion.button>
        </div>
      </motion.article>
    );
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
    <div className="hp">
      {/* ====== HERO ====== */}
      <section className="hp-hero">
        <div className="hp-hero__overlay" />
        <motion.div
          className="hp-hero__content"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="hp-hero__badge">
            <FiShield /> Trusted Healthcare Network
          </span>
          <h1>Discover Top-Rated<br />Hospitals Near You</h1>
          <p>Search from thousands of verified healthcare facilities with real patient reviews</p>

          <form onSubmit={handleSearch} className="hp-search">
            <div className="hp-search__box">
              <FiSearch className="hp-search__icon" />
              <input
                type="text"
                placeholder="Search by hospital name, city or speciality..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit">
                Search <FiArrowRight />
              </button>
            </div>
          </form>

          <div className="hp-hero__stats">
            <div className="hp-hero__stat">
              <strong>500+</strong>
              <span>Hospitals</span>
            </div>
            <div className="hp-hero__stat-divider" />
            <div className="hp-hero__stat">
              <strong>50K+</strong>
              <span>Happy Patients</span>
            </div>
            <div className="hp-hero__stat-divider" />
            <div className="hp-hero__stat">
              <strong>200+</strong>
              <span>Cities</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ====== TOOLBAR ====== */}
      <div className="hp-body">
        <motion.div
          className="hp-toolbar"
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <div className="hp-toolbar__left">
            <button
              className={`hp-toolbar__filter-btn ${showFilters ? 'active' : ''}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <FiFilter />
              <span>Filters</span>
              {hasActiveFilters && <span className="hp-toolbar__dot" />}
            </button>

            <motion.button
              className="hp-toolbar__nearby-btn"
              onClick={handleFindNearby}
              disabled={locatingNearby}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FiNavigation />
              <span>{locatingNearby ? 'Locating...' : 'Find Nearby'}</span>
            </motion.button>

            {hasActiveFilters && (
              <motion.button
                className="hp-toolbar__clear"
                onClick={resetFilters}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <FiX /> Clear All
              </motion.button>
            )}
          </div>

          <div className="hp-toolbar__right">
            <div className="hp-toolbar__sort">
              <span>Sort:</span>
              <select name="sortBy" value={filters.sortBy} onChange={handleFilterChange}>
                <option value="name">Name A-Z</option>
                <option value="rating">Top Rated</option>
                <option value="beds">Most Beds</option>
              </select>
              <FiChevronDown className="hp-toolbar__sort-arrow" />
            </div>
            <span className="hp-toolbar__count">
              {hospitals?.length || 0} results
            </span>
          </div>
        </motion.div>

        {/* ====== FILTER PANEL ====== */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              className="hp-filters"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
            >
              <div className="hp-filters__inner">
                <div className="hp-filters__group">
                  <label>City</label>
                  <input type="text" name="city" placeholder="e.g. Mumbai" value={filters.city} onChange={handleFilterChange} />
                </div>
                <div className="hp-filters__group">
                  <label>State</label>
                  <input type="text" name="state" placeholder="e.g. Maharashtra" value={filters.state} onChange={handleFilterChange} />
                </div>
                <div className="hp-filters__group">
                  <label>Min Rating</label>
                  <select name="minRating" value={filters.minRating} onChange={handleFilterChange}>
                    <option value={0}>Any</option>
                    <option value={3}>3+ ★</option>
                    <option value={4}>4+ ★</option>
                    <option value={4.5}>4.5+ ★</option>
                  </select>
                </div>
                <div className="hp-filters__checks">

                  <label className="hp-check">
                    <input type="checkbox" name="hasBeds" checked={filters.hasBeds} onChange={handleFilterChange} />
                    <span className="hp-check__box" />
                    <span>Beds Available</span>
                  </label>
                </div>
                <button className="hp-filters__apply" onClick={() => setShowFilters(false)}>
                  Apply Filters
                </button>
              </div>  
            </motion.div>
          )}
        </AnimatePresence>

        {/* ====== ERROR ====== */}
        <AnimatePresence>
          {error && (
            <motion.div className="hp-alert" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              ⚠️ {error}
            </motion.div>
          )}
          {locationError && (
            <motion.div className="hp-alert hp-alert--warning" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              📍 {locationError}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ====== TOP REVIEWED HOSPITALS SECTION ====== */}
        {!loading && hospitals && hospitals.length > 0 && (
          <FeaturedHospitalsSection hospitals={hospitals.slice(0, 3)} dispatch={dispatch} navigate={navigate} />
        )}

        {/* ====== SKELETON ====== */}
        {loading && (
          <div className="hp-grid" ref={gridRef}>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="hp-skel">
                <div className="hp-skel__img" />
                <div className="hp-skel__body">
                  <div className="hp-skel__line w70" />
                  <div className="hp-skel__line w40" />
                  <div className="hp-skel__line w90" />
                  <div className="hp-skel__line w60" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ====== GRID ====== */}
        {!loading && hospitals && hospitals.length > 0 && (
          <motion.div
            className="hp-grid"
            ref={gridRef}
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
            }}
          >
            {hospitals.map((h, idx) => (
              <motion.article
                key={h._id}
                className="hcard"
                onClick={() => navigate(`/hospitals/${h._id}`)}
                variants={{
                  hidden: { opacity: 0, y: 30, scale: 0.97 },
                  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
                }}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.25 }}
              >
                {/* IMAGE */}
                <div className="hcard__img-wrap">
                  <img
                    src={h.hospitalImage || hospitalImg}
                    alt={h.name}
                    onError={(e) => { e.target.src = hospitalImg; }}
                  />
                  <div className="hcard__img-overlay" />

                  {/* TOP BADGES */}
                  <div className="hcard__badges">
                  </div>

                  {/* FAVORITE */}
                  <button className="hcard__fav" onClick={(e) => e.stopPropagation()}>
                    <FiHeart />
                  </button>
                </div>

                {/* BODY */}
                <div className="hcard__body">
                  <div className="hcard__top-row">
                    {h.type && <span className="hcard__type">{h.type}</span>}
                    {h.hospitalRating && (
                      <span className="hcard__rating">
                        <FiStar className="hcard__rating-star" />
                        {Number(h.hospitalRating).toFixed(1)}
                      </span>
                    )}
                  </div>

                  <h3 className="hcard__name">{h.name}</h3>

                  {h.hospitalRating && (
                    <div className="hcard__stars">
                      {renderStars(h.hospitalRating)}
                      <span className="hcard__stars-value">{Number(h.hospitalRating).toFixed(1)}</span>
                    </div>
                  )}

                  {h.address && (
                    <p className="hcard__address">
                      <FiMapPin />
                      {h.address.length > 50 ? h.address.substring(0, 50) + '...' : h.address}
                    </p>
                  )}

                  {h.phone && (
                    <a href={`tel:${h.phone}`} className="hcard__phone" onClick={(e) => e.stopPropagation()}>
                      <FiPhone /> {h.phone}
                    </a>
                  )}

                  {/* STATS ROW */}
                  <div className="hcard__stats">
                    {h.beds && (
                      <div className="hcard__stat-chip">
                        <FiActivity />
                        <span>{h.beds.total} Beds</span>
                      </div>
                    )}
                    {h.beds?.icu > 0 && (
                      <div className="hcard__stat-chip hcard__stat-chip--accent">
                        <span>ICU: {h.beds.icu}</span>
                      </div>
                    )}
                  </div>

                  {/* TAGS */}
                  {h.facilities && (
                    <div className="hcard__tags">
                      {h.facilities.imaging?.xray && <span className="hcard__tag">X-Ray</span>}
                      {h.facilities.imaging?.mri && <span className="hcard__tag">MRI</span>}
                      {h.facilities.imaging?.ct && <span className="hcard__tag">CT Scan</span>}
                      {h.facilities.imaging?.ultrasound && <span className="hcard__tag">Ultrasound</span>}
                      {h.facilities.operationTheaters > 0 && (
                        <span className="hcard__tag">OT: {h.facilities.operationTheaters}</span>
                      )}
                    </div>
                  )}

                  <button className="hcard__cta" onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/hospitals/${h._id}`);
                  }}>
                    View Details <FiArrowRight />
                  </button>
                </div>
              </motion.article>
            ))}
          </motion.div>
        )}

        {/* ====== EMPTY ====== */}
        {!loading && (!hospitals || hospitals.length === 0) && (
          <motion.div
            className="hp-empty"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="hp-empty__icon">🔍</div>
            <h3>No Hospitals Found</h3>
            <p>We couldn't find hospitals matching your criteria. Try adjusting filters.</p>
            <button onClick={resetFilters} className="hp-empty__btn">Reset Filters</button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Hospitals;
