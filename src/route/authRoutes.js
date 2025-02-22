import express from 'express'
import { registerUser, loginUser, logoutUser } from '../controller/authController.js'

const router = express.Router()

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', registerUser)

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', loginUser)

router.post('/logout', logoutUser)

export default router
