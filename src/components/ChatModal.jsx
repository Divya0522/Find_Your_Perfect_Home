import React,{useContext} from "react";
import { Container, Stack } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import UserChat from "../components/chat/UserChat";
import PotentialChats from "../components/chat/PotentialChats";
import ChatBox from "../components/chat/ChatBox";
import "../styles/ChatModal.css"; // Import shared styles

const ChatModal = ({ onClose }) => {
  const { user } = useContext(AuthContext);
  const { userChats, isUserChatsLoading, updateCurrentChat, currentChat } = useContext(ChatContext);

  return (
    <div className="chat-modal-overlay">
      <div className="chat-modal-content">
        <div className="chat-header">
          <h2>Chats</h2>
        </div>
        <div className="chat-container">
          <div className="chat-sidebar">
            <PotentialChats />
            {userChats?.length < 1 ? null : (
              <Stack className="messages-box flex-grow-0 pe-3" gap={3}>
                {isUserChatsLoading && <p>Loading chats..</p>}
                {userChats?.map((chat, index) => (
                  <div key={index} onClick={() => updateCurrentChat(chat)}>
                    <UserChat chat={chat} user={user} />
                  </div>
                ))}
              </Stack>
            )}
          </div>
          <div className="chat-main">
            {currentChat ? (
              <ChatBox currentChat={currentChat} />
            ) : (
              <div className="no-chat-selected">
                <p>No conversation selected yet...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;