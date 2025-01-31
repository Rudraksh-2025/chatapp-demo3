// src/components/CallButton.jsx

import React, { useState, useEffect, useRef } from 'react';
import CallOutlinedIcon from '@mui/icons-material/CallOutlined';
import { Modal, Box, IconButton, Typography, CircularProgress, Alert } from '@mui/material';
import {
    StreamVideo,
    StreamCall,
    StreamTheme,
    SpeakerLayout,
    CallControls
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import { useWebSocket } from '../../Contexts/WebSocketContext.jsx';
import { useUserStore } from '../../store/useUserStore.js';
import CloseIcon from '@mui/icons-material/Close';
// import CustomCallControls from './CustomCallControls'; 
import { getVideoClient, resetVideoClient } from '../../utils/videoClient.js';

const apiKey = import.meta.env.VITE_STEAM_API;

// Fetch token function (unchanged)
const fetchToken = async (userId) => {
    try {
        const response = await fetch("http://localhost:3001/api/token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: userId.toString() }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Failed to fetch token: ${errorData.error || response.statusText}`);
        }

        const data = await response.json();
        return data.token;
    } catch (error) {
        console.error('Token Fetch Error:', error);
        throw new Error('Network error while fetching token');
    }
};

const CallButton = ({ dialogId, currentUserId, userIdToCall }) => {
    const socket = useWebSocket();
    const callId = dialogId.toString();
    const [open, setOpen] = useState(false);
    const [ringModal, setRingModal] = useState(false);
    const [client, setClient] = useState(null);
    const [call, setCall] = useState(null);
    const { getUser } = useUserStore();
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const callRef = useRef(null);
    const clientRef = useRef(null);


    // Username fetch useEffect
    useEffect(() => {
        const fetchUserName = async () => {
            try {
                const response = await getUser(currentUserId);
                setName(response.user.login);
            } catch (err) {
                console.error("Error fetching user name:", err);
                setError('Failed to fetch user information.');
            }
        };
        fetchUserName();
    }, [getUser, currentUserId]);

    // Call end useEffect
    useEffect(() => {
        if (!socket) return;
        const handleCallEnded = ({ callId: endedCallId }) => {
            if (endedCallId === callId) {
                alert("Call ended by the other user.");
                handleClose();
            }
        };

        socket.on('call-ended', handleCallEnded);

        return () => {
            socket.off('call-ended', handleCallEnded);
        };
    }, [socket, callId]);

    // For initiating call
    const handleOpen = async () => {
        console.log("Initiating call...");
        setLoading(true);
        setError('');
        try {
            const user = { id: currentUserId.toString() }
            const token = await fetchToken(currentUserId);
            const myClient = getVideoClient(
                apiKey,
                user,
                token
            );

            setClient(myClient);
            clientRef.current = myClient;

            const myCall = myClient.call("default", callId);
            await myCall.join({ create: true });
            setCall(myCall);
            callRef.current = myCall;

            setRingModal(true);

            socket.emit('send-call', { from: currentUserId, to: userIdToCall, callId, name });
            console.log(`Call sent to ${userIdToCall} with callId ${callId}`);
        } catch (error) {
            console.error("Error initiating call:", error);
            setError('Failed to initiate the call. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // onClose
    const handleClose = async () => {
        setRingModal(false);
        console.log("handleClose invoked");
        setError('');

        if (callRef.current) {
            console.log("Attempting to leave the call...");
            try {
                await callRef.current.leave();
                console.log("Left the call successfully");
            } catch (err) {
                console.error("Error leaving the call:", err);
            }
            socket.emit('call-ended', { to: userIdToCall, callId });
            setCall(null);
            callRef.current = null;
        } else {
            console.log("No active call to leave.");
        }

        if (clientRef.current) {
            console.log("Attempting to disconnect the client...");
            try {
                await clientRef.current.disconnectUser();
                console.log("Disconnected the client successfully");
            } catch (err) {
                console.error("Error disconnecting client:", err);
                setError('Failed to disconnect from the call.');
            }
            setClient(null);
            clientRef.current = null;
            resetVideoClient();
        } else {
            console.log("No active client to disconnect.");
        }

        setOpen(false);
    };

    // Ringing modal close
    const handleRingClose = () => {
        setRingModal(false);
    };

    // Call response useEffect
    useEffect(() => {
        if (!socket) return;

        const handleCallResponse = async ({ accepted, callId: responseCallId }) => {
            if (responseCallId !== callId) return;

            if (accepted) {
                handleRingClose();
                setOpen(true);
            } else {
                handleClose();
                alert('Call was rejected');
            }
        };

        socket.on('call-response', handleCallResponse);

        return () => {
            socket.off('call-response', handleCallResponse);
        };
    }, [socket, callId, handleClose]);

    // Disconnect event useEffect
    useEffect(() => {
        if (call) {
            const handleCallEnded = () => {
                handleClose();
            };
            call.on('ended', handleCallEnded);

            return () => {
                call.off('ended', handleCallEnded);
            };
        }
    }, [call, handleClose]);

    return (
        <>
            <CallOutlinedIcon
                onClick={handleOpen}
                sx={{ color: 'var(--medium-gray)', cursor: 'pointer' }}
            />

            {/* Active Call Modal */}
            <Modal open={open} onClose={(event, reason) => {
                if (reason !== 'backdropClick') {
                    handleRingClose();
                }
            }}>
                <Box sx={modalStyle}>
                    {client && call ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                            <StreamVideo client={client}>
                                <StreamTheme className="my-theme-overrides">
                                    <StreamCall call={call}>
                                        <SpeakerLayout mirrorLocalParticipantVideo={false} />

                                        <CallControls
                                            onLeave={handleClose}
                                        />
                                    </StreamCall>
                                </StreamTheme>
                            </StreamVideo>
                            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                        </Box>
                    ) : (
                        <Box sx={{ textAlign: 'center' }}>
                            <CircularProgress />
                            <Typography variant="body1" sx={{ mt: 2 }}>Loading call...</Typography>
                        </Box>
                    )}
                </Box>
            </Modal>

            {/* Ringing Modal */}
            <Modal open={ringModal} onClose={(event, reason) => {
                if (reason !== 'backdropClick') {
                    handleRingClose();
                }
            }}>
                <Box sx={modalStyle}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                        <IconButton
                            onClick={handleClose}
                            sx={{
                                position: 'absolute',
                                top: 16,
                                right: 16,
                                zIndex: 1,
                                color: 'white',
                                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                '&:hover': {
                                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                },
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                        {loading ? (
                            <>
                                <CircularProgress />
                                <Typography variant="body1">Calling...</Typography>
                            </>
                        ) : (
                            <Typography variant="body1">Ringing ...</Typography>
                        )}
                        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                    </Box>
                </Box>
            </Modal>
        </>
    );
};

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    alignItems: 'center',
    bgcolor: '#1f2c33',
    color: 'white',
    borderRadius: '8px',
    boxShadow: 24,
    p: 4,
    outline: 'none',
};

export default CallButton;
