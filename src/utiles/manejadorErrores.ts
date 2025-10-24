// utiles/manejadorErrores.ts
import { ValidationError } from "./validadores";

/**
 * Crea un error de validación formateado para lanzar
 */
export function crearErrorValidacion(error: ValidationError): Error {
  return new Error(JSON.stringify(error));
}

/**
 * Parsea un error y devuelve el objeto ValidationError si es posible
 */
export function parsearError(error: unknown): ValidationError | null {
  if (error instanceof Error) {
    try {
      return JSON.parse(error.message) as ValidationError;
    } catch {
      // No es un error de validación JSON
    }
  }
  return null;
}

/**
 * Crea un error de cálculo
 */
export function crearErrorCalculacion(mensaje: string): Error {
  return crearErrorValidacion({
    error: "CalculationError",
    message: `Error en el cálculo: ${mensaje}`
  });
}

/**
 * Crea un error interno del servidor
 */
export function crearErrorInterno(mensaje: string = "Error interno del servidor"): Error {
  return crearErrorValidacion({
    error: "InternalServerError",
    message: mensaje
  });
}