/**
 * Tema 1 - Tests con node:test
 *
 * Ejemplo de tests nativos de Node.js.
 * Ejecutar: node --test src/math.test.js
 */

import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import { sumar, restar, multiplicar, dividir } from './utils/math.js';
import Calculadora from './utils/math.js';

describe('Funciones matemáticas (named exports)', () => {

  it('debe sumar dos números positivos', () => {
    assert.strictEqual(sumar(2, 3), 5);
  });

  it('debe sumar números negativos', () => {
    assert.strictEqual(sumar(-5, 3), -2);
  });

  it('debe restar dos números', () => {
    assert.strictEqual(restar(10, 4), 6);
  });

  it('debe multiplicar dos números', () => {
    assert.strictEqual(multiplicar(6, 7), 42);
  });

  it('debe dividir dos números', () => {
    assert.strictEqual(dividir(20, 4), 5);
  });

  it('debe lanzar error al dividir por cero', () => {
    assert.throws(
      () => dividir(10, 0),
      {
        name: 'Error',
        message: 'No se puede dividir por cero'
      }
    );
  });

});

describe('Clase Calculadora (default export)', () => {
  let calc;

  before(() => {
    calc = new Calculadora();
  });

  after(() => {
    calc = null;
  });

  it('debe iniciar con historial vacío', () => {
    const nuevaCalc = new Calculadora();
    assert.deepStrictEqual(nuevaCalc.historial, []);
  });

  it('debe sumar y guardar en historial', () => {
    const resultado = calc.sumar(10, 5);
    assert.strictEqual(resultado, 15);
    assert.ok(calc.historial.includes('10 + 5 = 15'));
  });

  it('debe restar y guardar en historial', () => {
    const resultado = calc.restar(20, 8);
    assert.strictEqual(resultado, 12);
    assert.ok(calc.historial.includes('20 - 8 = 12'));
  });

  it('debe multiplicar y guardar en historial', () => {
    const resultado = calc.multiplicar(3, 4);
    assert.strictEqual(resultado, 12);
    assert.ok(calc.historial.includes('3 × 4 = 12'));
  });

  it('debe limpiar el historial', () => {
    calc.sumar(1, 1);
    assert.ok(calc.historial.length > 0);
    calc.limpiarHistorial();
    assert.deepStrictEqual(calc.historial, []);
  });

});

describe('Tests asíncronos', () => {

  it('debe resolver una promesa', async () => {
    const resultado = await Promise.resolve(42);
    assert.strictEqual(resultado, 42);
  });

  it('debe manejar múltiples promesas', async () => {
    const resultados = await Promise.all([
      Promise.resolve(1),
      Promise.resolve(2),
      Promise.resolve(3)
    ]);
    assert.deepStrictEqual(resultados, [1, 2, 3]);
  });

  it('debe rechazar promesa correctamente', async () => {
    await assert.rejects(
      async () => {
        throw new Error('Error de prueba');
      },
      {
        name: 'Error',
        message: 'Error de prueba'
      }
    );
  });

});
