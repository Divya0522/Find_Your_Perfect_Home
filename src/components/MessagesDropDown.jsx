// import React, { useState } from 'react';
// import '../styles/MessagesDropdown.css';

// const MessagesDropdown = ({ onMessagesClick, onSavedListingsClick, onBlockedUsersClick }) => {
//   const [showMenu, setShowMenu] = useState(false);

//   const toggleMenu = () => {
//     setShowMenu(!showMenu);
//   };

//   return (
//     <div className="messages-dropdown">
//       {/* Toggle Button */}
//       <button className="menu-toggler" onClick={toggleMenu}>
//         ☰
//       </button>

//       {/* Dropdown Menu */}
//       {showMenu && (
//         <div className="dropdown-menu">
//           <button onClick={onMessagesClick}>Messages</button>
//           <button onClick={onSavedListingsClick}>Saved Listings</button>
//           <button onClick={onBlockedUsersClick}>Blocked Users</button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MessagesDropdown;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/MessagesDropdown.css";

const MessagesDropdown = ({ onMessagesClick, onSavedListingsClick, onBlockedUsersClick }) => {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleBlockedUsersClick = () => {
    navigate("/blocked-users"); // Navigate to the blocked users page
  };

  return (
    <div className="messages-dropdown">
      {/* Toggle Button */}
      <button className="menu-toggler" onClick={toggleMenu}>
        ☰
      </button>

      {/* Dropdown Menu */}
      {showMenu && (
        <div className="dropdown-menu">
          <button onClick={onMessagesClick}>Messages</button>
          <button onClick={onSavedListingsClick}>Saved Listings</button>
          <button onClick={handleBlockedUsersClick}>Blocked Users</button>
        </div>
      )}
    </div>
  );
};

export default MessagesDropdown;