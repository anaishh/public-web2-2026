/**
 * Tema 1 - Ejemplo 07: Criptografía
 *
 * Uso del módulo node:crypto para operaciones criptográficas.
 * Ejecutar: node src/07-crypto-examples.js
 */

import {
  randomBytes,
  randomUUID,
  createHash,
  scrypt,
  timingSafeEqual
} from 'node:crypto';

console.log('=== Módulo node:crypto ===\n');

// 1. Generar UUID v4
console.log('1. UUID v4:');
const uuid1 = randomUUID();
const uuid2 = randomUUID();
console.log('   -', uuid1);
console.log('   -', uuid2);

// 2. Bytes aleatorios (útil para tokens)
console.log('\n2. Bytes aleatorios:');
const bytesHex = randomBytes(16).toString('hex');
const bytesBase64 = randomBytes(16).toString('base64');
console.log('   - 16 bytes (hex):', bytesHex);
console.log('   - 16 bytes (base64):', bytesBase64);

// Token de sesión típico
const sessionToken = randomBytes(32).toString('hex');
console.log('   - Token de sesión (32 bytes):', sessionToken);

// 3. Hash SHA-256
console.log('\n3. Hash SHA-256:');
const mensaje = 'Hola Mundo';
const hash256 = createHash('sha256').update(mensaje).digest('hex');
console.log(`   - Hash de "${mensaje}":`, hash256);

// El mismo input siempre produce el mismo hash
const hash256_2 = createHash('sha256').update(mensaje).digest('hex');
console.log('   - Mismo hash:', hash256 === hash256_2);

// Input diferente produce hash diferente
const hashDiferente = createHash('sha256').update('Hola Mundo!').digest('hex');
console.log('   - Hash diferente:', hash256 !== hashDiferente);

// 4. Otros algoritmos de hash
console.log('\n4. Otros algoritmos:');
const texto = 'password123';
console.log(`   Texto: "${texto}"`);
console.log('   - MD5:', createHash('md5').update(texto).digest('hex'));
console.log('   - SHA-1:', createHash('sha1').update(texto).digest('hex'));
console.log('   - SHA-512:', createHash('sha512').update(texto).digest('hex').substring(0, 32) + '...');

// 5. Hash de contraseñas con scrypt (más seguro que bcrypt para Node.js nativo)
console.log('\n5. Hash de contraseña con scrypt:');

/**
 * Genera un hash seguro de contraseña
 */
function hashPassword(password) {
  return new Promise((resolve, reject) => {
    const salt = randomBytes(16).toString('hex');
    scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(`${salt}:${derivedKey.toString('hex')}`);
    });
  });
}

/**
 * Verifica una contraseña contra su hash
 */
function verifyPassword(password, hash) {
  return new Promise((resolve, reject) => {
    const [salt, key] = hash.split(':');
    const keyBuffer = Buffer.from(key, 'hex');
    scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      // Comparación segura contra timing attacks
      resolve(timingSafeEqual(keyBuffer, derivedKey));
    });
  });
}

// Demo de hash de contraseña
const password = 'MiPassword123';
const hashedPassword = await hashPassword(password);
console.log('   - Password:', password);
console.log('   - Hash:', hashedPassword.substring(0, 50) + '...');

// Verificar contraseña correcta
const isValid = await verifyPassword(password, hashedPassword);
console.log('   - Verificación correcta:', isValid);

// Verificar contraseña incorrecta
const isInvalid = await verifyPassword('wrongpassword', hashedPassword);
console.log('   - Verificación incorrecta:', isInvalid);

// 6. Generar hash para integridad de archivos
console.log('\n6. Hash de integridad (checksum):');
const contenidoArchivo = 'Contenido del archivo para verificar integridad';
const checksum = createHash('sha256').update(contenidoArchivo).digest('hex');
console.log('   - Contenido:', contenidoArchivo.substring(0, 30) + '...');
console.log('   - SHA-256:', checksum);

console.log('\nNota: Para contraseñas en producción, considera usar bcryptjs');
console.log('que es más portable y tiene protección contra ataques de hardware.');
