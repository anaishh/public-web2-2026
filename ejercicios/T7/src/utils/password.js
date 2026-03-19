/**
 * T7: Utilidades de Password
 */

import bcryptjs from 'bcryptjs';

/**
 * Hashea una contraseña
 */
export const hashPassword = async (password) => {
  return bcryptjs.hash(password, 10);
};

/**
 * Compara contraseña con hash
 */
export const comparePassword = async (password, hash) => {
  return bcryptjs.compare(password, hash);
};
