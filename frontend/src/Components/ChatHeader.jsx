import React, { useEffect } from 'react';
import { Box, Typography, Avatar, IconButton } from '@mui/material';
import CallOutlinedIcon from '@mui/icons-material/CallOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '../store/useAuthStore';
import { FormatTimeStampHeader } from '../utils/FormatTimeStamp';


const ChatHeader = ({ dialogId }) => {
    const { dialogs, getDialogs } = useChatStore();
    const { authUser } = useAuthStore();
    const CurrentDialog = dialogs.filter((id) => id._id === dialogId);

    useEffect(() => {
        if (authUser) {
            getDialogs();
        }
    }, [authUser, getDialogs]);
    return (
        <Box
        >
            {CurrentDialog?.map((dialog, index) => (
                <Box className='chatHeader-container' index={index}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar alt="Anil" src="https://via.placeholder.com/50" />
                        <Box>
                            <Typography variant="h6" sx={{ color: 'var(--light-gray) ' }} >{dialog.name}</Typography>
                            <Typography sx={{ color: 'var(--light-gray)' }} variant="body2" color="textSecondary">
                                Online - Last seen, {FormatTimeStampHeader(dialog.last_message_date_sent)}
                            </Typography>
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton>
                            <CallOutlinedIcon sx={{ color: 'var(--medium-gray)' }} />
                        </IconButton>
                        <button>
                            <MoreVertIcon sx={{ color: 'var(--medium-gray)' }} />
                        </button>
                    </Box></Box>
            ))}

        </Box>
    );
};

export default ChatHeader;
