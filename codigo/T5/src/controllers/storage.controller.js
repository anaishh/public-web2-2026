import Storage from '../models/storage.model.js';
import { handleHttpError } from '../utils/handleError.js';
import { unlink } from 'node:fs/promises';
import { join } from 'node:path';

const PUBLIC_URL = process.env.PUBLIC_URL || 'http://localhost:3000';

// POST /api/storage
export const uploadFile = async (req, res) => {
  if (!req.file) {
    return handleHttpError(res, 'No se subió ningún archivo', 400);
  }
  
  const { filename, originalname, mimetype, size } = req.file;
  
  const fileData = await Storage.create({
    filename,
    originalName: originalname,
    url: `${PUBLIC_URL}/uploads/${filename}`,
    mimetype,
    size
  });
  
  res.status(201).json({ data: fileData });
};

// POST /api/storage/multiple
export const uploadMultipleFiles = async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return handleHttpError(res, 'No se subieron archivos', 400);
  }
  
  const filesData = await Promise.all(
    req.files.map(file => 
      Storage.create({
        filename: file.filename,
        originalName: file.originalname,
        url: `${PUBLIC_URL}/uploads/${file.filename}`,
        mimetype: file.mimetype,
        size: file.size
      })
    )
  );
  
  res.status(201).json({ data: filesData });
};

// GET /api/storage
export const getFiles = async (req, res) => {
  const { page = 1, limit = 20, mimetype } = req.query;
  
  const filter = {};
  if (mimetype) {
    filter.mimetype = { $regex: `^${mimetype}` };
  }
  
  const skip = (Number(page) - 1) * Number(limit);
  
  const [files, total] = await Promise.all([
    Storage.find(filter)
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 }),
    Storage.countDocuments(filter)
  ]);
  
  res.json({
    data: files,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit))
    }
  });
};

// GET /api/storage/:id
export const getFile = async (req, res) => {
  const file = await Storage.findById(req.params.id);
  
  if (!file) {
    return handleHttpError(res, 'Archivo no encontrado', 404);
  }
  
  res.json({ data: file });
};

// DELETE /api/storage/:id
export const deleteFile = async (req, res) => {
  const file = await Storage.findById(req.params.id);
  
  if (!file) {
    return handleHttpError(res, 'Archivo no encontrado', 404);
  }
  
  // Eliminar archivo físico
  try {
    const filePath = join(process.cwd(), 'storage', file.filename);
    await unlink(filePath);
  } catch (err) {
    console.warn('Archivo físico no encontrado:', file.filename);
  }
  
  await Storage.findByIdAndDelete(req.params.id);
  
  res.status(204).send();
};

// GET /api/storage/type/:type
export const getFilesByType = async (req, res) => {
  const mimePatterns = {
    image: 'image/',
    audio: 'audio/',
    video: 'video/',
    document: 'application/'
  };
  
  const pattern = mimePatterns[req.params.type];
  
  if (!pattern) {
    return handleHttpError(res, 'Tipo no válido: image, audio, video, document', 400);
  }
  
  const files = await Storage.find({
    mimetype: { $regex: `^${pattern}` }
  }).sort({ createdAt: -1 });
  
  res.json({ data: files });
};
