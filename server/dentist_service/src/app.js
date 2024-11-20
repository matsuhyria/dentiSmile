import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import connectDB from './config/db.js';
import authRouter from './routes/authRoutes.js';
import retrievalRouter from './routes/retrievalRoutes.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/dentist_db';
const PORT = process.env.PORT || 5000;

connectDB(MONGODB_URI);

const app = express();
app.use(express.json());
app.use(morgan('dev'));
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:4173'],
    credentials: true
}));

app.get('/api/v1', (req, res) => {
    res.status(200).json({ message: 'Welcome to DentiSmile+ API v1!' });
});

app.use(authRouter);
app.use(retrievalRouter);

app.use('/api/*', (req, res) => {
    res.status(404).json({ message: 'Server error.' });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;