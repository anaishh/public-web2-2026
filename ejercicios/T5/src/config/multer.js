/**
 * Configuración de Multer para subida de carátulas
 */

import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directorio de uploads (relativo a la raíz del proyecto)
const UPLOADS_DIR = path.join(__dirname, '../../uploads');

// Tipos MIME permitidos
const ALLOWED_MIMES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

// Almacenamiento en disco con nombre único
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = crypto.randomBytes(16).toString('hex');
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  }
});

// Filtro: solo imágenes
const imageFilter = (req, file, cb) => {
  if (ALLOWED_MIMES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Solo se permiten imágenes (${ALLOWED_MIMES.join(', ')})`), false);
  }
};

// Instancia configurada para carátulas
export const uploadCover = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5 MB
});

export { UPLOADS_DIR };
