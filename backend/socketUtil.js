import User from './models/userModel';

// const addUser = async ({ name, roomCode }) => {
//     const users = await User.find({ roomCode });

//     console.log('add User', users);

//     if (users.length === 4) {
//         return { error: 'Room already full' };
//     }

//     const newUser = { userName, roomCode };
//     await User.create(newUser);
//     return { newUser };
// };

const getUser = async (id) => {
    const user = await User.findOne(id);
    console.log('getUser', user);
    return user;
}

const getUsersInRoom = async (roomCode) => {
    return await User.find({roomCode}).select({password: 0})
}

const socketUtil = {
    getUsersInRoom
}

export default socketUtil;