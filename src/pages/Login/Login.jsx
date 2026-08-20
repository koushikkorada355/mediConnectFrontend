import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { loginUser } from '../../store/slices/authSlice';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoggedIn, loading, error, role } = useSelector(state => state.auth);
  const [userRole, setUserRole] = useState('User');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);



  // Redirect based on role after login
  useEffect(() => {
    if (isLoggedIn && role) {
      switch (role) {
        case 'SUPER_ADMIN':
          navigate('/system-admin');
          break;
        case 'HOSPITAL_ADMIN':
          navigate('/hospital-admin');
          break;
        default:
          navigate('/');
          break;
      }
    }
  }, [isLoggedIn, role, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoginError(null);

    // Dispatch Redux login action
    const result = await dispatch(loginUser({
      email: formData.email,
      password: formData.password,
    }));

    // Handle login response
    if (result.type === loginUser.fulfilled.type) {
      // Login successful - navigation handled by useEffect hook
      console.log('Login successful');
    } else if (result.type === loginUser.rejected.type) {
      setLoginError(result.payload || 'Login failed');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.12,
        delayChildren: 0.2,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <div className="auth-container">
      {/* Animated background blobs */}
      <div className="bg-blob blob-1"></div>
      <div className="bg-blob blob-2"></div>

      <motion.div
        className="auth-box"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Close button */}
        <motion.button
          onClick={() => navigate('/')}
          className="close-btn"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          ✕
        </motion.button>

        <motion.div
          className="auth-header"
          variants={itemVariants}
        >
          <h2>Welcome Back</h2>
          <p>Sign in to your account</p>
        </motion.div>

        <motion.div
          className="role-selector"
          variants={itemVariants}
        >
          <p className="role-label">Login as:</p>
          <div className="role-options">
            {['Patient', 'Doctor', 'Hospital Admin'].map((role) => (
              <button
                key={role}
                type="button"
                className={`role-btn ${userRole === role.toLowerCase().replace(' ', '-') ? 'active' : ''}`}
                onClick={() => setUserRole(role.toLowerCase().replace(' ', '-'))}
              >
                {role}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          variants={itemVariants}
        >
          {loginError && (
            <motion.div
              className="error-box"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              variants={itemVariants}
            >
              {loginError}
            </motion.div>
          )}
          <motion.div
            className="form-group"
            variants={itemVariants}
          >
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your.email@example.com"
              className={errors.email ? 'input-error' : ''}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </motion.div>

          <motion.div
            className="form-group"
            variants={itemVariants}
          >
            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className={errors.password ? 'input-error' : ''}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'HIDE' : 'SHOW'}
              </button>
            </div>
            {errors.password && <span className="error-message">{errors.password}</span>}
          </motion.div>

          <motion.div
            className="form-footer"
            variants={itemVariants}
          >
            <Link to="#" className="forgot-password">Forgot password?</Link>
          </motion.div>

          <motion.button
            type="submit"
            className="auth-btn"
            disabled={loading}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? (
              <span className="loading-spinner"></span>
            ) : (
              'Sign In'
            )}
          </motion.button>
        </motion.form>

        <motion.div
          className="auth-footer"
          variants={itemVariants}
        >
          <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
