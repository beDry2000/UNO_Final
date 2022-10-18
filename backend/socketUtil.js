import User from './models/userModel';

const addUser = async ({ name, roomCode }) => {
    const users = await User.find({ roomCode });

    console.log('add User', users);

    if (users.length === 4) {
        return { error: 'Room already full' };
    }

    const newUser = { userName, roomCode };
    await User.create(newUser);
    return { newUser };
};

const removeUser = async (id) => {
    const user = await User.findByIdAndDelete(id);
    console.log('User da bi xoa', user);
    return user;
}

const getUser = async (id) => {
    const user = await User.findOne(id);
    console.log('getUser', user);
    return user;
}

const getUsersInRoom = async (roomCode) => {
    return await User.find({roomCode}).select({password: 0})
}

const socketUtil = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}

export default socketUtil;