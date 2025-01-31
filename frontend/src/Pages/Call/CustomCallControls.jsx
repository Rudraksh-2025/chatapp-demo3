// src/components/CustomCallControls.jsx

import React, { useState, useEffect } from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import CallEndIcon from '@mui/icons-material/CallEnd';
import { red } from '@mui/material/colors';

const CustomCallControls = ({ call, onLeave }) => {
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoEnabled, setIsVideoEnabled] = useState(true);

    // Initialize mute and video state based on the call's initial state
    useEffect(() => {
        if (call) {
            setIsMuted(call.localParticipant.audioMuted);
            setIsVideoEnabled(call.localParticipant.videoEnabled);
        }
    }, [call]);

    // Handle mute/unmute
    const handleToggleMute = () => {
        if (call) {
            call.localParticipant.audioEnabled = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    // Handle video enable/disable
    const handleToggleVideo = () => {
        if (call) {
            call.localParticipant.videoEnabled = !isVideoEnabled;
            setIsVideoEnabled(!isVideoEnabled);
        }
    };

    // Handle leaving the call
    const handleLeaveCall = () => {
        if (onLeave && typeof onLeave === 'function') {
            onLeave();
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 2,
                padding: 2,
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                borderRadius: '8px',
            }}
        >
            {/* Mute/Unmute Button */}
            <Tooltip title={isMuted ? "Unmute" : "Mute"}>
                <IconButton
                    onClick={handleToggleMute}
                    sx={{
                        color: 'white',
                        backgroundColor: isMuted ? 'rgba(255, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.3)',
                        '&:hover': {
                            backgroundColor: isMuted ? 'rgba(255, 0, 0, 0.9)' : 'rgba(0, 0, 0, 0.5)',
                        },
                    }}
                >
                    {isMuted ? <MicOffIcon /> : <MicIcon />}
                </IconButton>
            </Tooltip>

            {/* Video Enable/Disable Button */}
            <Tooltip title={isVideoEnabled ? "Turn Video Off" : "Turn Video On"}>
                <IconButton
                    onClick={handleToggleVideo}
                    sx={{
                        color: 'white',
                        backgroundColor: isVideoEnabled ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 0, 0, 0.7)',
                        '&:hover': {
                            backgroundColor: isVideoEnabled ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 0, 0, 0.9)',
                        },
                    }}
                >
                    {isVideoEnabled ? <VideocamIcon /> : <VideocamOffIcon />}
                </IconButton>
            </Tooltip>

            {/* Leave Call Button */}
            <Tooltip title="Leave Call">
                <IconButton
                    onClick={handleLeaveCall}
                    sx={{
                        color: 'white',
                        backgroundColor: red[700],
                        '&:hover': {
                            backgroundColor: red[900],
                        },
                    }}
                >
                    <CallEndIcon />
                </IconButton>
            </Tooltip>
        </Box>
    );
};

export default CustomCallControls;
