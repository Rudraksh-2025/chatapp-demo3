import React, { useState } from 'react';
import { Box, TextField, IconButton, Modal, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import { emoji } from '../utils/Emoji';
import { useChatStore } from '../store/useChatStore';

const ChatInput = ({ dialogId }) => {
    const { recipient_id, isSendingMsg, createMsg, createFile } = useChatStore();
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [file, setFile] = useState(null);
    const [filePreview, setFilePreview] = useState('');
    const [fileId, setFileId] = useState('');
    const [name, setName] = useState('');
    const [ContentType, setContentType] = useState('');


    const handleEmojiClick = (emoji) => {
        setMessage((prev) => prev + emoji);
        setOpen(false);
    };

    const handleFileChange = async (event) => {
        const selectedFile = event.target.files[0];
        if (!selectedFile) return; // Exit if no file is selected

        // Validate file type
        if (!selectedFile.type.startsWith("image/")) {
            console.error("Selected file is not an image.");
            return;
        }

        try {
            // Convert image to Base64 using a Promise

            const base64String = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = (error) => reject(error);
                reader.readAsDataURL(selectedFile);
            });

            const modifyBase64String = (base64, fileName) => {
                const parts = base64.split(';base64,');
                if (parts.length !== 2) throw new Error('Invalid Base64 format');
                const mimeType = parts[0]; // Example: data:image/jpeg
                const base64Data = parts[1]; // Example: /9j/4Q/...
                return `${mimeType};name=${fileName};base64,${base64Data}`;
            };

            const modifiedBase64String = modifyBase64String(base64String, selectedFile.name);
            // Set preview and send Base64 string to createFile
            setFilePreview(modifiedBase64String);
            setFile(selectedFile);
            const uploadedFile = await createFile(selectedFile, modifiedBase64String);
            if (uploadedFile) {
                setFileId(uploadedFile.id);
                setContentType(uploadedFile.content_type)
                setName(uploadedFile.name)
                console.log("File uploaded:", uploadedFile);
            }
        } catch (error) {
            console.error("Error handling file:", error);
            removeFile(); // Reset state on error
        }
    };


    const removeFile = () => {
        setFile(null);
        setFilePreview('');
        setFileId('');
        setContentType('')
        setName('')
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleSend = async () => {
        if (message.trim() || fileId) {
            const msgData = {
                chat_dialog_id: dialogId,
                message: message.trim(),
                recipient_id: recipient_id,
                attachments: fileId ? { id: fileId, type: 'image', content_type: ContentType, name: name } : '',
            };
            await createMsg(msgData);
            // Clear form
            setMessage('');
            removeFile();
        }
    };

    return (
        <Box className="chat-input-container" sx={{ padding: 2 }}>
            <IconButton sx={{ color: 'var(--medium-gray)' }} onClick={() => setOpen(true)}>
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
                    <Grid container>
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
                <AttachFileIcon sx={{ color: 'var(--medium-gray)' }} />
                <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleFileChange}
                />
            </IconButton>
            {filePreview && (
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        mb: 2,
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 2,
                        padding: 1.5,
                        bgcolor: 'background.paper',
                        boxShadow: 1,
                    }}
                >
                    <Box
                        component="img"
                        src={filePreview}
                        alt="Preview"
                        sx={{
                            width: 60,
                            height: 60,
                            borderRadius: 1,
                            objectFit: 'cover',
                            border: '1px solid',
                            borderColor: 'divider',
                        }}
                    />
                    <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
                        <Typography
                            variant="body2"
                            noWrap
                            sx={{ fontWeight: 500, color: 'text.primary' }}
                        >
                            {file.name}
                        </Typography>
                        <Typography
                            variant="caption"
                            sx={{ color: 'text.secondary' }}
                        >
                            {Math.round(file.size / 1024)} KB
                        </Typography>
                    </Box>
                    <IconButton size="small" onClick={removeFile} sx={{ color: 'error.main' }}>
                        <CloseIcon />
                    </IconButton>
                </Box>
            )}

            <TextField
                variant="outlined"
                fullWidth
                value={message}
                disabled={isSendingMsg}
                onKeyDown={handleKeyPress}
                onChange={(e) => setMessage(e.target.value)}
                size="small"
                autoComplete="off"
                className="text-field-input"
                placeholder="Type your message here..."
                sx={{
                    marginX: 2,
                    color: isSendingMsg ? '#B0B0B0' : 'var(--medium-gray)',
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
                        color: '#D3D3D3',
                        opacity: 1,
                    },
                }}
            />

            <IconButton onClick={handleSend} disabled={isSendingMsg || (!message.trim() && !filePreview)}>
                <SendIcon sx={{ color: isSendingMsg ? '#B0B0B0' : 'var(--medium-gray)' }} />
            </IconButton>
        </Box>
    );
};

export default ChatInput;
