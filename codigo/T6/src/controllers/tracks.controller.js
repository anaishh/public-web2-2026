import Track from '../models/track.model.js';
import { AppError } from '../utils/AppError.js';

// GET /api/tracks
export const getTracks = async (req, res) => {
  const { page = 1, limit = 10, genre, isPublic, sortBy = 'createdAt', order = 'desc' } = req.query;
  
  const filter = {};
  if (genre) filter.genres = { $in: [genre] };
  if (isPublic !== undefined) filter.isPublic = isPublic;
  
  const skip = (Number(page) - 1) * Number(limit);
  const sort = { [sortBy]: order === 'asc' ? 1 : -1 };
  
  const [tracks, total] = await Promise.all([
    Track.find(filter)
      .populate('artist', 'name email avatar')
      .skip(skip)
      .limit(Number(limit))
      .sort(sort),
    Track.countDocuments(filter)
  ]);
  
  res.json({
    data: tracks,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit))
    }
  });
};

// GET /api/tracks/top
export const getTopTracks = async (req, res) => {
  const { limit = 10 } = req.query;
  
  const tracks = await Track.find({ isPublic: true })
    .populate('artist', 'name avatar')
    .sort({ plays: -1 })
    .limit(Number(limit));
  
  res.json({ data: tracks });
};

// GET /api/tracks/:id
export const getTrack = async (req, res) => {
  const track = await Track.findById(req.params.id)
    .populate('artist', 'name email avatar');
  
  if (!track) {
    throw AppError.notFound('Track');
  }
  
  res.json({ data: track });
};

// POST /api/tracks
export const createTrack = async (req, res) => {
  const track = await Track.create(req.body);
  await track.populate('artist', 'name email avatar');
  
  res.status(201).json({ data: track });
};

// PUT /api/tracks/:id
export const updateTrack = async (req, res) => {
  const track = await Track.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  ).populate('artist', 'name email avatar');
  
  if (!track) {
    throw AppError.notFound('Track');
  }
  
  res.json({ data: track });
};

// DELETE /api/tracks/:id (soft delete)
export const deleteTrack = async (req, res) => {
  const track = await Track.softDeleteById(req.params.id);
  
  if (!track) {
    throw AppError.notFound('Track');
  }
  
  res.json({
    message: 'Track eliminado',
    data: { id: track._id, deletedAt: track.deletedAt }
  });
};

// PATCH /api/tracks/:id/restore
export const restoreTrack = async (req, res) => {
  const track = await Track.restoreById(req.params.id);
  
  if (!track) {
    throw AppError.notFound('Track');
  }
  
  res.json({
    message: 'Track restaurado',
    data: track
  });
};

// POST /api/tracks/:id/play
export const playTrack = async (req, res) => {
  const track = await Track.findByIdAndUpdate(
    req.params.id,
    { $inc: { plays: 1 } },
    { new: true }
  );
  
  if (!track) {
    throw AppError.notFound('Track');
  }
  
  res.json({ data: { plays: track.plays } });
};

// POST /api/tracks/:id/like
export const likeTrack = async (req, res) => {
  const track = await Track.findByIdAndUpdate(
    req.params.id,
    { $inc: { likes: 1 } },
    { new: true }
  );
  
  if (!track) {
    throw AppError.notFound('Track');
  }
  
  res.json({ data: { likes: track.likes } });
};

// GET /api/tracks/deleted
export const getDeletedTracks = async (req, res) => {
  const tracks = await Track.findDeleted()
    .populate('artist', 'name email')
    .sort({ deletedAt: -1 });
  
  res.json({ data: tracks });
};
