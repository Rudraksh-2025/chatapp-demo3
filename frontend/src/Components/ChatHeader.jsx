// src/components/ChatHeader.jsx
import React, { useEffect, useState } from 'react';
import { Box, Typography, IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '../store/useAuthStore';
import { FormatTimeStampHeader } from '../utils/FormatTimeStamp';
import ProfilePhoto from './ProfilePhoto';
import CallButton from '../Pages/Call/CallButton';

const ChatHeader = ({ dialogId }) => {
    const { dialogs, getDialogs } = useChatStore();
    const { authUser, logout } = useAuthStore();
    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const CurrentDialog = dialogs.find((dialog) => dialog._id === dialogId);

    useEffect(() => {
        if (authUser) {
            getDialogs();
        }
    }, [authUser, getDialogs]);

    if (!CurrentDialog) return null; // Handle case when dialog is not found
    const userToCall = CurrentDialog.occupants_ids.find(id => id !== authUser.session.user_id);
    return (
        <Box className='chatHeader-container' sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <ProfilePhoto dialogId={CurrentDialog._id} />
                <Box>
                    <Typography variant="h6" sx={{ color: 'var(--light-gray)' }}>
                        {CurrentDialog.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'var(--light-gray)' }}>
                        Last sent, {FormatTimeStampHeader(CurrentDialog.last_message_date_sent)}
                    </Typography>
                </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton>
                    <CallButton
                        dialogId={CurrentDialog._id}
                        occupants={CurrentDialog.occupants_ids}
                        currentUserId={authUser.session.user_id}
                        userIdToCall={userToCall}
                    />
                </IconButton>
                <IconButton>
                    <MoreVertIcon sx={{ color: 'var(--medium-gray)' }} onClick={handleMenuClick} />
                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={isMenuOpen}
                        onClose={handleMenuClose}
                        MenuListProps={{
                            "aria-labelledby": "basic-button",
                        }}
                    >
                        <MenuItem onClick={logout}>Logout</MenuItem>
                    </Menu>
                </IconButton>
            </Box>
        </Box>
    );
};

export default ChatHeader;
