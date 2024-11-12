const mongoose = require('mongoose');

const connectDB = async (URIpath) => {
    try {
        await mongoose.connect(URIpath);
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error: ', error);
        process.exit(1);
    }
};

module.exports = connectDB;
