import connectDB from './config/db.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:3100/dentist_db';
const PORT = process.env.PORT || 5000;

connectDB(MONGODB_URI);

console.log(`Server running on port ${PORT}`);