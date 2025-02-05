import React, { useEffect, useState, useRef } from 'react';
import { Modal, Box, Button, Typography, CircularProgress, Alert } from '@mui/material';
import { useWebSocket } from '../../Contexts/WebSocketContext.jsx';
import {
    StreamVideo,
    StreamCall,
    StreamTheme,
    SpeakerLayout,
    CallControls
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import { getVideoClient, resetVideoClient } from '../../utils/VideoClient.js';

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

const IncomingCallDialog = ({ currentUserId }) => {
    const socket = useWebSocket();
    const [incomingCall, setIncomingCall] = useState(null);
    const [call, setCall] = useState(null);
    const [client, setClient] = useState(null);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const apiKey = import.meta.env.VITE_STEAM_API;
    const [name, setName] = useState('');
    const callRef = useRef(null);
    const clientRef = useRef(null);

    //incoming call and ending call useEffect
    useEffect(() => {
        if (!socket) return;

        const handleIncomingCall = ({ from, callId, name }) => {
            console.log("Incoming call received from:", from);
            setIncomingCall({ from, callId });
            setOpen(true);
            setName(name);
            setError('');
        };

        socket.on('incoming-call', handleIncomingCall);

        const handleCallEnded = ({ callId: endedCallId }) => {
            if (incomingCall && endedCallId === incomingCall.callId) {
                alert("Call ended.");
                handleCloseCall();
            }
        };

        socket.on('call-ended', handleCallEnded);

        return () => {
            socket.off('incoming-call', handleIncomingCall);
            socket.off('call-ended', handleCallEnded);
        };
    }, [socket, incomingCall]);

    const handleAccept = async () => {
        console.log("Accepting call...");
        setLoading(true);
        setError('');
        try {
            const token = await fetchToken(currentUserId);
            const myClient = getVideoClient(apiKey, { id: currentUserId.toString() }, token);
            setClient(myClient);
            clientRef.current = myClient;

            const myCall = myClient.call("default", incomingCall.callId);
            await myCall.join({ create: false });
            setCall(myCall);
            callRef.current = myCall;

            socket.emit('call-response', { to: incomingCall.from, accepted: true, callId: incomingCall.callId });
            setOpen(false);
        } catch (error) {
            console.error("Error accepting call:", error);
            setError('Failed to accept the call. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleReject = () => {
        console.log("Rejecting call...");
        setOpen(false);
        setError('');
        if (incomingCall) {
            socket.emit('call-response', { to: incomingCall.from, accepted: false, callId: incomingCall.callId });
        }
    };

    const handleCloseCall = async () => {
        console.log('handleClose invoked')
        setOpen(false);
        setError('');
        if (callRef.current) {
            try {
                await callRef.current.leave();
                console.log("Left the call successfully");

            } catch (err) {
                console.error("Error leaving the call:", err);
                setError('Failed to leave the call properly.');
            }
            socket.emit('call-ended', { to: incomingCall.from, callId: incomingCall.callId });
            setCall(null);
        }
        if (clientRef.current) {
            try {
                await clientRef.current.disconnectUser();
                console.log("Disconnected the client successfully");
            } catch (err) {
                console.error("Error disconnecting client:", err);
                setError('Failed to disconnect from the call.');
            }
            setClient(null);
            resetVideoClient();
        }
    };



    // Listen for call end events to handle disconnection
    useEffect(() => {
        if (call) {
            const handleCallEnded = () => {
                console.log("Call ended event triggered");
                handleCloseCall();
            };
            call.on('ended', handleCallEnded);

            return () => {
                call.off('ended', handleCallEnded);
            };
        }
    }, [call]);

    return (
        <>
            {/* Incoming Call Modal */}
            <Modal open={open} onClose={(event, reason) => {
                if (reason !== 'backdropClick') {
                    handleReject();
                }
            }}>
                <Box sx={modalStyle}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                        <Typography variant="h6">Incoming Call</Typography>
                        <Typography variant="body1"> {name || 'User'} is calling you.</Typography>
                    </Box>

                    {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

                    <Box sx={{ display: 'flex', justifyContent: 'space-around', marginTop: 2 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleAccept}
                            disabled={loading}
                            startIcon={loading && <CircularProgress size={20} />}
                            sx={{
                                '&:focus': {
                                    outline: 'none',
                                    boxShadow: 'none',
                                },
                                '&:active': {
                                    outline: 'none',
                                    boxShadow: 'none',
                                },
                            }}
                        >
                            {loading ? 'Accepting...' : 'Accept'}
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={handleReject}
                            disabled={loading}
                            sx={{
                                '&:focus': {
                                    outline: 'none',
                                    boxShadow: 'none',
                                },
                                '&:active': {
                                    outline: 'none',
                                    boxShadow: 'none',
                                },
                            }}
                        >
                            Reject
                        </Button>
                    </Box>
                </Box>
            </Modal>

            {/* Active Call Modal */}
            <Modal open={Boolean(call)} onClose={(event, reason) => {
                if (reason !== 'backdropClick') {
                    handleCloseCall();
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
                                            onLeave={handleCloseCall}
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

export default IncomingCallDialog;
