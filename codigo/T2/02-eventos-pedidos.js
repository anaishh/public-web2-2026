/**
 * T2 - Ejercicio 2: Sistema de pedidos con EventEmitter
 * 
 * Implementa un sistema de pedidos usando EventEmitter con:
 * - Evento 'pedido-recibido' 
 * - Evento 'pedido-procesado'
 * - Uso de events.once() con timeout
 * 
 * Ejecutar con: node 02-eventos-pedidos.js
 */

import { EventEmitter, once } from 'node:events';
import { setTimeout as delay } from 'node:timers/promises';

// Sistema de pedidos
class SistemaPedidos extends EventEmitter {
  constructor() {
    super();
    this.pedidos = new Map();
    this.contadorId = 0;
  }

  async procesarPedido(producto, cantidad) {
    const id = ++this.contadorId;
    const pedido = { id, producto, cantidad, estado: 'recibido', timestamp: Date.now() };
    
    this.pedidos.set(id, pedido);
    this.emit('pedido-recibido', pedido);

    // Simular procesamiento (1-3 segundos)
    const tiempoProcesamiento = 1000 + Math.random() * 2000;
    await delay(tiempoProcesamiento);

    pedido.estado = 'procesado';
    pedido.tiempoProcesamiento = tiempoProcesamiento;
    this.emit('pedido-procesado', pedido);

    return pedido;
  }
}

// === EJEMPLO 1: Uso básico con .on() ===
console.log('=== Ejemplo 1: Listeners con .on() ===\n');

const sistema = new SistemaPedidos();

// Registrar listeners permanentes
sistema.on('pedido-recibido', (pedido) => {
  console.log(`📦 Pedido #${pedido.id} recibido: ${pedido.cantidad}x ${pedido.producto}`);
});

sistema.on('pedido-procesado', (pedido) => {
  console.log(`✅ Pedido #${pedido.id} procesado en ${pedido.tiempoProcesamiento.toFixed(0)}ms`);
});

// Procesar algunos pedidos
await sistema.procesarPedido('Laptop', 2);
await sistema.procesarPedido('Monitor', 1);

console.log('\n=== Ejemplo 2: Usando events.once() con timeout ===\n');

// === EJEMPLO 2: Esperar evento con timeout usando once() ===
const sistema2 = new SistemaPedidos();

async function esperarPedidoProcesado(timeoutMs = 5000) {
  console.log(`⏳ Esperando que se procese un pedido (timeout: ${timeoutMs}ms)...`);
  
  try {
    // once() convierte el evento en una Promise
    const [pedido] = await once(sistema2, 'pedido-procesado', {
      signal: AbortSignal.timeout(timeoutMs)
    });
    
    console.log(`🎉 Pedido procesado exitosamente:`, pedido);
    return pedido;
  } catch (err) {
    if (err.name === 'TimeoutError') {
      console.log('⏰ Timeout: El pedido tardó demasiado en procesarse');
    } else if (err.name === 'AbortError') {
      console.log('🚫 Operación cancelada');
    } else {
      throw err;
    }
    return null;
  }
}

// Iniciar espera y procesamiento en paralelo
const esperaPromise = esperarPedidoProcesado(5000);
sistema2.procesarPedido('Teclado', 3);
await esperaPromise;

console.log('\n=== Ejemplo 3: Timeout que expira ===\n');

// Ejemplo donde el timeout expira
const sistema3 = new SistemaPedidos();

// Timeout muy corto (100ms) que expirará
const esperaCorta = esperarPedidoProcesado.call({ sistema: sistema3 }, 100);

// Simular procesamiento lento (modificamos el método temporalmente)
const procesarLento = async () => {
  await delay(2000); // 2 segundos
  sistema3.emit('pedido-procesado', { id: 999, producto: 'Test', estado: 'procesado' });
};

// El timeout de 100ms expirará antes de que se emita el evento
const sistema3Listener = async () => {
  try {
    const [pedido] = await once(sistema3, 'pedido-procesado', {
      signal: AbortSignal.timeout(100)
    });
    console.log('Pedido recibido:', pedido);
  } catch (err) {
    if (err.name === 'TimeoutError') {
      console.log('⏰ Timeout de 100ms expirado (el pedido tardó más)');
    }
  }
};

await Promise.all([sistema3Listener(), procesarLento()]);

console.log('\n=== Fin de los ejemplos ===');
