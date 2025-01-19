import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '../store/useAuthStore';
import { useUserStore } from '../store/useUserStore';
import { FormatTimeStamp } from '../utils/FormatTimeStamp';

const ChatWindow = ({ dialogId }) => {
    const { getMsg, msg, currentDialogId, clearDialogUser } = useChatStore();
    const { authUser } = useAuthStore();
    const currentUserId = authUser?.session?.user_id;

    useEffect(() => {
        if (!dialogId) return;
        getMsg(dialogId);
        const intervalId = setInterval(() => {
            getMsg(dialogId);
        }, 2000);
        return () => clearInterval(intervalId);
    }, [dialogId, getMsg]);

    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (messagesEndRef.current && msg) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [msg]);


    return (
        <Box className="chat-window">
            {msg.map((message, index) => {
                const isSender = message.sender_id === currentUserId;
                return (
                    <Box
                        key={message._id || index}
                        ref={messagesEndRef}
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
                        <Typography variant="body1">{message.message}</Typography>
                        <Typography
                            variant="caption"
                            sx={{ display: 'block', marginTop: '4px', textAlign: isSender ? 'right' : 'left' }}
                        >
                            {FormatTimeStamp(message.date_sent)}
                        </Typography>
                    </Box>
                );
            })}
            {/* <div ref={messagesEndRef} /> */}
        </Box>
    );
};

export default ChatWindow;
