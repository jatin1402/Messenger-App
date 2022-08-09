import React from 'react';
import { ChatState } from '../Context/ChatProvider';

export default function ChatBox() {
  const { user, chats, setChats, selectedChat, setSelectedChat } = ChatState();
  return <div>ChatBox</div>;
}
