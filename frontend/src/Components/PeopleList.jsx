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
    const { dialogs, getDialogs, setDialogUser } = useChatStore();
    const { authUser, isCheckingAuth } = useAuthStore();
    const navigate = useNavigate();
    const [selectedDialogId, setSelectedDialogId] = useState(
        localStorage.getItem('selectedDialogId') || null
    );

    useEffect(() => {
        if (authUser) {
            getDialogs();
        }
        const intervalId = setInterval(() => {
            getDialogs();

        }, 2000);
        return () => clearInterval(intervalId);
    }, [authUser, getDialogs]);

    useEffect(() => {
        if (selectedDialogId) {
            setDialogUser(selectedDialogId);
        }
    }, [selectedDialogId, setDialogUser]);



    if (isCheckingAuth) {
        return <Typography>Loading...</Typography>;
    }

    const handleDialogClick = (dialog) => {
        setSelectedDialogId(dialog._id);
        localStorage.setItem('selectedDialogId', dialog._id);
        setDialogUser(dialog._id);
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
                {dialogs?.map((dialog) => (
                    <ListItem
                        key={dialog._id}
                        className="people-list"
                        onClick={() => handleDialogClick(dialog)}
                        sx={{
                            px: 2,
                            py: '3px',
                            borderTop: '1px solid #2A3942',
                            backgroundColor: selectedDialogId === dialog._id ? '#2A3942' : 'transparent',
                            cursor: 'pointer',
                            '&:hover': {
                                backgroundColor: selectedDialogId === dialog._id ? '#2A3942' : 'rgba(255, 255, 255, 0.04)',
                            },
                        }}
                    >
                        <Avatar sx={{ marginRight: 2 }}>{dialog.name[0]}</Avatar>
                        <ListItemText
                            sx={{ color: 'var(--light-gray)' }}
                            primary={<Typography
                                component="span"
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}
                            >
                                <span> {dialog.name}</span>
                                <Typography
                                    component="span"
                                    sx={{
                                        backgroundColor: dialog.unread_messages_count > 0 ? '#FF5733' : 'transparent',
                                        color: 'white',
                                        fontSize: '12px',
                                        fontWeight: 'bold',
                                        borderRadius: '50%',
                                        padding: dialog.unread_messages_count > 0 ? '0px 6px' : '0',
                                        textAlign: 'center',
                                        marginLeft: '8px',
                                        display: dialog.unread_messages_count > 0 ? 'inline-block' : 'none',
                                    }}
                                >
                                    {dialog.unread_messages_count}
                                </Typography>
                            </Typography>}
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
                                    <span>
                                        {dialog.last_message && dialog.last_message.length > 20
                                            ? dialog.last_message.slice(0, 20) + '...'
                                            : dialog.last_message || ''}
                                    </span>
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
