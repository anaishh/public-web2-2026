/**
 * Datos de ejemplo - Simula base de datos
 */

export const cursos = {
  programacion: [
    { id: 1, titulo: 'JavaScript Moderno ES2024', lenguaje: 'javascript', nivel: 'basico', vistas: 15000 },
    { id: 2, titulo: 'Node.js y Express 5', lenguaje: 'javascript', nivel: 'intermedio', vistas: 8500 },
    { id: 3, titulo: 'Python para Data Science', lenguaje: 'python', nivel: 'intermedio', vistas: 12000 },
    { id: 4, titulo: 'TypeScript Avanzado', lenguaje: 'javascript', nivel: 'avanzado', vistas: 6500 }
  ]
};

let nextId = 5;

export const getNextId = () => nextId++;
