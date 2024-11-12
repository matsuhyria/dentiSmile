const express = require('express');
const morgan = require('morgan');
const path = require('path');
const cors = require('cors');
const connectDB = require('../config/db');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:3100/dentist_db';
const PORT = process.env.PORT || 5000;


connectDB(MONGODB_URI);

const app = express();
app.use(express.json());
app.use(require('cors'));
app.use(morgan('dev'));
app.options('*', cors());
app.use(cors());

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
