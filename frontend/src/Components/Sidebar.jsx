import React from 'react';
import { Box, IconButton } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ChatIcon from '@mui/icons-material/Chat';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuthStore } from '../store/useAuthStore';

const Sidebar = () => {
    const { logout, authUser } = useAuthStore()
    return (
        <Box
            sx={{
                width: { xs: "100vw", md: '100%' },
                height: { xs: "10%", md: '100vh' },
                backgroundColor: '#6B38FB',
                display: 'flex',
                flexDirection: { xs: "row", md: 'column' },
                alignItems: 'center',
                padding: 2,
                gap: 2,
            }}
        >
            <IconButton>
                <img
                    src="https://plus.unsplash.com/premium_photo-1689565611422-b2156cc65e47?q=80&w=2370&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="profile"
                    style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        border: '2px solid white',
                    }}
                />
            </IconButton>
            <IconButton>
                <HomeIcon style={{ color: 'white' }} />
            </IconButton>
            <IconButton>
                <ChatIcon style={{ color: 'white' }} />
            </IconButton>
            <Box sx={{ flexGrow: 1 }} />
            <IconButton>
                <LogoutIcon onClick={logout} style={{ color: 'white' }} />
            </IconButton>
        </Box>
    );
};

export default Sidebar;
