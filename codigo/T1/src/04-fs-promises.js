/**
 * Tema 1 - Ejemplo 04: Sistema de Archivos con Promesas
 *
 * Uso de node:fs/promises para operaciones de archivos.
 * Ejecutar: node src/04-fs-promises.js
 */

import {
  readFile,
  writeFile,
  mkdir,
  readdir,
  stat,
  unlink,
  access,
  constants
} from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, '..', 'data');

console.log('=== Sistema de Archivos con Promesas ===\n');

// Función auxiliar para verificar si existe un archivo/directorio
async function existe(ruta) {
  try {
    await access(ruta, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  try {
    // 1. Crear directorio si no existe
    console.log('1. Creando directorio data/...');
    await mkdir(dataDir, { recursive: true });
    console.log('   Directorio creado:', dataDir);

    // 2. Escribir archivo JSON
    console.log('\n2. Escribiendo productos.json...');
    const productos = [
      { id: 1, nombre: 'Laptop', precio: 999.99, stock: 15 },
      { id: 2, nombre: 'Mouse', precio: 29.99, stock: 50 },
      { id: 3, nombre: 'Teclado', precio: 79.99, stock: 30 },
      { id: 4, nombre: 'Monitor', precio: 299.99, stock: 10 },
      { id: 5, nombre: 'Webcam', precio: 89.99, stock: 25 }
    ];
    const productosPath = path.join(dataDir, 'productos1.json');
    await writeFile(productosPath, JSON.stringify(productos, null, 0));
    console.log('   Archivo escrito:', productosPath);

    // 3. Leer archivo
    console.log('\n3. Leyendo productos.json...');
    const contenido = await readFile(productosPath, 'utf-8');
    const productosLeidos = JSON.parse(contenido);
    console.log('   Productos encontrados:', productosLeidos.length);

    // 4. Filtrar y escribir nuevo archivo
    console.log('\n4. Filtrando productos caros (precio > 100)...');
    const productosCaros = productosLeidos.filter(p => p.precio > 100);
    const carosPath = path.join(dataDir, 'productos-caros.json');
    await writeFile(carosPath, JSON.stringify(productosCaros, null, 2));
    console.log('   Productos caros:', productosCaros.length);
    console.log('   Guardados en:', carosPath);

    // 5. Obtener información de archivo
    console.log('\n5. Información del archivo:');
    const info = await stat(productosPath);
    console.log('   - Tamaño:', info.size, 'bytes');
    console.log('   - Creado:', info.birthtime.toLocaleString());
    console.log('   - Modificado:', info.mtime.toLocaleString());
    console.log('   - Es directorio:', info.isDirectory());

    // 6. Listar directorio
    console.log('\n6. Contenido del directorio data/:');
    const archivos = await readdir(dataDir);
    archivos.forEach(archivo => {
      console.log('   -', archivo);
    });

    // 7. Operaciones en paralelo con Promise.all
    console.log('\n7. Leyendo múltiples archivos en paralelo...');
    const [file1, file2] = await Promise.all([
      readFile(productosPath, 'utf-8'),
      readFile(carosPath, 'utf-8')
    ]);
    console.log('   productos.json:', JSON.parse(file1).length, 'items');
    console.log('   productos-caros.json:', JSON.parse(file2).length, 'items');

    console.log('\n¡Operaciones completadas exitosamente!');

  } catch (error) {
    console.error('\nError:', error.message);
    process.exit(1);
  }
}

main();
