#!/usr/bin/env node

/**
 * T1 Ejercicio: Package Analyzer CLI
 *
 * Conceptos aplicados:
 * - ESM (import/export)
 * - process.argv para argumentos CLI
 * - node:fs/promises para I/O asíncrono
 * - node:path para rutas multiplataforma
 * - Top-level await
 * - Manejo de errores
 */

import { readFile, writeFile, stat, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Colores ANSI para output bonito
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m'
};

const c = (color, text) => `${colors[color]}${text}${colors.reset}`;

/**
 * Analiza el tipo de versión
 */
function analyzeVersion(version) {
  if (version.startsWith('^')) return { type: 'caret', symbol: '^', desc: 'Compatible minor' };
  if (version.startsWith('~')) return { type: 'tilde', symbol: '~', desc: 'Compatible patch' };
  if (version.startsWith('>=')) return { type: 'range', symbol: '>=', desc: 'Range' };
  if (/^\d/.test(version)) return { type: 'fixed', symbol: '=', desc: 'Versión fija' };
  return { type: 'other', symbol: '?', desc: 'Otro' };
}

/**
 * Calcula el tamaño de un directorio recursivamente
 */
async function getDirSize(dirPath) {
  try {
    let totalSize = 0;
    const items = await readdir(dirPath, { withFileTypes: true });

    for (const item of items) {
      const itemPath = path.join(dirPath, item.name);
      if (item.isDirectory()) {
        totalSize += await getDirSize(itemPath);
      } else {
        const stats = await stat(itemPath);
        totalSize += stats.size;
      }
    }

    return totalSize;
  } catch {
    return 0;
  }
}

/**
 * Formatea bytes a unidad legible
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Función principal
 */
