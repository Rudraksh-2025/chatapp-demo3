import React from 'react';
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
    return (
        <Box
            sx={{
                flex: 1,
                padding: 2,
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
            }}
        >
            {messages.map((msg, index) => (
                <Box
                    key={index}
                    sx={{
                        alignSelf: msg.sender === 'me' ? 'flex-end' : 'flex-start',
                        backgroundColor: msg.sender === 'me' ? '#6B38FB' : '#2D2D2D',
                        color: msg.sender === 'me' ? 'white' : 'white',
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
        </Box>
    );
};

export default ChatWindow;
