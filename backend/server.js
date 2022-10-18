import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import connectDB from './config/db';
import errorHandler from './middlewares/errorHandler';
import userRouter from './routes/userRouter';
import http from 'http';
import socketUtil from './socketUtil';

const PORT = 5000;

connectDB();
const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000'
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
            // Send new Game State to room
            // Only the part that needs to be updated
            // Always set back to prev state of Uno Button
            io.to(roomCode).emit('updateGame', gameState);
        })
        // send Message
        socket.on('message', message => {
            io.to(roomCode).emit('message', message);
        })
        // Leav
        socket.on('leaving', newUser => {
            io.to(roomCode).emit('roomData', {users: newUser});
        })
        // disconnect
        socket.on('disconnect', async () => {
            console.log('Disconnected')
            // io.to(roomCode).emit('roomData', { users: await socketUtil.getUsersInRoom(roomCode) })
        })
    })
})


app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/api/users", userRouter);

app.use(errorHandler);

server.listen(PORT, () => {
    console.log('listening on port ' + PORT);
})