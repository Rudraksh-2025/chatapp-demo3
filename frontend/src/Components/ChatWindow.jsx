import React, { useEffect, useRef } from 'react';
import { Box, Typography } from '@mui/material';

const messages = [
    { text: 'Hey There!', sender: 'other', time: 'Today, 8:30pm' },
    { text: 'How are you?', sender: 'other', time: 'Today, 8:30pm' },
    { text: 'Hello!', sender: 'me', time: 'Today, 8:33pm' },
    { text: 'I am fine and how are you?', sender: 'me', time: 'Today, 8:34pm' },
    { text: 'I am also fine', sender: 'other', time: 'Today, 8:37pm' },
    { text: 'where are you from?', sender: 'me', time: 'Today, 8:45pm' },
];

const ChatWindow = () => {
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView();
    };

    useEffect(() => {
        scrollToBottom();
    }, []);
    return (
        <Box
            className='chat-window'
        >
            {messages.map((msg, index) => (
                <Box
                    key={index}
                    sx={{
                        alignSelf: msg.sender === 'me' ? 'flex-end' : 'flex-start',
                        backgroundColor: msg.sender === 'me' ? '#09563a' : '#2C3E50',
                        color: msg.sender === 'me' ? 'var(--light-gray)' : 'var(--light-gray)',
                        borderRadius: '16px',
                        padding: '8px 16px',
                        maxWidth: '60%',
                    }}
                >
                    <Typography variant="body1">{msg.text}</Typography>
                    <Typography variant="caption" sx={{ display: 'block', marginTop: '4px', textAlign: 'right' }}>
                        {msg.time}
                    </Typography>
                </Box>
            ))}
            <div ref={messagesEndRef} />
        </Box>
    );
};

export default ChatWindow;
