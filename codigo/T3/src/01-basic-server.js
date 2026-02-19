/**
 * Tema 3 - Ejemplo 1: Servidor HTTP Básico
 * 
 * Ejecutar: npm run basic
 * Probar: http://localhost:3000
 */

import { createServer } from 'node:http';

const PORT = 3000;

const server = createServer((req, res) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  
  const { method, url, headers } = req;
  const parsedUrl = new URL(url, `http://${headers.host}`);
  const path = parsedUrl.pathname;
  const query = Object.fromEntries(parsedUrl.searchParams);
  
  // Routing básico
  if (method === 'GET' && path === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
      <h1>Servidor HTTP con Node.js</h1>
      <p>Endpoints disponibles:</p>
      <ul>
        <li><a href="/health">GET /health</a> - Estado del servidor</li>
        <li><a href="/api/info">GET /api/info</a> - Información de la request</li>
        <li><a href="/api/cursos">GET /api/cursos</a> - Lista de cursos</li>
        <li><a href="/api/cursos?nivel=basico">GET /api/cursos?nivel=basico</a> - Filtrar</li>
      </ul>
    `);
    return;
  }
  
  if (method === 'GET' && path === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    }));
    return;
  }
  
  if (method === 'GET' && path === '/api/info') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      method,
      path,
      query,
      headers: {
        host: headers.host,
        'user-agent': headers['user-agent']
      }
    }, null, 2));
    return;
  }
  
  if (method === 'GET' && path === '/api/cursos') {
    const cursos = [
      { id: 1, titulo: 'JavaScript Básico', nivel: 'basico', vistas: 1500 },
      { id: 2, titulo: 'Node.js Intermedio', nivel: 'intermedio', vistas: 980 },
      { id: 3, titulo: 'Express Avanzado', nivel: 'avanzado', vistas: 750 }
    ];
    
    let resultado = cursos;
    
    if (query.nivel) {
      resultado = cursos.filter(c => c.nivel === query.nivel);
    }
    
    if (query.orden === 'vistas') {
      resultado = [...resultado].sort((a, b) => b.vistas - a.vistas);
    }
    
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(resultado, null, 2));
    return;
  }
  
  // 404
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Ruta no encontrada', path, method }));
});

server.listen(PORT, () => {
  console.log(`\nServidor ejecutándose en http://localhost:${PORT}`);
  console.log('Usa Ctrl+C para detener el servidor\n');
});
