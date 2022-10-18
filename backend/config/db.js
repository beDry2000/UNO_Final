import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect('mongodb+srv://bedry123:bedry123@bedry.loerwx1.mongodb.net/uno?retryWrites=true&w=majority');

        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (err) {
        console.log(err);

        process.exit(1);
    }
}

export default connectDB;