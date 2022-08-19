import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import React from 'react';
import { ChatState } from '../Context/ChatProvider';
import { AddIcon } from '@chakra-ui/icons';
import ChatLoading from './ChatLoading';
import GroupChatModal from './miscelaneous/GroupChatModal';

export default function MyChats() {
  const [loggedUser, setLoggedUser] = useState();
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();

  const toast = useToast();
  const fetchChats = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${user.jwt_token}`,
      },
    };

    try {
      const { data } = await axios.get('/api/chat', config);
      setChats(data);
    } catch (err) {
      toast({
        title: 'Error occured in fetching all chats',
        status: 'error',
        duration: '5000s',
        isClosable: true,
        position: 'bottom-left',
      });
    }
  };

  // const getSender = (loggedUser, users) => {
  //   console.log(',,,,,,', loggedUser._id);
  //   console.log('......', users);
  //   // return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
  // };
  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem('userInfo')));
    fetchChats();
  }, []);

  return (
    <div>
      <Box
        d={{ base: selectedChat ? 'none' : 'flex', md: 'flex' }}
        flexDir="column"
        alignItems="center"
        p={3}
        bg="white"
        h="100%"
        // w={{ base: '100%', md: '31%' }}
        borderRadius="lg"
        borderWidth="1px"
      >
        <Box
          pb={3}
          px={3}
          fontSize={{ base: '28px', md: '30px' }}
          fontFamily="Work sans"
          d="flex"
          w="100%"
          h="100%"
          justifyContent="space-between"
          alignItems="center"
        >
          MyChats
          <GroupChatModal>
            <Button
              d="flex"
              fontSize={{ base: '17px', md: '10px' }}
              rightIcon={<AddIcon />}
            >
              New Group Chat
            </Button>
          </GroupChatModal>
        </Box>
        <Box
          d="flex"
          flexDir="column"
          p={3}
          bg="#f8f8f8"
          w="100%"
          h="100%"
          borderRadius="lg"
          overflowY="hidden"
        >
          {chats ? (
            <Stack overflowY="scroll">
              {chats.map((chat) => {
                return (
                  <Box
                    onClick={() => setSelectedChat(chat)}
                    cursor="pointer"
                    bg={selectedChat === chat ? '#38B2AC' : '#E8E8E8'}
                    color={selectedChat === chat ? 'white' : 'black'}
                    px={3}
                    py={2}
                    borderRadius="lg"
                    key={chat._id}
                  >
                    <Text>
                      {!chat.isGroupChat
                        ? // ? getSender(loggedUser, chat.users)
                          chat.users[0].name
                        : chat.chatName}
                    </Text>
                  </Box>
                );
              })}
            </Stack>
          ) : (
            <ChatLoading />
          )}
        </Box>
      </Box>
    </div>
  );
}
