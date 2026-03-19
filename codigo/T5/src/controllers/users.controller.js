import User from '../models/user.model.js';
import { handleHttpError } from '../utils/handleError.js';

// GET /api/users
export const getUsers = async (req, res) => {
  const { page = 1, limit = 10, role, isActive, search } = req.query;
  
  const filter = {};
  if (role) filter.role = role;
  if (isActive !== undefined) filter.isActive = isActive === 'true';
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }
  
  const skip = (Number(page) - 1) * Number(limit);
  
  const [users, total] = await Promise.all([
    User.find(filter)
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 }),
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
    return handleHttpError(res, 'Usuario no encontrado', 404);
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
    return handleHttpError(res, 'Usuario no encontrado', 404);
  }
  
  res.json({ data: user });
};

// DELETE /api/users/:id
export const deleteUser = async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  
  if (!user) {
    return handleHttpError(res, 'Usuario no encontrado', 404);
  }
  
  res.status(204).send();
};

// PATCH /api/users/:id/deactivate
export const deactivateUser = async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  );
  
  if (!user) {
    return handleHttpError(res, 'Usuario no encontrado', 404);
  }
  
  res.json({ data: user });
};
