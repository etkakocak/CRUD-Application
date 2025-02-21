import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './src/route/authRoutes.js';
import Snippet from './src/model/snippet.js';
import User from './src/model/user.js'; 

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

const requireAuth = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/auth/login'); 
    }
    next();
};

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

app.get('/snippets/create', requireAuth, (req, res) => {
    res.render('create-snippet', { error: null });
});

app.post('/snippets/create', requireAuth, async (req, res) => {
    const { title, code, language } = req.body;

    if (!title || !code || !language) {
        return res.render('create-snippet', { error: 'All fields are required' });
    }

    try {
        const newSnippet = new Snippet({
            title,
            code,
            language,
            user: req.session.user 
        });

        await newSnippet.save();
        res.redirect('/snippets');
    } catch (error) {
        res.status(500).send('Server error');
    }
});

app.get('/auth/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

app.use('/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
