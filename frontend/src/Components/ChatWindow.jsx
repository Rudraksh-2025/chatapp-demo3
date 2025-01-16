import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '../store/useAuthStore';
import { useUserStore } from '../store/useUserStore';

const ChatWindow = ({ dialogId }) => {
    // const [usernames, setUsernames] = useState({});
    const { getMsg, msg } = useChatStore();
    const { authUser } = useAuthStore();
    const currentUserId = authUser?.session?.user_id;
    // const { getUserName } = useUserStore()

    useEffect(() => {
        if (!dialogId) return;
        getMsg(dialogId);
        const intervalId = setInterval(() => {
            getMsg(dialogId);
        }, 1000);
        return () => clearInterval(intervalId);
    }, [dialogId, getMsg]);

    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [msg]);

    // useEffect(() => {
    //     const fetchUsernames = async () => {
    //         const newUsernames = { ...usernames };
    //         for (const message of msg) {
    //             if (!newUsernames[message.sender_id]) {
    //                 newUsernames[message.sender_id] =
    //                     message.sender_id === currentUserId
    //                         ? 'You'
    //                         : await getUserName(message.sender_id);
    //             }
    //         }
    //         setUsernames(newUsernames);
    //     };

    //     fetchUsernames();
    // }, [currentUserId, getUserName, usernames]);

    return (
        <Box className="chat-window">
            {msg.map((message, index) => {
                const isSender = message.sender_id === currentUserId;
                // const username = usernames[message.sender_id] || 'Loading...';
                return (
                    <Box
                        key={message._id || index}
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
                        {/* <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {username}
                        </Typography> */}
                        <Typography variant="body1">{message.message}</Typography>
                        <Typography
                            variant="caption"
                            sx={{ display: 'block', marginTop: '4px', textAlign: isSender ? 'right' : 'left' }}
                        >
                            {new Date(message.date_sent * 1000).toLocaleTimeString()}
                        </Typography>
                    </Box>
                );
            })}
            <div ref={messagesEndRef} />
        </Box>
    );
};

export default ChatWindow;
