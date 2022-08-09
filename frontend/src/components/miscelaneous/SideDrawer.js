import React, { useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Input,
  MenuList,
  Spinner,
} from '@chakra-ui/react';
import { Tooltip } from '@chakra-ui/react';
import { Text, Menu } from '@chakra-ui/react';
import { MenuButton, MenuItem } from '@chakra-ui/react';
import { ChatState } from '../../Context/ChatProvider';
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons';
import ProfileModal from './ProfileModal';
import { useNavigate } from 'react-router-dom';
import ChatLoading from '../ChatLoading';
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from '@chakra-ui/react';
import { useDisclosure } from '@chakra-ui/hooks';
import { useToast } from '@chakra-ui/react';
import axios from 'axios';
import UserListItem from '../UserAvatar/UserListItem';

export default function SideDrawer() {
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const history = useNavigate();
  const { user, chats, setChats, selectedChat, setSelectedChat } = ChatState();
  const toast = useToast();

  const logout = () => {
    localStorage.removeItem('userInfo');
    history('/');
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: 'Please enter the input in search',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top-left',
      });
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          authorization: `Bearer ${user.jwt_token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);
      console.log({ data });
      setLoading(false);
      setSearchResult(data);
    } catch (err) {
      toast({
        title: 'Error Occured',
        description: 'Cannot search this user',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom-left',
      });
    }
  };

  // const accessChat = async (userId) => {
  //   try {
  //     setLoadingChat(true);
  //     const config = {
  //       headers: {
  //         'Content-type': 'application/json',
  //         authorization: `Bearer ${user.jwt_token}`,
  //       },
  //     };

  //     const { data } = await axios.post('/api/chat', { userId }, config);
  //     setLoadingChat(false);
  //     setSelectedChat(data);
  //     onClose();
  //   } catch (err) {
  //     toast({
  //       title: 'Error in fetching Chat with this user',
  //       description: err.message,
  //       status: 'error',
  //       duration: 5000,
  //       isClosable: true,
  //       position: 'bottom-left',
  //     });
  //   }
  // };
  console.log(searchResult);
  const accessChat = () => {};
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        align-items="center"
        bg="white"
        width="100%"
        padding="5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="Searh Users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <i class="fa-solid fa-magnifying-glass"></i>
            <Text d={{ base: 'none', md: 'flex' }} px="4">
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize="2xl" fontFamily="Work sans">
          Talk-a-tive
        </Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              <BellIcon fontSize="2xl" m={1} />
            </MenuButton>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                // name={user.name}
                src={user.pic}
              ></Avatar>
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>

              <MenuItem onClick={logout}>Log Out</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Search Users</DrawerHeader>

          <DrawerBody>
            <Box display="flex">
              <Input
                placeholder="Search by name or Email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult.map((user) => {
                return (
                  <UserListItem
                    user={user}
                    key={user._id}
                    userListHandler={accessChat(user._id)}
                  />
                );
              })
            )}
          </DrawerBody>

          {loadingChat && <Spinner />}
        </DrawerContent>
      </Drawer>
    </>
  );
}
