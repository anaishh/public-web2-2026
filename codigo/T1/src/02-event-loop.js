/**
 * Tema 1 - Ejemplo 02: Event Loop Básico
 *
 * Demuestra el orden de ejecución en el Event Loop.
 * Ejecutar: node src/02-event-loop.js
 */

console.log('=== Orden de Ejecución en el Event Loop ===\n');

// 1. Código síncrono (se ejecuta primero)
console.log('1. [SYNC] Inicio del script');

// 2. setTimeout - Macrotask (se encola para después)
setTimeout(() => {
  console.log('5. [MACRO] setTimeout con 0ms');
}, 0);

// 3. setImmediate - Check phase (después de I/O)
setImmediate(() => {
  console.log('6. [IMMEDIATE] setImmediate');
});

// 4. Promise - Microtask (prioridad sobre macrotasks)
Promise.resolve().then(() => {
  console.log('3. [MICRO] Promise.resolve().then()');
});

// 5. process.nextTick - Máxima prioridad en microtasks
process.nextTick(() => {
  console.log('2. [NEXTTICK] process.nextTick()');
});

// 6. Otra Promise
Promise.resolve().then(() => {
  console.log('4. [MICRO] Segunda Promise');
});

// 7. Más código síncrono
console.log('1b. [SYNC] Fin del código síncrono');

console.log('\n--- Orden esperado: ---');
console.log('1. SYNC → 2. nextTick → 3-4. Promises → 5. setTimeout → 6. setImmediate\n');
