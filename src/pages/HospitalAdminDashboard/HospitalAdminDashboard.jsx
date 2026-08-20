import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getHospitalDoctors, addDoctorToHospital } from '../../store/slices/doctorSlice';
import apiClient from '../../services/apiClient';
import './HospitalAdminDashboard.css';

// Hospital Admin Sub-pages
const Overview = () => {
  const [hospital, setHospital] = useState(null);
  const [doctorsCount, setDoctorsCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const hospitalRes = await apiClient.get('/hospital/admin/me');
        if (hospitalRes.data && hospitalRes.data.data) {
          const hosp = hospitalRes.data.data;
          setHospital(hosp);
          
          const docsRes = await apiClient.get(`/hospitaladmin/doctors/${hosp._id}`);
          if (docsRes.data && docsRes.data.data) {
            setDoctorsCount(docsRes.data.data.length);
          }
        }
      } catch(e) {
        console.error("Error fetching overview data", e);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="dashboard-content animate-fade-in">
      <h2 className="dashboard-title">Hospital Overview</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Doctors</h3>
          <p className="stat-value">{doctorsCount}</p>
        </div>
        <div className="stat-card">
          <h3>Total Beds Available</h3>
          <p className="stat-value text-green">
            {hospital ? (hospital.generalBeds || 0) + (hospital.icuBeds || 0) + (hospital.ccuBeds || 0) : 0} / {hospital ? hospital.totalBeds || 0 : 0}
          </p>
        </div>
        <div className="stat-card">
          <h3>Overall Capacity</h3>
          <p className="stat-value">
            {hospital && hospital.totalBeds 
              ? Math.round(((hospital.generalBeds || 0) + (hospital.icuBeds || 0) + (hospital.ccuBeds || 0)) / hospital.totalBeds * 100) + '%' 
              : 'N/A'}
          </p>
        </div>
      </div>
      <div className="dashboard-chart-placeholder mt-6">
        <p>Graphical Representation of Resources...</p>
      </div>
    </div>
  );
};

