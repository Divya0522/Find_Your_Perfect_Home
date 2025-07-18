
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import UserChat from "../components/chat/UserChat";
import PotentialChats from "../components/chat/PotentialChats";
import ChatBox from "../components/chat/ChatBox";
import "../styles/Chat.css";

const Chat = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { userChats, currentChat, updateCurrentChat,notifications} = useContext(ChatContext);

  const handleCloseChat = () => {
    updateCurrentChat(null);
    navigate(-1);
  };

  return (
    <div className="chat-container">
        <div className="chat-header">
        <div className="header-left">
          <h2>Messages</h2>
          {/* <div className="notifications-badge">
            {notifications.filter(n => !n.isRead).length}
          </div> */}
        </div>
        <button className="close-button" onClick={handleCloseChat}>
          Close
        </button>
      </div>

      <div className="chat-content">
      <div className="chat-sidebar">
  {/* New Chats Section at the TOP */}
  <div className="sidebar-section">
    <h3>New Chats</h3>
    <PotentialChats />
  </div>

  {/* Existing Chats Section below */}
  <div className="sidebar-section">
    <h3>Existing Chats</h3>
    {userChats?.length > 0 ? (
      userChats.map((chat, index) => (
        <div key={index} onClick={() => updateCurrentChat(chat)}>
          <UserChat chat={chat} user={user} />
        </div>
      ))
    ) : (
      <p className="no-chats">No conversations started yet</p>
    )}
  </div>
</div>

        {/* Right Content */}
        <div className="chat-main">
          {currentChat ? (
            <ChatBox currentChat={currentChat} />
          ) : (
            <div className="no-chat-selected">
              <p>Select a conversation or start a new one</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;