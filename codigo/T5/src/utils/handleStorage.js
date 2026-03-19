import multer from 'multer';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = join(__dirname, '../../storage');
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const ext = extname(file.originalname).toLowerCase();
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

// Tipos permitidos
const allowedMimeTypes = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'audio/mpeg',
  'audio/wav',
  'audio/ogg',
  'video/mp4',
  'video/webm',
  'application/pdf'
];

// Filtro de archivos
const fileFilter = (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Tipo no permitido: ${file.mimetype}`), false);
  }
};

// Límites
const limits = {
  fileSize: 10 * 1024 * 1024, // 10MB
  files: 5
};

// Middleware
const uploadMiddleware = multer({
  storage,
  fileFilter,
  limits
});

export default uploadMiddleware;

// Exportaciones adicionales
export const uploadSingle = (fieldName = 'file') => uploadMiddleware.single(fieldName);
export const uploadArray = (fieldName = 'files', maxCount = 5) => uploadMiddleware.array(fieldName, maxCount);
