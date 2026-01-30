/**
 * Módulo de utilidades matemáticas
 * Ejemplo de exports en ES Modules
 */

// Named exports (exportaciones con nombre)
export const sumar = (a, b) => a + b;

export const restar = (a, b) => a - b;

export const multiplicar = (a, b) => a * b;

export const dividir = (a, b) => {
  if (b === 0) {
    throw new Error('No se puede dividir por cero');
  }
  return a / b;
};

// Default export (exportación por defecto)
// Solo puede haber un default export por módulo
export default class Calculadora {
  constructor() {
    this.historial = [];
  }

  sumar(a, b) {
    const resultado = a + b;
    this.historial.push(`${a} + ${b} = ${resultado}`);
    return resultado;
  }

  restar(a, b) {
    const resultado = a - b;
    this.historial.push(`${a} - ${b} = ${resultado}`);
    return resultado;
  }

  multiplicar(a, b) {
    const resultado = a * b;
    this.historial.push(`${a} × ${b} = ${resultado}`);
    return resultado;
  }

  dividir(a, b) {
    if (b === 0) {
      throw new Error('No se puede dividir por cero');
    }
    const resultado = a / b;
    this.historial.push(`${a} ÷ ${b} = ${resultado}`);
    return resultado;
  }

  limpiarHistorial() {
    this.historial = [];
  }
}
