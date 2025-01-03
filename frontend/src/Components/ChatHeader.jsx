import React from 'react';
import { Box, Typography, Avatar, IconButton } from '@mui/material';
import CallOutlinedIcon from '@mui/icons-material/CallOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';


const ChatHeader = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px',
                borderBottom: '2px solid #e0e0e0',
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar alt="Anil" src="https://via.placeholder.com/50" />
                <Box>
                    <Typography variant="h6">Anil</Typography>
                    <Typography variant="body2" color="textSecondary">
                        Online - Last seen, 2:02pm
                    </Typography>
                </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton>
                    <CallOutlinedIcon sx={{ color: '#9747FF' }} />
                </IconButton>
                <IconButton>
                    <MoreVertIcon sx={{ color: '#9747FF' }} />
                </IconButton>
            </Box>
        </Box>
    );
};

export default ChatHeader;
