/**
 * Tema 1 - Ejemplo 05: Módulo path
 *
 * Manipulación de rutas de archivos multiplataforma.
 * Ejecutar: node src/05-path-examples.js
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';

console.log('=== Módulo node:path ===\n');

// Obtener __dirname y __filename en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Rutas actuales:');
console.log('  __filename:', __filename);
console.log('  __dirname:', __dirname);

// path.join() - Une segmentos de ruta
console.log('\npath.join() - Unir rutas:');
console.log('  join("src", "utils", "math.js"):', path.join('src', 'utils', 'math.js'));
console.log('  join(__dirname, "..", "data"):', path.join(__dirname, '..', 'data'));
console.log('  join("/app", "src", "..", "dist"):', path.join('/app', 'src', '..', 'dist'));

// path.resolve() - Resuelve a ruta absoluta
console.log('\npath.resolve() - Rutas absolutas:');
console.log('  resolve("src"):', path.resolve('src'));
console.log('  resolve("src", "index.js"):', path.resolve('src', 'index.js'));
console.log('  resolve("/tmp", "archivo.txt"):', path.resolve('/tmp', 'archivo.txt'));

// Extraer partes de una ruta
const rutaEjemplo = '/usuarios/app/src/controllers/user.controller.js';
console.log('\nPartes de una ruta:', rutaEjemplo);
console.log('  dirname:', path.dirname(rutaEjemplo));
console.log('  basename:', path.basename(rutaEjemplo));
console.log('  basename sin ext:', path.basename(rutaEjemplo, '.js'));
console.log('  extname:', path.extname(rutaEjemplo));

// path.parse() - Parsear ruta completa
console.log('\npath.parse():');
const parsed = path.parse(rutaEjemplo);
console.log('  root:', parsed.root);
console.log('  dir:', parsed.dir);
console.log('  base:', parsed.base);
console.log('  name:', parsed.name);
console.log('  ext:', parsed.ext);

// path.format() - Reconstruir ruta desde objeto
console.log('\npath.format() - Reconstruir:');
const nuevaRuta = path.format({
  dir: '/app/src',
  name: 'index',
  ext: '.ts'
});
console.log('  format({dir, name, ext}):', nuevaRuta);

// Normalizar rutas
console.log('\npath.normalize() - Normalizar:');
console.log('  normalize("/app//src/../dist"):', path.normalize('/app//src/../dist'));
console.log('  normalize("./src/./utils"):', path.normalize('./src/./utils'));

// Ruta relativa entre dos rutas
console.log('\npath.relative() - Ruta relativa:');
console.log('  relative("/app/src", "/app/dist"):', path.relative('/app/src', '/app/dist'));
console.log('  relative("/app/src/utils", "/app/src"):', path.relative('/app/src/utils', '/app/src'));

// Verificar si es ruta absoluta
console.log('\npath.isAbsolute():');
console.log('  isAbsolute("/app/src"):', path.isAbsolute('/app/src'));
console.log('  isAbsolute("./src"):', path.isAbsolute('./src'));
console.log('  isAbsolute("src"):', path.isAbsolute('src'));

// Separador de rutas (depende del SO)
console.log('\nSeparadores:');
console.log('  path.sep:', JSON.stringify(path.sep));
console.log('  path.delimiter:', JSON.stringify(path.delimiter));
