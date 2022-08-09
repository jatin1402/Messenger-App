import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createContext } from 'react';

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [chats, setChats] = useState();
  const [selectedChat, setSelectedChat] = useState();

  const history = useNavigate();
  console.log(user);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    setUser(userInfo);
    if (!userInfo) {
      history('/');
    }
  }, [history]);

  return (
    <ChatContext.Provider
      value={{ user, setUser, chats, setChats, selectedChat, setSelectedChat }}
    >
      {children}
    </ChatContext.Provider>
  );
};

// to make state available in all the places we use hook useContext`
export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
