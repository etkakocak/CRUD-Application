import express from 'express';
import { createSnippet, getAllSnippets, getUserSnippets, updateSnippet, deleteSnippet } from '../controller/snippetController.js';

const router = express.Router();

router.post('/', createSnippet);
router.get('/', getAllSnippets);
router.get('/mine', getUserSnippets);
router.put('/:id', updateSnippet);
router.delete('/:id', deleteSnippet);

export default router;
