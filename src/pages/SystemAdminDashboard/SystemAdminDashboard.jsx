import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getAllDoctors, createDoctorAccount } from '../../store/slices/doctorSlice';
import apiClient from '../../services/apiClient';
import './SystemAdminDashboard.css';

// System Admin Sub-pages
const Overview = () => {
  const [stats, setStats] = useState({ hospitals: 0, doctors: 0, bloodBanks: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [hospitalsRes, doctorsRes, bloodBanksRes] = await Promise.all([
          apiClient.get('/hospital'),
          apiClient.get('/doctor'),
          apiClient.get('/bloodbanks')
        ]);
        setStats({
          hospitals: hospitalsRes.data?.pagination?.total || hospitalsRes.data?.data?.length || 0,
          doctors: doctorsRes.data?.pagination?.total || doctorsRes.data?.data?.length || 0,
          bloodBanks: bloodBanksRes.data?.pagination?.total || bloodBanksRes.data?.data?.length || 0
        });
      } catch (err) {
        console.error("Failed to fetch stats", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="dashboard-content animate-fade-in">
      <h2 className="dashboard-title">Dashboard Overview</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Hospitals</h3>
          <p className="stat-value">{stats.hospitals}</p>
        </div>
        <div className="stat-card">
          <h3>Total Doctors</h3>
          <p className="stat-value">{stats.doctors}</p>
        </div>
        <div className="stat-card">
          <h3>Total Blood Banks</h3>
          <p className="stat-value">{stats.bloodBanks}</p>
        </div>
      </div>
      <div className="dashboard-chart-placeholder">
        <p>Platform Growth Chart Activity Feed...</p>
      </div>
    </div>
  );
};

const ManageHospitalAdmins = () => {
  const [hospitals, setHospitals] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const fetchHospitals = async () => {
    try {
      const res = await apiClient.get('/hospital');
      if (res.data && res.data.data) {
        setHospitals(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching hospital admins", err);
    }
  };

  useEffect(() => {
    fetchHospitals();
  }, []);

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiClient.post('/superadmin/create-hospital-admin', newAdmin);
      setShowAddForm(false);
      setNewAdmin({ name: '', email: '', password: '' });
      fetchHospitals();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create hospital admin");
    } finally {
      setLoading(false);
    }
  };

  const handleEditAdmin = async (hospital) => {
    const adminId = hospital?.adminUserId?._id;
    if (!adminId) {
      alert('Admin user not found for this hospital');
      return;
    }

    const currentName = hospital?.adminUserId?.name || '';
    const currentEmail = hospital?.adminUserId?.email || '';

    const name = window.prompt('Enter updated admin name', currentName);
    if (name === null) return;

    const email = window.prompt('Enter updated admin email', currentEmail);
    if (email === null) return;

    const password = window.prompt('Enter new password (leave blank to keep unchanged)', '');
    if (password === null) return;

    try {
      const payload = {
        name: name.trim(),
        email: email.trim().toLowerCase()
      };

      if (password.trim()) {
        payload.password = password.trim();
      }

      await apiClient.put(`/superadmin/hospital-admin/${adminId}`, payload);
      fetchHospitals();
      alert('Hospital admin updated successfully');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update hospital admin');
    }
  };

  const handleDeleteAdmin = async (hospital) => {
    const adminId = hospital?.adminUserId?._id;
    if (!adminId) {
      alert('Admin user not found for this hospital');
      return;
    }

    const confirmed = window.confirm('Are you sure you want to delete this hospital admin?');
    if (!confirmed) return;

    try {
      await apiClient.delete(`/superadmin/hospital-admin/${adminId}`);
      fetchHospitals();
      alert('Hospital admin deleted successfully');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete hospital admin');
    }
  };

  return (
    <div className="dashboard-content animate-fade-in">
      <div className="page-header">
        <h2 className="dashboard-title">Manage Hospital Admins</h2>
        <button className="btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Cancel' : 'Add New Admin'}
        </button>
      </div>

      {showAddForm && (
        <div className="settings-card mb-6 p-4 border rounded" style={{ marginBottom: '1.5rem', padding: '1.5rem', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <h3 style={{ marginBottom: '1rem' }}>Create Hospital Admin Account</h3>
          <form onSubmit={handleAddAdmin} className="form-grid">
            <div className="form-group">
              <label>Name</label>
              <input type="text" className="form-input" required value={newAdmin.name} onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })} placeholder="Admin Name" />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" className="form-input" required value={newAdmin.email} onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })} placeholder="Admin Email" />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" className="form-input" required value={newAdmin.password} onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })} placeholder="Password" />
            </div>
            <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button type="submit" className="btn-primary w-full" disabled={loading}>
                {loading ? 'Creating...' : 'Create Admin'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Admin Name</th>
              <th>Admin Email</th>
              <th>Hospital</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {hospitals.map(hospital => (
              <tr key={hospital._id}>
                <td>{hospital.adminUserId?.name || 'N/A'}</td>
                <td>{hospital.adminUserId?.email || 'N/A'}</td>
                <td>{hospital.name}</td>
                <td><span className="badge badge-active">{hospital.isActive !== false ? 'Active' : 'Pending'}</span></td>
                <td>
                  <button className="btn-icon" onClick={() => handleEditAdmin(hospital)}>Edit</button>
                  <button className="btn-icon btn-danger" onClick={() => handleDeleteAdmin(hospital)}>Delete</button>
                </td>
              </tr>
            ))}
            {hospitals.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: "1rem" }}>No hospital admins found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ManageBloodBankAdmins = () => {
  const [bloodBanks, setBloodBanks] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const fetchBloodBanks = async () => {
    try {
      const res = await apiClient.get('/bloodbanks');
      if (res.data && res.data.data) {
        setBloodBanks(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching blood banks", err);
    }
  };

  useEffect(() => {
    fetchBloodBanks();
  }, []);

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiClient.post('/superadmin/create-bloodbank-admin', newAdmin);
      setShowAddForm(false);
      setNewAdmin({ name: '', email: '', password: '' });
      fetchBloodBanks();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create blood bank admin");
    } finally {
      setLoading(false);
    }
  };

  const handleEditAdmin = async (bloodBank) => {
    const adminId = bloodBank?.adminUserId?._id;
    if (!adminId) {
      alert('Admin user not found for this blood bank');
      return;
    }

    const currentName = bloodBank?.adminUserId?.name || '';
    const currentEmail = bloodBank?.adminUserId?.email || '';

    const name = window.prompt('Enter updated admin name', currentName);
    if (name === null) return;

    const email = window.prompt('Enter updated admin email', currentEmail);
    if (email === null) return;

    const password = window.prompt('Enter new password (leave blank to keep unchanged)', '');
    if (password === null) return;

    try {
      const payload = {
        name: name.trim(),
        email: email.trim().toLowerCase()
      };

      if (password.trim()) {
        payload.password = password.trim();
      }

      await apiClient.put(`/superadmin/bloodbank-admin/${adminId}`, payload);
      fetchBloodBanks();
      alert('Blood bank admin updated successfully');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update blood bank admin');
    }
  };

  const handleDeleteAdmin = async (bloodBank) => {
    const adminId = bloodBank?.adminUserId?._id;
    if (!adminId) {
      alert('Admin user not found for this blood bank');
      return;
    }

    const confirmed = window.confirm('Are you sure you want to delete this blood bank admin?');
    if (!confirmed) return;

    try {
      await apiClient.delete(`/superadmin/bloodbank-admin/${adminId}`);
      fetchBloodBanks();
      alert('Blood bank admin deleted successfully');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete blood bank admin');
    }
  };

  return (
    <div className="dashboard-content animate-fade-in">
      <div className="page-header">
        <h2 className="dashboard-title">Manage Blood Bank Admins</h2>
        <button className="btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Cancel' : 'Add New Admin'}
        </button>
      </div>

      {showAddForm && (
        <div className="settings-card mb-6 p-4 border rounded" style={{ marginBottom: '1.5rem', padding: '1.5rem', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <h3 style={{ marginBottom: '1rem' }}>Create Blood Bank Admin Account</h3>
          <form onSubmit={handleAddAdmin} className="form-grid">
            <div className="form-group">
              <label>Name</label>
              <input type="text" className="form-input" required value={newAdmin.name} onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })} placeholder="Admin Name" />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" className="form-input" required value={newAdmin.email} onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })} placeholder="Admin Email" />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" className="form-input" required value={newAdmin.password} onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })} placeholder="Password" />
            </div>
            <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button type="submit" className="btn-primary w-full" disabled={loading}>
                {loading ? 'Creating...' : 'Create Admin'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Admin Name</th>
              <th>Admin Email</th>
              <th>Blood Bank</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bloodBanks.map(bb => (
              <tr key={bb._id}>
                <td>{bb.adminUserId?.name || 'N/A'}</td>
                <td>{bb.adminUserId?.email || 'N/A'}</td>
                <td>{bb.name}</td>
                <td><span className="badge badge-active">Active</span></td>
                <td>
                  <button className="btn-icon" onClick={() => handleEditAdmin(bb)}>Edit</button>
                  <button className="btn-icon btn-danger" onClick={() => handleDeleteAdmin(bb)}>Delete</button>
                </td>
              </tr>
            ))}
            {bloodBanks.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: "1rem" }}>No blood bank admins found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ManageDoctors = () => {
  const dispatch = useDispatch();
  const { doctors, loading } = useSelector((state) => state.doctor);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newDoctor, setNewDoctor] = useState({ name: '', email: '', password: '', image: null });

  useEffect(() => {
    dispatch(getAllDoctors());
  }, [dispatch]);

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', newDoctor.name);
    formData.append('email', newDoctor.email);
    formData.append('password', newDoctor.password);
    if (newDoctor.image) {
      formData.append('profileImage', newDoctor.image);
    }
    console.log('[SystemAdminDashboard] doctor form payload:', Array.from(formData.entries()).map(([k, v]) => [k, v instanceof File ? v.name : v]));
    await dispatch(createDoctorAccount(formData));
    setShowAddForm(false);
    setNewDoctor({ name: '', email: '', password: '', image: null });
    dispatch(getAllDoctors());
  };

  const handleEditDoctor = async (doctor) => {
    const doctorId = doctor?._id;
    if (!doctorId) {
      alert('Doctor ID not found');
      return;
    }

    const currentName = doctor?.userId?.name || doctor?.name || '';
    const currentEmail = doctor?.userId?.email || doctor?.email || '';
    const currentSpecialization = doctor?.specialization || '';
    const currentExperience = doctor?.experience ?? '';
    const currentLicenseNumber = doctor?.licenseNumber || '';

    const name = window.prompt('Enter updated doctor name', currentName);
    if (name === null) return;

    const email = window.prompt('Enter updated doctor email', currentEmail);
    if (email === null) return;

    const specialization = window.prompt('Enter specialization', currentSpecialization);
    if (specialization === null) return;

    const experience = window.prompt('Enter experience in years', String(currentExperience));
    if (experience === null) return;

    const licenseNumber = window.prompt('Enter license number', currentLicenseNumber);
    if (licenseNumber === null) return;

    const password = window.prompt('Enter new password (leave blank to keep unchanged)', '');
    if (password === null) return;

    try {
      const payload = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        specialization: specialization.trim(),
        experience: experience.trim(),
        licenseNumber: licenseNumber.trim()
      };

      if (password.trim()) {
        payload.password = password.trim();
      }

      await apiClient.put(`/superadmin/doctor/${doctorId}`, payload);
      dispatch(getAllDoctors());
      alert('Doctor updated successfully');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update doctor');
    }
  };

  const handleDeleteDoctor = async (doctor) => {
    const doctorId = doctor?._id;
    if (!doctorId) {
      alert('Doctor ID not found');
      return;
    }

    const confirmed = window.confirm('Are you sure you want to delete this doctor?');
    if (!confirmed) return;

    try {
      await apiClient.delete(`/superadmin/doctor/${doctorId}`);
      dispatch(getAllDoctors());
      alert('Doctor deleted successfully');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete doctor');
    }
  };

  return (
    <div className="dashboard-content animate-fade-in">
      <div className="page-header">
        <h2 className="dashboard-title">Manage Doctors</h2>
        <button className="btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Cancel' : 'Add New Doctor'}
        </button>
      </div>

      {showAddForm && (
        <div className="settings-card mb-6 p-4 border rounded" style={{ marginBottom: '1.5rem', padding: '1.5rem', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <h3 style={{ marginBottom: '1rem' }}>Create Doctor Account</h3>
          <form onSubmit={handleAddDoctor} className="form-grid" encType="multipart/form-data">
            <div className="form-group">
              <label>Name</label>
              <input type="text" className="form-input" required value={newDoctor.name} onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })} placeholder="Full Name" />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" className="form-input" required value={newDoctor.email} onChange={(e) => setNewDoctor({ ...newDoctor, email: e.target.value })} placeholder="Email Address" />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" className="form-input" required value={newDoctor.password} onChange={(e) => setNewDoctor({ ...newDoctor, password: e.target.value })} placeholder="Password" />
            </div>
            <div className="form-group">
              <label>Profile Image</label>
              <input type="file" className="form-input" accept="image/*" onChange={(e) => setNewDoctor({ ...newDoctor, image: e.target.files[0] })} />
            </div>
            <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button type="submit" className="btn-primary w-full">Create Account</button>
            </div>
          </form>
        </div>
      )}

      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Specialization</th>
              <th>Hospital</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={{ textAlign: "center", padding: "1rem" }}>Loading...</td></tr>
            ) : doctors && doctors.map(doc => (
              <tr key={doc._id}>
                <td>{doc.userId?.name || doc.name || 'N/A'}</td>
                <td>{doc.userId?.email || doc.email || 'N/A'}</td>
                <td>{doc.specialization?.name || doc.specialization || 'N/A'}</td>
                <td>{doc.hospitalId?.name || 'N/A'}</td>
                <td>
                  <button className="btn-icon" onClick={() => handleEditDoctor(doc)}>Edit</button>
                  <button className="btn-icon btn-danger" onClick={() => handleDeleteDoctor(doc)}>Delete</button>
                </td>
              </tr>
            ))}
            {!loading && (!doctors || doctors.length === 0) && (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: "1rem" }}>No doctors found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Settings = () => (
  <div className="dashboard-content animate-fade-in">
    <h2 className="dashboard-title">System Settings</h2>
    <div className="settings-card">
      <div className="form-group">
        <label>Platform Name</label>
        <input type="text" className="form-input" defaultValue="MediConnect" />
      </div>
      <div className="form-group">
        <label>Support Email</label>
        <input type="email" className="form-input" defaultValue="support@mediconnect.com" />
      </div>
      <button className="btn-primary mt-4">Save Changes</button>
    </div>
  </div>
);

const SystemAdminDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('auth');
    navigate('/login');
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-brand">
          <h2>MediConnect</h2>
          <span className="brand-badge">Super Admin</span>
        </div>
        <nav className="sidebar-nav">
          <Link to="/system-admin" className={`nav-item ${location.pathname === '/system-admin' ? 'active' : ''}`}>
            Dashboard Overview
          </Link>
          <Link to="/system-admin/hospital-admins" className={`nav-item ${location.pathname.includes('/hospital-admins') ? 'active' : ''}`}>
            Manage Hospital Admins
          </Link>
          <Link to="/system-admin/blood-bank-admins" className={`nav-item ${location.pathname.includes('/blood-bank-admins') ? 'active' : ''}`}>
            Manage Blood Bank Admins
          </Link>
          <Link to="/system-admin/doctors" className={`nav-item ${location.pathname.includes('/doctors') ? 'active' : ''}`}>
            Manage Doctors
          </Link>
          <Link to="/system-admin/settings" className={`nav-item ${location.pathname.includes('/settings') ? 'active' : ''}`}>
            System Settings
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="dashboard-main">
        {/* Topbar */}
        <header className="dashboard-topbar">
          <div className="search-bar">
            <input type="text" placeholder="Search..." className="search-input" />
          </div>
          <div className="topbar-actions">
            <div className="user-profile">
              <div className="avatar">SA</div>
              <span>Super Admin</span>
              <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </header>

        {/* Dynamic Routes */}
        <div className="dashboard-body">
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="hospital-admins" element={<ManageHospitalAdmins />} />
            <Route path="blood-bank-admins" element={<ManageBloodBankAdmins />} />
            <Route path="doctors" element={<ManageDoctors />} />
            <Route path="settings" element={<Settings />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default SystemAdminDashboard;
