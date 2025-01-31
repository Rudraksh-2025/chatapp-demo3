import { create } from 'zustand';
import { socket } from '../utils/Socket.js';

export const useSocketStore = create((set, get) => {
    let peerConnection = null; // Regular variable for peer connection

    const iceServers = {
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    };

    return {
        isCalling: false,
        peerConnection: null,
        isReceiving: false,
        localStream: null,
        remoteStream: null,
        callData: null,

        // Initialize local media
        initLocalStream: async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true,
                });
                set({ localStream: stream });
            } catch (error) {
                console.error('Error accessing media devices:', error);
            }
        },

        startCall: async (to) => {
            set({ isCalling: true });

            const { localStream, initLocalStream } = get();

            if (!localStream) {
                await initLocalStream();
            }

            const currentStream = get().localStream;
            if (!currentStream) {
                console.error('Failed to initialize local media stream.');
                set({ isCalling: false });
                return;
            }

            peerConnection = new RTCPeerConnection(iceServers);
            set({ peerConnection });
            currentStream.getTracks().forEach((track) =>
                peerConnection.addTrack(track, currentStream)
            );

            peerConnection.onicecandidate = (event) => {
                if (event.candidate) {
                    socket.emit('send-candidate', { to, candidate: event.candidate });
                }
            };

            peerConnection.ontrack = (event) => {
                set({ remoteStream: event.streams[0] });
            };

            try {
                const offer = await peerConnection.createOffer();
                await peerConnection.setLocalDescription(offer);
                console.log('Sending offer to:', to);
                socket.emit('call-user', { to, offer });
            } catch (error) {
                console.error('Error starting call:', error);
                set({ isCalling: false });
            }
        },

        answerCall: async () => {
            const { callData, localStream, initLocalStream } = get();
            if (!localStream) await initLocalStream();

            peerConnection = new RTCPeerConnection(iceServers);
            localStream.getTracks().forEach((track) => peerConnection.addTrack(track, localStream));

            peerConnection.onicecandidate = (event) => {
                if (event.candidate) {
                    socket.emit('send-candidate', { to: callData.from, candidate: event.candidate });
                }
            };

            peerConnection.ontrack = (event) => {
                set({ remoteStream: event.streams[0] });
            };

            try {
                await peerConnection.setRemoteDescription(new RTCSessionDescription(callData.offer));
                const answer = await peerConnection.createAnswer();
                await peerConnection.setLocalDescription(answer);
                socket.emit('answer-call', { to: callData.from, answer });
            } catch (error) {
                console.error('Error answering call:', error);
            }

            set({ isReceiving: false });
        },

        endCall: (to) => {
            let { peerConnection } = get();
            if (peerConnection) {
                peerConnection.close();
                peerConnection = null;
            }

            const { localStream } = get();
            if (localStream) {
                localStream.getTracks().forEach((track) => track.stop());
                set({ localStream: null });
            }

            set({ isCalling: false, isReceiving: false, remoteStream: null });
            socket.emit('end-call', { to });
        },

        addCandidate: (candidate) => {
            const { peerConnection } = get();
            if (peerConnection) {
                peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
            }
        },

        handleIncomingCall: (data) => {
            console.log('ye log call lag gaya ', data)
            set({ isReceiving: true, callData: data });
        },
    };
});

// Handle Socket Events
socket.on('call-made', async (data) => {
    console.log('Incoming call:', data);
    useSocketStore.getState().handleIncomingCall(data);
});
socket.on('call-answered', (data) => {
    const peerConnection = useSocketStore.getState().peerConnection;
    peerConnection?.setRemoteDescription(new RTCSessionDescription(data.answer));
});
socket.on('receive-candidate', (data) => {
    useSocketStore.getState().addCandidate(data.candidate);
});
socket.on('call-ended', (data) => {
    useSocketStore.getState().endCall(data);
});
