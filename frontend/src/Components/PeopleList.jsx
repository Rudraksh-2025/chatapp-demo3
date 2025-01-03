import React, { useEffect } from 'react';
import { Box, Typography, List, ListItem, ListItemText, Badge, Avatar } from '@mui/material';
import { useChatStore } from '../store/useChatStore'

export const PeopleList = () => {
    const { users, getUsers } = useChatStore()
    // const usersList = users.users
    console.log(users)
    useEffect(() => {
        getUsers()
    }, [getUsers])
    return (
        <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ marginBottom: 1 }}>
                People List
            </Typography>
            <List >
                {users?.map((person, index) => (
                    <ListItem key={index} sx={{ m: 0, p: 0, borderTop: '1px solid #ddd' }}>
                        <Avatar sx={{ marginRight: 2 }}>A</Avatar>
                        <List sx={{
                            width: '100%',
                            marginRight: '20px'
                        }}>
                            <ListItem key={index} disableGutters sx={{ m: 0, p: 0 }}>
                                <ListItemText
                                    sx={{ m: 0, p: 0 }}
                                    primary={person.user.login}
                                    secondary={
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'space-between', mt: 0.5 }}>
                                            <Typography variant="body2" sx={{ color: 'text.primary' }}>
                                                {person.message}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                                {person.time}
                                            </Typography>
                                        </Box>
                                    }
                                />
                            </ListItem>
                        </List>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};
