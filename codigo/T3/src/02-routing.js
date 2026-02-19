/**
 * Tema 3 - Ejemplo 2: API REST con Routing Manual
 * 
 * Ejecutar: npm run routing
 * Probar con REST Client o curl
 */

import { createServer } from 'node:http';

const PORT = 3000;

// Base de datos en memoria
const db = {
  cursos: [
    { id: 1, titulo: 'JavaScript Moderno', nivel: 'basico', vistas: 15000 },
    { id: 2, titulo: 'Node.js Avanzado', nivel: 'avanzado', vistas: 8500 },
    { id: 3, titulo: 'Python para Data Science', nivel: 'intermedio', vistas: 12000 }
  ]
};

let nextId = 4;

// Helper: Leer body de la request
function getBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(new Error('JSON inválido'));
      }
    });
    req.on('error', reject);
  });
}

// Helper: Enviar respuesta JSON
function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, { 
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  });
  res.end(JSON.stringify(data, null, 2));
}

// Helper: Extraer parámetros de ruta
function matchRoute(pattern, path) {
  const patternParts = pattern.split('/').filter(Boolean);
  const pathParts = path.split('/').filter(Boolean);
  
  if (patternParts.length !== pathParts.length) return null;
  
  const params = {};
  
  for (let i = 0; i < patternParts.length; i++) {
    if (patternParts[i].startsWith(':')) {
      params[patternParts[i].slice(1)] = pathParts[i];
    } else if (patternParts[i] !== pathParts[i]) {
      return null;
    }
  }
  
  return params;
}

// Handlers
const handlers = {
  getAllCursos: (req, res, { query }) => {
    let resultado = [...db.cursos];
    
    if (query.nivel) {
      resultado = resultado.filter(c => c.nivel === query.nivel);
    }
    
    if (query.orden === 'vistas') {
      resultado.sort((a, b) => b.vistas - a.vistas);
    }
    
    sendJSON(res, 200, resultado);
  },
  
  getCursoById: (req, res, { params }) => {
    const id = parseInt(params.id);
    const curso = db.cursos.find(c => c.id === id);
    
    if (!curso) {
      return sendJSON(res, 404, { error: 'Curso no encontrado' });
    }
    
    sendJSON(res, 200, curso);
  },
  
  createCurso: async (req, res) => {
    try {
      const body = await getBody(req);
      
      if (!body.titulo || !body.nivel) {
        return sendJSON(res, 400, { error: 'Campos requeridos: titulo, nivel' });
      }
      
      const nuevoCurso = {
        id: nextId++,
        titulo: body.titulo,
        nivel: body.nivel,
        vistas: 0
      };
      
      db.cursos.push(nuevoCurso);
      sendJSON(res, 201, nuevoCurso);
    } catch (error) {
      sendJSON(res, 400, { error: error.message });
    }
  },
  
  updateCurso: async (req, res, { params }) => {
    try {
      const id = parseInt(params.id);
      const index = db.cursos.findIndex(c => c.id === id);
      
      if (index === -1) {
        return sendJSON(res, 404, { error: 'Curso no encontrado' });
      }
      
      const body = await getBody(req);
      db.cursos[index] = { id, ...body };
      sendJSON(res, 200, db.cursos[index]);
    } catch (error) {
      sendJSON(res, 400, { error: error.message });
    }
  },
  
  patchCurso: async (req, res, { params }) => {
    try {
      const id = parseInt(params.id);
      const index = db.cursos.findIndex(c => c.id === id);
      
      if (index === -1) {
        return sendJSON(res, 404, { error: 'Curso no encontrado' });
      }
      
      const body = await getBody(req);
      db.cursos[index] = { ...db.cursos[index], ...body };
      sendJSON(res, 200, db.cursos[index]);
    } catch (error) {
      sendJSON(res, 400, { error: error.message });
    }
  },
  
  deleteCurso: (req, res, { params }) => {
    const id = parseInt(params.id);
    const index = db.cursos.findIndex(c => c.id === id);
    
    if (index === -1) {
      return sendJSON(res, 404, { error: 'Curso no encontrado' });
    }
    
    db.cursos.splice(index, 1);
    res.writeHead(204);
    res.end();
  }
};

// Servidor principal
const server = createServer(async (req, res) => {
  const { method, url, headers } = req;
  const parsedUrl = new URL(url, `http://${headers.host}`);
  const path = parsedUrl.pathname;
  const query = Object.fromEntries(parsedUrl.searchParams);
  
  console.log(`[${new Date().toISOString()}] ${method} ${path}`);
  
  // CORS preflight
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    return res.end();
  }
  
  try {
    // GET /
    if (method === 'GET' && path === '/') {
      return sendJSON(res, 200, {
        mensaje: 'API de Cursos',
        endpoints: {
          'GET /api/cursos': 'Listar cursos',
          'GET /api/cursos/:id': 'Obtener curso',
          'POST /api/cursos': 'Crear curso',
          'PUT /api/cursos/:id': 'Actualizar curso',
          'PATCH /api/cursos/:id': 'Actualizar parcialmente',
          'DELETE /api/cursos/:id': 'Eliminar curso'
        }
      });
    }
    
    // GET /api/cursos
    if (method === 'GET' && path === '/api/cursos') {
      return handlers.getAllCursos(req, res, { query });
    }
    
    // GET /api/cursos/:id
    const getParams = matchRoute('/api/cursos/:id', path);
    if (method === 'GET' && getParams) {
      return handlers.getCursoById(req, res, { params: getParams });
    }
    
    // POST /api/cursos
    if (method === 'POST' && path === '/api/cursos') {
      return handlers.createCurso(req, res);
    }
    
    // PUT /api/cursos/:id
    const putParams = matchRoute('/api/cursos/:id', path);
    if (method === 'PUT' && putParams) {
      return handlers.updateCurso(req, res, { params: putParams });
    }
    
    // PATCH /api/cursos/:id
    const patchParams = matchRoute('/api/cursos/:id', path);
    if (method === 'PATCH' && patchParams) {
      return handlers.patchCurso(req, res, { params: patchParams });
    }
    
    // DELETE /api/cursos/:id
    const deleteParams = matchRoute('/api/cursos/:id', path);
    if (method === 'DELETE' && deleteParams) {
      return handlers.deleteCurso(req, res, { params: deleteParams });
    }
    
    // 404
    sendJSON(res, 404, { error: 'Ruta no encontrada' });
    
  } catch (error) {
    console.error('Error:', error);
    sendJSON(res, 500, { error: 'Error interno del servidor' });
  }
});

server.listen(PORT, () => {
  console.log(`\n🚀 API REST ejecutándose en http://localhost:${PORT}`);
  console.log('📝 Endpoints disponibles:');
  console.log('   GET    /api/cursos');
  console.log('   GET    /api/cursos/:id');
  console.log('   POST   /api/cursos');
  console.log('   PUT    /api/cursos/:id');
  console.log('   PATCH  /api/cursos/:id');
  console.log('   DELETE /api/cursos/:id\n');
});
