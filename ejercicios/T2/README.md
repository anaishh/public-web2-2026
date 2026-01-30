# 🍕 Ejercicio T2: Pizza Express - Sistema de Pedidos

## La Cocina Asíncrona

Simula el sistema de gestión de pedidos de una pizzería usando EventEmitter, Promises y async/await.

**Nivel:** ⭐⭐ Intermedio | **Tiempo:** 25-30 min

## 📖 Historia

"Pizza Express" necesita un sistema que gestione el ciclo de vida de los pedidos: recepción → preparación → horneado → listo. Cada fase tiene tiempos aleatorios y el sistema debe manejar múltiples pedidos simultáneos sin bloquearse.

## 📋 Requisitos

### 1. Clase `PizzaShop` que extienda EventEmitter

Eventos a emitir:
- `order:received` - Cuando llega un pedido
- `order:preparing` - Cuando empieza a prepararse
- `order:baking` - Cuando entra al horno
- `order:ready` - Cuando está lista
- `order:failed` - Si algo falla

### 2. Cada pedido debe tener

```javascript
{
  id: 'ORD-001',
  pizza: 'Pepperoni',
  customer: 'Juan',
  status: 'pending',
  timestamps: {
    received: Date,
    preparing: Date,
    baking: Date,
    ready: Date
  }
}
```

### 3. Simular tiempos con delays aleatorios

- Preparación: 1-3 segundos
- Horneado: 2-4 segundos
- 10% de probabilidad de fallo aleatorio

### 4. Procesar múltiples pedidos en paralelo

Usar `Promise.allSettled()` para manejar éxitos y fallos.

## 🎯 Criterios de éxito

- [ ] EventEmitter correctamente extendido
- [ ] Todos los eventos se emiten en orden
- [ ] Los pedidos se procesan en paralelo
- [ ] Los fallos no detienen otros pedidos
- [ ] Timestamps registrados correctamente

## 🎁 BONUS

1. Añadir un evento `shop:stats` que emita estadísticas cada 5 segundos
2. Implementar cola de prioridad (clientes VIP primero)
3. Usar `AbortController` para cancelar pedidos

## Ejecutar

```bash
cd ejercicios/T2
node src/pizza-shop.js
```
