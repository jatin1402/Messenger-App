import {
  Button,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import React, { useState } from 'react';
import { ChatState } from '../../Context/ChatProvider';
import UserBadgeItem from '../UserAvatar/UserBadge';
import UserListItem from '../UserAvatar/UserListItem';

export default function GroupChatModal({ children }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const toast = useToast();
  //   const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState();
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState([]);

  const { user } = ChatState();

  const handleSearch = async (query) => {
    // setSearch(query);
    if (!query) {
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          authorization: `Bearer ${user.jwt_token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${query}`, config);
      setLoading(false);
      setSearchResult(data);
      console.log(loading);
      console.log(data);
    } catch (error) {
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

  const addToGroup = (userToAdd) => {
    if (selectedUser.includes(userToAdd)) {
      toast({
        title: 'User Already present',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'bottom-left',
      });
    }

    setSelectedUser([...selectedUser, userToAdd]);
  };

  const removeFromGroup = (delUser) => {
    setSelectedUser(
      selectedUser.filter((sel) => {
        return sel._id === delUser._id;
      })
    );
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Group Chat</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <Input
                placeholder="Add Users eg: John, Piyush, Jane"
                mb={3}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>

            {selectedUser?.map((u) => {
              return (
                <UserBadgeItem
                  key={u.user_id}
                  handleFunction={() => removeFromGroup(u)}
                />
              );
            })}

            {loading ? (
              <div>loading...</div>
            ) : (
              searchResult?.slice(0, 4).map((user) => {
                return (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => addToGroup(user)}
                  />
                );
              })
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
