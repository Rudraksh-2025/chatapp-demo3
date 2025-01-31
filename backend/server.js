require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { StreamChat } = require("stream-chat");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
app.use(bodyParser.json());


app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        methods: ["GET", "POST"],
        credentials: true,
    })
);

// Stream Chat credentials
const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

// tokens for user
app.post("/api/token", (req, res) => {
    const { user_id } = req.body;
    if (!user_id) {
        return res.status(400).json({ error: "user_id is required" });
    }
    const serverClient = StreamChat.getInstance(apiKey, apiSecret);
    const token = serverClient.createToken(user_id);
    res.json({ token });
});

const httpServer = http.createServer(app);

// Initialize Socket.IO server
const io = new Server(httpServer, {
    cors: {
        origin: process.env.FRONTEND_URL, // Replace with your frontend's origin
        methods: ["GET", "POST"],
        credentials: true,
    },
});

const users = {};

io.on("connection", (socket) => {
    console.log(`New client connected: ${socket.id}`);

    socket.on("register", (userId) => {
        console.log(`Registering user: ${userId} with socket ID: ${socket.id}`);
        users[userId] = socket.id;
    });

    socket.on("send-call", ({ from, to, callId, name }) => {
        console.log(`send-call from ${from} to ${to} with callId ${callId}`);
        const toSocketId = users[to];
        if (toSocketId) {
            io.to(toSocketId).emit("incoming-call", { from, callId, name });
            console.log(`Emitted incoming-call to ${to} (socket ID: ${toSocketId})`);
        } else {
            console.log(`User ${to} is not connected`);
        }
    });

    socket.on("call-response", ({ to, accepted, callId }) => {
        console.log(`call-response from ${socket.id} to ${to}: accepted=${accepted}, callId=${callId}`);
        const toSocketId = users[to];
        if (toSocketId) {
            io.to(toSocketId).emit("call-response", { accepted, callId });
            console.log(`Emitted call-response to ${to} (socket ID: ${toSocketId})`);
        } else {
            console.log(`User ${to} is not connected`);
        }
    });

    socket.on("call-ended", ({ to, callId }) => {
        console.log(`call-ended from ${socket.id} to ${to} with callId ${callId}`);
        const toSocketId = users[to];
        if (toSocketId) {
            io.to(toSocketId).emit("call-ended", { callId });
            console.log(`Emitted call-ended to ${to} (socket ID: ${toSocketId})`);
        } else {
            console.log(`User ${to} is not connected`);
        }
    });

    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
        for (const [userId, socketId] of Object.entries(users)) {
            if (socketId === socket.id) {
                delete users[userId];
                console.log(`Removed user ${userId} from users list`);
                break;
            }
        }
    });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
