import React from 'react';
import { Box } from '@chakra-ui/react';
// import axios from 'axios';
import { ChatState } from '../Context/ChatProvider';
import SideDrawer from '../components/miscelaneous/SideDrawer';
import MyChats from '../components/MyChats';
import ChatBox from '../components/ChatBox';
export default function ChatPage(props) {
  const { user } = ChatState(props.value);
  console.log(user);
  console.log('inside chat page');
  return (
    <div style={{ width: '100%' }}>
      {user && <SideDrawer />}
      <Box display="flex" justifyContent="space-between" w="100%" h="91vh">
        {user && <MyChats />}
        {user && <ChatBox />}
      </Box>
    </div>
  );
}
