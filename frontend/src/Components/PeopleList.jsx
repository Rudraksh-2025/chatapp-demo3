import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemText,
    Avatar
} from '@mui/material';
import MoreOption from './MoreOption';
import { useChatStore } from '../store/useChatStore';
import { FormatTimeStamp } from '../utils/FormatTimeStamp';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export const PeopleList = () => {
    const [selectedIndex, setSelectedIndex] = useState(null);
    const { dialogs, getDialogs } = useChatStore();
    const { authUser, isCheckingAuth } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (authUser) {
            getDialogs();
        }
        const intervalId = setInterval(() => {
            getDialogs();
        }, 2000);
        return () => clearInterval(intervalId);
    }, [authUser, getDialogs]);
    if (isCheckingAuth) {
        return <Typography>Loading...</Typography>;
    }

    const handleDialogClick = (dialog, index) => {
        setSelectedIndex(index);
        navigate(`/chat/${dialog._id}`);
    };

    return (
        <Box className="chatList-container" sx={{ flex: 1 }}>
            <Box className="chatList-heading" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ marginBottom: 1, color: 'var(--light-gray)' }}>
                    Chat
                </Typography>
                <MoreOption />
            </Box>

            <List>
                {dialogs?.map((dialog, index) => (
                    <ListItem
                        key={index}
                        className="people-list"
                        onClick={() => handleDialogClick(dialog, index)}
                        sx={{
                            px: 2,
                            py: '3px',
                            borderTop: '1px solid #2A3942',
                            backgroundColor: selectedIndex === index ? '#2A3942' : 'transparent',
                            cursor: 'pointer',
                            '&:hover': {
                                backgroundColor: selectedIndex === index ? '#2A3942' : 'rgba(255, 255, 255, 0.04)',
                            },
                        }}
                    >
                        <Avatar sx={{ marginRight: 2 }}>{dialog.name[0]}</Avatar>
                        <ListItemText
                            sx={{ color: 'var(--light-gray)' }}
                            primary={dialog.name}
                            secondary={
                                <Typography
                                    component="span"
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        color: 'var(--medium-gray)',
                                    }}
                                >
                                    <span>{dialog.last_message && dialog.last_message.length > 20
                                        ? dialog.last_message.slice(0, 20) + '...'
                                        : dialog.last_message || ''}</span>
                                    <Typography
                                        variant="caption"
                                        component="span"
                                        sx={{ color: 'var(--dark-gray)', marginLeft: 'auto' }}
                                    >
                                        {FormatTimeStamp(dialog.last_message_date_sent)}
                                    </Typography>
                                </Typography>
                            }
                        />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};
