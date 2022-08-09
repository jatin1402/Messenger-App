import React, { useState } from 'react';
import { InputRightElement, VStack, useToast } from '@chakra-ui/react';
import {
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  Button,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';

export default function Login(props) {
  const [show, setShow] = useState(false);
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const history = useNavigate();
  const handleShowPassword = () => {
    setShow(!show);
  };

  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      toast({
        title: 'Please fill all the fields',
        description: 'Cannot submit',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          'Content-type': 'application/json',
        },
      };

      const { data } = await axios.post(
        '/api/user/login',
        { email, password },
        config
      );
      console.log(data);
      toast({
        title: 'Registered Successfully',
        description: `Hi there `,
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      setLoading(false);
      history('/chats');
      localStorage.setItem('userInfo', JSON.stringify(data));
    } catch (err) {
      toast({
        title: 'Error occured',
        description: err.response.data.message,
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      setLoading(false);
    }
  };
  return (
    <div>
      <VStack spacing={'10px'}>
        <FormControl>
          <FormLabel htmlFor="email">Email address</FormLabel>
          <Input
            id="email"
            type="text"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            value={email}
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="password">Password</FormLabel>
          <InputGroup size="md">
            <Input
              id="password"
              type={show ? 'text' : 'password'}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              value={password}
            />
            <InputRightElement>
              <Button h="1.75rem" size="sm" onClick={handleShowPassword}>
                {show ? 'Hide' : 'Show'}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>

        <Button
          colorScheme="blue"
          width="100%"
          style={{ marginTop: 15 }}
          onClick={submitHandler}
          onLoading={loading}
        >
          Log In
        </Button>
      </VStack>
    </div>
  );
}
