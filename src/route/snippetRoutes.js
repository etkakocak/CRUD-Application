import express from 'express';
import { 
    createSnippet, 
    getAllSnippets, 
    getUserSnippets, 
    getSnippetById, 
    updateSnippet, 
    deleteSnippet 
} from '../controller/snippetController.js';

const router = express.Router();

const requireAuth = (req, res, next) => {
    if (!req.session.user) {
        req.flash('error_msg', 'You must be logged in to perform this action.');
        return res.redirect('/auth/login');
    }
    next();
};

// Get all snippets (Public)
router.get('/', getAllSnippets);

// Get snippets of logged-in user (Private)
router.get('/mine', requireAuth, getUserSnippets);

// Get single snippet by ID for editing (Private)
router.get('/edit/:id', requireAuth, getSnippetById);

// Create a new snippet (Private)
router.post('/', requireAuth, createSnippet);

// Update a snippet (Private)
router.post('/edit/:id', requireAuth, updateSnippet);

// Delete a snippet (Private)
router.post('/delete/:id', requireAuth, deleteSnippet);

export default router;
