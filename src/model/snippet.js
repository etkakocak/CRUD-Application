import mongoose from 'mongoose';

const SnippetSchema = new mongoose.Schema({
    title: { type: String, required: true },
    code: { type: String, required: true },
    language: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Snippet', SnippetSchema);
