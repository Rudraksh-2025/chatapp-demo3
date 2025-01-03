import React from 'react';
import { Box, Typography, List, ListItem, ListItemText, Badge } from '@mui/material';

const groups = [
    { name: 'Friends Forever', time: 'Today, 9:52pm', message: 'Hahahahah!', unread: 0 },
    { name: 'Mera Gang', time: 'Yesterday, 12:31pm', message: 'Kyuuuuu???', unread: 0 },
    { name: 'Hiking', time: 'Wednesday, 9:12am', message: "It's not going to happen", unread: 0 },
];

const GroupsList = () => {
    return (
        <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
                Groups
            </Typography>
            <List>
                {groups.map((group, index) => (
                    <ListItem key={index} disableGutters>
                        <ListItemText
                            primary={group.name}
                            secondary={`${group.time} - ${group.message}`}
                        />
                        {group.unread > 0 && <Badge badgeContent={group.unread} color="error" />}
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default GroupsList;
