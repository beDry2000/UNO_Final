import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import connectDB from './config/db';
import errorHandler from './middlewares/errorHandler';
import userRouter from './routes/userRouter';
import http from 'http';
import socketUtil from './socketUtil';
import { config } from 'dotenv';


config();
connectDB();
const app = express();
app.use(cors());
const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
const io = new Server(server, {
    // cors: {
    //     origin: 'http://localhost:3000'
    // }

    cors: {
        origin: process.env.ORIGIN
    }
});

// Socket.io
io.on('connection', socket => {

    // Join room
    socket.on('join', async (roomCode) => {
        socket.join(roomCode);

        // update Users
        io.to(roomCode).emit('roomData', { roomCode, users: await socketUtil.getUsersInRoom(roomCode) });

        // initiate Game State
        socket.on('initGameState', gameState => {
            io.to(roomCode).emit('initGameState', gameState);
        })

        // update Game State
        socket.on('updateGameState', gameState => {
            io.to(roomCode).emit('updateGame', gameState);
        })
        // send Message
        socket.on('message', (message) => {
            io.to(roomCode).emit('message', message);
        })
        // Leav
        socket.on('leaving', newUser => {
            io.to(roomCode).emit('roomData', {users: newUser});
            io.to(roomCode).emit('leaveUser')
        })
        // disconnect
        socket.on('disconnect', async () => {
            io.to(roomCode).emit('leaveUser')
            // io.to(roomCode).emit('roomData', { users: await socketUtil.getUsersInRoom(roomCode) })
        })
    })
})


app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/tryout', (req, res) => {
    res.json({isTesting: true});
})

app.use("/api/users", userRouter);

app.use(errorHandler);

server.listen(PORT, () => {
    console.log('listening on port ' + PORT);
})