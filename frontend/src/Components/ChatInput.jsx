import React, { useState } from 'react';
import { Box, TextField, IconButton, Modal } from '@mui/material';
import Grid from '@mui/material/Grid2';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import SendIcon from '@mui/icons-material/Send';
import { emoji } from '../utils/Emoji'

const ChatInput = () => {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [file, setFile] = useState(null)
    const handleEmojiClick = (emoji) => {
        setMessage((prev) => prev + emoji);
        setOpen(false);
    };
    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            console.log('File selected:', selectedFile.name);
        }
    };
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                padding: '8px 16px',
                borderTop: '1px solid #e0e0e0',
            }}
        >
            <IconButton onClick={() => setOpen(true)}>
                <EmojiEmotionsIcon />
            </IconButton>
            <Modal
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="emoji-picker-title"
                aria-describedby="emoji-picker-description"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                        maxHeight: '300px',
                        overflowY: 'auto',
                    }}
                >
                    <Grid container spacing={1}>
                        {emoji.map((emoji, index) => (
                            <Grid
                                item
                                key={index}
                                xs={2}
                                sx={{
                                    fontSize: '24px',
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    '&:hover': { bgcolor: '#f0f0f0' },
                                }}
                                onClick={() => handleEmojiClick(emoji)}
                            >
                                {emoji}
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Modal>
            <IconButton component="label">
                <AttachFileIcon />
                <input
                    type="file"
                    hidden
                    onChange={handleFileChange}
                />
            </IconButton>
            <TextField
                variant="outlined"
                fullWidth
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                color="primary"
                size='small'
                placeholder="Type your message here..."
                sx={{ marginX: 2, bgcolor: 'white' }}
            />
            <IconButton>
                <SendIcon sx={{ color: '#6E00FF' }} />
            </IconButton>
        </Box>
    );
};

export default ChatInput;
