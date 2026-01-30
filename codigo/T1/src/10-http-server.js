/**
 * Tema 1 - Ejemplo 10: Servidor HTTP Nativo
 *
 * Servidor HTTP básico sin frameworks.
 * Ejecutar: node src/10-http-server.js
 * O con watch: node --watch src/10-http-server.js
 */

import http from 'node:http';

const PORT = process.env.PORT || 3000;

// Crear el servidor HTTP
const server = http.createServer((req, res) => {
  const { method, url } = req;

  // Log de la petición
  console.log(`[${new Date().toISOString()}] ${method} ${url}`);

  // Configurar headers comunes
  res.setHeader('Content-Type', 'application/json');

  // Router básico
  if (method === 'GET' && url === '/') {
    // Ruta raíz
    res.writeHead(200);
    res.end(JSON.stringify({
      mensaje: 'Bienvenido a la API',
      version: '1.0.0',
      endpoints: [
        'GET /',
        'GET /fecha',
        'GET /aleatorio',
        'GET /info',
        'POST /echo'
      ]
    }));
  }

  else if (method === 'GET' && url === '/fecha') {
    // Fecha actual
    const ahora = new Date();
    res.writeHead(200);
    res.end(JSON.stringify({
      fecha: ahora.toISOString(),
      timestamp: ahora.getTime(),
      local: ahora.toLocaleString('es-ES')
    }));
  }

  else if (method === 'GET' && url === '/aleatorio') {
    // Número aleatorio
    const numero = Math.floor(Math.random() * 100) + 1;
    res.writeHead(200);
    res.end(JSON.stringify({
      numero,
      rango: '1-100'
    }));
  }

  else if (method === 'GET' && url === '/info') {
    // Información del servidor
    res.writeHead(200);
    res.end(JSON.stringify({
      node: process.version,
      plataforma: process.platform,
      memoria: {
        usada: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`,
        total: `${(process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2)} MB`
      },
      uptime: `${process.uptime().toFixed(2)} segundos`
    }));
  }

  else if (method === 'POST' && url === '/echo') {
    // Echo - devuelve el body recibido
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        res.writeHead(200);
        res.end(JSON.stringify({
          mensaje: 'Echo de tu petición',
          recibido: data,
          timestamp: new Date().toISOString()
        }));
      } catch (error) {
        res.writeHead(400);
        res.end(JSON.stringify({
          error: true,
          mensaje: 'JSON inválido',
          detalle: error.message
        }));
      }
    });
  }

  else if (method === 'GET' && url.startsWith('/saludar/')) {
    // Ruta con parámetro: /saludar/:nombre
    const nombre = decodeURIComponent(url.split('/')[2] || 'Mundo');
    res.writeHead(200);
    res.end(JSON.stringify({
      saludo: `¡Hola, ${nombre}!`,
      hora: new Date().toLocaleTimeString('es-ES')
    }));
  }

  else {
    // 404 - Ruta no encontrada
    res.writeHead(404);
    res.end(JSON.stringify({
      error: true,
      mensaje: 'Ruta no encontrada',
      ruta: `${method} ${url}`
    }));
  }
});

// Manejar errores del servidor
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Error: El puerto ${PORT} ya está en uso`);
  } else {
    console.error('Error del servidor:', error);
  }
  process.exit(1);
});

// Iniciar el servidor
server.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log('🚀 Servidor HTTP Nativo');
  console.log('='.repeat(50));
  console.log(`📡 Escuchando en: http://localhost:${PORT}`);
  console.log('');
  console.log('Endpoints disponibles:');
  console.log(`  GET  http://localhost:${PORT}/`);
  console.log(`  GET  http://localhost:${PORT}/fecha`);
  console.log(`  GET  http://localhost:${PORT}/aleatorio`);
  console.log(`  GET  http://localhost:${PORT}/info`);
  console.log(`  GET  http://localhost:${PORT}/saludar/TuNombre`);
  console.log(`  POST http://localhost:${PORT}/echo`);
  console.log('');
  console.log('Presiona Ctrl+C para detener');
  console.log('='.repeat(50));
});

// Manejo de cierre graceful
process.on('SIGINT', () => {
  console.log('\n\nCerrando servidor...');
  server.close(() => {
    console.log('Servidor cerrado');
    process.exit(0);
  });
});
