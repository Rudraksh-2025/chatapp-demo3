import React, { useEffect, useRef } from 'react';
import { Box, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';

import { useAuthStore } from '../store/useAuthStore';

const ChatWindow = ({ messages = [] }) => {
    const { chat_dialog_id } = useParams();
    const messagesEndRef = useRef(null);
    const { authUser } = useAuthStore();
    const currentUserId = authUser?.session?.user_id;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView();
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);
    return (
        <Box className="chat-window">
            {messages.map((msg, index) => {
                const isSender = msg.sender_id === currentUserId;
                return (
                    <Box
                        key={msg._id || index}
                        sx={{
                            alignSelf: isSender ? 'flex-end' : 'flex-start',
                            backgroundColor: isSender ? '#09563a' : '#2C3E50',
                            color: 'white',
                            borderRadius: '16px',
                            padding: '8px 16px',
                            maxWidth: '60%',
                            marginBottom: '8px',
                        }}
                    >
                        <Typography variant="body1">{msg.message}{isSender}</Typography>
                        <Typography
                            variant="caption"
                            sx={{ display: 'block', marginTop: '4px', textAlign: isSender ? 'right' : 'left' }}
                        >
                            {new Date(msg.date_sent * 1000).toLocaleTimeString()}
                        </Typography>
                    </Box>
                );
            })}
            <div ref={messagesEndRef} />
        </Box>
    );
};

export default ChatWindow;
