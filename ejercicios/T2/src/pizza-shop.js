/**
 * T2 Ejercicio: Pizza Express - Sistema de Pedidos
 *
 * Conceptos aplicados:
 * - EventEmitter
 * - Promises y async/await
 * - Promise.allSettled()
 * - Simulación de tiempos asíncronos
 * - Manejo de errores en async
 */

import { EventEmitter } from 'node:events';

// Utilidad para delay aleatorio
const randomDelay = (min, max) => {
  const ms = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Utilidad para generar IDs
const generateId = () => `ORD-${Date.now().toString(36).toUpperCase()}`;

/**
 * Clase PizzaShop - Gestiona pedidos de pizza
 */
class PizzaShop extends EventEmitter {
  constructor(options = {}) {
    super();
    this.orders = new Map();
    this.stats = {
      received: 0,
      completed: 0,
      failed: 0,
      totalTime: 0
    };
    this.failureRate = options.failureRate || 0.1; // 10% de fallos
    this.isOpen = true;

    // BONUS: Emitir estadísticas cada 5 segundos
    if (options.enableStats) {
      this.statsInterval = setInterval(() => {
        this.emit('shop:stats', this.getStats());
      }, 5000);
    }
  }

  /**
   * Crea un nuevo pedido
   */
  async order(pizza, customer, priority = 'normal') {
    const order = {
      id: generateId(),
      pizza,
      customer,
      priority,
      status: 'pending',
      timestamps: {
        received: new Date()
      }
    };

    this.orders.set(order.id, order);
    this.stats.received++;

    this.emit('order:received', {
      id: order.id,
      pizza,
      customer,
      priority
    });

    try {
      await this.processOrder(order);
      return order;
    } catch (error) {
      order.status = 'failed';
      order.error = error.message;
      this.stats.failed++;
      throw error;
    }
  }

  /**
   * Procesa un pedido a través de todas las etapas
   */
  async processOrder(order) {
    // Fase 1: Preparación
    order.status = 'preparing';
    order.timestamps.preparing = new Date();
    this.emit('order:preparing', { id: order.id, pizza: order.pizza });

    await randomDelay(1000, 3000);

    // Simular fallo aleatorio
    if (Math.random() < this.failureRate) {
      const error = new Error(`¡Se cayó la pizza ${order.pizza}!`);
      this.emit('order:failed', { id: order.id, error: error.message });
      throw error;
    }

    // Fase 2: Horneado
    order.status = 'baking';
    order.timestamps.baking = new Date();
    this.emit('order:baking', { id: order.id, pizza: order.pizza });

    await randomDelay(2000, 4000);

    // Otro punto de posible fallo
    if (Math.random() < this.failureRate / 2) {
      const error = new Error(`¡Se quemó la pizza ${order.pizza}!`);
      this.emit('order:failed', { id: order.id, error: error.message });
      throw error;
    }

    // Fase 3: Lista
    order.status = 'ready';
    order.timestamps.ready = new Date();

    const totalTime = order.timestamps.ready - order.timestamps.received;
    this.stats.completed++;
    this.stats.totalTime += totalTime;

    this.emit('order:ready', {
      id: order.id,
      pizza: order.pizza,
      customer: order.customer,
      totalTime: `${(totalTime / 1000).toFixed(1)}s`
    });

    return order;
  }

  /**
   * Procesa múltiples pedidos en paralelo
   */
  async processMultipleOrders(orders) {
    console.log(`\n🍕 Procesando ${orders.length} pedidos en paralelo...\n`);

    const promises = orders.map(({ pizza, customer, priority }) =>
      this.order(pizza, customer, priority)
    );

    // Promise.allSettled: no falla si uno falla
    const results = await Promise.allSettled(promises);

    const summary = {
      total: results.length,
      fulfilled: results.filter(r => r.status === 'fulfilled').length,
      rejected: results.filter(r => r.status === 'rejected').length,
      orders: results.map(r =>
        r.status === 'fulfilled'
          ? { status: 'success', order: r.value }
          : { status: 'failed', reason: r.reason.message }
      )
    };

    return summary;
  }

  /**
   * Obtiene estadísticas
   */
  getStats() {
    const avgTime = this.stats.completed > 0
      ? (this.stats.totalTime / this.stats.completed / 1000).toFixed(1)
      : 0;

    return {
      received: this.stats.received,
      completed: this.stats.completed,
      failed: this.stats.failed,
      successRate: this.stats.received > 0
        ? ((this.stats.completed / this.stats.received) * 100).toFixed(1) + '%'
        : '0%',
      averageTime: `${avgTime}s`,
      activeOrders: [...this.orders.values()].filter(
        o => !['ready', 'failed'].includes(o.status)
      ).length
    };
  }

  /**
   * Cierra la tienda
   */
  close() {
    this.isOpen = false;
    if (this.statsInterval) {
      clearInterval(this.statsInterval);
    }
    this.emit('shop:closed', this.getStats());
  }
}

// ========================================
// Demo
// ========================================

async function demo() {
  console.log('═'.repeat(50));
  console.log('🍕 PIZZA EXPRESS - Sistema de Pedidos');
  console.log('═'.repeat(50));

  const shop = new PizzaShop({
    failureRate: 0.15,  // 15% de fallos para la demo
    enableStats: true
  });

  // Registrar listeners para todos los eventos
  shop.on('order:received', (data) => {
    console.log(`📥 [RECIBIDO] Pedido ${data.id}: ${data.pizza} para ${data.customer}`);
  });

  shop.on('order:preparing', (data) => {
    console.log(`👨‍🍳 [PREPARANDO] ${data.id}: Preparando ${data.pizza}...`);
  });

  shop.on('order:baking', (data) => {
    console.log(`🔥 [HORNEANDO] ${data.id}: ${data.pizza} en el horno...`);
  });

  shop.on('order:ready', (data) => {
    console.log(`✅ [LISTA] ${data.id}: ¡${data.pizza} lista para ${data.customer}! (${data.totalTime})`);
  });

  shop.on('order:failed', (data) => {
    console.log(`❌ [FALLO] ${data.id}: ${data.error}`);
  });

  shop.on('shop:stats', (stats) => {
    console.log(`\n📊 [STATS] Completados: ${stats.completed}, Fallidos: ${stats.failed}, Promedio: ${stats.averageTime}\n`);
  });

  // Crear pedidos de prueba
  const orders = [
    { pizza: 'Pepperoni', customer: 'Juan' },
    { pizza: 'Margarita', customer: 'María' },
    { pizza: 'Hawaiana', customer: 'Pedro' },
    { pizza: 'Cuatro Quesos', customer: 'Ana', priority: 'vip' },
    { pizza: 'Vegetariana', customer: 'Luis' },
    { pizza: 'BBQ Chicken', customer: 'Carmen' }
  ];

  // Procesar todos en paralelo
  const results = await shop.processMultipleOrders(orders);

  console.log('\n' + '═'.repeat(50));
  console.log('📋 RESUMEN FINAL');
  console.log('═'.repeat(50));
  console.log(`   Total pedidos:    ${results.total}`);
  console.log(`   ✅ Completados:   ${results.fulfilled}`);
  console.log(`   ❌ Fallidos:      ${results.rejected}`);
  console.log('');

  // Estadísticas finales
  const finalStats = shop.getStats();
  console.log('📊 ESTADÍSTICAS:');
  console.log(`   Tasa de éxito:    ${finalStats.successRate}`);
  console.log(`   Tiempo promedio:  ${finalStats.averageTime}`);
  console.log('');

  // Cerrar tienda
  shop.close();
  console.log('🚪 Pizza Express cerrada. ¡Hasta mañana!\n');
}

// Ejecutar demo
demo().catch(console.error);
