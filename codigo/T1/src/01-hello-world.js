/**
 * Tema 1 - Ejemplo 01: Hello World
 *
 * El programa más básico en Node.js usando ES Modules.
 * Ejecutar: node src/01-hello-world.js
 */

// console.log está disponible globalmente (no necesita import)
console.log('=== Hello World en Node.js ===\n');

// Información básica del entorno
console.log('Node.js version:', process.version);
console.log('Plataforma:', process.platform);
console.log('Arquitectura:', process.arch);
console.log('Directorio actual:', process.cwd());

// Variables de entorno
console.log('\nVariables de entorno:');
console.log('- NODE_ENV:', process.env.NODE_ENV || '(no definida)');
console.log('- USER:', process.env.USER || process.env.USERNAME || '(no definida)');

// Argumentos de línea de comandos
console.log('\nArgumentos (process.argv):');
process.argv.forEach((arg, index) => {
  console.log(`  [${index}]: ${arg}`);
});

console.log('\n¡Node.js está funcionando correctamente!');
