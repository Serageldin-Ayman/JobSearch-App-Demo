import mongoose from 'mongoose';

const connectDB = async () => {
    const uri = process.env.URI_CONNECTION || "mongodb://127.0.0.1:27017/jobSearch_app";
    try {
        await mongoose.connect(uri);
        console.log(`DB connected successfully at: ${uri}`);
    } catch (error) {
        console.error(`DB faild to connect ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;