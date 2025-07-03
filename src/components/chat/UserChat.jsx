


import { useFetchRecipientUser } from "../../hooks/useFetchRecipient";
import avatar from '../../assets/avatar.svg';
import { Stack } from "react-bootstrap";
import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import { unreadNotificationsFunc } from "../../utils/unreadNotifications";
import { useFetchLatestMessage } from "../../hooks/userFetchLatestMessage";
import moment from "moment";
import '../../styles/RealEstateSearch.css';

const UserChat = ({ chat, user }) => {
  const { recipientUser } = useFetchRecipientUser(chat, user);
  const { onlineUsers, notifications, markThisUserNotificationsAsRead ,unreadCounts} = useContext(ChatContext);
  const unreadNotifications = unreadNotificationsFunc(notifications);
  const { latestMessage } = useFetchLatestMessage(chat);
  const thisUserNotifications = notifications.filter(n => 
    n.senderId === recipientUser?._id && !n.isRead
  );
  const unreadCount = chat.unreadCount || 0;
  const isOnline = onlineUsers?.some( ou => ou.userId === recipientUser?._id.toString());

  const truncateText = (text) => {
    let shortText = text.substring(0, 20);
    if (text.length > 20) {
      shortText = shortText + "...";
    }
    return shortText;
  };

  return (
  
<div className="user-card">
  <img src={recipientUser?.avatar || avatar} alt="avatar" className="avatar" />
  <div className="text-content">
    <div className="name">{recipientUser?.name}</div>
  
    <div className="last-message">
      {latestMessage?.text ? truncateText(latestMessage.text) : "No messages yet"}
    </div>
    <div className="message-time">
      {latestMessage?.createdAt ? 
        moment(latestMessage.createdAt).format('h:mm A') : ''}
    </div>
  </div>
   <div className="unread-count">
        {chat.unreadCount > 0 && (
          <span className="unread-badge">{chat.unreadCount}</span>
        )}
      </div>
</div>
);
};

export default UserChat;