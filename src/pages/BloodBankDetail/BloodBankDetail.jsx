import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiMapPin, FiPhone, FiMail, FiClock, FiDroplet, FiTrendingUp,
  FiAlertCircle, FiArrowLeft, FiActivity, FiShield, FiUsers,
  FiAward, FiBarChart2, FiArrowRight, FiCheckCircle
} from 'react-icons/fi';
import { getBloodBankById } from '../../store/slices/bloodBankSlice';
import { selectBloodBank, selectBloodBankLoading } from '../../store/selectors/bloodBankSelectors';
import './BloodBankDetail.css';

const BloodBankDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const bloodBank = useSelector(selectBloodBank);
  const loading = useSelector(selectBloodBankLoading);
  const [activeTab, setActiveTab] = useState('inventory');

  useEffect(() => {
    if (id) dispatch(getBloodBankById(id));
    window.scrollTo(0, 0);
  }, [id, dispatch]);

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="bbd">
        <div className="bbd__skel">
          <div className="bbd__skel-hero" />
          <div className="bbd__skel-body">
            <div className="bbd__skel-row">
              {[1, 2, 3].map(i => <div key={i} className="bbd__skel-card" />)}
            </div>
            <div className="bbd__skel-row">
              {[1, 2, 3, 4].map(i => <div key={i} className="bbd__skel-card bbd__skel-card--sm" />)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Not Found ── */
  if (!bloodBank) {
    return (
      <div className="bbd">
        <div className="bbd__empty">
          <FiAlertCircle />
          <h2>Blood Bank Not Found</h2>
          <p>The blood bank you're looking for doesn't exist or has been removed.</p>
          <button onClick={() => navigate('/bloodbanks')}>
            <FiArrowLeft /> Back to Blood Banks
          </button>
        </div>
      </div>
    );
  }

  /* ── Derived data ── */
  const totalUnits = bloodBank.bloodInventory?.reduce((s, i) => s + i.unitsAvailable, 0) || 0;
  const availableTypes = bloodBank.bloodInventory?.filter(i => i.unitsAvailable > 0).length || 0;
  const criticalTypes = bloodBank.bloodInventory?.filter(i => i.unitsAvailable > 0 && i.unitsAvailable <= 5).length || 0;

  const GROUP_CLR = {
    'A+': '#DC2626', 'A-': '#F87171',
    'B+': '#2563EB', 'B-': '#60A5FA',
    'AB+': '#7C3AED', 'AB-': '#A78BFA',
    'O+': '#059669', 'O-': '#34D399',
  };

  const stockLevel = (u) => u > 10 ? 'high' : u > 3 ? 'mid' : u > 0 ? 'low' : 'out';

  /* ── Render ── */
  return (
    <div className="bbd">
      {/* ─── BACK ─── */}
      <motion.button className="bbd__back" onClick={() => navigate('/bloodbanks')} whileHover={{ x: -4 }} whileTap={{ scale: 0.95 }}>
        <FiArrowLeft /> Back
      </motion.button>

      {/* ═══════════════════════════════════════════
          HERO – Gradient banner
          ═══════════════════════════════════════════ */}
      <motion.section className="bbd__hero" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="bbd__hero-bg">
          <div className="bbd__hero-orb bbd__hero-orb--1" />
          <div className="bbd__hero-orb bbd__hero-orb--2" />
          <div className="bbd__hero-orb bbd__hero-orb--3" />
        </div>

        <div className="bbd__hero-inner">
          {/* Left – Title & Contact */}
          <motion.div className="bbd__hero-left" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <div className="bbd__hero-status">
              <span className="bbd__dot" />
              {bloodBank.isActive !== false ? 'Active' : 'Inactive'}
            </div>

            <h1>{bloodBank.name}</h1>

            <div className="bbd__hero-meta">
              <span><FiMapPin /> {bloodBank.address}</span>
              {bloodBank.phone && <a href={`tel:${bloodBank.phone}`}><FiPhone /> {bloodBank.phone}</a>}
              {bloodBank.email && <a href={`mailto:${bloodBank.email}`}><FiMail /> {bloodBank.email}</a>}
            </div>

            <div className="bbd__hero-actions">
              <motion.a href={`tel:${bloodBank.phone}`} className="bbd__btn bbd__btn--white" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <FiPhone /> Call Now
              </motion.a>
              <motion.a href={`mailto:${bloodBank.email}`} className="bbd__btn bbd__btn--outline" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <FiMail /> Send Email
              </motion.a>
            </div>
          </motion.div>

          {/* Right – Stat cards */}
          <motion.div className="bbd__hero-right" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <div className="bbd__stat-card">
              <FiDroplet />
              <strong>{totalUnits}</strong>
              <span>Total Units</span>
            </div>
            <div className="bbd__stat-card">
              <FiTrendingUp />
              <strong>{availableTypes}/8</strong>
              <span>Types Available</span>
            </div>
            <div className="bbd__stat-card">
              <FiClock />
              <strong>24/7</strong>
              <span>Open Hours</span>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* ═══════════════════════════════════════════
          TABS
          ═══════════════════════════════════════════ */}
      <div className="bbd__body">
        <motion.nav className="bbd__tabs" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          {[
            { key: 'inventory', icon: FiDroplet, label: 'Inventory' },
            { key: 'details', icon: FiShield, label: 'Details' },
            { key: 'services', icon: FiAward, label: 'Services' },
          ].map(t => (
            <button key={t.key} className={`bbd__tab ${activeTab === t.key ? 'active' : ''}`} onClick={() => setActiveTab(t.key)}>
              <t.icon /> {t.label}
            </button>
          ))}
        </motion.nav>

        <AnimatePresence mode="wait">
          {/* ─── INVENTORY TAB ─── */}
          {activeTab === 'inventory' && (
            <motion.div key="inv" className="bbd__panel" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.25 }}>
              <div className="bbd__panel-head">
                <div>
                  <h2>Blood Inventory</h2>
                  <p>Real-time stock levels across all blood groups</p>
                </div>
                <span className="bbd__updated">Updated {new Date(bloodBank.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              </div>

              {/* Summary strip */}
              <div className="bbd__inv-strip">
                <div className="bbd__inv-strip-item">
                  <FiBarChart2 />
                  <div><strong>{totalUnits}</strong><span>Total Units</span></div>
                </div>
                <div className="bbd__inv-strip-item">
                  <FiCheckCircle />
                  <div><strong>{availableTypes}</strong><span>Available Groups</span></div>
                </div>
                <div className="bbd__inv-strip-item bbd__inv-strip-item--warn">
                  <FiAlertCircle />
                  <div><strong>{criticalTypes}</strong><span>Low Stock</span></div>
                </div>
              </div>

              {/* Blood cards */}
              <div className="bbd__blood-grid">
                {bloodBank.bloodInventory?.map((inv, idx) => {
                  const lvl = stockLevel(inv.unitsAvailable);
                  return (
                    <motion.div
                      key={inv.bloodGroup}
                      className={`bbd__bcard bbd__bcard--${lvl}`}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.06 }}
                      whileHover={{ y: -6 }}
                    >
                      <div className="bbd__bcard-top" style={{ '--grp-clr': GROUP_CLR[inv.bloodGroup] }}>
                        <span className="bbd__bcard-group">{inv.bloodGroup}</span>
                        <span className={`bbd__bcard-badge bbd__bcard-badge--${lvl}`}>
                          {lvl === 'high' ? 'In Stock' : lvl === 'mid' ? 'Moderate' : lvl === 'low' ? 'Low' : 'Empty'}
                        </span>
                      </div>
                      <div className="bbd__bcard-mid">
                        <strong>{inv.unitsAvailable}</strong>
                        <span>units available</span>
                      </div>
                      <div className="bbd__bcard-bar">
                        <motion.div
                          className="bbd__bcard-fill"
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: Math.min(inv.unitsAvailable / 50, 1) }}
                          transition={{ duration: 0.7, ease: 'easeOut', delay: idx * 0.06 }}
                          style={{ background: GROUP_CLR[inv.bloodGroup] }}
                        />
                      </div>
                      <motion.button className="bbd__bcard-btn" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                        Request <FiArrowRight />
                      </motion.button>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ─── DETAILS TAB ─── */}
          {activeTab === 'details' && (
            <motion.div key="det" className="bbd__panel" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.25 }}>
              <div className="bbd__panel-head">
                <div>
                  <h2>Bank Details</h2>
                  <p>Certifications, team, and operational information</p>
                </div>
              </div>

              <div className="bbd__detail-grid">
                {[
                  { icon: FiShield, title: 'Certification', sub: 'ISO 9001 Certified', badge: 'Verified' },
                  { icon: FiUsers, title: 'Medical Staff', sub: 'Qualified professionals', badge: '24/7' },
                  { icon: FiActivity, title: 'Lab Testing', sub: 'Advanced diagnostics', badge: 'Rapid' },
                  { icon: FiTrendingUp, title: 'Success Rate', sub: 'Transfusion success', badge: '99.8%' },
                ].map((d, i) => (
                  <motion.div key={i} className="bbd__dcard" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} whileHover={{ y: -5 }}>
                    <div className="bbd__dcard-icon"><d.icon /></div>
                    <h4>{d.title}</h4>
                    <p>{d.sub}</p>
                    <span className="bbd__dcard-badge">{d.badge}</span>
                  </motion.div>
                ))}
              </div>

              {/* Contact card */}
              <div className="bbd__contact-card">
                <h3>Contact & Location</h3>
                <div className="bbd__contact-rows">
                  <div className="bbd__contact-row"><FiMapPin /><div><label>Address</label><p>{bloodBank.address}</p></div></div>
                  <div className="bbd__contact-row"><FiPhone /><div><label>Phone</label><a href={`tel:${bloodBank.phone}`}>{bloodBank.phone}</a></div></div>
                  <div className="bbd__contact-row"><FiMail /><div><label>Email</label><a href={`mailto:${bloodBank.email}`}>{bloodBank.email}</a></div></div>
                </div>
              </div>

              {/* Hours */}
              <div className="bbd__hours-card">
                <h3>Operating Hours</h3>
                <div className="bbd__hours-rows">
                  {[
                    { day: 'Monday – Sunday', time: '24 Hours' },

                    { day: 'Blood Donations', time: '6:00 AM – 8:00 PM' },
                  ].map((h, i) => (
                    <div key={i} className="bbd__hours-row">
                      <span>{h.day}</span>
                      <strong>{h.time}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ─── SERVICES TAB ─── */}
          {activeTab === 'services' && (
            <motion.div key="srv" className="bbd__panel" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.25 }}>
              <div className="bbd__panel-head">
                <div>
                  <h2>Services & Facilities</h2>
                  <p>Everything this blood bank offers</p>
                </div>
              </div>

              <div className="bbd__srv-grid">
                {[
                  { icon: FiDroplet, title: 'Whole Blood Donation', desc: 'Safe and sterile donation by trained phlebotomists' },
                  { icon: FiActivity, title: 'Blood Grouping & Screening', desc: 'ABO, Rh typing, antibody screening and cross-match' },
                  { icon: FiAward, title: 'Component Separation', desc: 'Plasma, platelets, packed RBCs and cryoprecipitate' },

                  { icon: FiUsers, title: 'Donor Counseling', desc: 'Pre and post donation health counseling sessions' },
                  { icon: FiShield, title: 'Quality & Safety', desc: 'NAT testing, temperature-controlled storage chain' },
                ].map((s, idx) => (
                  <motion.div
                    key={idx}
                    className="bbd__srv-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.07 }}
                    whileHover={{ y: -5, boxShadow: '0 12px 32px rgba(15,23,42,.12)' }}
                  >
                    <div className="bbd__srv-icon"><s.icon /></div>
                    <h4>{s.title}</h4>
                    <p>{s.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ═══════════════════════════════════════════
          CTA
          ═══════════════════════════════════════════ */}
      <motion.section className="bbd__cta" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
        <div className="bbd__cta-inner">
          <FiDroplet className="bbd__cta-icon" />
          <h2>Need Blood Urgently?</h2>
          <p>Every second counts. Reach out now for immediate assistance.</p>
          <div className="bbd__cta-actions">

            <motion.a href={`mailto:${bloodBank.email}`} className="bbd__btn bbd__btn--glass" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <FiMail /> Email Request
            </motion.a>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default BloodBankDetail;
