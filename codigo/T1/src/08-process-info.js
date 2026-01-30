/**
 * Tema 1 - Ejemplo 08: Objeto process
 *
 * Información y control del proceso de Node.js.
 * Ejecutar: node src/08-process-info.js arg1 arg2 --flag
 */

console.log('=== Objeto process ===\n');

// Información del proceso
console.log('Información del proceso:');
console.log('  - PID:', process.pid);
console.log('  - PPID:', process.ppid);
console.log('  - Título:', process.title);
console.log('  - Node version:', process.version);
console.log('  - V8 version:', process.versions.v8);

// Argumentos de línea de comandos
console.log('\nArgumentos (process.argv):');
process.argv.forEach((arg, index) => {
  console.log(`  [${index}]: ${arg}`);
});

// Parseando argumentos (ejemplo simple)
console.log('\nParseando argumentos:');
const args = process.argv.slice(2); // Quitar node y script
console.log('  - Args sin node/script:', args);

// Variables de entorno
console.log('\nVariables de entorno (selección):');
console.log('  - NODE_ENV:', process.env.NODE_ENV || '(no definida)');
console.log('  - PATH:', (process.env.PATH || '').substring(0, 50) + '...');
console.log('  - HOME:', process.env.HOME || process.env.USERPROFILE);
console.log('  - SHELL:', process.env.SHELL || '(no definida)');

// Uso de memoria
console.log('\nUso de memoria:');
const memoria = process.memoryUsage();
console.log('  - Heap total:', (memoria.heapTotal / 1024 / 1024).toFixed(2), 'MB');
console.log('  - Heap usado:', (memoria.heapUsed / 1024 / 1024).toFixed(2), 'MB');
console.log('  - External:', (memoria.external / 1024 / 1024).toFixed(2), 'MB');
console.log('  - RSS:', (memoria.rss / 1024 / 1024).toFixed(2), 'MB');
console.log('  - Array buffers:', (memoria.arrayBuffers / 1024 / 1024).toFixed(2), 'MB');

// Directorio de trabajo
console.log('\nDirectorios:');
console.log('  - cwd():', process.cwd());
console.log('  - execPath:', process.execPath);

// Tiempo de ejecución
console.log('\nTiempo de ejecución:');
console.log('  - uptime:', process.uptime().toFixed(3), 'segundos');

// Medir tiempo con hrtime.bigint()
console.log('\nMidiendo tiempo con hrtime.bigint():');
const inicio = process.hrtime.bigint();
// Simular trabajo
let suma = 0;
for (let i = 0; i < 1000000; i++) {
  suma += i;
}
const fin = process.hrtime.bigint();
const duracionNs = Number(fin - inicio);
const duracionMs = duracionNs / 1_000_000;
console.log(`  - Suma de 0 a 999999 = ${suma}`);
console.log(`  - Duración: ${duracionNs.toLocaleString()} ns (${duracionMs.toFixed(2)} ms)`);

// Platform info
console.log('\nPlataforma:');
console.log('  - platform:', process.platform);
console.log('  - arch:', process.arch);

// Eventos del proceso
console.log('\nEventos del proceso (registrando manejadores):');

process.on('beforeExit', (code) => {
  console.log('  [beforeExit] Código:', code);
});

process.on('exit', (code) => {
  console.log('  [exit] Código de salida:', code);
});

// Manejo de errores no capturados
process.on('uncaughtException', (err) => {
  console.error('  [uncaughtException]:', err.message);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('  [unhandledRejection]:', reason);
});

console.log('\n¡Script completado! El proceso terminará ahora...');

// Descomenta para probar salida con código de error:
// process.exit(1);
