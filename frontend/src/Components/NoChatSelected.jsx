import React, { useEffect, useRef } from 'react';
import { Box, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';

import { useAuthStore } from '../store/useAuthStore';

const NoChatSelected = ({ messages = [] }) => {
    return (
        <Box className="chat-window">
            Nothing
        </Box>
    );
};

export default NoChatSelected;
