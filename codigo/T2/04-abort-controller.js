/**
 * T2 - Ejercicio 4: AbortController y cancelación de operaciones
 * 
 * Implementa diferentes patrones de cancelación usando AbortController:
 * - Timeout automático con AbortSignal.timeout()
 * - Cancelación manual
 * - Combinación de señales con AbortSignal.any()
 * 
 * Ejecutar con: node 04-abort-controller.js
 */

import { setTimeout as delay } from 'node:timers/promises';

// === EJEMPLO 1: fetch con timeout usando AbortSignal.timeout() ===
console.log('=== Ejemplo 1: Timeout automático ===\n');

async function fetchConTimeout(url, timeoutMs) {
  console.log(`Fetching ${url} con timeout de ${timeoutMs}ms...`);
  
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(timeoutMs)
    });
    
    const data = await response.json();
    console.log(`✅ Respuesta recibida:`, data.length ? `${data.length} items` : data);
    return data;
  } catch (err) {
    if (err.name === 'TimeoutError') {
      console.log(`⏰ Timeout: La petición excedió ${timeoutMs}ms`);
    } else if (err.name === 'AbortError') {
      console.log('🚫 Petición cancelada');
    } else {
      console.log(`❌ Error: ${err.message}`);
    }
    return null;
  }
}

// Probar con API real (JSONPlaceholder)
await fetchConTimeout('https://jsonplaceholder.typicode.com/posts', 5000);

// === EJEMPLO 2: Cancelación manual ===
console.log('\n=== Ejemplo 2: Cancelación manual ===\n');

async function operacionLarga(signal) {
  console.log('Iniciando operación larga...');
  
  for (let i = 1; i <= 10; i++) {
    // Verificar si fue cancelada
    if (signal.aborted) {
      console.log(`🚫 Operación cancelada en paso ${i}`);
      throw new Error('Operación cancelada por el usuario');
    }
    
    console.log(`  Paso ${i}/10...`);
    await delay(500, null, { signal }).catch(() => {});
    
    // Re-verificar después del delay
    if (signal.aborted) {
      console.log(`🚫 Operación cancelada después del paso ${i}`);
      throw new Error('Operación cancelada por el usuario');
    }
  }
  
  console.log('✅ Operación completada');
  return 'resultado final';
}

const controller = new AbortController();

// Cancelar después de 2 segundos
setTimeout(() => {
  console.log('\n⚡ Usuario solicita cancelación...');
  controller.abort();
}, 2000);

try {
  const resultado = await operacionLarga(controller.signal);
  console.log('Resultado:', resultado);
} catch (err) {
  console.log('Capturado:', err.message);
}

// === EJEMPLO 3: AbortSignal.any() - Combinar múltiples señales ===
console.log('\n=== Ejemplo 3: Combinar señales con AbortSignal.any() ===\n');

async function operacionConMultiplesCancelaciones() {
  // Controlador para cancelación del usuario
  const userController = new AbortController();
  
  // Timeout de 10 segundos
  const timeoutSignal = AbortSignal.timeout(10000);
  
  // Combinar ambas señales
  const combinedSignal = AbortSignal.any([
    userController.signal,
    timeoutSignal
  ]);
  
  console.log('Operación iniciada. Se cancelará si:');
  console.log('  - El usuario lo solicita (simulado en 1.5s)');
  console.log('  - Pasan 10 segundos (timeout)');
  
  // Simular que el usuario cancela en 1.5 segundos
  setTimeout(() => {
    console.log('\n⚡ Usuario cancela la operación...');
    userController.abort(new Error('Cancelado por el usuario'));
  }, 1500);
  
  try {
    // Operación que tarda 5 segundos
    await delay(5000, 'completado', { signal: combinedSignal });
    console.log('✅ Operación completada');
  } catch (err) {
    if (err.name === 'AbortError') {
      // Obtener la razón específica
      const reason = combinedSignal.reason;
      console.log(`🚫 Cancelado: ${reason?.message || 'Sin razón específica'}`);
    }
  }
}

await operacionConMultiplesCancelaciones();

// === EJEMPLO 4: Patrón de limpieza con eventos ===
console.log('\n=== Ejemplo 4: Escuchar evento de abort ===\n');

function operacionConLimpieza(signal) {
  return new Promise((resolve, reject) => {
    let recurso = { activo: true, id: Math.random().toString(36).substr(2, 9) };
    console.log(`Recurso ${recurso.id} adquirido`);
    
    // Registrar listener para limpieza
    const limpiar = () => {
      if (recurso.activo) {
        console.log(`🧹 Limpiando recurso ${recurso.id}...`);
        recurso.activo = false;
        recurso = null;
      }
      reject(new DOMException('Operación abortada', 'AbortError'));
    };
    
    signal.addEventListener('abort', limpiar, { once: true });
    
    // Simular operación
    setTimeout(() => {
      if (!signal.aborted) {
        signal.removeEventListener('abort', limpiar);
        console.log(`✅ Operación completada con recurso ${recurso.id}`);
        resolve('éxito');
      }
    }, 2000);
  });
}

const controller2 = new AbortController();

// Cancelar en 1 segundo
setTimeout(() => controller2.abort(), 1000);

try {
  await operacionConLimpieza(controller2.signal);
} catch (err) {
  console.log(`Capturado: ${err.name}`);
}

console.log('\n=== Fin de los ejemplos de AbortController ===');
