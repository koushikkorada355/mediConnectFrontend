import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import logo from '../../assets/images/profile2.png';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { isLoggedIn, role } = useSelector(state => state.auth);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/doctors?search=${searchQuery}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    setIsMenuOpen(false);
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Doctors', path: '/doctors' },
    { name: 'Hospitals', path: '/hospitals' },
    { name: 'Blood Banks', path: '/bloodbanks' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar-inner">

        {/* Logo & Brand */}
        <Link to="/" className="navbar-logo-container">
          <img src={logo} alt="MediConnect" className="navbar-logo-img" />
          <div className="navbar-brand">
            <span className="navbar-title">
              Medi<span className="title-highlight">Connect</span>
            </span>
            <span className="navbar-subtitle">Your Health, Connected</span>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className={`navbar-center ${isMenuOpen ? 'active' : ''}`}>
          <div className="nav-links-group">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link ${location.pathname === link.path ? 'nav-link--active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Search */}
          <form className="navbar-search" onSubmit={handleSearch}>
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search doctors, hospitals..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="search-btn">
              Search
            </button>
          </form>

          {/* Mobile Auth Buttons */}
          <div className="mobile-auth-buttons">
            {isLoggedIn ? (
              <>
                <div className="user-info">
                  <p className="user-name">{role || 'User'}</p>
                </div>
                <button 
                  onClick={handleLogout} 
                  className="btn-logout"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-login" onClick={() => setIsMenuOpen(false)}>Login</Link>
                <Link to="/signup" className="btn-signup" onClick={() => setIsMenuOpen(false)}>Get Started</Link>
              </>
            )}
          </div>
        </div>

        {/* Right Section */}
        <div className="navbar-right">
          {isLoggedIn ? (
            <>
              <div className="user-info">
                <p className="user-name">{role || 'User'}</p>
              </div>
              <button 
                onClick={handleLogout} 
                className="btn-logout"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-login">Login</Link>
              <Link to="/signup" className="btn-signup">Get Started</Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className={`mobile-menu-btn ${isMenuOpen ? 'active' : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
