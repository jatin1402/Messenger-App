import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { InputRightElement, VStack, useToast } from '@chakra-ui/react';
import {
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  Button,
} from '@chakra-ui/react';
import axios from 'axios';

export default function Signup() {
  const [show, setShow] = useState(false);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pic, setPic] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const history = useNavigate();

  const handleShowPassword = () => {
    setShow(!show);
  };

  // saving the image in mongo database

  const submitHandler = async () => {
    setLoading(true);
    if (!name || !password || !email || !pic) {
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
    if (password !== confirmPassword) {
      toast({
        title: 'Passwords do not match',
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
        '/api/user',
        { name, email, password, pic },
        config
      );
      console.log(data);
      toast({
        title: 'Registered Successfully',
        description: `Hi there ${name}`,
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      setLoading(false);
      history.push('/chats');
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

  const postDetails = (pic) => {
    setLoading(true);
    if (pic === undefined) {
      //display up an error using toast
      toast({
        title: 'Picture is mandatory',
        description: 'Error while uploading the picture',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      return;
    }
    if (pic.type === 'image/jpeg' || pic.type === 'image/png') {
      const data = new FormData();
      data.append('file', pic);
      data.append('upload_preset', 'chat-app');
      data.append('cloud_name', 'jatinimageserver');
      fetch('https://api.cloudinary.com/v1_1/jatinimageserver/image/upload', {
        method: 'post',
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setPic(data.url.toString());
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      toast({
        title: 'Picture is mandatory',
        description: 'Error while uploading the picture',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      setLoading(false);
      return;
    }
  };
  return (
    <div>
      <VStack spacing={'10px'}>
        <FormControl isRequired>
          <FormLabel htmlFor="name">Name</FormLabel>
          <Input
            id="name"
            type="text"
            onChange={(e) => {
              setName(e.target.value);
            }}
            value={name}
          />
        </FormControl>
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
          <InputGroup size={'md'}>
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
        <FormControl>
          <FormLabel htmlFor="confirm-password">Confirm Password</FormLabel>
          <InputGroup size={'md'}>
            <Input
              id="confirm-password"
              type={show ? 'text' : 'password'}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
              value={confirmPassword}
            />
            <InputRightElement mr={'1.5'}>
              <Button h="1.75rem" size="sm" onClick={handleShowPassword}>
                {show ? 'Hide' : 'Show'}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <FormControl>
          <FormLabel>Upload your Picture</FormLabel>
          <Input
            id="profile-pic"
            type="file"
            accept="image/*"
            spacing="2px"
            onChange={(e) => {
              postDetails(e.target.files[0]);
            }}
          />
        </FormControl>
        <Button
          colorScheme="blue"
          width="100%"
          style={{ marginTop: 15 }}
          onClick={submitHandler}
          isLoading={loading}
        >
          Sign Up
        </Button>
      </VStack>
    </div>
  );
}