async function main() {
  console.log(c('bright', '\n📦 Package Analyzer CLI\n'));
  console.log(c('gray', '═'.repeat(50)));

  // Obtener path del argumento o usar directorio actual
  const targetPath = process.argv[2] || '.';
  const packagePath = path.resolve(targetPath, 'package.json');

  console.log(c('cyan', `\n📂 Analizando: ${packagePath}\n`));

  try {
    // Leer package.json
    const content = await readFile(packagePath, 'utf-8');
    const pkg = JSON.parse(content);

    // === Información del proyecto ===
    console.log(c('bright', '📋 Información del Proyecto'));
    console.log(c('gray', '─'.repeat(40)));
    console.log(`   Nombre:    ${c('green', pkg.name || 'Sin nombre')}`);
    console.log(`   Versión:   ${c('yellow', pkg.version || 'Sin versión')}`);
    console.log(`   Tipo:      ${pkg.type === 'module' ? c('green', 'ESM ✓') : c('yellow', 'CommonJS')}`);

    if (pkg.engines?.node) {
      const required = pkg.engines.node;
      const current = process.version;
      console.log(`   Node req:  ${required} (actual: ${current})`);
    }

    // === Dependencias ===
    const deps = pkg.dependencies || {};
    const devDeps = pkg.devDependencies || {};
    const depsCount = Object.keys(deps).length;
    const devDepsCount = Object.keys(devDeps).length;

    console.log(c('bright', '\n📚 Dependencias'));
    console.log(c('gray', '─'.repeat(40)));
    console.log(`   Producción:   ${c('green', depsCount)}`);
    console.log(`   Desarrollo:   ${c('yellow', devDepsCount)}`);
    console.log(`   Total:        ${c('bright', depsCount + devDepsCount)}`);

    // Análisis detallado de dependencias
    const allDeps = { ...deps, ...devDeps };
    const analysis = {
      caret: [],
      tilde: [],
      fixed: [],
      scoped: [],
      other: []
    };

    for (const [name, version] of Object.entries(allDeps)) {
      const vInfo = analyzeVersion(version);
      analysis[vInfo.type === 'range' ? 'other' : vInfo.type].push({ name, version });

      if (name.startsWith('@')) {
        analysis.scoped.push({ name, version });
      }
    }

    console.log(c('bright', '\n📊 Análisis de Versiones'));
    console.log(c('gray', '─'.repeat(40)));
    console.log(`   ^ (minor compatible): ${c('cyan', analysis.caret.length)}`);
    console.log(`   ~ (patch compatible): ${c('yellow', analysis.tilde.length)}`);
    console.log(`   = (versión fija):     ${c('red', analysis.fixed.length)}`);
    console.log(`   @ (scoped packages):  ${c('blue', analysis.scoped.length)}`);

    // Listar dependencias
    if (depsCount > 0) {
      console.log(c('bright', '\n📦 Dependencias de Producción'));
      console.log(c('gray', '─'.repeat(40)));
      for (const [name, version] of Object.entries(deps)) {
        const vInfo = analyzeVersion(version);
        const scopeTag = name.startsWith('@') ? c('blue', ' [scoped]') : '';
        console.log(`   ${c('gray', vInfo.symbol)} ${name}${scopeTag}: ${c('cyan', version)}`);
      }
    }

    if (devDepsCount > 0) {
      console.log(c('bright', '\n🔧 Dependencias de Desarrollo'));
      console.log(c('gray', '─'.repeat(40)));
      for (const [name, version] of Object.entries(devDeps)) {
        const vInfo = analyzeVersion(version);
        console.log(`   ${c('gray', vInfo.symbol)} ${name}: ${c('yellow', version)}`);
      }
    }

    // === Scripts ===
    const scripts = pkg.scripts || {};
    const scriptsCount = Object.keys(scripts).length;

    if (scriptsCount > 0) {
      console.log(c('bright', '\n⚡ Scripts Disponibles'));
      console.log(c('gray', '─'.repeat(40)));
      for (const [name, command] of Object.entries(scripts)) {
        const shortCmd = command.length > 40 ? command.substring(0, 40) + '...' : command;
        console.log(`   ${c('green', name)}: ${c('gray', shortCmd)}`);
      }
    }

    // === BONUS: Tamaño de node_modules ===
    const nodeModulesPath = path.resolve(targetPath, 'node_modules');
    try {
      const nmStats = await stat(nodeModulesPath);
      if (nmStats.isDirectory()) {
        console.log(c('bright', '\n📁 node_modules'));
        console.log(c('gray', '─'.repeat(40)));
        console.log(`   Calculando tamaño...`);
        const size = await getDirSize(nodeModulesPath);
        console.log(`   Tamaño: ${c('yellow', formatBytes(size))}`);
      }
    } catch {
      console.log(c('gray', '\n   (node_modules no encontrado)'));
    }

    // === Generar reporte ===
    const report = {
      analyzedAt: new Date().toISOString(),
      path: packagePath,
      project: {
        name: pkg.name,
        version: pkg.version,
        type: pkg.type || 'commonjs'
      },
      dependencies: {
        production: depsCount,
        development: devDepsCount,
        total: depsCount + devDepsCount
      },
      versionAnalysis: {
        caretCount: analysis.caret.length,
        tildeCount: analysis.tilde.length,
        fixedCount: analysis.fixed.length,
        scopedCount: analysis.scoped.length
      },
      scripts: Object.keys(scripts)
    };

    const reportPath = path.resolve(targetPath, 'analysis-report.json');
    await writeFile(reportPath, JSON.stringify(report, null, 2));

    console.log(c('bright', '\n✅ Reporte Generado'));
    console.log(c('gray', '─'.repeat(40)));
    console.log(`   Guardado en: ${c('green', reportPath)}`);

    console.log(c('gray', '\n' + '═'.repeat(50)));
    console.log(c('bright', '📦 Análisis completado\n'));

  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error(c('red', `\n❌ Error: No se encontró ${packagePath}`));
      console.error(c('gray', '   Asegúrate de que el directorio contiene un package.json\n'));
    } else if (error instanceof SyntaxError) {
      console.error(c('red', '\n❌ Error: El archivo package.json no es JSON válido'));
      console.error(c('gray', `   ${error.message}\n`));
    } else {
      console.error(c('red', `\n❌ Error: ${error.message}\n`));
    }
    process.exit(1);
  }
}

// Ejecutar
main();
