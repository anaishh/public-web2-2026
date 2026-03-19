/**
 * T6: Controlador de Notes
 */

import Note from '../models/note.model.js';
import { AppError } from '../utils/AppError.js';

/**
 * GET /api/notes - Listar notas (excluye eliminadas)
 */
export const getNotes = async (req, res) => {
  const notes = await Note.find()
    .sort({ pinned: -1, createdAt: -1 });

  res.json({
    count: notes.length,
    data: notes
  });
};

/**
 * GET /api/notes/trash - Listar papelera
 */
export const getTrash = async (req, res) => {
  const notes = await Note.findDeleted()
    .sort({ deletedAt: -1 });

  res.json({
    count: notes.length,
    message: 'Las notas se eliminan permanentemente después de 30 días',
    data: notes
  });
};

/**
 * GET /api/notes/search - Búsqueda full-text
 */
export const searchNotes = async (req, res) => {
  const { q } = req.query;

  if (!q || q.length < 2) {
    throw AppError.badRequest('El término de búsqueda debe tener al menos 2 caracteres');
  }

  const notes = await Note.find(
    { $text: { $search: q } },
    { score: { $meta: 'textScore' } }
  ).sort({ score: { $meta: 'textScore' } });

  res.json({
    query: q,
    count: notes.length,
    data: notes
  });
};

/**
 * GET /api/notes/:id
 */
export const getNote = async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (!note) {
    throw AppError.notFound('Nota');
  }

  res.json({ data: note });
};

/**
 * POST /api/notes
 */
export const createNote = async (req, res) => {
  const { title, content, color, pinned } = req.body;

  const note = await Note.create({
    title,
    content,
    color,
    pinned
  });

  res.status(201).json({
    message: 'Nota creada',
    data: note
  });
};

/**
 * PUT /api/notes/:id
 */
export const updateNote = async (req, res) => {
  const { title, content, color, pinned } = req.body;

  const note = await Note.findByIdAndUpdate(
    req.params.id,
    { title, content, color, pinned },
    { new: true, runValidators: true }
  );

  if (!note) {
    throw AppError.notFound('Nota');
  }

  res.json({
    message: 'Nota actualizada',
    data: note
  });
};

/**
 * DELETE /api/notes/:id - Soft delete
 */
export const deleteNote = async (req, res) => {
  const note = await Note.softDeleteById(req.params.id, 'user');

  if (!note) {
    throw AppError.notFound('Nota');
  }

  res.json({
    message: 'Nota movida a la papelera',
    data: {
      id: note._id,
      deletedAt: note.deletedAt
    }
  });
};

/**
 * POST /api/notes/:id/restore - Restaurar
 */
export const restoreNote = async (req, res) => {
  const note = await Note.restoreById(req.params.id);

  if (!note) {
    throw AppError.notFound('Nota');
  }

  res.json({
    message: 'Nota restaurada',
    data: note
  });
};

/**
 * DELETE /api/notes/:id/permanent - Hard delete
 */
export const permanentDeleteNote = async (req, res) => {
  const note = await Note.hardDelete(req.params.id);

  if (!note) {
    throw AppError.notFound('Nota');
  }

  res.json({
    message: 'Nota eliminada permanentemente',
    data: { id: note._id }
  });
};

/**
 * DELETE /api/notes/trash/empty - Vaciar papelera
 */
export const emptyTrash = async (req, res) => {
  const result = await Note.emptyTrash();

  res.json({
    message: 'Papelera vaciada',
    deletedCount: result.deletedCount
  });
};
