
import React, { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { useFetchRecipientUser } from "../../hooks/useFetchRecipient";
import moment from "moment";
import InputEmoji from "react-input-emoji";
import { getRequest, baseUrl } from "../../utils/services";
import { FaPaperPlane } from "react-icons/fa";

const ChatBox = () => {
  const { user } = useContext(AuthContext);
  const {
    currentChat,
    messages,
    isMessagesLoading,
    sendTextMessage,
    setIsMessagesLoading,
    setMessagesError,
    setMessages,
    setCurrentChat,
  } = useContext(ChatContext);

  const { recipientUser } = useFetchRecipientUser(currentChat, user);
  const [textMessage, setTextMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (currentChat && user) {
      
      const markAsRead = async () => {
        await getRequest(`${baseUrl}/chats/find/${currentChat.members[0]}/${currentChat.members[1]}`);
      };
      markAsRead();
    }
  }, [currentChat, user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const getMessages = async () => {
      if (!currentChat?._id) return;

      setIsMessagesLoading(true);
      setMessagesError(null);

      try {
        const response = await getRequest(`${baseUrl}/messages/${currentChat._id}`);
        if (response.error) {
          setMessagesError(response);
        } else {
          setMessages(response);
        }
      } catch (error) {
        setMessagesError({ error: true, message: "Failed to fetch messages." });
      } finally {
        setIsMessagesLoading(false);
      }
    };

    getMessages();
  }, [currentChat]);

 

  const handleCloseChat = () => {
    setCurrentChat(null);
  };

  if (!recipientUser || !currentChat) {
    return (
      <div className="no-chat-selected">
        <p>Select a conversation to start chatting</p>
      </div>
    );
  }

  if (isMessagesLoading) {
    return <div className="loading-chat">Loading messages...</div>;
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="recipient-info">
          <h3>{recipientUser?.name}</h3>
        </div>
      </div>

      <div className="messages-container">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${
              message.senderId === user._id ? "sent" : "received"
            }`}
          >
            <div className="message-content">
              <p>{message.text}</p>
              <span className="message-time">
                {moment(message.createdAt).format("h:mm A")}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="message-input-container">
        <InputEmoji
          value={textMessage}
          onChange={setTextMessage}
          fontFamily="nunito"
          borderColor="#e0e0e0"
          borderRadius={20}
          placeholder="Type a message..."
        />
        <button
          className="send-button"
          onClick={() => sendTextMessage(textMessage, user, currentChat._id, setTextMessage)}
          disabled={!textMessage.trim()}
        >
          <FaPaperPlane className="send-icon" />
        </button>
      </div>
    </div>
  );
};

export default ChatBox;