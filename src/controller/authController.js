import User from '../model/user.js'

export const registerUser = async (req, res) => {
  const { username, password } = req.body

  try {
    const userExists = await User.findOne({ username })

    if (userExists) {
      req.flash('error_msg', 'Username already exists.')
      return res.redirect('/auth/register')
    }

    const user = await User.create({ username, password })

    if (user) {
      req.session.user = { id: user._id.toString(), username: user.username }
      req.flash('success_msg', 'Registration successful! You are now logged in.')
      res.redirect('/snippets')
    } else {
      req.flash('error_msg', 'Invalid user data')
      res.redirect('/auth/register')
    }
  } catch (error) {
    req.flash('error_msg', 'Server error')
    res.redirect('/auth/register')
  }
}

export const loginUser = async (req, res) => {
  const { username, password } = req.body

  try {
    const user = await User.findOne({ username })

    if (!user || !(await user.matchPassword(password))) {
      req.flash('error_msg', 'Invalid username or password')
      return res.redirect('/auth/login')
    }

    req.session.user = { id: user._id.toString(), username: user.username }
    req.flash('success_msg', `Login successful! Welcome, ${user.username}.`)
    res.redirect('/snippets')
  } catch (error) {
    req.flash('error_msg', 'Server error')
    res.redirect('/auth/login')
  }
}

export const logoutUser = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/')
  })
}
