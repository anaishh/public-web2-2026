/**
 * T2 - Ejercicio 5: AsyncLocalStorage para contexto en peticiones
 * 
 * Implementa un sistema de logging que automáticamente incluye
 * el requestId en todos los logs, sin pasarlo explícitamente.
 * 
 * Ejecutar con: node 05-async-local-storage.js
 */

import { AsyncLocalStorage } from 'node:async_hooks';
import { randomUUID } from 'node:crypto';
import { setTimeout as delay } from 'node:timers/promises';

// Crear el storage para el contexto de la request
const requestContext = new AsyncLocalStorage();

// === Logger que usa el contexto automáticamente ===
const logger = {
  _format(nivel, mensaje) {
    const store = requestContext.getStore();
    const requestId = store?.requestId ?? 'NO-CONTEXT';
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${requestId}] [${nivel}] ${mensaje}`;
  },
  
  info(mensaje) {
    console.log(this._format('INFO', mensaje));
  },
  
  debug(mensaje) {
    console.log(this._format('DEBUG', mensaje));
  },
  
  error(mensaje) {
    console.error(this._format('ERROR', mensaje));
  },
  
  // Obtener métricas del request actual
  getRequestDuration() {
    const store = requestContext.getStore();
    if (!store?.startTime) return null;
    return Date.now() - store.startTime;
  }
};

// === Simulación de servicios que usan el logger ===

async function getUserFromDatabase(userId) {
  logger.debug(`Consultando usuario ${userId} en base de datos`);
  await delay(100 + Math.random() * 200); // Simular latencia DB
  logger.debug(`Usuario ${userId} encontrado`);
  return { id: userId, nombre: `Usuario_${userId}`, email: `user${userId}@example.com` };
}

async function getOrdersFromDatabase(userId) {
  logger.debug(`Consultando pedidos del usuario ${userId}`);
  await delay(150 + Math.random() * 150);
  const orders = [
    { id: 1, producto: 'Laptop', total: 1200 },
    { id: 2, producto: 'Mouse', total: 25 }
  ];
  logger.debug(`Encontrados ${orders.length} pedidos`);
  return orders;
}

async function sendNotification(userId, mensaje) {
  logger.debug(`Enviando notificación a usuario ${userId}`);
  await delay(50);
  logger.info(`Notificación enviada: "${mensaje}"`);
}

// === Handler de la petición ===

async function handleUserRequest(userId) {
  logger.info(`Procesando petición para usuario ${userId}`);
  
  try {
    // Todas estas funciones usarán el mismo requestId automáticamente
    const user = await getUserFromDatabase(userId);
    const orders = await getOrdersFromDatabase(userId);
    
    // Operación en paralelo
    await Promise.all([
      sendNotification(userId, 'Tu perfil fue consultado'),
      delay(50).then(() => logger.debug('Tarea paralela completada'))
    ]);
    
    const duration = logger.getRequestDuration();
    logger.info(`Petición completada en ${duration}ms`);
    
    return { user, orders, processedIn: duration };
  } catch (err) {
    logger.error(`Error procesando petición: ${err.message}`);
    throw err;
  }
}

// === Middleware que establece el contexto ===

function withRequestContext(handler) {
  return async (...args) => {
    const context = {
      requestId: randomUUID().split('-')[0], // ID corto para legibilidad
      startTime: Date.now(),
      metadata: {}
    };
    
    // Ejecutar el handler dentro del contexto
    return requestContext.run(context, () => handler(...args));
  };
}

// === Demostración ===

console.log('=== AsyncLocalStorage: Contexto automático en requests ===\n');

// Sin contexto (para comparar)
console.log('--- Log SIN contexto ---');
logger.info('Este log no tiene requestId');

console.log('\n--- Peticiones CON contexto ---\n');

// Crear handler envuelto con contexto
const handleRequest = withRequestContext(handleUserRequest);

// Simular múltiples peticiones concurrentes
const peticiones = Promise.all([
  handleRequest(1),
  handleRequest(2),
  handleRequest(3)
]);

// Esperar a que todas terminen
const resultados = await peticiones;

console.log('\n=== Resultados finales ===');
resultados.forEach((r, i) => {
  console.log(`\nPetición ${i + 1}:`);
  console.log(`  Usuario: ${r.user.nombre}`);
  console.log(`  Pedidos: ${r.orders.length}`);
  console.log(`  Tiempo: ${r.processedIn}ms`);
});

// === Ejemplo adicional: Añadir metadata al contexto ===
console.log('\n\n=== Ejemplo: Modificar contexto durante la ejecución ===\n');

async function handleWithMetadata(userId) {
  const store = requestContext.getStore();
  
  // Añadir información al contexto
  store.metadata.userId = userId;
  store.metadata.action = 'profile-view';
  
  logger.info(`Inicio - Metadata: ${JSON.stringify(store.metadata)}`);
  
  await delay(100);
  
  // La metadata persiste a través de las llamadas async
  store.metadata.step = 'completed';
  logger.info(`Fin - Metadata: ${JSON.stringify(store.metadata)}`);
}

await withRequestContext(handleWithMetadata)(42);

console.log('\n=== Fin del ejemplo de AsyncLocalStorage ===');

/*
 * CASOS DE USO DE AsyncLocalStorage:
 * 
 * 1. Request ID / Correlation ID para tracing
 * 2. Usuario autenticado disponible en toda la request
 * 3. Transacciones de base de datos
 * 4. Configuración de tenant en apps multi-tenant
 * 5. Locale/idioma para internacionalización
 * 6. Feature flags por request
 */
