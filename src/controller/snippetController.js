import Snippet from '../model/snippet.js'

export const createSnippet = async (req, res) => {
  const { title, code, language } = req.body

  if (!req.session.user) {
    req.flash('error_msg', 'Unauthorized! Please log in.')
    return res.redirect('/auth/login')
  }

  try {
    await Snippet.create({
      title,
      code,
      language,
      user: req.session.user.id
    })

    req.flash('success_msg', 'Snippet created successfully!')
    res.redirect('/snippets')
  } catch (error) {
    req.flash('error_msg', 'Server error')
    res.redirect('/snippets/create')
  }
}

export const getAllSnippets = async (req, res) => {
  try {
    const snippets = await Snippet.find().populate('user', 'username')
    res.json(snippets)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

export const getUserSnippets = async (req, res) => {
  if (!req.session.user) {
    req.flash('error_msg', 'Unauthorized! Please log in.')
    return res.redirect('/auth/login')
  }

  try {
    const snippets = await Snippet.find({ user: req.session.user.id })
    res.json(snippets)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

export const getSnippetById = async (req, res) => {
  try {
    const snippet = await Snippet.findById(req.params.id)
    if (!snippet) {
      return res.status(404).send('Snippet not found')
    }

    if (snippet.user.toString() !== req.session.user.id) {
      return res.status(403).send('You are not authorized to edit this snippet')
    }

    res.render('edit-snippet', { snippet })
  } catch (error) {
    res.status(500).send('Server error')
  }
}

export const updateSnippet = async (req, res) => {
  const { id } = req.params
  const { title, code, language } = req.body

  if (!req.session.user) {
    req.flash('error_msg', 'Unauthorized! Please log in.')
    return res.redirect('/auth/login')
  }

  try {
    const snippet = await Snippet.findById(id)
    if (!snippet) {
      req.flash('error_msg', 'Snippet not found')
      return res.redirect('/snippets')
    }

    if (snippet.user.toString() !== req.session.user.id) {
      req.flash('error_msg', 'You can only update your own snippets')
      return res.redirect('/snippets')
    }

    snippet.title = title || snippet.title
    snippet.code = code || snippet.code
    snippet.language = language || snippet.language
    await snippet.save()

    req.flash('success_msg', 'Snippet updated successfully!')
    res.redirect('/snippets')
  } catch (error) {
    req.flash('error_msg', 'Server error')
    res.redirect('/snippets')
  }
}

export const deleteSnippet = async (req, res) => {
  const { id } = req.params

  if (!req.session.user) {
    req.flash('error_msg', 'Unauthorized! Please log in.')
    return res.redirect('/auth/login')
  }

  try {
    const snippet = await Snippet.findById(id)
    if (!snippet) {
      req.flash('error_msg', 'Snippet not found')
      return res.redirect('/snippets')
    }

    if (snippet.user.toString() !== req.session.user.id) {
      req.flash('error_msg', 'You can only delete your own snippets')
      return res.redirect('/snippets')
    }

    await Snippet.findByIdAndDelete(id)
    req.flash('success_msg', 'Snippet deleted successfully!')
    res.redirect('/snippets')
  } catch (error) {
    req.flash('error_msg', 'Server error')
    res.redirect('/snippets')
  }
}
