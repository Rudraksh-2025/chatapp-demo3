import React, { useEffect } from 'react';
import { Box, TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { useUserStore } from '../store/useUserStore';
import { useNavigate } from 'react-router-dom';
import { useChatStore } from '../store/useChatStore';

const Search = () => {
    const { users, getUsers } = useUserStore();
    const { getDialogs, dialogs } = useChatStore()
    const navigate = useNavigate();


    const handleClick = (event, value) => {
        console.log(value)
        const dialog = dialogs?.find(dialog => dialog.name === value);
        if (dialog) {
            localStorage.setItem('selectedDialogId', dialog._id);
            navigate(`/chat/${dialog._id}`);
        }
    };

    return (
        <Box sx={{ m: 2 }}>
            <Autocomplete
                freeSolo
                id="free-solo-2-demo"
                disableClearable
                options={dialogs?.map(option => option.name)}
                onChange={handleClick} // Attach the handleClick function
                renderInput={(params) => (
                    <TextField
                        {...params}
                        placeholder="Search User"
                        color="primary"
                        size="medium"
                        slotProps={{
                            input: {
                                ...params.InputProps,
                                type: 'search',
                            },
                        }}
                        sx={{
                            borderRadius: '10px',
                            bgcolor: '#2A3942',
                            '& .MuiOutlinedInput-root': {
                                color: 'white',
                                '& fieldset': {
                                    border: 'none',
                                },
                                '&:hover fieldset': {
                                    border: 'none',
                                },
                                '&.Mui-focused fieldset': {
                                    border: 'none',
                                },
                            },
                            '& .MuiOutlinedInput-input::placeholder': {
                                color: 'grey',
                                opacity: 1,
                            },
                        }}
                    />
                )}
            />
        </Box>
    );
};

export default Search;
