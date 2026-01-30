/**
 * Tema 1 - Ejemplo 06: Información del Sistema Operativo
 *
 * Uso del módulo node:os para obtener información del sistema.
 * Ejecutar: node src/06-os-info.js
 */

import os from 'node:os';

console.log('=== Información del Sistema Operativo ===\n');

// Información básica del sistema
console.log('Sistema:');
console.log('  - Tipo:', os.type());
console.log('  - Plataforma:', os.platform());
console.log('  - Release:', os.release());
console.log('  - Arquitectura:', os.arch());
console.log('  - Hostname:', os.hostname());

// Información de memoria
const totalMemGB = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
const freeMemGB = (os.freemem() / 1024 / 1024 / 1024).toFixed(2);
const usedMemGB = (totalMemGB - freeMemGB).toFixed(2);
const memUsagePercent = ((usedMemGB / totalMemGB) * 100).toFixed(1);

console.log('\nMemoria:');
console.log(`  - Total: ${totalMemGB} GB`);
console.log(`  - Libre: ${freeMemGB} GB`);
console.log(`  - Usada: ${usedMemGB} GB (${memUsagePercent}%)`);

// Información de CPUs
const cpus = os.cpus();
console.log('\nCPUs:');
console.log('  - Núcleos:', cpus.length);
console.log('  - Modelo:', cpus[0].model);
console.log('  - Velocidad:', cpus[0].speed, 'MHz');

// Mostrar uso de cada CPU
console.log('  - Uso por núcleo:');
cpus.forEach((cpu, index) => {
  const total = Object.values(cpu.times).reduce((a, b) => a + b, 0);
  const idle = cpu.times.idle;
  const usage = (((total - idle) / total) * 100).toFixed(1);
  console.log(`      CPU ${index}: ${usage}%`);
});

// Directorios importantes
console.log('\nDirectorios:');
console.log('  - Home:', os.homedir());
console.log('  - Temp:', os.tmpdir());

// Tiempo de actividad
const uptimeHours = (os.uptime() / 3600).toFixed(2);
const uptimeDays = (os.uptime() / 86400).toFixed(2);
console.log('\nTiempo de actividad:');
console.log(`  - ${uptimeHours} horas (${uptimeDays} días)`);

// Interfaces de red
console.log('\nInterfaces de red:');
const networkInterfaces = os.networkInterfaces();
Object.entries(networkInterfaces).forEach(([name, interfaces]) => {
  console.log(`  ${name}:`);
  interfaces.forEach(iface => {
    if (iface.family === 'IPv4') {
      console.log(`    - IPv4: ${iface.address}`);
    }
  });
});

// Usuario actual
console.log('\nUsuario actual:');
const userInfo = os.userInfo();
console.log('  - Username:', userInfo.username);
console.log('  - UID:', userInfo.uid);
console.log('  - GID:', userInfo.gid);
console.log('  - Shell:', userInfo.shell);

// Constantes del sistema
console.log('\nConstantes:');
console.log('  - EOL:', JSON.stringify(os.EOL));
console.log('  - Endianness:', os.endianness());

// Prioridad del proceso
console.log('\nPrioridad del proceso:', os.getPriority());
