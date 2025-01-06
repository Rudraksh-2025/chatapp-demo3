import React from 'react';
import { Box, Typography, Avatar, IconButton } from '@mui/material';
import CallOutlinedIcon from '@mui/icons-material/CallOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';


const ChatHeader = () => {
    return (
        <Box
            className='chatHeader-container'
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar alt="Anil" src="https://via.placeholder.com/50" />
                <Box>
                    <Typography variant="h6" sx={{ color: 'var(--light-gray) ' }} >Anil</Typography>
                    <Typography sx={{ color: 'var(--light-gray)' }} variant="body2" color="textSecondary">
                        Online - Last seen, 2:02pm
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
            </Box>
        </Box>
    );
};

export default ChatHeader;