const ManageDoctors = () => {
  const dispatch = useDispatch();
  const { hospitalDoctors, loading } = useSelector((state) => state.doctor);
  const [hospital, setHospital] = useState(null);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDoctor, setNewDoctor] = useState({ doctorId: '', department: '', consultationHours: '' });

  useEffect(() => {
    const fetchHospital = async () => {
      try {
        const hospitalRes = await apiClient.get('/hospital/admin/me');
        if (hospitalRes.data && hospitalRes.data.data) {
          setHospital(hospitalRes.data.data);
          dispatch(getHospitalDoctors(hospitalRes.data.data._id));
        }
      } catch (err) {
        console.error("Error fetching hospital", err);
      }
    };
    fetchHospital();
  }, [dispatch]);

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    if (hospital && hospital._id) {
      await dispatch(addDoctorToHospital({ ...newDoctor, hospitalId: hospital._id }));
      setShowAddForm(false);
      setNewDoctor({ doctorId: '', department: '', consultationHours: '' });
      dispatch(getHospitalDoctors(hospital._id));
    }
  };

  return (
    <div className="dashboard-content animate-fade-in">
      <div className="page-header">
        <h2 className="dashboard-title">Manage Doctors</h2>
        <button className="btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Cancel' : 'Add Doctor'}
        </button>
      </div>

      {showAddForm && (
        <div className="settings-card mb-6 p-4 border rounded" style={{ marginBottom: '1.5rem', padding: '1.5rem', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <h3 style={{ marginBottom: '1rem' }}>Add Doctor to Hospital</h3>
          <form onSubmit={handleAddDoctor} className="form-grid">
            <div className="form-group">
              <label>Doctor ID</label>
              <input type="text" className="form-input" required value={newDoctor.doctorId} onChange={(e) => setNewDoctor({...newDoctor, doctorId: e.target.value})} placeholder="Enter Doctor ID" />
            </div>
            <div className="form-group">
              <label>Department</label>
              <input type="text" className="form-input" required value={newDoctor.department} onChange={(e) => setNewDoctor({...newDoctor, department: e.target.value})} placeholder="e.g. Cardiology" />
            </div>
            <div className="form-group">
              <label>Consultation Hours</label>
              <input type="text" className="form-input" required value={newDoctor.consultationHours} onChange={(e) => setNewDoctor({...newDoctor, consultationHours: e.target.value})} placeholder="e.g. 9 AM - 5 PM" />
            </div>
            <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button type="submit" className="btn-primary w-full">Submit</button>
            </div>
          </form>
        </div>
      )}

      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Department</th>
              <th>Consultation Hours</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" style={{textAlign: "center", padding: "1rem"}}>Loading...</td></tr>
            ) : hospitalDoctors && hospitalDoctors.map(doc => (
              <tr key={doc._id}>
                <td>{doc.doctorId?.name || doc.name || 'N/A'}</td>
                <td>{doc.department || doc.specialization?.name || doc.specialization || 'N/A'}</td>
                <td>{doc.consultationHours || doc.availableHours || '9 AM - 5 PM'}</td>
                <td>
                  <button className="btn-icon">Update Details</button>
                  <button className="btn-icon btn-danger">Remove</button>
                </td>
              </tr>
            ))}
            {!loading && (!hospitalDoctors || hospitalDoctors.length === 0) && (
              <tr>
                <td colSpan="4" style={{textAlign: "center", padding: "1rem"}}>No doctors found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const BedManagement = () => {
  const [hospital, setHospital] = useState(null);

  useEffect(() => {
    const fetchBedStats = async () => {
      try {
        const hospitalRes = await apiClient.get('/hospital/admin/me');
        if (hospitalRes.data && hospitalRes.data.data) {
          setHospital(hospitalRes.data.data);
        }
      } catch (e) {
        console.error("Error fetching bed management data", e);
      }
    };
    fetchBedStats();
  }, []);

  return (
    <div className="dashboard-content animate-fade-in">
      <h2 className="dashboard-title">Bed Management</h2>
      <div className="bed-stats-grid">
        <div className="bed-card general">
          <h4>General Beds</h4>
          <div className="bed-count">{hospital?.generalBeds || 0} Available</div>
          <button className="btn-secondary mt-2">Update Status</button>
        </div>
        <div className="bed-card icu">
          <h4>ICU Beds</h4>
          <div className="bed-count text-orange">{hospital?.icuBeds || 0} Available</div>
          <button className="btn-secondary mt-2">Update Status</button>
        </div>
        <div className="bed-card ccu">
          <h4>CCU Beds</h4>
          <div className="bed-count text-red">{hospital?.ccuBeds || 0} Available</div>
          <button className="btn-secondary mt-2">Update Status</button>
        </div>
      </div>
    </div>
  );
};

const HospitalProfile = () => {
  const [hospital, setHospital] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    type: 'PRIVATE',
    phone: '',
    email: '',
    establishedDate: '',
    lat: 0,
    lng: 0
  });

  const fetchProfile = async () => {
    try {
      const res = await apiClient.get('/hospital/admin/me');
      if (res.data && res.data.data) {
        setHospital(res.data.data);
        setFormData({
          ...res.data.data,
          establishedDate: res.data.data.establishedDate ? new Date(res.data.data.establishedDate).toISOString().split('T')[0] : ''
        });
      }
    } catch (err) {
      console.error("Error fetching profile", err);
      if (err.response?.status === 404) {
        setIsCreating(true);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });
    if (imageFile) {
      data.append('hospitalImage', imageFile);
    }

    try {
      if (isCreating) {
        await apiClient.post('/hospital', data);
        alert('Hospital created successfully!');
        setIsCreating(false);
      } else {
        await apiClient.put(`/hospital/${hospital._id}`, data);
        alert('Hospital updated successfully!');
      }
      fetchProfile();
    } catch (err) {
      console.error("Error saving hospital", err);
      alert(err.response?.data?.message || 'Failed to save hospital details');
    }
  };

  if (loading) return <div className="dashboard-content">Loading...</div>;

  return (
    <div className="dashboard-content animate-fade-in">
      <h2 className="dashboard-title">{isCreating ? 'Create Hospital Profile' : 'Hospital Profile & Settings'}</h2>
      
      <form onSubmit={handleSubmit} className="settings-section">
        <h3>Basic Profile Information</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>Hospital Name</label>
            <input type="text" className="form-input" required value={formData.name || ''} onChange={(e) => setFormData({...formData, name: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Hospital Type</label>
            <select className="form-input" required value={formData.type || 'PRIVATE'} onChange={(e) => setFormData({...formData, type: e.target.value})}>
              <option value="PRIVATE">Private</option>
              <option value="GOVERNMENT">Government</option>
            </select>
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input type="text" className="form-input" required value={formData.phone || ''} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" className="form-input" required value={formData.email || ''} onChange={(e) => setFormData({...formData, email: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Established Date</label>
            <input type="date" className="form-input" value={formData.establishedDate || ''} onChange={(e) => setFormData({...formData, establishedDate: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Full Address</label>
            <input type="text" className="form-input" required value={formData.address || ''} onChange={(e) => setFormData({...formData, address: e.target.value})} />
          </div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label>Hospital Image</label>
            <input type="file" className="form-input" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} required={isCreating} />
            {hospital?.hospitalImage && (
              <div style={{ marginTop: '10px' }}>
                <img src={hospital.hospitalImage} alt="Hospital" style={{ width: '100px', borderRadius: '4px' }} />
              </div>
            )}
          </div>
        </div>

        <button type="submit" className="btn-primary mt-6">{isCreating ? 'Create Profile' : 'Save All Changes'}</button>
      </form>
    </div>
  );
};

const HospitalAdminDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [hospitalName, setHospitalName] = useState("Loading...");

  useEffect(() => {
    apiClient.get('/hospital/admin/me')
      .then(res => {
        if (res.data && res.data.data) {
          setHospitalName(res.data.data.name);
        } else {
          setHospitalName("Hospital Admin");
        }
      })
      .catch(e => {
        console.error("Error loading hospital header", e);
        setHospitalName("Hospital Admin");
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('auth');
    navigate('/login');
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="dashboard-sidebar hospital-theme">
        <div className="sidebar-brand">
          <h2>{hospitalName}</h2>
          <span className="brand-badge hospital">Hospital Admin</span>
        </div>
        <nav className="sidebar-nav">
          <Link to="/hospital-admin" className={`nav-item ${location.pathname === '/hospital-admin' ? 'active' : ''}`}>
            Dashboard
          </Link>
          <Link to="/hospital-admin/doctors" className={`nav-item ${location.pathname.includes('/doctors') ? 'active' : ''}`}>
            Manage Doctors
          </Link>
          <Link to="/hospital-admin/beds" className={`nav-item ${location.pathname.includes('/beds') ? 'active' : ''}`}>
            Bed Management
          </Link>
          <Link to="/hospital-admin/profile" className={`nav-item ${location.pathname.includes('/profile') ? 'active' : ''}`}>
            Profile & Settings
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="dashboard-main">
        {/* Topbar */}
        <header className="dashboard-topbar">
          <div className="topbar-title">
            <h3>Welcome, {hospitalName}</h3>
          </div>
          <div className="topbar-actions">
            <button className="notification-btn">🔔</button>
            <div className="user-profile">
              <div className="avatar hospital-avatar">HA</div>
              <span>Hospital Admin</span>
              <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </header>

        {/* Dynamic Routes */}
        <div className="dashboard-body">
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="doctors" element={<ManageDoctors />} />
            <Route path="beds" element={<BedManagement />} />
            <Route path="profile" element={<HospitalProfile />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default HospitalAdminDashboard;
