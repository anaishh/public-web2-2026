/**
 * T3 Ejercicio: URL Shortener Nativo
 *
 * Conceptos aplicados:
 * - node:http sin frameworks
 * - Routing manual
 * - Parsing de JSON body
 * - Redirecciones HTTP
 * - Query params y path params
 */

import http from 'node:http';
import { URL } from 'node:url';
import crypto from 'node:crypto';

const PORT = process.env.PORT || 3000;
const BASE_URL = `http://localhost:${PORT}`;
const MAX_URLS = 100; // BONUS: Límite de URLs

// Almacenamiento en memoria
const urls = new Map();

// ========================================
// Utilidades
// ========================================

/**
 * Genera un código corto único
 */
function generateCode(length = 6) {
  return crypto.randomBytes(length).toString('base64url').slice(0, length);
}

/**
 * Valida si una URL es válida
 */
function isValidUrl(urlString) {
  try {
    const url = new URL(urlString);
    return ['http:', 'https:'].includes(url.protocol);
  } catch {
    return false;
  }
}

/**
 * Parsea el body JSON de una request
 */
async function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
      // Limitar tamaño del body (protección DoS)
      if (body.length > 10000) {
        reject(new Error('Body too large'));
      }
    });

    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(new Error('Invalid JSON'));
      }
    });

    req.on('error', reject);
  });
}

/**
 * Envía respuesta JSON
 */
function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

/**
 * Envía error
 */
function sendError(res, statusCode, message) {
  sendJson(res, statusCode, { error: true, message });
}

/**
 * BONUS: Limpia URLs expiradas (24h)
 */
function cleanExpiredUrls() {
  const now = Date.now();
  const expirationTime = 24 * 60 * 60 * 1000; // 24 horas

  for (const [code, data] of urls.entries()) {
    if (now - new Date(data.createdAt).getTime() > expirationTime) {
      urls.delete(code);
      console.log(`🗑️ URL expirada eliminada: ${code}`);
    }
  }
}

// Limpiar cada hora
setInterval(cleanExpiredUrls, 60 * 60 * 1000);

// ========================================
// Handlers de rutas
// ========================================

/**
 * POST /shorten - Crea URL corta
 */
async function handleShorten(req, res) {
  try {
    const { url } = await parseJsonBody(req);

    if (!url) {
      return sendError(res, 400, 'URL es requerida');
    }

    if (!isValidUrl(url)) {
      return sendError(res, 400, 'URL no válida. Debe empezar con http:// o https://');
    }

    // BONUS: Limitar cantidad de URLs (FIFO)
    if (urls.size >= MAX_URLS) {
      const oldestKey = urls.keys().next().value;
      urls.delete(oldestKey);
      console.log(`🗑️ Límite alcanzado, eliminada URL más antigua: ${oldestKey}`);
    }

    // Generar código único
    let code;
    do {
      code = generateCode();
    } while (urls.has(code));

    const urlData = {
      originalUrl: url,
      createdAt: new Date().toISOString(),
      visits: 0,
      lastVisit: null
    };

    urls.set(code, urlData);

    console.log(`✅ URL creada: ${code} -> ${url}`);

    sendJson(res, 201, {
      code,
      shortUrl: `${BASE_URL}/${code}`,
      originalUrl: url,
      createdAt: urlData.createdAt
    });

  } catch (error) {
    sendError(res, 400, error.message);
  }
}

/**
 * GET /:code - Redirige a URL original
 */
function handleRedirect(res, code) {
  const urlData = urls.get(code);

  if (!urlData) {
    sendError(res, 404, 'URL no encontrada');
    return;
  }

  // Actualizar estadísticas
  urlData.visits++;
  urlData.lastVisit = new Date().toISOString();

  console.log(`🔗 Redirect: ${code} -> ${urlData.originalUrl} (visita #${urlData.visits})`);

  // Redirección 302 (temporal)
  res.writeHead(302, { Location: urlData.originalUrl });
  res.end();
}

