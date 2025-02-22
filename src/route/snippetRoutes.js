import express from 'express'
import {
  createSnippet,
  getAllSnippets,
  getUserSnippets,
  getSnippetById,
  updateSnippet,
  deleteSnippet
} from '../controller/snippetController.js'

const router = express.Router()

const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    req.flash('error_msg', 'You must be logged in to perform this action.')
    return res.redirect('/auth/login')
  }
  next()
}

router.get('/', getAllSnippets)

router.get('/mine', requireAuth, getUserSnippets)

router.get('/edit/:id', requireAuth, getSnippetById)

router.post('/', requireAuth, createSnippet)

router.post('/edit/:id', requireAuth, updateSnippet)

router.post('/delete/:id', requireAuth, deleteSnippet)

export default router
