import mongoose from 'mongoose';

const connectDB = async (URIpath) => {
    try {
        await mongoose.connect(URIpath);
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error: ', error);
        throw error;
    }
};

export default connectDB;
