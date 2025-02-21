import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './src/route/authRoutes.js';
import Snippet from './src/model/snippet.js';
import User from './src/model/user.js';
import flash from 'connect-flash';

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

app.use(flash());

app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.user = req.session.user || null;
    next();
});

const requireAuth = (req, res, next) => {
    if (!req.session.user) {
        req.flash('error_msg', 'You must log in to create a snippet!');
        return res.redirect('/auth/login');
    }
    next();
};

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/snippets', async (req, res) => {
    const snippets = await Snippet.find();
    const userSnippets = req.session.user 
        ? await Snippet.find({ user: req.session.user.id }) 
        : [];
    res.render('snippets', { snippets, userSnippets });
});

app.get('/auth/login', (req, res) => {
    res.render('login');
});

app.post('/auth/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        if (!user || !(await user.matchPassword(password))) {
            req.flash('error_msg', 'Invalid username or password');
            return res.redirect('/auth/login');
        }

        req.session.user = { id: user._id.toString(), username: user.username };
        req.flash('success_msg', `Login successful! Welcome, ${user.username}.`);
        res.redirect('/snippets');
    } catch (error) {
        res.status(500).send('Server error');
    }
});

app.get('/snippets/create', requireAuth, (req, res) => {
    res.render('create-snippet', { error_msg: req.flash('error_msg')[0] || null });
});

app.post('/snippets/create', requireAuth, async (req, res) => {
    const { title, code, language } = req.body;

    if (!title || !code || !language) {
        req.flash('error_msg', 'All fields are required');
        return res.redirect('/snippets/create');
    }

    try {
        const newSnippet = new Snippet({
            title,
            code,
            language,
            user: req.session.user.id // 🔥 Hata düzeltildi! Artık ObjectId olarak kaydediliyor.
        });

        await newSnippet.save();
        req.flash('success_msg', 'Snippet created successfully!');
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
