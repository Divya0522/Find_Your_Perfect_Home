
import { useContext, useState, useEffect } from "react";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";
import '../../styles/RealEstateSearch.css';

const PotentialChats = () => {
  const { user } = useContext(AuthContext);
  const { potentialChats, createChat, onlineUsers, userChats } = useContext(ChatContext);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [userChats]);

  return (
    <div className="potential-chats-container">
      <button 
        className="dropdown-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        New Chats ({potentialChats.length}) ▼
      </button>
      
      {isOpen && (
        <div className="potential-chats-dropdown">
          {potentialChats.map((u) => (
            <div
              key={u._id}
              className="potential-chat-item"
              onClick={() => createChat(user._id, u._id)}
            >
              <div className="user-info">
                <span className="user-name">{u.name}</span>
                <div className="status-indicator">
                  <div 
                    className={`online-dot ${
                      onlineUsers?.some(ou => ou.userId === u._id) 
                        ? 'online' 
                        : 'offline'
                    }`}
                  />
                  <span className="status-text">
                    {onlineUsers?.some(ou => ou.userId === u._id)
                      ? 'Online'
                      : 'Offline'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PotentialChats;