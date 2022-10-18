import mongoose from "mongoose";

const userSchema = mongoose.Schema(
    {
        email: String,
        password: String,
        userName: {
            type: String,
            required: [true, 'Please enter username']
        },
        isGuest: Boolean,
        roomCode: String
    }
)

const User = mongoose.model('User', userSchema);
export default User;
