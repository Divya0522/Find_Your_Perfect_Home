
import { createContext, useCallback, useEffect, useState } from "react";
import { baseUrl, getRequest, postRequest } from "../utils/services";
import { io } from "socket.io-client";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children, user }) => {
  const [userChats, setUserChats] = useState([]);
  const [isUserChatsLoading, setUsersChatsLoading] = useState(false);
  const [userChatsError, setUserChatsError] = useState(null);
  const [potentialChats, setPotentialChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState(null);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState(null);
  const [sendTextMessageError, setSendTextMessageError] = useState(null);
  const [newMessage, setNewMessage] = useState(null);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [isAllUsersLoading, setIsAllUsersLoading] = useState(false);
 const [unreadCounts, setUnreadCounts] = useState({});

  // Initialize socket and attach event listeners
  useEffect(() => {
    const newSocket = io("http://localhost:5001", {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });
    setSocket(newSocket);

    // Attach event listeners
    newSocket.on("getOnlineUsers", (res) => {
      setOnlineUsers(res);
    });

    newSocket.on("getMessage", (res) => {
      // if (currentChat?._id !== res.chatId) {
      //   updateUnreadCount(res.chatId);
      // }
      if (currentChat?._id !== res.chatId) {
        setUserChats(prevChats => 
          prevChats.map(chat => 
            chat._id === res.chatId 
              ? { ...chat, unreadCount: (chat.unreadCount || 0) + 1 } 
              : chat
          )
        );
      }
      setMessages((prev) => [...prev, res]);
    });

    newSocket.on("getNotification", (res) => {
      const isChatOpen = currentChat?.members.some((id) => id === res.senderId);

      if (isChatOpen) {
        setNotifications((prev) => [{ ...res, isRead: true }, ...prev]);
      } else {
        setNotifications((prev) => [res, ...prev]);
      }
    });

    // Cleanup
    return () => {
      newSocket.disconnect();
      setSocket(null);
    };
  }, [user, currentChat]);
  const resetUnreadCount = useCallback(async (chatId) => {
    setUserChats(prevChats =>
      prevChats.map(chat =>
        chat._id === chatId ? { ...chat, unreadCount: 0 } : chat
      )
    );
  }, []);
  // Update unread count
  const updateUnreadCount = (chatId) => {
    setUserChats((prevChats) =>
      prevChats.map((chat) =>
        chat._id === chatId ? { ...chat, unreadCount: (chat.unreadCount || 0) + 1 } : chat
      )
    );
  };

  // Fetch all users
  useEffect(() => {
    if (!user?._id) return;

    const fetchAllUsers = async () => {
      setIsAllUsersLoading(true);
      const response = await getRequest(`${baseUrl}/users`);
      if (!response.error) {
        setAllUsers(response.filter((i) => i._id !== user._id));
      } else {
        console.error("Error fetching all users:", response.message);
      }
      setIsAllUsersLoading(false);
    };

    fetchAllUsers();
  }, [user]);

  // Update potential chats
  useEffect(() => {
    if (!user?._id || !allUsers || allUsers.length === 0) return;

    const pChats = allUsers.filter((u) => {
      const isChatCreated = userChats?.some((chat) => chat.members.includes(u._id));
      return !isChatCreated && u._id !== user._id;
    });

    setPotentialChats(pChats);
  }, [user, allUsers, userChats]);

  // Fetch user chats
  useEffect(() => {
    if (!user?._id) return;

    const getUserChats = async () => {
      const response = await getRequest(`${baseUrl}/chats/${user._id}`);
      if (!response.error) {
        setUserChats(response);
      }
    };

    getUserChats();
  }, [user]);

  // Fetch messages for the current chat
  useEffect(() => {
    const getMessages = async () => {
      if (!currentChat?._id) return;

      setIsMessagesLoading(true);
      setMessagesError(null);
      const response = await getRequest(`${baseUrl}/messages/${currentChat._id}`);
      setIsMessagesLoading(false);

      if (response.error) {
        return setMessagesError(response);
      }

      setMessages(response);
    };

    getMessages();
  }, [currentChat]);
  useEffect(() => {
    if (socket) {
      socket.on('user-status', (data) => {
        setOnlineUsers((prev) => {
          const updatedUsers = prev.filter((user) => user.userId !== data.userId);
          if (data.status === 'online') {
            updatedUsers.push({ userId: data.userId, status: 'online' });
          }
          return updatedUsers;
        });
      });
    }
  }, [socket]);
  // Send text message
  const sendTextMessage = useCallback(
    async (textMessage, sender, currentChatId, setTextMessage) => {
      if (!textMessage) return console.log("You must type something...");

      const response = await postRequest(`${baseUrl}/messages`, {
        chatId: currentChatId,
        senderId: sender._id,
        text: textMessage,
      });

      if (response.error) {
        return setSendTextMessageError(response);
      }

      setNewMessage(response);
      setMessages((prev) => [...prev, response]);
      setTextMessage("");
    },
    []
  );

  // Update current chat
  // const updateCurrentChat = (chat) => {
  //   console.log("Updating current chat:", chat);
  //   setCurrentChat(chat);
  // };

  const updateCurrentChat = useCallback(async (chat) => {
    if (chat?._id) {
      // Reset unread count when opening chat
      await getRequest(`${baseUrl}/chats/find/${chat.members[0]}/${chat.members[1]}`);
      resetUnreadCount(chat._id);
    }
    setCurrentChat(chat);
  }, [resetUnreadCount]);

  // Create chat
  const createChat = useCallback(async (firstId, secondId) => {
    console.log("Creating chat between:", firstId, secondId);

    const requestBody = { firstId, secondId };
    const response = await postRequest(`${baseUrl}/chats`, requestBody);

    if (response.error) {
      console.log("Error creating chat", response);
      return;
    }

    setUserChats((prev) => [...prev, response]);
    setCurrentChat(response);

    return response;
  }, []);

  // Mark all notifications as read
  const markAllNotificationsAsRead = useCallback((notifications) => {
    const updatedNotifications = notifications.map((n) => ({
      ...n,
      isRead: true,
    }));
    setNotifications(updatedNotifications);
  }, []);

  // Mark notification as read
  const markNotificationAsRead = useCallback((n, userChats, user, notifications) => {
    const desiredChat = userChats.find((chat) => {
      const chatMembers = [user._id, n.senderId];
      return chat?.members.every((member) => chatMembers.includes(member));
    });

    const updatedNotifications = notifications.map((el) => {
      if (n.senderId === el.senderId) {
        return { ...el, isRead: true };
      }
      return el;
    });

    setNotifications(updatedNotifications);
    updateCurrentChat(desiredChat);
  }, []);

  // Mark this user's notifications as read
  const markThisUserNotificationsAsRead = useCallback((thisUserNotifications, notifications) => {
    const mNotifications = notifications.map((el) => {
      let notification;
      thisUserNotifications.forEach((n) => {
        if (n.senderId === el.senderId) {
          notification = { ...n, isRead: true };
        } else {
          notification = el;
        }
      });
      return notification;
    });
    setNotifications(mNotifications);
  }, []);

  // Unread notifications function
  const unreadNotificationsFunc = (notifications) => {
    return notifications.filter((n) => !n.isRead);
  };

  return (
    <ChatContext.Provider
      value={{
        userChats,
        isUserChatsLoading,
        userChatsError,
        potentialChats,
        setPotentialChats,
        createChat,
        setCurrentChat,
        updateCurrentChat,
        messages,
        isMessagesLoading,
        messagesError,
        currentChat,
        sendTextMessage,
        onlineUsers,
        notifications,
        allUsers,
        markAllNotificationsAsRead,
        markNotificationAsRead,
        markThisUserNotificationsAsRead,
        setUserChats,
        isMessagesLoading,
        setIsMessagesLoading,
        messagesError,
        setMessagesError,
        messages,
        setMessages,
        unreadNotificationsFunc,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};