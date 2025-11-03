const Post = require('../models/postModel');

exports.getAllPosts = async (req , res) => {
    try {
        const posts = await Post.find();
        res.status(200).json({
            status: 'success',
            data: posts
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching posts' });
    }
};
exports.createPost = async (req, res) => {
    try {
        // Support multiple payload shapes:
        // - { title, content }
        // - { title, body }
        // - { post: { title, content } }
        let payload = req.body;
        if (payload && payload.post && typeof payload.post === 'object') payload = payload.post;

        const title = payload && (payload.title || payload.name);
        const content = payload && (payload.content ?? payload.body);

        if (!title || !content) {
            return res.status(400).json({ message: 'Missing required fields: title and content (or body).' });
        }

        const newPost = new Post({ title, content });
        await newPost.save();
        // Return 201 Created on successful creation
        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ message: 'Error creating post' });
    }
};

exports.getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching post' });
    }
};

exports.updatePost = async (req, res) => {
    try {
        // Accept multiple payload shapes for updates as well
        let payload = req.body;
        if (payload && payload.post && typeof payload.post === 'object') payload = payload.post;
        const title = payload && (payload.title || payload.name);
        const content = payload && (payload.content ?? payload.body);

        const updates = {};
        if (title !== undefined) updates.title = title;
        if (content !== undefined) updates.content = content;

        const post = await Post.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true }
        );
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Error updating post' });
    }
};
exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findByIdAndDelete(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(204).json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting post' });
    }
};