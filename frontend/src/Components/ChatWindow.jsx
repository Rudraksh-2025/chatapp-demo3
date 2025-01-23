import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '../store/useAuthStore';
import { FormatTimeStamp } from '../utils/FormatTimeStamp';
import GetName from './GetName';

const ChatWindow = () => {
    const { dialogId } = useParams();
    const { getMsg, msg, dialogs } = useChatStore();
    const { authUser } = useAuthStore();
    const currentUserId = authUser?.session?.user_id;
    const [messages, setmessages] = useState([])
    const [type, setType] = useState(3)
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (!dialogId) return;

        getMsg(dialogId);
        const intervalId = setInterval(() => {
            getMsg(dialogId);
        }, 2000);

        return () => clearInterval(intervalId);
    }, [dialogId, getMsg]);

    if (JSON.stringify(messages) !== JSON.stringify(msg)) {
        setmessages(msg);
    }
    // const dialog = dialogs?.find(value => value._id === dialogId);
    // useEffect(() => {
    //     if (dialog) {
    //         setType(dialog.type);
    //     }
    // }, [dialog]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView();
    }, [messages]);


    return (
        <Box className="chat-window">
            {msg.map((message, index) => {
                const isSender = message.sender_id === currentUserId;

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
                        {/* {type === 2 && (
                            <Typography variant="caption">
                                <GetName senderId={message.sender_id} dialogId={dialogId} />
                            </Typography>
                        )} */}
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
            <div ref={messagesEndRef} />
        </Box>
    );
};

export default ChatWindow;
