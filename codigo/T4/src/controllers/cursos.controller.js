/**
 * Controlador de Cursos
 * Express 5 captura automáticamente errores async
 */

import { cursos, getNextId } from '../data/cursos.js';
import { ApiError } from '../middleware/errorHandler.js';

const programacion = cursos.programacion;

// GET /api/cursos/programacion
export const getAll = (req, res) => {
  let resultado = [...programacion];
  const { nivel, lenguaje, orden } = req.query;
  
  if (nivel) resultado = resultado.filter(c => c.nivel === nivel);
  if (lenguaje) resultado = resultado.filter(c => c.lenguaje === lenguaje);
  
  if (orden === 'vistas') resultado.sort((a, b) => b.vistas - a.vistas);
  else if (orden === 'titulo') resultado.sort((a, b) => a.titulo.localeCompare(b.titulo));
  
  res.json(resultado);
};

// GET /api/cursos/programacion/:id
export const getById = (req, res) => {
  const id = parseInt(req.params.id);
  const curso = programacion.find(c => c.id === id);
  
  if (!curso) throw ApiError.notFound(`Curso con ID ${id} no encontrado`);
  
  res.json(curso);
};

// POST /api/cursos/programacion
export const create = (req, res) => {
  const { titulo, lenguaje, nivel, descripcion } = req.body;
  
  const existe = programacion.some(c => c.titulo.toLowerCase() === titulo.toLowerCase());
  if (existe) throw ApiError.conflict('Ya existe un curso con ese título');
  
  const nuevoCurso = {
    id: getNextId(),
    titulo,
    lenguaje,
    nivel,
    descripcion: descripcion || null,
    vistas: 0
  };
  
  programacion.push(nuevoCurso);
  res.status(201).json(nuevoCurso);
};

// PUT /api/cursos/programacion/:id
export const update = (req, res) => {
  const id = parseInt(req.params.id);
  const index = programacion.findIndex(c => c.id === id);
  
  if (index === -1) throw ApiError.notFound(`Curso con ID ${id} no encontrado`);
  
  const { titulo, lenguaje, nivel, descripcion } = req.body;
  
  programacion[index] = {
    id,
    titulo,
    lenguaje,
    nivel,
    descripcion: descripcion || null,
    vistas: programacion[index].vistas
  };
  
  res.json(programacion[index]);
};

// PATCH /api/cursos/programacion/:id
export const partialUpdate = (req, res) => {
  const id = parseInt(req.params.id);
  const index = programacion.findIndex(c => c.id === id);
  
  if (index === -1) throw ApiError.notFound(`Curso con ID ${id} no encontrado`);
  
  programacion[index] = { ...programacion[index], ...req.body };
  res.json(programacion[index]);
};

// DELETE /api/cursos/programacion/:id
export const remove = (req, res) => {
  const id = parseInt(req.params.id);
  const index = programacion.findIndex(c => c.id === id);
  
  if (index === -1) throw ApiError.notFound(`Curso con ID ${id} no encontrado`);
  
  programacion.splice(index, 1);
  res.status(204).end();
};
