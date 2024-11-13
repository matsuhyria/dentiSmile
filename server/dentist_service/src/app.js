import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import connectDB from './config/db.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:3100/dentist_db';
const PORT = process.env.PORT || 5000;

connectDB(MONGODB_URI);

const app = express();
app.use(express.json());
app.use(morgan('dev'));
app.options('*', cors());
app.use(cors());

app.get('/api/v1', (req, res) => {
    res.status(200).json({ message: 'Welcome to DentiSmile+ API v1!' });
});

app.all('*', (req, res) => {
    res.status(404).json({ message: 'Server error.' });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;