import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import connectDB from '../config/db.js';
import slotRoutes from './routes/slots.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:3100/dentist_db';
const PORT = process.env.PORT || 5000;

connectDB(MONGODB_URI);

const app = express();
app.use(express.json());
app.use(morgan('dev'));
app.options('*', cors());
app.use(cors());

app.use('/api', slotRoutes);


app.all('*', (req, res) => {
    res.status(404).json({ message: 'Server error.' });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;