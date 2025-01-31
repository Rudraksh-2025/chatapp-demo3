import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import Sidebar from '../../Components/Sidebar';
import { PeopleList } from '../../Components/PeopleList';
import ChatHeader from '../../Components/ChatHeader';
import ChatWindow from '../../Components/ChatWindow';
import { WebSocketProvider } from '../../Contexts/WebSocketContext.jsx';
import ChatInput from '../../Components/ChatInput';
import Grid from '@mui/material/Grid2';
import { useAuthStore } from '../../store/useAuthStore';
import Search from '../../Components/Search'
import IncomingCallDialog from '../Call/IncomingCallDialog';
import './chat.css';

const Chat = () => {
    const { dialogId } = useParams();
    const { authUser } = useAuthStore();
    const currentUserId = authUser?.session?.user_id
    return (
        <Container className='chat-container' maxWidth='xxl' disableGutters>
            <Box className='chat-Box'>
                <Grid container>
                    <Grid xs='auto' sx={{ height: '100vh' }} item>
                        <Sidebar />
                    </Grid>
                    <Grid size={4} item container direction="column" sx={{ height: '100vh', bgcolor: '#111B21', color: 'white' }}>
                        <Grid item>
                            <Search />
                        </Grid>
                        <Grid item sx={{
                            flex: 1,
                            overflowY: 'auto',
                            scrollbarWidth: 'none',
                            '&::-webkit-scrollbar': {
                                display: 'none',
                            },
                        }} >
                            <PeopleList />
                        </Grid>
                    </Grid>
                    {
                        dialogId ?
                            (
                                <Grid item container direction="column" flexGrow={1} sx={{ height: '100vh' }}>
                                    <Grid item>
                                        <WebSocketProvider userId={currentUserId}>
                                            <div>
                                                <ChatHeader dialogId={dialogId} />
                                                <IncomingCallDialog currentUserId={currentUserId} dialogId={dialogId} />
                                            </div>
                                        </WebSocketProvider>
                                    </Grid>
                                    <Grid item className='chat-bg' sx={{ flex: 1, overflowY: 'auto' }}>
                                        <ChatWindow dialogId={dialogId} />
                                    </Grid>
                                    <Grid item>
                                        <ChatInput dialogId={dialogId} />
                                    </Grid>
                                </Grid>
                            ) :
                            (<Grid item className='chat-bg2' container direction="column" flexGrow={1} sx={{ height: '100vh' }}></Grid>)
                    }
                </Grid>
            </Box>
        </Container>
    );
};

export default Chat;
