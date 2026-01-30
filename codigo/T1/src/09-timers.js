/**
 * Tema 1 - Ejemplo 09: Timers
 *
 * setTimeout, setInterval, setImmediate y sus cancelaciones.
 * Ejecutar: node src/09-timers.js
 */

console.log('=== Timers en Node.js ===\n');
console.log('Inicio del script:', new Date().toLocaleTimeString());

// 1. setTimeout - Ejecutar una vez después de X ms
console.log('\n1. setTimeout (ejecución diferida):');

setTimeout(() => {
  console.log('   [1s] Ejecutado después de 1 segundo');
}, 1000);

setTimeout(() => {
  console.log('   [2s] Ejecutado después de 2 segundos');
}, 2000);

// setTimeout con 0ms - Se ejecuta después del código síncrono
setTimeout(() => {
  console.log('   [0ms] Aunque es 0ms, se ejecuta después del código síncrono');
}, 0);

// 2. clearTimeout - Cancelar un timeout
console.log('\n2. clearTimeout (cancelar):');
const timeoutACancelar = setTimeout(() => {
  console.log('   [CANCELADO] Este mensaje NO debería aparecer');
}, 500);

clearTimeout(timeoutACancelar);
console.log('   Timeout cancelado exitosamente');

// 3. setInterval - Ejecutar repetidamente cada X ms
console.log('\n3. setInterval (ejecución repetida):');

let contador = 0;
const intervalo = setInterval(() => {
  contador++;
  console.log(`   [Tick ${contador}] Cada 500ms`);

  // Detener después de 5 ticks
  if (contador >= 5) {
    clearInterval(intervalo);
    console.log('   Intervalo detenido después de 5 ticks');
  }
}, 500);

// 4. setImmediate - Ejecutar en la siguiente iteración del Event Loop
console.log('\n4. setImmediate (siguiente iteración del Event Loop):');

setImmediate(() => {
  console.log('   [IMMEDIATE 1] Primera llamada a setImmediate');
});

setImmediate(() => {
  console.log('   [IMMEDIATE 2] Segunda llamada a setImmediate');
});

// 5. Orden de ejecución
console.log('\n5. Orden de ejecución (sync → nextTick → immediate → timeout):');

setTimeout(() => console.log('   3. setTimeout 0ms'), 0);
setImmediate(() => console.log('   4. setImmediate'));
process.nextTick(() => console.log('   2. process.nextTick'));
console.log('   1. Código síncrono');

// 6. Uso práctico: Polling con setInterval
console.log('\n6. Ejemplo práctico - Verificar condición cada X tiempo:');

let intentos = 0;
const maxIntentos = 3;

function verificarCondicion() {
  return new Promise((resolve) => {
    intentos++;
    console.log(`   Intento ${intentos}/${maxIntentos}...`);

    // Simular que la condición se cumple en el intento 3
    if (intentos >= 3) {
      resolve(true);
    } else {
      resolve(false);
    }
  });
}

async function esperarCondicion() {
  return new Promise((resolve, reject) => {
    const intervaloVerificacion = setInterval(async () => {
      const resultado = await verificarCondicion();

      if (resultado) {
        clearInterval(intervaloVerificacion);
        console.log('   ¡Condición cumplida!');
        resolve(true);
      } else if (intentos >= maxIntentos) {
        clearInterval(intervaloVerificacion);
        console.log('   Máximo de intentos alcanzado');
        reject(new Error('Timeout'));
      }
    }, 300);
  });
}

// Ejecutar después de que otros ejemplos terminen
setTimeout(async () => {
  try {
    await esperarCondicion();
  } catch (error) {
    console.log('   Error:', error.message);
  }

  console.log('\n=== Fin de los ejemplos de Timers ===');
}, 4000);

console.log('\nEsperando ejecución de timers...');
console.log('(El script terminará en ~5 segundos)\n');
