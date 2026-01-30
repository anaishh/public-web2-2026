# T2: Eventos y Asincronía - Ejemplos de Código

Este directorio contiene los ejemplos prácticos del **Tema 2: Eventos y Asincronía**.

## Requisitos

- Node.js >= 20.0.0 (recomendado v22 LTS o superior)

## Estructura

```
T2/
├── 01-event-loop-orden.js      # Orden de ejecución del Event Loop
├── 02-eventos-pedidos.js       # EventEmitter con events.once()
├── 03-promise-allsettled.js    # Promise.allSettled para fallos parciales
├── 04-abort-controller.js      # Cancelación con AbortController
├── 05-async-local-storage.js   # Contexto con AsyncLocalStorage
├── 06-eventos-async-iterator.js # Eventos como async iterators
├── package.json
└── README.md
```

## Ejecución

Cada ejemplo se puede ejecutar individualmente:

```bash
# Ejemplo 1: Event Loop
node 01-event-loop-orden.js

# Ejemplo 2: Sistema de pedidos con eventos
node 02-eventos-pedidos.js

# Ejemplo 3: Promise.allSettled
node 03-promise-allsettled.js

# Ejemplo 4: AbortController
node 04-abort-controller.js

# Ejemplo 5: AsyncLocalStorage
node 05-async-local-storage.js

# Ejemplo 6: Async Iterator de eventos
node 06-eventos-async-iterator.js
```

O usando los scripts de npm:

```bash
npm run ej1  # Event Loop
npm run ej2  # Eventos
npm run ej3  # Promise.allSettled
npm run ej4  # AbortController
npm run ej5  # AsyncLocalStorage
npm run ej6  # Async Iterator
```

## Descripción de cada ejemplo

### 01 - Event Loop Orden
Demuestra el orden de ejecución entre:
- Código síncrono
- `process.nextTick()`
- Microtasks (`Promise.then()`, `queueMicrotask()`)
- Macrotasks (`setTimeout`, `setImmediate`)

### 02 - Sistema de Pedidos
Implementa un sistema de pedidos usando `EventEmitter`:
- Registro de listeners con `.on()`
- Espera de eventos con `events.once()`
- Timeout con `AbortSignal.timeout()`

### 03 - Promise.allSettled
Muestra cómo manejar operaciones que pueden fallar parcialmente:
- Lectura de múltiples archivos en paralelo
- Separación de resultados exitosos y fallidos
- Comparación con `Promise.all()`

### 04 - AbortController
Patrones de cancelación de operaciones:
- `AbortSignal.timeout()` para timeouts automáticos
- Cancelación manual con `controller.abort()`
- `AbortSignal.any()` para combinar señales
- Limpieza de recursos al cancelar

### 05 - AsyncLocalStorage
Sistema de logging con contexto automático:
- Request ID automático en todos los logs
- Propagación de contexto a través de llamadas async
- Metadata dinámica durante la ejecución
- Casos de uso reales (tracing, transacciones)

### 06 - Eventos como Async Iterator
Uso de `events.on()` para consumir eventos:
- `for await...of` con EventEmitter
- Filtrado de eventos en el loop
- Uso de `break` para salir
- Acumulación y análisis de eventos

## Conceptos Clave

| Concepto | API | Ejemplo |
|----------|-----|---------|
| Event Loop | N/A | `01-event-loop-orden.js` |
| EventEmitter | `node:events` | `02-eventos-pedidos.js` |
| Promesas paralelas | `Promise.allSettled` | `03-promise-allsettled.js` |
| Cancelación | `AbortController` | `04-abort-controller.js` |
| Contexto async | `AsyncLocalStorage` | `05-async-local-storage.js` |
| Async iterators | `events.on()` | `06-eventos-async-iterator.js` |

## Referencias

- [Node.js Events Documentation](https://nodejs.org/api/events.html)
- [Node.js Async Hooks](https://nodejs.org/api/async_hooks.html)
- [MDN AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)
