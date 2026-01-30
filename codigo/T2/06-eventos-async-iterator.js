/**
 * T2 - Ejercicio 6: Iterador asíncrono de eventos con events.on()
 * 
 * Crea un sistema que emita eventos y los procese como async iterator.
 * Demuestra el uso de events.on() y AbortController para control.
 * 
 * Ejecutar con: node 06-eventos-async-iterator.js
 */

import { EventEmitter, on } from 'node:events';

console.log('=== Async Iterators con EventEmitter ===\n');

// === EJEMPLO 1: Iterador básico con límite de eventos ===
console.log('--- Ejemplo 1: Procesar N eventos ---\n');

async function procesarNEventos(limite) {
  const emisor = new EventEmitter();
  const ac = new AbortController();
  
  // Emisor de datos (simula una fuente de datos)
  let contador = 0;
  const intervalo = setInterval(() => {
    contador++;
    const dato = {
      id: contador,
      valor: Math.random().toFixed(3),
      timestamp: Date.now()
    };
    
    console.log(`📤 Emitiendo dato #${contador}:`, dato.valor);
    emisor.emit('dato', dato);
    
    // Detener después de N eventos
    if (contador >= limite) {
      clearInterval(intervalo);
      // Pequeño delay antes de abortar para procesar el último
      setTimeout(() => ac.abort(), 100);
    }
  }, 500);
  
  // Consumir eventos como async iterator
  console.log(`\n📥 Procesando hasta ${limite} eventos...\n`);
  
  try {
    for await (const [dato] of on(emisor, 'dato', { signal: ac.signal })) {
      console.log(`   ✅ Procesado #${dato.id}: valor=${dato.valor}`);
    }
  } catch (err) {
    if (err.name === 'AbortError') {
      console.log('\n🏁 Iteración completada (abort signal)');
    } else {
      throw err;
    }
  }
  
  console.log(`\nTotal procesados: ${contador} eventos`);
}

await procesarNEventos(5);

// === EJEMPLO 2: Stream de datos con filtrado ===
console.log('\n\n--- Ejemplo 2: Filtrar eventos en el iterador ---\n');

async function streamConFiltro() {
  const emisor = new EventEmitter();
  const ac = new AbortController();
  
  // Emitir datos mezclados
  let count = 0;
  const intervalo = setInterval(() => {
    count++;
    const tipo = Math.random() > 0.5 ? 'importante' : 'normal';
    emisor.emit('mensaje', { id: count, tipo, contenido: `Mensaje ${count}` });
    
    if (count >= 10) {
      clearInterval(intervalo);
      setTimeout(() => ac.abort(), 100);
    }
  }, 300);
  
  console.log('Filtrando solo mensajes "importantes":\n');
  
  try {
    for await (const [mensaje] of on(emisor, 'mensaje', { signal: ac.signal })) {
      // Filtrar dentro del loop
      if (mensaje.tipo === 'importante') {
        console.log(`⭐ [IMPORTANTE] ${mensaje.contenido}`);
      } else {
        console.log(`   [normal] ${mensaje.contenido}`);
      }
    }
  } catch (err) {
    if (err.name !== 'AbortError') throw err;
  }
  
  console.log('\n🏁 Stream completado');
}

await streamConFiltro();

// === EJEMPLO 3: Múltiples consumidores ===
console.log('\n\n--- Ejemplo 3: Procesamiento con break ---\n');

async function procesarHastaCondicion() {
  const emisor = new EventEmitter();
  
  // Emitir números
  let num = 0;
  const intervalo = setInterval(() => {
    num++;
    emisor.emit('numero', num);
  }, 200);
  
  console.log('Esperando un número mayor a 7...\n');
  
  // Usar for await con break (sin AbortController)
  for await (const [numero] of on(emisor, 'numero')) {
    console.log(`Recibido: ${numero}`);
    
    if (numero > 7) {
      console.log(`\n✅ Encontrado número > 7: ${numero}`);
      clearInterval(intervalo);
      break; // Salir del loop
    }
  }
  
  console.log('Loop terminado con break');
}

await procesarHastaCondicion();

// === EJEMPLO 4: Transformar eventos a objetos ===
console.log('\n\n--- Ejemplo 4: Acumulador de eventos ---\n');

async function acumularEventos(duracionMs) {
  const emisor = new EventEmitter();
  const eventos = [];
  
  // Emitir eventos aleatorios
  const intervalo = setInterval(() => {
    const evento = {
      tipo: ['click', 'scroll', 'keypress'][Math.floor(Math.random() * 3)],
      timestamp: Date.now()
    };
    emisor.emit('evento', evento);
  }, 100);
  
  console.log(`Acumulando eventos durante ${duracionMs}ms...\n`);
  
  const startTime = Date.now();
  
  try {
    for await (const [evento] of on(emisor, 'evento', { 
      signal: AbortSignal.timeout(duracionMs) 
    })) {
      eventos.push(evento);
      process.stdout.write(`\rEventos acumulados: ${eventos.length}`);
    }
  } catch (err) {
    if (err.name !== 'TimeoutError') throw err;
  }
  
  clearInterval(intervalo);
  
  // Analizar eventos acumulados
  console.log('\n\n📊 Resumen de eventos:');
  const porTipo = eventos.reduce((acc, e) => {
    acc[e.tipo] = (acc[e.tipo] || 0) + 1;
    return acc;
  }, {});
  
  Object.entries(porTipo).forEach(([tipo, count]) => {
    console.log(`   ${tipo}: ${count}`);
  });
  
  console.log(`\nTotal: ${eventos.length} eventos en ${duracionMs}ms`);
  console.log(`Rate: ${(eventos.length / (duracionMs / 1000)).toFixed(1)} eventos/segundo`);
}

await acumularEventos(2000);

console.log('\n\n=== Fin de los ejemplos de Async Iterators ===');

/*
 * VENTAJAS DE events.on() CON ASYNC ITERATORS:
 * 
 * 1. Sintaxis limpia con for await...of
 * 2. Backpressure automático (el emisor espera al consumidor)
 * 3. Fácil integración con AbortController
 * 4. Manejo de errores con try/catch estándar
 * 5. Compatible con break/continue/return
 * 
 * CASOS DE USO:
 * - WebSocket messages
 * - Server-Sent Events
 * - File watchers
 * - Database change streams
 * - Message queues
 */
