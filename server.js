import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './src/route/authRoutes.js';

dotenv.config(); 

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));

connectDB();

app.use('/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
