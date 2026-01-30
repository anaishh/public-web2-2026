/**
 * Tema 1 - Ejemplo 03: ES Modules (ESM)
 *
 * Demuestra import/export con ES Modules.
 * Ejecutar: node src/03-esm-modules.js
 */

// Importar módulos nativos con prefijo node:
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Importar módulos propios
import { sumar, restar, multiplicar, dividir } from './utils/math.js';
import Calculadora from './utils/math.js';

console.log('=== ES Modules en Node.js ===\n');

// Usar funciones importadas
console.log('Operaciones matemáticas:');
console.log('  sumar(5, 3) =', sumar(5, 3));
console.log('  restar(10, 4) =', restar(10, 4));
console.log('  multiplicar(6, 7) =', multiplicar(6, 7));
console.log('  dividir(20, 4) =', dividir(20, 4));

// Usar clase importada (export default)
console.log('\nUsando clase Calculadora:');
const calc = new Calculadora();
console.log('  calc.sumar(100, 50) =', calc.sumar(100, 50));
console.log('  calc.historial =', calc.historial);

// __dirname y __filename en ESM
// (No existen directamente, hay que crearlos)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('\nRutas en ESM:');
console.log('  import.meta.url:', import.meta.url);
console.log('  __filename:', __filename);
console.log('  __dirname:', __dirname);

// Top-level await (solo funciona en ESM)
console.log('\nTop-level await (leyendo package.json):');
try {
  const packagePath = path.join(__dirname, '..', 'package.json');
  const content = await readFile(packagePath, 'utf-8');
  const pkg = JSON.parse(content);
  console.log('  Nombre del proyecto:', pkg.name);
  console.log('  Versión:', pkg.version);
} catch (error) {
  console.log('  Error leyendo package.json:', error.message);
}
