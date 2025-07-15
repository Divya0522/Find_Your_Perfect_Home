
import React, { useState } from 'react';
import { FaHome, FaUser, FaTasks, FaChartBar, FaBell, FaList, FaBan, FaCog, FaBars, FaLock,FaSignOutAlt } from 'react-icons/fa';
import '../styles/Sidebar.css';

const Sidebar = ({ activeTab, setActiveTab,handleLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { name: 'View All Users', icon: <FaUser /> },
    { name: 'Blocked/Unblocked Users', icon: <FaLock /> }, // New menu item
    { name: 'Suspend/Activate User Accounts', icon: <FaBan /> },
    { name: 'View All Listings', icon: <FaList /> },
    { name: 'Approve/Reject Listings', icon: <FaTasks /> },
    { name: 'View Platform Analytics', icon: <FaChartBar /> },
    { name: 'System Settings', icon: <FaCog /> },
    
  ];

  return (
    <div className={`sidebar ${isMenuOpen ? 'open' : 'closed'}`}>
      {/* Dashboard icon at the top */}
      <div className="dashboard-icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        <FaBars size={30} />
      </div>

      {/* Home icon below the dashboard icon */}
      <div
        className="home-icon"
        onClick={() => {
          setActiveTab(''); // Reset activeTab to show the home page
        }}
      >
        <FaHome size={30} />
      </div>

      {/* Menu items */}
      {isMenuOpen && (
        <ul className="menu">
          {menuItems.map((item, index) => (
            <li
              key={index}
              className={`menu-item ${activeTab === item.name ? 'active' : ''}`}
              onClick={() => setActiveTab(item.name)} // Set activeTab to the selected menu item
            >
              <div className="icon">{item.icon}</div>
              <div className="text">{item.name}</div>
            </li>
          ))}
        </ul>
      )}
      {isMenuOpen && (
        <div className="logout-button" onClick={handleLogout}>
          <FaSignOutAlt size={20} />
          <span>Logout</span>
        </div>
      )}
    </div>
  );
};

export default Sidebar;