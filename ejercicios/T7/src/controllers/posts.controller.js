/**
 * T7: Controlador de Posts
 */

import Post from '../models/post.model.js';

/**
 * GET /api/posts - Posts publicados
 */
export const getPosts = async (req, res) => {
  const { tag, author } = req.query;

  const filter = { published: true };

  if (tag) {
    filter.tags = tag.toLowerCase();
  }

  if (author) {
    filter.author = author;
  }

  const posts = await Post.find(filter)
    .populate('author', 'name avatar')
    .sort({ createdAt: -1 });

  res.json({
    count: posts.length,
    data: posts
  });
};

/**
 * GET /api/posts/drafts - Borradores del usuario
 */
export const getMyDrafts = async (req, res) => {
  const posts = await Post.find({
    author: req.user._id,
    published: false
  }).sort({ updatedAt: -1 });

  res.json({
    count: posts.length,
    data: posts
  });
};

/**
 * GET /api/posts/:slug
 */
export const getPost = async (req, res) => {
  const post = await Post.findOne({ slug: req.params.slug })
    .populate('author', 'name avatar');

  if (!post) {
    return res.status(404).json({
      error: true,
      message: 'Post no encontrado'
    });
  }

  // Si no está publicado, solo el autor o admin pueden verlo
  if (!post.published) {
    if (!req.user ||
        (req.user.role !== 'admin' &&
         post.author._id.toString() !== req.user._id.toString())) {
      return res.status(404).json({
        error: true,
        message: 'Post no encontrado'
      });
    }
  }

  res.json({ data: post });
};

/**
 * POST /api/posts
 */
export const createPost = async (req, res) => {
  const { title, content, excerpt, tags, published } = req.body;

  const post = await Post.create({
    title,
    content,
    excerpt,
    tags: tags || [],
    published: published || false,
    author: req.user._id
  });

  await post.populate('author', 'name avatar');

  res.status(201).json({
    message: 'Post creado',
    data: post
  });
};

/**
 * PUT /api/posts/:id
 */
export const updatePost = async (req, res) => {
  const { title, content, excerpt, tags, published } = req.body;

  const post = await Post.findByIdAndUpdate(
    req.params.id,
    { title, content, excerpt, tags, published },
    { new: true, runValidators: true }
  ).populate('author', 'name avatar');

  if (!post) {
    return res.status(404).json({
      error: true,
      message: 'Post no encontrado'
    });
  }

  res.json({
    message: 'Post actualizado',
    data: post
  });
};

/**
 * DELETE /api/posts/:id
 */
export const deletePost = async (req, res) => {
  const post = await Post.findByIdAndDelete(req.params.id);

  if (!post) {
    return res.status(404).json({
      error: true,
      message: 'Post no encontrado'
    });
  }

  res.json({
    message: 'Post eliminado',
    data: { id: post._id }
  });
};

/**
 * Obtener owner ID de un post (para middleware)
 */
export const getPostOwnerId = async (req) => {
  const post = await Post.findById(req.params.id);
  return post?.author;
};
