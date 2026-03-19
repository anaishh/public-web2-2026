/**
 * T5 Ejercicio: Controlador de Movies
 *
 * Conceptos aplicados:
 * - CRUD completo
 * - Operaciones atómicas con $inc
 * - Filtrado por query params
 * - Agregación para estadísticas
 */

import Movie from '../models/movie.model.js';
import { UPLOADS_DIR } from '../config/multer.js';
import { unlink } from 'fs/promises';
import path from 'path';

/**
 * GET /api/movies
 * Lista películas con filtro opcional por género
 */
export const getMovies = async (req, res) => {
  const { genre } = req.query;

  // Construir filtro dinámicamente
  const filter = {};
  if (genre) {
    filter.genre = genre.toLowerCase();
  }

  const movies = await Movie.find(filter).sort({ title: 1 });

  res.json({
    count: movies.length,
    data: movies
  });
};

/**
 * GET /api/movies/:id
 * Obtiene una película por ID
 */
export const getMovie = async (req, res) => {
  const movie = await Movie.findById(req.params.id);

  if (!movie) {
    return res.status(404).json({
      error: true,
      message: 'Película no encontrada'
    });
  }

  res.json({
    data: movie,
    isClassic: movie.isClassic() // Usando el método de instancia
  });
};

/**
 * POST /api/movies
 * Crea una nueva película
 */
export const createMovie = async (req, res) => {
  const { title, director, year, genre, stock } = req.body;

  // Verificar si ya existe
  const existing = await Movie.findOne({
    title: { $regex: new RegExp(`^${title}$`, 'i') }
  });

  if (existing) {
    return res.status(409).json({
      error: true,
      message: 'Ya existe una película con ese título'
    });
  }

  const movie = await Movie.create({
    title,
    director,
    year,
    genre,
    stock: stock || 5
  });

  res.status(201).json({
    message: 'Película creada',
    data: movie
  });
};

/**
 * POST /api/movies/:id/rent
 * Alquila una película (resta stock, suma rentedCount)
 */
export const rentMovie = async (req, res) => {
  // Operación atómica: solo actualiza si stock > 0
  const movie = await Movie.findOneAndUpdate(
    {
      _id: req.params.id,
      stock: { $gt: 0 }  // Condición: debe haber stock
    },
    {
      $inc: {
        stock: -1,       // Resta 1 al stock
        rentedCount: 1   // Suma 1 a veces alquilada
      }
    },
    { new: true }
  );

  if (!movie) {
    // Verificar si existe pero no hay stock
    const exists = await Movie.findById(req.params.id);

    if (!exists) {
      return res.status(404).json({
        error: true,
        message: 'Película no encontrada'
      });
    }

    return res.status(400).json({
      error: true,
      message: 'No hay copias disponibles para alquilar',
      stock: exists.stock
    });
  }

  res.json({
    message: `🎬 ¡Disfruta "${movie.title}"!`,
    data: movie,
    remaining: movie.stock
  });
};

/**
 * POST /api/movies/:id/return
 * Devuelve una película (suma stock)
 */
export const returnMovie = async (req, res) => {
  const movie = await Movie.findById(req.params.id);

  if (!movie) {
    return res.status(404).json({
      error: true,
      message: 'Película no encontrada'
    });
  }

  // No permitir devolver más del stock inicial
  if (movie.stock >= movie.initialStock) {
    return res.status(400).json({
      error: true,
      message: 'No hay copias pendientes de devolución',
      stock: movie.stock,
      initialStock: movie.initialStock
    });
  }

  // Incrementar stock
  movie.stock += 1;
  await movie.save();

  res.json({
    message: `📼 Gracias por devolver "${movie.title}"`,
    data: movie
  });
};

/**
 * GET /api/movies/stats/top
 * Devuelve las 5 películas más alquiladas
 */
export const getTopMovies = async (req, res) => {
  const limit = parseInt(req.query.limit) || 5;

  const topMovies = await Movie.find()
    .sort({ rentedCount: -1 })
    .limit(limit)
    .select('title director year genre rentedCount');

  res.json({
    title: '🏆 Películas más alquiladas',
    data: topMovies.map((movie, index) => ({
      rank: index + 1,
      ...movie.toObject()
    }))
  });
};

/**
 * DELETE /api/movies/:id
 * Elimina una película
 */
export const deleteMovie = async (req, res) => {
  const movie = await Movie.findByIdAndDelete(req.params.id);

  if (!movie) {
    return res.status(404).json({
      error: true,
      message: 'Película no encontrada'
    });
  }

  // Eliminar carátula si existe
  if (movie.cover) {
    await unlink(path.join(UPLOADS_DIR, movie.cover)).catch(() => {});
  }

  res.json({
    message: `Película "${movie.title}" eliminada`,
    data: movie
  });
};

/**
 * PATCH /api/movies/:id/cover
 * Sube o reemplaza la carátula de una película
 */
export const uploadMovieCover = async (req, res) => {
  const movie = await Movie.findById(req.params.id);

  if (!movie) {
    // Eliminar el archivo subido si la película no existe
    if (req.file) {
      await unlink(req.file.path).catch(() => {});
    }
    return res.status(404).json({
      error: true,
      message: 'Película no encontrada'
    });
  }

  if (!req.file) {
    return res.status(400).json({
      error: true,
      message: 'No se ha enviado ninguna imagen. Usa el campo "cover"'
    });
  }

  // Si ya tenía carátula, eliminar la anterior
  if (movie.cover) {
    await unlink(path.join(UPLOADS_DIR, movie.cover)).catch(() => {});
  }

  movie.cover = req.file.filename;
  await movie.save();

  res.json({
    message: `Carátula de "${movie.title}" actualizada`,
    data: movie
  });
};

/**
 * GET /api/movies/:id/cover
 * Devuelve la imagen de carátula de una película
 */
export const getMovieCover = async (req, res) => {
  const movie = await Movie.findById(req.params.id);

  if (!movie) {
    return res.status(404).json({
      error: true,
      message: 'Película no encontrada'
    });
  }

  if (!movie.cover) {
    return res.status(404).json({
      error: true,
      message: 'Esta película no tiene carátula'
    });
  }

  const coverPath = path.join(UPLOADS_DIR, movie.cover);
  res.sendFile(coverPath);
};
