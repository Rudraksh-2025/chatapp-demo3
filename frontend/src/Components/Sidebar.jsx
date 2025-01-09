import React from 'react';
import { Box, IconButton } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ChatIcon from '@mui/icons-material/Chat';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuthStore } from '../store/useAuthStore';

const Sidebar = () => {
    const { logout } = useAuthStore()
    return (
        <Box
            sx={{
                width: { xs: "100vw", md: '100%' },
                height: { xs: "10%", md: '100vh' },
                backgroundColor: '#1F2C33',
                display: 'flex',
                flexDirection: { xs: "row", md: 'column' },
                alignItems: 'center',
                padding: 2,
                gap: 2,
            }}
        >
            <IconButton>
                <img
                    src="https://via.placeholder.com/50"
                    alt="profile"
                    style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        border: '2px solid #A9A9A9',
                    }}
                />
            </IconButton>
            <IconButton>
                <HomeIcon style={{ color: '#A9A9A9' }} />
            </IconButton>
            <IconButton>
                <ChatIcon style={{ color: '#A9A9A9' }} />
            </IconButton>
            <Box sx={{ flexGrow: 1 }} />
            <IconButton onClick={logout}>
                <LogoutIcon style={{ color: '#A9A9A9' }} />
            </IconButton>
        </Box>
    );
};

export default Sidebar;
