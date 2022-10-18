import User from '../models/userModel';
import express from 'express';
import asyncHandler from 'express-async-handler';
import randomstring from 'randomstring';

const userRouter = express.Router();

const register = asyncHandler(async (req, res) => {
    const { email, userName, password } = req.body;

    if (!email || !userName || !password) {
        res.status(400);
        throw new Error('Please add all field');
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    const user = await User.create({
        email, userName, password,
        isGuest: false
    });

    if (user) {
        res.status(201).json({
            id: user.id,
            userName,
            email
        })
    } else {
        res.status(400);
        throw new Error('Invalid user data')
    }
})

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && user.password === password && user.isGuest === false) {
        res.status(201).json({
            id: user.id,
            userName: user.userName,
            email,
            isGuest: false
        })
    } else {
        res.status(400);
        throw new Error('Invalid credentials');
    }
})

const createGuest = asyncHandler(async (req, res) => {
    const { userName } = req.body;
    if (!userName) {
        res.status(400);
        throw new Error('Please add all field');
    }
    console.log('Dang tao guest')
    const user = await User.create({
        email: '',
        userName,
        password: '',
        isGuest: true
    })
    if (!user) {
        res.status(400);
        throw new Error('Invalid input');
    } else {
        res.status(201).json({
            id: user.id,
            userName: user.userName,
            isGuest: user.isGuest
        })
    }
})

const deleteUser = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
        res.status(400);
        throw new Error('Non-existing user');
    }
    res.json(user);
});

const joinRoom = asyncHandler(async (req, res) => {
    const { roomCode } = req.body;

    if (!roomCode) {
        res.status(400);
        throw new Error('Fill in the room code');
    }

    const isExistRoom = await User.find({ roomCode });

    if (isExistRoom.length === 0) {
        res.status(400);
        throw new Error('Room not found');
    }

    if (isExistRoom.length === 2) {
        res.status(400);
        throw new Error('Room already full');
    }

    const user = await User.findByIdAndUpdate(req.params.id, { roomCode }, { new: true }).select({ password: 0 });
    if (!user) {
        res.status(400);
        throw new Error('User not found');
    }

    const users = await User.find({ roomCode });

    res.json(users);
})

const createRoom = asyncHandler(async (req, res) => {
    const roomCode = randomstring.generate({
        length: 7,
        capitalization: 'uppercase'
    });

    const user = await User.findByIdAndUpdate(req.params.id, { roomCode }, { new: true }).select({ password: 0 });
    if (!user) {
        res.status(400);
        throw new Error('User not found');
    }

    res.json(user);
})

// Leave room
const leaveRoom = asyncHandler(async (req, res) => {
    const user = await User.findByIdAndUpdate(req.params.id, { roomCode: '' }, { new: true });
    if (!user) {
        res.status(400);
        throw new Error('User not found');
    }

    res.json(user);

})

userRouter.post('/', register)
userRouter.post('/login', login);
userRouter.post('/guest', createGuest);
userRouter.put('/join/:id', joinRoom);
userRouter.put('/createRoom/:id', createRoom);
userRouter.put('/leave/:id', leaveRoom);
userRouter.delete('/del/:id', deleteUser);

export default userRouter;