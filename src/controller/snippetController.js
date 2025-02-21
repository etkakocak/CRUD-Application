import Snippet from '../model/snippet.js';

export const createSnippet = async (req, res) => {
    const { title, code, language } = req.body;

    if (!req.session.user) {
        return res.status(403).json({ message: "Unauthorized! Please log in." });
    }

    try {
        const newSnippet = await Snippet.create({
            title,
            code,
            language,
            user: req.session.user
        });

        res.status(201).json({ message: "Snippet created successfully!", snippet: newSnippet });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getAllSnippets = async (req, res) => {
    try {
        const snippets = await Snippet.find().populate('user', 'username');
        res.json(snippets);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getUserSnippets = async (req, res) => {
    if (!req.session.user) {
        return res.status(403).json({ message: "Unauthorized! Please log in." });
    }

    try {
        const snippets = await Snippet.find({ user: req.session.user });
        res.json(snippets);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const updateSnippet = async (req, res) => {
    const { id } = req.params;
    const { title, code, language } = req.body;

    if (!req.session.user) {
        return res.status(403).json({ message: "Unauthorized! Please log in." });
    }

    try {
        const snippet = await Snippet.findById(id);
        if (!snippet) {
            return res.status(404).json({ message: "Snippet not found" });
        }

        if (snippet.user.toString() !== req.session.user) {
            return res.status(403).json({ message: "You can only update your own snippets" });
        }

        snippet.title = title || snippet.title;
        snippet.code = code || snippet.code;
        snippet.language = language || snippet.language;
        await snippet.save();

        res.json({ message: "Snippet updated successfully!", snippet });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const deleteSnippet = async (req, res) => {
    const { id } = req.params;

    if (!req.session.user) {
        return res.status(403).json({ message: "Unauthorized! Please log in." });
    }

    try {
        const snippet = await Snippet.findById(id);
        if (!snippet) {
            return res.status(404).json({ message: "Snippet not found" });
        }

        if (snippet.user.toString() !== req.session.user) {
            return res.status(403).json({ message: "You can only delete your own snippets" });
        }

        await Snippet.findByIdAndDelete(id);
        res.json({ message: "Snippet deleted successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
