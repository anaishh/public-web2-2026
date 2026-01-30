/**
 * T2 - Ejercicio 3: Promise.allSettled para lectura de archivos
 * 
 * Lee múltiples archivos en paralelo y reporta cuáles existían y cuáles no.
 * Demuestra cómo manejar fallos parciales con Promise.allSettled().
 * 
 * Ejecutar con: node 03-promise-allsettled.js
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Lista de archivos a leer (algunos existen, otros no)
const archivos = [
  'package.json',           // Probablemente existe en el proyecto
  'datos.txt',              // Puede no existir
  'noexiste.log',           // No existe
  'config.json',            // Puede no existir
  '01-event-loop-orden.js'  // Existe (lo creamos antes)
];

console.log('=== Lectura de múltiples archivos con Promise.allSettled ===\n');
console.log('Archivos a leer:', archivos);
console.log('\n--- Iniciando lectura paralela ---\n');

// Función para leer un archivo con información adicional
async function leerArchivo(nombreArchivo) {
  const rutaCompleta = path.join(__dirname, nombreArchivo);
  const contenido = await fs.readFile(rutaCompleta, 'utf-8');
  return {
    archivo: nombreArchivo,
    tamaño: contenido.length,
    primerasLineas: contenido.split('\n').slice(0, 3).join('\n')
  };
}

// Leer todos los archivos en paralelo
const resultados = await Promise.allSettled(
  archivos.map(archivo => leerArchivo(archivo))
);

// Separar exitosos y fallidos
const exitosos = [];
const fallidos = [];

resultados.forEach((resultado, index) => {
  const archivo = archivos[index];
  
  if (resultado.status === 'fulfilled') {
    exitosos.push({
      archivo,
      datos: resultado.value
    });
  } else {
    fallidos.push({
      archivo,
      error: resultado.reason.code || resultado.reason.message
    });
  }
});

// Mostrar resultados
console.log('=== ARCHIVOS LEÍDOS EXITOSAMENTE ===\n');
if (exitosos.length === 0) {
  console.log('  (ninguno)\n');
} else {
  exitosos.forEach(({ archivo, datos }) => {
    console.log(`✅ ${archivo}`);
    console.log(`   Tamaño: ${datos.tamaño} caracteres`);
    console.log(`   Preview: "${datos.primerasLineas.substring(0, 50)}..."`);
    console.log();
  });
}

console.log('=== ARCHIVOS CON ERROR ===\n');
if (fallidos.length === 0) {
  console.log('  (ninguno)\n');
} else {
  fallidos.forEach(({ archivo, error }) => {
    console.log(`❌ ${archivo}`);
    console.log(`   Error: ${error}`);
    console.log();
  });
}

// Resumen
console.log('=== RESUMEN ===');
console.log(`Total archivos: ${archivos.length}`);
console.log(`Exitosos: ${exitosos.length}`);
console.log(`Fallidos: ${fallidos.length}`);
console.log(`Tasa de éxito: ${((exitosos.length / archivos.length) * 100).toFixed(1)}%`);

/*
 * DIFERENCIAS CON Promise.all():
 * 
 * Promise.all():
 * - Si UNO falla, TODO falla
 * - No sabes cuáles tuvieron éxito
 * - Útil cuando necesitas TODOS los resultados
 * 
 * Promise.allSettled():
 * - Siempre completa, nunca rechaza
 * - Retorna { status: 'fulfilled', value } o { status: 'rejected', reason }
 * - Útil cuando quieres resultados parciales
 * - Ideal para operaciones independientes
 */
