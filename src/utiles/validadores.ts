// utiles/validadores.ts

/**
 * Interfaz para errores de validación
 */
export interface ValidationError {
  error: string;
  message: string;
}

/**
 * Valida el parámetro 'days'
 */
export function validarDays(days: any): ValidationError | null {
  if (days === undefined) return null;

  if (typeof days !== 'number') {
    return {
      error: "InvalidParameterType",
      message: "El parámetro 'days' debe ser un número"
    };
  }

  if (!Number.isInteger(days)) {
    return {
      error: "InvalidParameterValue", 
      message: "El parámetro 'days' debe ser un número entero"
    };
  }

  if (days < 0) {
    return {
      error: "InvalidParameterValue",
      message: "El parámetro 'days' debe ser un entero positivo"
    };
  }

  if (days > 365) {
    return {
      error: "InvalidParameterValue",
      message: "El parámetro 'days' no puede ser mayor a 365"
    };
  }

  return null;
}

/**
 * Valida el parámetro 'hours'
 */
export function validarHours(hours: any): ValidationError | null {
  if (hours === undefined) return null;

  if (typeof hours !== 'number') {
    return {
      error: "InvalidParameterType",
      message: "El parámetro 'hours' debe ser un número"
    };
  }

  if (!Number.isInteger(hours)) {
    return {
      error: "InvalidParameterValue",
      message: "El parámetro 'hours' debe ser un número entero"
    };
  }

  if (hours < 0) {
    return {
      error: "InvalidParameterValue",
      message: "El parámetro 'hours' debe ser un entero positivo"
    };
  }

  if (hours > 24 * 30) { // Máximo 30 días en horas
    return {
      error: "InvalidParameterValue", 
      message: "El parámetro 'hours' no puede ser mayor a 720 (30 días)"
    };
  }

  return null;
}

/**
 * Valida el parámetro 'date'
 */
export function validarDate(date: any): ValidationError | null {
  if (date === undefined) return null;

  if (typeof date !== 'string') {
    return {
      error: "InvalidParameterType",
      message: "El parámetro 'date' debe ser un string"
    };
  }
  
  // Validar formato ISO 8601 con Z
  const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;
  if (!isoRegex.test(date)) {
    return {
      error: "InvalidDateFormat",
      message: "El parámetro 'date' debe estar en formato ISO 8601 UTC (YYYY-MM-DDTHH:mm:ssZ)"
    };
  }

  // Validar que sea una fecha válida
  const fecha = new Date(date);
  if (isNaN(fecha.getTime())) {
    return {
      error: "InvalidDate",
      message: "El parámetro 'date' contiene una fecha inválida"
    };
  }

  // Validar que no sea una fecha futura excesiva
  const fechaMaxima = new Date();
  fechaMaxima.setFullYear(fechaMaxima.getFullYear() + 2); // Máximo 2 años en el futuro
  if (fecha > fechaMaxima) {
    return {
      error: "InvalidDateRange",
      message: "La fecha no puede ser mayor a 2 años en el futuro"
    };
  }

  return null;
}

/**
 * Valida que al menos un parámetro esté presente
 */
export function validarParametrosRequeridos(days?: number, hours?: number): ValidationError | null {
  if (days === undefined && hours === undefined) {
    return {
      error: "MissingParameters",
      message: "Se requiere al menos uno de los parámetros: days o hours"
    };
  }
  return null;
}