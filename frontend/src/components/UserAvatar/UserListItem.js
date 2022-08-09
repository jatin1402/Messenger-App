import { Avatar, Box, Text } from '@chakra-ui/react';
import React from 'react';

export default function UserListItem({ user, userListHandler }) {
  console.log('user entered');
  return (
    <Box
      onClick={userListHandler}
      cursor="pointer"
      bg="#E8E8E8"
      _hover={{
        background: '#38B2AC',
        color: 'white',
      }}
      w="100%"
      d="flex"
      alignItems="center"
      color="black"
      px={3}
      py={2}
      mb={2}
      borderRadius="lg"
    >
      <Avatar mr={2} size="sm" name={user.name} src={user.picture} />
      <Box>
        <Text>{user.name}</Text>
        <Text fontSize="xs">
          <b>{user.email}</b>
        </Text>
      </Box>
    </Box>
  );
}
