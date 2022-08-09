import { Container, Box, Text } from '@chakra-ui/react';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Login from '../components/Authentication/Login';
import Signup from '../components/Authentication/Signup';

export default function HomePage() {
    const history = useNavigate();
    useEffect(() => {
        // if user is already logged in
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (userInfo) {
            history('/chats');
        }
    }, [history]);
    return (
        <Container w="xl" centerContent>
            <Box
                d="flex"
                justifyContent="center"
                justifySelf={'center'}
                p={2.5}
                bg={'white'}
                w="100%"
                m="40px 0 15px 0"
                borderRadius="lg"
                borderWidth="1px"
            >
                <Text
                    marginLeft={'170px'}
                    fontSize={'3xl'}
                    fontFamily={'Work sans'}
                    color="black"
                >
                    Talk-a-tive
                </Text>
            </Box>
            <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px">
                <Tabs isFitted variant="soft-rounded">
                    <TabList>
                        <Tab>Login</Tab>
                        <Tab>SignUp</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <Login />
                        </TabPanel>
                        <TabPanel>
                            <Signup />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </Container>
    );
}
