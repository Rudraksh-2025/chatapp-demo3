import React, { useEffect, useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText, Badge, Avatar } from '@mui/material';
import { useChatStore } from '../store/useChatStore'
import MoreVertIcon from '@mui/icons-material/MoreVert';

export const PeopleList = () => {
    const { users, getUsers } = useChatStore()
    const [selectedIndex, setSelectedIndex] = useState(null);
    console.log(users)
    useEffect(() => {
        getUsers()
    }, [getUsers])
    return (
        <Box clasName="chatList-container" sx={{ flex: 1 }}>
            <Box className="chatList-heading">
                <Typography variant="h6" sx={{ marginBottom: 1, color: 'var(--light-gray)' }}>
                    Chat
                </Typography>
                <button>
                    <MoreVertIcon sx={{ color: 'var(--medium-gray)' }} />
                </button>

            </Box>

            <List >
                {users?.map((person, index) => (
                    <ListItem
                        key={index}
                        className='people-list'
                        onClick={() => setSelectedIndex(index)}
                        sx={{
                            px: 2,
                            py: '3px',
                            borderTop: '1px solid #2A3942',
                            backgroundColor: selectedIndex === index ? '#2A3942' : 'transparent',
                            cursor: 'pointer',
                            '&:hover': {
                                backgroundColor: selectedIndex === index ? '#2A3942' : 'rgba(255, 255, 255, 0.04)'

                            }
                        }}
                    >
                        <Avatar sx={{ marginRight: 2 }}>A</Avatar>
                        <List sx={{
                            width: '100%',
                            marginRight: '20px'
                        }}>
                            <ListItem key={index} disableGutters sx={{ m: 0, p: 0 }}>
                                <ListItemText
                                    sx={{ m: 0, p: 0, color: 'var(--light-gray)' }}
                                    primary={person.user.login}
                                    secondary={
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'space-between', mt: 0.5 }}>
                                            <Typography variant="body2" sx={{ color: 'var(--medium-gray)' }}>
                                                {/* {person.message} */}
                                                Hello how are you?
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: 'var(--dark-gray)' }}>
                                                {/* {person.time} */}
                                                10:45 pm
                                            </Typography>
                                        </Box>
                                    }
                                />
                            </ListItem>
                        </List>
                    </ListItem>
                ))}
            </List>
        </Box >
    );
};
