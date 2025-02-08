const express = require('express');
const userRoute = require('./routes/user');
const projectRoute = require('./routes/project');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const { createMessage } = require('./controller/message');
const cors = require('cors');

const app = express();
const PORT = 4000;
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ['http://127.0.0.1:5500', 'http://localhost:5500'],
        methods: ['GET', 'POST'],
        credentials: true
    }
});

app.use(cors({ 
    origin: ['http://127.0.0.1:5500', 'http://localhost:5500'],
    credentials: true, 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH','OPTIONS'], 
    allowedHeaders: ['Content-Type', 'Authorization'] 
}));

async function connectdb() {
    await mongoose.connect("mongodb://127.0.0.1:27017/DevConnect");
    console.log('Connected to MongoDB');
}
connectdb();

const users = {};

app.get('/', (req, res) => {
    res.json({ message: 'DevConnect API is running' });
});

app.use(express.json());
app.use(cookieParser());

app.use('/user', userRoute);
app.use('/project', projectRoute);

io.on('connection', (socket) => {
    console.log('A new user connected:', socket.id);

    users[socket.id] = socket;

    socket.on("message", async (data) => {
        try{
            const msgData = {
                message: data.message,
                senderId: data.senderId,
            };
    
            io.emit("message", data);
        } catch(err) {
            console.error('Message creation error:', err);
            return res.status(500).json({ message: "Failed to send message" });
        }
    });

    socket.on("disconnect", ()=>{
        console.log("User disconnected:", socket.id);
        delete users[socket.id];
    });
});



server.listen(PORT, () => {console.log(`Sever running on port: ${4000}`)});