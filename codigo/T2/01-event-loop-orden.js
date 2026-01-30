/**
 * T2 - Ejercicio 1: Orden de ejecución del Event Loop
 * 
 * Este ejemplo demuestra el orden de ejecución de las diferentes
 * colas del Event Loop en Node.js.
 * 
 * Ejecutar con: node 01-event-loop-orden.js
 */

console.log('=== Inicio del programa ===\n');

// 1. Código síncrono (se ejecuta primero)
console.log('1. [SYNC] Código síncrono - Primera línea');

// 2. setTimeout con 0ms (va a la cola de timers - macrotask)
setTimeout(() => {
  console.log('5. [TIMER] setTimeout con 0ms');
}, 0);

// 3. setImmediate (va a la cola check - macrotask)
setImmediate(() => {
  console.log('6. [CHECK] setImmediate');
});

// 4. Promise.resolve().then() (va a la cola de microtasks)
Promise.resolve().then(() => {
  console.log('3. [MICROTASK] Promise.then()');
});

// 5. queueMicrotask (va a la cola de microtasks)
queueMicrotask(() => {
  console.log('4. [MICROTASK] queueMicrotask()');
});

// 6. process.nextTick (prioridad máxima, antes de cualquier otra cola async)
process.nextTick(() => {
  console.log('2. [NEXTTICK] process.nextTick()');
});

// 7. Más código síncrono
console.log('1b. [SYNC] Código síncrono - Segunda línea');

console.log('\n=== Fin del código síncrono ===');
console.log('(Ahora se procesan las colas asíncronas...)\n');

/*
 * ORDEN DE EJECUCIÓN ESPERADO:
 * 
 * 1.  [SYNC] Código síncrono - Primera línea
 * 1b. [SYNC] Código síncrono - Segunda línea
 * 2.  [NEXTTICK] process.nextTick()     ← Máxima prioridad async
 * 3.  [MICROTASK] Promise.then()        ← Microtasks
 * 4.  [MICROTASK] queueMicrotask()      ← Microtasks
 * 5.  [TIMER] setTimeout con 0ms        ← Fase timers
 * 6.  [CHECK] setImmediate              ← Fase check
 * 
 * NOTA: El orden entre setTimeout(0) y setImmediate puede variar
 * si se ejecutan en el contexto principal (no dentro de I/O callback)
 */
