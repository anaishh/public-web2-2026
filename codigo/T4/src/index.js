/**
 * Punto de entrada
 */

import { env } from './config/env.js';
import app from './app.js';

const server = app.listen(env.PORT, () => {
  console.log('\n' + '═'.repeat(50));
  console.log('   🚀 API EXPRESS 5 INICIADA');
  console.log('═'.repeat(50));
  console.log(`   📍 URL:     http://localhost:${env.PORT}`);
  console.log(`   📋 API:     http://localhost:${env.PORT}/api`);
  console.log(`   💚 Health:  http://localhost:${env.PORT}/health`);
  console.log(`   🌍 Entorno: ${env.NODE_ENV}`);
  console.log('═'.repeat(50) + '\n');
});

// Graceful shutdown
const shutdown = (signal) => {
  console.log(`\n📴 ${signal} recibida. Cerrando...`);
  server.close(() => {
    console.log('✅ Servidor cerrado');
    process.exit(0);
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
