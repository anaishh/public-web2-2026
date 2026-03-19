import Track from '../models/track.model.js';
import { handleHttpError } from '../utils/handleError.js';

// GET /api/tracks
export const getTracks = async (req, res) => {
  const { 
    page = 1, 
    limit = 10, 
    artist, 
    genre, 
    isPublic,
    sortBy = 'createdAt',
    order = 'desc'
  } = req.query;
  
  const filter = {};
  if (artist) filter.artist = artist;
  if (genre) filter.genres = { $in: [genre] };
  if (isPublic !== undefined) filter.isPublic = isPublic === 'true';
  
  const sort = {};
  sort[sortBy] = order === 'asc' ? 1 : -1;
  
  const skip = (Number(page) - 1) * Number(limit);
  
  const [tracks, total] = await Promise.all([
    Track.find(filter)
      .populate('artist', 'name email avatar')
      .populate('collaborators', 'name avatar')
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

// GET /api/tracks/artist/:artistId
export const getTracksByArtist = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);
  
  const [tracks, total] = await Promise.all([
    Track.find({ artist: req.params.artistId, isPublic: true })
      .populate('artist', 'name avatar')
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 }),
    Track.countDocuments({ artist: req.params.artistId, isPublic: true })
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

// GET /api/tracks/:id
export const getTrack = async (req, res) => {
  const track = await Track.findById(req.params.id)
    .populate('artist', 'name email avatar')
    .populate('collaborators', 'name avatar');
  
  if (!track) {
    return handleHttpError(res, 'Track no encontrado', 404);
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
    return handleHttpError(res, 'Track no encontrado', 404);
  }
  
  res.json({ data: track });
};

// DELETE /api/tracks/:id
export const deleteTrack = async (req, res) => {
  const track = await Track.findByIdAndDelete(req.params.id);
  
  if (!track) {
    return handleHttpError(res, 'Track no encontrado', 404);
  }
  
  res.status(204).send();
};

// POST /api/tracks/:id/play
export const playTrack = async (req, res) => {
  const track = await Track.findByIdAndUpdate(
    req.params.id,
    { $inc: { plays: 1 } },
    { new: true }
  );
  
  if (!track) {
    return handleHttpError(res, 'Track no encontrado', 404);
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
    return handleHttpError(res, 'Track no encontrado', 404);
  }
  
  res.json({ data: { likes: track.likes } });
};
