import React, { useState, useEffect } from 'react';
import { Box, IconButton } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ChatIcon from '@mui/icons-material/Chat';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuthStore } from '../store/useAuthStore';
import pp12 from '../assets/ProfilePhotos/pp12.jpg';
import { toast } from 'react-toastify';
import Tooltip from '@mui/material/Tooltip';
import { useUserStore } from '../store/useUserStore';

const Sidebar = () => {
    const { getUser } = useUserStore()
    const { authUser, logout } = useAuthStore();
    const [name, setName] = useState()
    const currentUserId = authUser?.session?.user_id
    const handleCommingSoon = () => {
        toast.success('this functionality is coming soon');
    };
    useEffect(() => {
        const fetchUserName = async () => {
            try {
                const response = await getUser(currentUserId);
                setName(response.user.login);
            } catch (err) {
                console.error("Error fetching user name:", err);
                setError('Failed to fetch user information.');
            }
        };
        fetchUserName();
    }, [getUser, currentUserId]);

    return (
        <Box
            sx={{
                width: { xs: '100vw', md: '100%' },
                height: { xs: '10%', md: '100vh' },
                backgroundColor: '#1F2C33',
                display: 'flex',
                flexDirection: { xs: 'row', md: 'column' },
                alignItems: 'center',
                padding: 2,
                gap: 2,
            }}
        >
            <Tooltip title={name}>
                <IconButton
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        padding: 0,
                        margin: 0,
                    }}
                >
                    <img
                        src={pp12}
                        alt="profile"
                        style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            border: '2px solid #A9A9A9',
                        }}
                    />

                </IconButton>
            </Tooltip>


            {/* Home */}
            <IconButton>
                <HomeIcon onClick={handleCommingSoon} style={{ color: '#A9A9A9' }} />
            </IconButton>

            {/* Chat */}
            <IconButton sx={{ borderBottom: '2px solid #A9A9A9', borderRadius: 0 }}>
                <ChatIcon style={{ color: '#A9A9A9' }} />
            </IconButton>

            <Box sx={{ flexGrow: 1 }} />

            {/* Logout */}
            <IconButton onClick={logout}>
                <LogoutIcon style={{ color: '#A9A9A9' }} />
            </IconButton>
        </Box>
    );
};

export default Sidebar;
