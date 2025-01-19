import React, { useEffect } from 'react'
import { Container, Box } from '@mui/material';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useUserStore } from '../store/useUserStore';
import { Navigate } from 'react-router-dom';

const Search = () => {
    const { users, getUsers } = useUserStore()
    useEffect(() => {
        getUsers()
    }, [getUsers])
    const handleClick = () => {
        Navigate(`/chat/${dialog._id}`)
    }
    return (
        <Box sx={{ m: 2, }}>
            <Autocomplete
                freeSolo
                id="free-solo-2-demo"

                disableClearable
                options={users?.map((option) => option.user.login)}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        placeholder="Search User"
                        color='primary'
                        size='medium'
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
    )
}

export default Search

