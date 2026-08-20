import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiSearch, FiMapPin, FiPhone, FiDroplet, FiFilter, FiX,
  FiTrendingUp, FiChevronDown, FiArrowRight, FiClock, FiAlertCircle
} from 'react-icons/fi';
import { getAllBloodBanks, getBloodBanksByGroup } from '../../store/slices/bloodBankSlice';
import { selectBloodBanks, selectBloodBankLoading, selectBloodBankError, selectGroupBloodBanks } from '../../store/selectors/bloodBankSelectors';
import './BloodBanks.css';

const bloodBankImg = 'https://images.unsplash.com/photo-1576091160550-112173f7f869?w=500&h=300&fit=crop';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const BloodBanks = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const allBloodBanks = useSelector(selectBloodBanks);
  const groupBloodBanks = useSelector(selectGroupBloodBanks);
  const loading = useSelector(selectBloodBankLoading);
  const error = useSelector(selectBloodBankError);
  const gridRef = useRef(null);

  const [filters, setFilters] = useState({
    search: '',
    bloodGroup: '',
    minUnits: 0,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (filters.bloodGroup) {
      dispatch(getBloodBanksByGroup({
        bloodGroup: filters.bloodGroup,
        minUnits: filters.minUnits > 0 ? filters.minUnits : undefined,
      }));
    } else {
      const params = {
        ...(filters.search && { search: filters.search }),
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      };
      dispatch(getAllBloodBanks(params));
    }
  }, [dispatch, filters]);

  const bloodBanks = filters.bloodGroup ? groupBloodBanks : allBloodBanks;

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters(prev => ({ ...prev, search: searchQuery }));
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      bloodGroup: '',
      minUnits: 0,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
    setSearchQuery('');
  };

  const hasActiveFilters = Object.entries(filters).some(
    ([key, v]) => key !== 'sortBy' && key !== 'sortOrder' && v !== 0 && v !== false && v !== ''
  );

  const getBloodGroupIcon = (group) => {
    return <FiDroplet className={`bb-blood-icon bb-blood-${group.replace('+', 'plus').replace('-', 'minus')}`} />;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <div className="bb">
      {/* ====== HERO ====== */}
      <section className="bb-hero">
        <div className="bb-hero__overlay" />
        <div className="bb-hero__particles">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="bb-hero__particle"
              animate={{
                y: [0, -30, 0],
                x: [0, Math.random() * 40 - 20, 0],
                opacity: [0, 0.6, 0],
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                delay: i * 0.15,
              }}
            />
          ))}
        </div>

        <motion.div
          className="bb-hero__content"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="bb-hero__badge">
            <FiDroplet /> Life-Saving Donations
          </span>
          <h1>Find Blood <br />When You Need It</h1>
          <p>Search from verified blood banks with real-time inventory updates and instant availability</p>

          <form onSubmit={handleSearch} className="bb-search">
            <div className="bb-search__box">
              <FiSearch className="bb-search__icon" />
              <input
                type="text"
                placeholder="Search blood bank name, city or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit">
                Search <FiArrowRight />
              </button>
            </div>
          </form>

          <div className="bb-hero__stats">
            <motion.div
              className="bb-hero__stat"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <strong>2,500+</strong>
              <span>Blood Units</span>
            </motion.div>
            <div className="bb-hero__stat-divider" />
            <motion.div
              className="bb-hero__stat"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <strong>150+</strong>
              <span>Blood Banks</span>
            </motion.div>
            <div className="bb-hero__stat-divider" />
            <motion.div
              className="bb-hero__stat"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <strong>8 Types</strong>
              <span>Blood Groups</span>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ====== MAIN BODY ====== */}
      <div className="bb-body">
        {/* ====== TOOLBAR ====== */}
        <motion.div
          className="bb-toolbar"
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <div className="bb-toolbar__left">
            <button
              className={`bb-toolbar__filter-btn ${showFilters ? 'active' : ''}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <FiFilter />
              <span>Filters</span>
              {hasActiveFilters && <span className="bb-toolbar__dot" />}
            </button>

            {hasActiveFilters && (
              <motion.button
                className="bb-toolbar__clear"
                onClick={resetFilters}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <FiX /> Clear All
              </motion.button>
            )}
          </div>

          <div className="bb-toolbar__right">
            <div className="bb-toolbar__sort">
              <span>Sort:</span>
              <select name="sortBy" value={filters.sortBy} onChange={(e) => {
                const val = e.target.value;
                if (val === 'name') setFilters(prev => ({ ...prev, sortBy: 'name', sortOrder: 'asc' }));
                else if (val === 'createdAt') setFilters(prev => ({ ...prev, sortBy: 'createdAt', sortOrder: 'desc' }));
              }}>
                <option value="name">Name A-Z</option>
                <option value="createdAt">Recently Updated</option>
              </select>
              <FiChevronDown className="bb-toolbar__sort-arrow" />
            </div>
            <span className="bb-toolbar__count">
              {bloodBanks?.length || 0} results
            </span>
          </div>
        </motion.div>

        {/* ====== FILTER PANEL ====== */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              className="bb-filters"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
            >
              <div className="bb-filters__inner">
                <div className="bb-filters__section">
                  <h4>Search</h4>
                  <div className="bb-filters__group">
                    <input type="text" name="search" placeholder="Search by name or address..." value={filters.search} onChange={handleFilterChange} />
                  </div>
                </div>

                <div className="bb-filters__section">
                  <h4>Blood Group</h4>
                  <div className="bb-filters__blood-groups">
                    {BLOOD_GROUPS.map((group) => (
                      <label key={group} className={`bb-filters__blood-btn ${filters.bloodGroup === group ? 'active' : ''}`}>
                        <input
                          type="radio"
                          name="bloodGroup"
                          value={group}
                          checked={filters.bloodGroup === group}
                          onChange={handleFilterChange}
                        />
                        <span>{group}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="bb-filters__section">
                  <h4>Minimum Units</h4>
                  <div className="bb-filters__group">
                    <input
                      type="number"
                      name="minUnits"
                      placeholder="Min units available"
                      min="0"
                      value={filters.minUnits}
                      onChange={handleFilterChange}
                    />
                  </div>
                </div>

                <button className="bb-filters__apply" onClick={() => setShowFilters(false)}>
                  Apply Filters
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ====== ERROR ====== */}
        <AnimatePresence>
          {error && (
            <motion.div
              className="bb-alert bb-alert--error"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <FiAlertCircle /> {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ====== EMPTY STATE ====== */}
        {!loading && (!bloodBanks || bloodBanks.length === 0) && (
          <motion.div
            className="bb-empty"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <FiDroplet className="bb-empty__icon" />
            <h3>No blood banks found</h3>
            <p>Try adjusting your filters or search criteria</p>
            <button onClick={resetFilters} className="bb-empty__btn">
              Reset Filters
            </button>
          </motion.div>
        )}

        {/* ====== SKELETON ====== */}
        {loading && (
          <div className="bb-grid" ref={gridRef}>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bb-skel">
                <div className="bb-skel__img" />
                <div className="bb-skel__body">
                  <div className="bb-skel__line w70" />
                  <div className="bb-skel__line w40" />
                  <div className="bb-skel__line w90" />
                  <div className="bb-skel__line w60" />
                  <div className="bb-skel__line w80" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ====== GRID ====== */}
        {!loading && bloodBanks && bloodBanks.length > 0 && (
          <motion.div
            className="bb-grid"
            ref={gridRef}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {bloodBanks.map((bank) => (
              <motion.article
                key={bank._id}
                className="bbcard"
                variants={cardVariants}
                whileHover={{ y: -8, transition: { duration: 0.25 } }}
                onClick={() => navigate(`/blood-banks/${bank._id}`)}
              >
                {/* IMAGE */}
                <div className="bbcard__img-wrap">
                  <img
                    src={bank.bankImage || bloodBankImg}
                    alt={bank.name}
                    onError={(e) => { e.target.src = bloodBankImg; }}
                  />
                  <div className="bbcard__img-overlay" />

                  {/* AVAILABILITY BADGE */}
                  <div className="bbcard__availability">
                    <span className="bbcard__status bbcard__status--active">
                      <span className="bbcard__pulse" />
                      Open
                    </span>
                  </div>
                </div>

                {/* BODY */}
                <div className="bbcard__body">
                  {/* HEADER */}
                  <div className="bbcard__header">
                    <div>
                      <h3 className="bbcard__name">{bank.name}</h3>
                      <div className="bbcard__location">
                        <FiMapPin />
                        <span>{bank.address?.split(',')[0] || 'Location'}</span>
                      </div>
                    </div>
                  </div>

                  {/* STATS */}
                  <div className="bbcard__stats">
                    <div className="bbcard__stat">
                      <FiClock className="bbcard__stat-icon" />
                      <span className="bbcard__stat-label">24/7 Service</span>
                    </div>
                    <div className="bbcard__stat">
                      <FiTrendingUp className="bbcard__stat-icon" />
                      <span className="bbcard__stat-label">{bank.bloodInventory?.length || 0} Groups</span>
                    </div>
                  </div>

                  {/* BLOOD GROUPS */}
                  <div className="bbcard__blood-groups">
                    <span className="bbcard__blood-label">Available Types:</span>
                    <div className="bbcard__blood-list">
                      {bank.bloodInventory && bank.bloodInventory.slice(0, 4).map((inv) => (
                        <motion.div
                          key={inv.bloodGroup}
                          className="bbcard__blood-item"
                          whileHover={{ scale: 1.1 }}
                          title={`${inv.bloodGroup}: ${inv.unitsAvailable} units`}
                        >
                          <span className="bbcard__blood-group">{inv.bloodGroup}</span>
                          <span className={`bbcard__units ${inv.unitsAvailable > 5 ? 'available' : inv.unitsAvailable > 0 ? 'low' : 'empty'}`}>
                            {inv.unitsAvailable}
                          </span>
                        </motion.div>
                      ))}
                      {bank.bloodInventory && bank.bloodInventory.length > 4 && (
                        <div className="bbcard__blood-more">+{bank.bloodInventory.length - 4}</div>
                      )}
                    </div>
                  </div>

                  {/* CONTACT */}
                  <div className="bbcard__contact">
                    {bank.phone && (
                      <a href={`tel:${bank.phone}`} className="bbcard__contact-btn" onClick={(e) => e.stopPropagation()}>
                        <FiPhone /> Call
                      </a>
                    )}
                    <button className="bbcard__contact-btn bbcard__contact-btn--primary" onClick={(e) => e.stopPropagation()}>
                      Details <FiArrowRight />
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BloodBanks;
