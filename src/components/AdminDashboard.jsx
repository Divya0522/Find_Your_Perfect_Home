
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, CartesianGrid, XAxis, YAxis, Bar, LineChart, Line, ResponsiveContainer } from 'recharts';
import { FaUsers, FaUserCheck, FaUserSlash, FaList, FaBell, FaCog, FaSave } from 'react-icons/fa'; // Icons for statistics
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('');
  const [users, setUsers] = useState([]);
  const [listings, setListings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [reports, setReports] = useState([]); // State to store reports
  const [settings, setSettings] = useState([
    { id: 1, name: 'maintenanceMode', description: 'Maintenance Mode', value: 'false' },
    { id: 2, name: 'userRegistration', description: 'User Registration', value: 'true' },
    { id: 3, name: 'listingAutoApproval', description: 'Listing Auto Approval', value: 'false' },
    { id: 4, name: 'maxListingsPerUser', description: 'Max Listings Per User', value: '10' },
  ]);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [selectedListingReports, setSelectedListingReports] = useState([]); // State for selected listing's reports


  // Fetch blocked users
  useEffect(() => {
    const fetchBlockedUsers = async () => {
      try {
        const response = await fetch('https://find-your-perfect-home-backend.onrender.com/api/admin/blocked-users');
        const data = await response.json();
        setBlockedUsers(data);
      } catch (error) {
        console.error('Error fetching blocked users:', error);
      }
    };
    fetchBlockedUsers();
  }, []);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('https://find-your-perfect-home-backend.onrender.com/api/users');
        if (!response.ok) throw new Error('Failed to fetch users');
        const result = await response.json();
        setUsers(result || []);
      } catch (error) {
        console.error('Error fetching users:', error);
        setUsers([]);
      }
    };
    fetchUsers();
  }, []);

  // Fetch listings
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await fetch('https://find-your-perfect-home-backend.onrender.com/api/admin/listings');
        if (!response.ok) throw new Error('Failed to fetch listings');
        const result = await response.json();
        setListings(result || []);
      } catch (error) {
        console.error('Error fetching listings:', error);
        setListings([]);
      }
    };
    fetchListings();
  }, []);

  // Fetch reports for listings
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch("https://find-your-perfect-home-backend.onrender.com/api/admin/reports");
        if (!response.ok) throw new Error("Failed to fetch reports");
        const data = await response.json();
        setReports(data); // Update state with the fetched reports
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };
  
    fetchReports();
  }, []);

  // Handle approve listing
  const handleApprove = async (listingId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://find-your-perfect-home-backend.onrender.com/api/properties/${listingId}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setListings(listings.map(listing =>
          listing._id === listingId ? { ...listing, status: 'approved' } : listing
        ));
        alert('Listing approved successfully');
      } else {
        alert('Failed to approve listing');
      }
    } catch (error) {
      console.error('Error approving listing:', error);
      alert('Error approving listing');
    }
  };

  // Handle reject listing
  const handleReject = async (listingId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://find-your-perfect-home-backend.onrender.com/api/properties/${listingId}/reject`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setListings(listings.map(listing =>
          listing._id === listingId ? { ...listing, status: 'rejected' } : listing
        ));
        alert('Listing rejected successfully');
      } else {
        alert('Failed to reject listing');
      }
    } catch (error) {
      console.error('Error rejecting listing:', error);
      alert('Error rejecting listing');
    }
  };

  // Handle suspend/activate user
  const handleSuspend = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';

    try {
      const response = await fetch(`https://find-your-perfect-home-backend.onrender.com/api/admin/users/${userId}/suspend`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setUsers(users.map(user =>
          user._id === userId ? { ...user, status: newStatus } : user
        ));
      } else {
        console.error('Failed to update user status');
      }
    } catch (error) {
      console.error('Error suspending user:', error);
    }
  };

  // Handle setting change
  const handleSettingChange = (id, value) => {
    setSettings(settings.map(setting =>
      setting.id === id ? { ...setting, value } : setting
    ));
  };

  // Handle save settings
  const handleSaveSettings = async () => {
    try {
      const response = await fetch('https://find-your-perfect-home-backend.onrender.com/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        alert('Settings saved successfully');
      } else {
        alert('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings');
    }
  };

  // Handle unblock/block user
  const handleUnblockUser = async (userId) => {
    try {
      const response = await fetch(`https://find-your-perfect-home-backend.onrender.com/api/admin/users/${userId}/unblock`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        setBlockedUsers(blockedUsers.map(user =>
          user._id === userId ? { ...user, status: user.status === 'blocked' ? 'active' : 'blocked' } : user
        ));
      } else {
        console.error('Failed to update user status');
      }
    } catch (error) {
      console.error('Error unblocking user:', error);
    }
  };


  const ReportsModal = ({ reports, onClose }) => {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
          <h3>Reports for Listing</h3>
          <ul>
            {reports.map((report, index) => (
              <li key={index}>
                <strong>Reason:</strong> {report.reason} <br />
                <strong>Comment:</strong> {report.comment}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };
  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/signin');
  };

  // Data for User Distribution Pie Chart
  const userData = [
    { name: 'Active Users', value: users.filter(user => user.status === 'active').length },
    { name: 'Suspended Users', value: users.filter(user => user.status === 'suspended').length },
    { name: 'Blocked Users', value: users.filter(user => user.status === 'blocked').length },
  ];

  // Data for Listings by Price Range Bar Chart
  const processListingsByPrice = () => {
    if (!listings || listings.length === 0) return [];

    const priceRanges = [
      { range: '0 - 100K', min: 0, max: 100000 },
      { range: '100K - 500K', min: 100000, max: 500000 },
      { range: '500K - 1M', min: 500000, max: 1000000 },
      { range: '1M+', min: 1000000, max: Infinity },
    ];

    return priceRanges.map(range => ({
      range: range.range,
      listings: listings.filter(listing => listing.price >= range.min && listing.price < range.max).length,
    }));
  };

  // Data for Listings by Month Line Chart
  const processListingsByMonth = () => {
    if (!listings || listings.length === 0) return [];

    const months = Array.from({ length: 12 }, (_, i) => ({
      month: new Date(0, i).toLocaleString('default', { month: 'short' }),
      listings: 0,
    }));

    listings.forEach(listing => {
      if (listing.createdAt) {
        const month = new Date(listing.createdAt).getMonth();
        months[month].listings += 1;
      }
    });

    return months;
  };

  // Data for Listings by Status Bar Chart
  const processListingsByStatus = () => {
    if (!listings || listings.length === 0) return [];

    const statusCounts = {
      pending: listings.filter(listing => listing.status === 'pending').length,
      approved: listings.filter(listing => listing.status === 'approved').length,
      rejected: listings.filter(listing => listing.status === 'rejected').length,
    };

    return Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count,
    }));
  };

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  // Calculate statistics
  const activeUsers = users.filter(user => user.status === 'active').length;
  const suspendedUsers = users.filter(user => user.status === 'suspended').length;
  const totalListings = listings.length;
  const totalNotifications = notifications.length;

  return (
    <div className="dashboard">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} handleLogout={handleLogout} />
      <div className="main-content">
        {activeTab === '' && (
          <div className="home-page">
            <h1>Welcome to Admin Dashboard</h1>
            <p>Manage your platform efficiently with real-time insights.</p>

            {/* Statistics Cards */}
            <div className="stats-grid">
              {/* Total Users Card */}
              <div className="stat-card">
                <div className="stat-icon">
                  <FaUsers size={30} color="#4CAF50" />
                </div>
                <div className="stat-info">
                  <h3>Total Users</h3>
                  <p>{users.length}</p>
                </div>
              </div>

              {/* Active Users Card */}
              <div className="stat-card">
                <div className="stat-icon">
                  <FaUserCheck size={30} color="#2196F3" />
                </div>
                <div className="stat-info">
                  <h3>Active Users</h3>
                  <p>{activeUsers}</p>
                </div>
              </div>

              {/* Suspended Users Card */}
              <div className="stat-card">
                <div className="stat-icon">
                  <FaUserSlash size={30} color="#FF5722" />
                </div>
                <div className="stat-info">
                  <h3>Suspended Users</h3>
                  <p>{suspendedUsers}</p>
                </div>
              </div>

              {/* Total Listings Card */}
              <div className="stat-card">
                <div className="stat-icon">
                  <FaList size={30} color="#9C27B0" />
                </div>
                <div className="stat-info">
                  <h3>Total Listings</h3>
                  <p>{totalListings}</p>
                </div>
              </div>

              {/* Total Notifications Card */}
              <div className="stat-card">
                <div className="stat-icon">
                  <FaBell size={30} color="#FFC107" />
                </div>
                <div className="stat-info">
                  <h3>Total Notifications</h3>
                  <p>{totalNotifications}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View All Users Tab */}
        {activeTab === 'View All Users' && (
          <div className="user-table">
            <h2>View All Users</h2>
            <table>
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user._id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* View All Listings Tab */}
        {activeTab === 'View All Listings' && (
          <div className="listings-table">
            <h2>View All Listings</h2>
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Price</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {listings.map((listing) => (
                  <tr key={listing._id}>
                    <td>{listing.title}</td>
                    <td>{listing.description}</td>
                    <td>${listing.price.toLocaleString()}</td>
                    <td>{listing.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Approve/Reject Listings Tab */}
        {activeTab === 'Approve/Reject Listings' && (
  <div className="listings-table">
    <h2>Approve/Reject Listings</h2>
    <table>
      <thead>
        <tr>
          <th>Title</th>
          <th>Description</th>
          <th>Price</th>
          <th>Status</th>
          <th>Reports</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {listings.map((listing) => {
          // Filter reports for the current listing
          const listingReports = reports.filter(
            (report) =>
              report.property_id && // Ensure property_id exists
              report.property_id._id === listing._id // Match property_id with listing _id
          );

          return (
            <tr key={listing._id}>
              <td>{listing.title}</td>
              <td>{listing.description}</td>
              <td>${listing.price.toLocaleString()}</td>
              <td>{listing.status}</td>
              <td>
                <button
                  className="view-reports-button"
                  onClick={() => {
                    setSelectedListingReports(listingReports); // Set selected listing's reports
                    setIsModalOpen(true); // Open the modal
                  }}
                >
                  {listingReports.length} Reports
                </button>
              </td>
              <td>
                <button
                  onClick={() => handleApprove(listing._id)}
                  disabled={listing.status === 'approved'}
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(listing._id)}
                  disabled={listing.status === 'rejected'}
                >
                  Reject
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
)}
        {/* System Settings Tab */}
        {activeTab === 'System Settings' && (
          <div className="system-settings">
            <div className="settings-header">
              <FaCog className="settings-icon" />
              <h2>System Settings</h2>
            </div>

            <div className="settings-list">
              {settings.map((setting) => (
                <div key={setting.id} className="setting-item">
                  <label className="setting-label">{setting.description}</label>
                  {setting.name === 'maintenanceMode' ||
                  setting.name === 'userRegistration' ||
                  setting.name === 'listingAutoApproval' ? (
                    <select
                      value={setting.value}
                      onChange={(e) => handleSettingChange(setting.id, e.target.value)}
                      className="setting-input"
                    >
                      <option value="true">Enabled</option>
                      <option value="false">Disabled</option>
                    </select>
                  ) : (
                    <input
                      type="number"
                      value={setting.value}
                      onChange={(e) => handleSettingChange(setting.id, e.target.value)}
                      className="setting-input"
                    />
                  )}
                </div>
              ))}
            </div>

            <button onClick={handleSaveSettings} className="save-button">
              <FaSave className="save-icon" />
              Save Settings
            </button>
          </div>
        )}

        {/* Blocked/Unblocked Users Tab */}
        {activeTab === 'Blocked/Unblocked Users' && (
          <div className="user-table">
            <h2>Blocked/Unblocked Users</h2>
            <table>
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {blockedUsers.map((user) => (
                  <tr key={user._id}>
                    <td>{user._id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.status}</td>
                    <td>
                      <button onClick={() => handleUnblockUser(user._id)}>
                        {user.status === 'blocked' ? 'Unblock' : 'Block'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Suspend/Activate User Accounts Tab */}
        {activeTab === 'Suspend/Activate User Accounts' && (
          <div className="user-table">
            <h2>Suspend/Activate User Accounts</h2>
            <table>
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user._id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.status}</td>
                    <td>
                      <button onClick={() => handleSuspend(user._id, user.status)}>
                        {user.status === 'active' ? 'Suspend' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* View Platform Analytics Tab */}
        {activeTab === 'View Platform Analytics' && (
          <div className="analysis-chart">
            <h2>Platform Analytics</h2>

            {/* User Distribution Pie Chart */}
            <div className="chart-container">
              <h3>User Distribution</h3>
              <p>This pie chart shows the distribution of users based on their account status (active, suspended, or blocked).</p>
              <PieChart width={400} height={300}>
                <Pie data={userData} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value" label>
                  {userData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </div>

            {/* Listings by Price Range Bar Chart */}
            <div className="chart-container">
              <h3>Listings by Price Range</h3>
              <p>This bar chart shows the number of listings categorized by their price range.</p>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={processListingsByPrice()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="listings" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Listings by Month Line Chart */}
            <div className="chart-container">
              <h3>Listings by Month</h3>
              <p>This line chart shows the number of listings created each month over the past year.</p>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={processListingsByMonth()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="listings" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Listings by Status Bar Chart */}
            <div className="chart-container">
              <h3>Listings by Status</h3>
              <p>This bar chart shows the number of listings categorized by their current status (pending, approved, or rejected).</p>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={processListingsByStatus()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="status" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#FF8042" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
         {isModalOpen && (
        <ReportsModal
          reports={selectedListingReports}
          onClose={() => setIsModalOpen(false)}
        />
      )}
      </div>
    </div>
  );
};

export default AdminDashboard;