/**
 * GET /stats/:code - Estadísticas de URL
 */
function handleStats(res, code) {
  const urlData = urls.get(code);

  if (!urlData) {
    sendError(res, 404, 'URL no encontrada');
    return;
  }

  sendJson(res, 200, {
    code,
    shortUrl: `${BASE_URL}/${code}`,
    ...urlData
  });
}

/**
 * GET /api/urls - Lista todas las URLs
 */
function handleListUrls(res) {
  const urlList = Array.from(urls.entries()).map(([code, data]) => ({
    code,
    shortUrl: `${BASE_URL}/${code}`,
    ...data
  }));

  sendJson(res, 200, {
    count: urlList.length,
    maxUrls: MAX_URLS,
    data: urlList
  });
}

/**
 * DELETE /api/urls/:code - Elimina URL
 */
function handleDeleteUrl(res, code) {
  if (!urls.has(code)) {
    sendError(res, 404, 'URL no encontrada');
    return;
  }

  const deleted = urls.get(code);
  urls.delete(code);

  console.log(`🗑️ URL eliminada: ${code}`);

  sendJson(res, 200, {
    message: 'URL eliminada',
    deleted: { code, ...deleted }
  });
}

// ========================================
// Router principal
// ========================================

const server = http.createServer(async (req, res) => {
  const { method, url } = req;
  const parsedUrl = new URL(url, BASE_URL);
  const pathname = parsedUrl.pathname;

  console.log(`📨 ${method} ${pathname}`);

  // CORS headers (para testing desde navegador)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  try {
    // POST /shorten
    if (method === 'POST' && pathname === '/shorten') {
      await handleShorten(req, res);
      return;
    }

    // GET /api/urls
    if (method === 'GET' && pathname === '/api/urls') {
      handleListUrls(res);
      return;
    }

    // DELETE /api/urls/:code
    if (method === 'DELETE' && pathname.startsWith('/api/urls/')) {
      const code = pathname.split('/')[3];
      handleDeleteUrl(res, code);
      return;
    }

    // GET /stats/:code
    if (method === 'GET' && pathname.startsWith('/stats/')) {
      const code = pathname.split('/')[2];
      handleStats(res, code);
      return;
    }

    // GET /:code (redirect)
    if (method === 'GET' && pathname.length > 1 && !pathname.includes('/api')) {
      const code = pathname.slice(1); // Quitar el /
      handleRedirect(res, code);
      return;
    }

    // GET / (home)
    if (method === 'GET' && pathname === '/') {
      sendJson(res, 200, {
        name: 'URL Shortener API',
        version: '1.0.0',
        endpoints: {
          'POST /shorten': 'Crear URL corta',
          'GET /:code': 'Redirigir a URL original',
          'GET /stats/:code': 'Ver estadísticas',
          'GET /api/urls': 'Listar todas',
          'DELETE /api/urls/:code': 'Eliminar URL'
        }
      });
      return;
    }

    // 404
    sendError(res, 404, 'Ruta no encontrada');

  } catch (error) {
    console.error('Error:', error);
    sendError(res, 500, 'Error interno del servidor');
  }
});

// ========================================
// Iniciar servidor
// ========================================

server.listen(PORT, () => {
  console.log('═'.repeat(50));
  console.log('🔗 URL Shortener - HTTP Nativo (sin Express)');
  console.log('═'.repeat(50));
  console.log(`📡 Servidor en: ${BASE_URL}`);
  console.log(`📊 Límite: ${MAX_URLS} URLs`);
  console.log('');
  console.log('Endpoints:');
  console.log('  POST   /shorten         - Crear URL corta');
  console.log('  GET    /:code           - Redirigir');
  console.log('  GET    /stats/:code     - Estadísticas');
  console.log('  GET    /api/urls        - Listar todas');
  console.log('  DELETE /api/urls/:code  - Eliminar');
  console.log('═'.repeat(50));
});
