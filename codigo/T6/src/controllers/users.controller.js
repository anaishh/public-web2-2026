import User from '../models/user.model.js';
import { AppError } from '../utils/AppError.js';

// GET /api/users
export const getUsers = async (req, res) => {
  const { page = 1, limit = 10, isActive, search, sortBy = 'createdAt', order = 'desc' } = req.query;
  
  const filter = {};
  if (isActive !== undefined) filter.isActive = isActive;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }
  
  const skip = (Number(page) - 1) * Number(limit);
  const sort = { [sortBy]: order === 'asc' ? 1 : -1 };
  
  const [users, total] = await Promise.all([
    User.find(filter).skip(skip).limit(Number(limit)).sort(sort),
    User.countDocuments(filter)
  ]);
  
  res.json({
    data: users,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit))
    }
  });
};

// GET /api/users/:id
export const getUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  
  if (!user) {
    throw AppError.notFound('Usuario');
  }
  
  res.json({ data: user });
};

// POST /api/users
export const createUser = async (req, res) => {
  const user = await User.create(req.body);
  res.status(201).json({ data: user });
};

// PUT /api/users/:id
export const updateUser = async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  
  if (!user) {
    throw AppError.notFound('Usuario');
  }
  
  res.json({ data: user });
};

// DELETE /api/users/:id (soft delete)
export const deleteUser = async (req, res) => {
  const user = await User.softDeleteById(req.params.id);
  
  if (!user) {
    throw AppError.notFound('Usuario');
  }
  
  res.json({
    message: 'Usuario eliminado',
    data: { id: user._id, deletedAt: user.deletedAt }
  });
};

// PATCH /api/users/:id/restore
export const restoreUser = async (req, res) => {
  const user = await User.restoreById(req.params.id);
  
  if (!user) {
    throw AppError.notFound('Usuario');
  }
  
  res.json({
    message: 'Usuario restaurado',
    data: user
  });
};

// GET /api/users/deleted
export const getDeletedUsers = async (req, res) => {
  const users = await User.findDeleted().sort({ deletedAt: -1 });
  res.json({ data: users });
};
