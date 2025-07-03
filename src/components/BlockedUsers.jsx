import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/BlockedUsers.css";

const BlockedUsers = () => {
  const [blockedUsers, setBlockedUsers] = useState([]);

  // Fetch blocked users
  useEffect(() => {
    const fetchBlockedUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5001/api/users/blocked-users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBlockedUsers(response.data);
      } catch (error) {
        console.error("Error fetching blocked users:", error);
      }
    };

    fetchBlockedUsers();
  }, []);

  // Handle unblocking a user
  const handleUnblockUser = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:5001/api/users/unblock-user/${userId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        alert("User unblocked successfully!");
        // Remove the unblocked user from the list
        setBlockedUsers((prev) => prev.filter((user) => user._id !== userId));
      }
    } catch (error) {
      console.error("Error unblocking user:", error);
      alert("Failed to unblock user.");
    }
  };

  return (
    <div className="blocked-users-container">
      <h2>Blocked Users</h2>
      {blockedUsers.length > 0 ? (
        <ul className="blocked-users-list">
          {blockedUsers.map((user) => (
            <li key={user._id} className="blocked-user-item">
              <div className="user-info">
                <p>Name: {user.name}</p>
                <p>Email: {user.email}</p>
              </div>
              <button
                className="unblock-button"
                onClick={() => handleUnblockUser(user._id)}
              >
                Unblock
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No blocked users found.</p>
      )}
    </div>
  );
};

export default BlockedUsers;