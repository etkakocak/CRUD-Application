import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './src/route/authRoutes.js';
import Snippet from './src/model/snippet.js';

dotenv.config();
connectDB();

const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/snippets', async (req, res) => {
    const snippets = await Snippet.find();
    res.render('snippets', { snippets });
});

app.get('/auth/login', (req, res) => {
    res.render('login', { error: null }); 
});

app.post('/auth/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        if (!user || !(await user.matchPassword(password))) {
            return res.render('login', { error: 'Invalid username or password' });
        }

        req.session.user = user._id; 
        res.redirect('/snippets'); 
    } catch (error) {
        res.status(500).send('Server error');
    }
});

app.use('/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
