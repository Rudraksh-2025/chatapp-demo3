import React from 'react';
import { Box, Container } from '@mui/material';
import Sidebar from '../../Components/Sidebar';
import { PeopleList } from '../../Components/PeopleList';
import ChatHeader from '../../Components/ChatHeader';
import ChatWindow from '../../Components/ChatWindow';
import ChatInput from '../../Components/ChatInput';
import Search from '../../Components/Search';
import Grid from '@mui/material/Grid2';
import './chat.css'

const Chat = () => {
    return (
        <Container className='chat-container' maxWidth='xxl' disableGutters>
            <Box className='chat-Box'>
                <Grid container columnSpacing={1}>

                    <Grid sx={{ height: '100vh' }} item size='auto'>
                        <Sidebar />
                    </Grid>
                    <Grid size={4} container className='border2' direction="column" sx={{ height: '100vh' }}>
                        <Grid item  >
                            <Search />
                        </Grid>
                        <Grid item sx={{
                            flex: 1,
                            overflowY: 'auto',
                        }} >
                            <PeopleList />
                        </Grid>
                    </Grid>


                    <Grid className='border2' container direction="column" flexGrow={1} sx={{ height: '100vh' }}>
                        <Grid item >
                            <ChatHeader />
                        </Grid>
                        <Grid item sx={{
                            flex: 1,
                            overflowY: 'auto',
                        }}>
                            <ChatWindow />
                        </Grid>
                        <Grid item >
                            <ChatInput />
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default Chat;
