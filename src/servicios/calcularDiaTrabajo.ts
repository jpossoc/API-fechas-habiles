import { calcularFechaResultante, tiempoColombiaUTC } from "../utiles/tiempoUtiles";
import { 
  validarParametrosRequeridos, 
  validarDays, 
  validarHours, 
  validarDate,
  ValidationError 
} from "../utiles/validadores";
import { crearErrorValidacion, crearErrorCalculacion } from "../utiles/manejadorErrores";

/**
 * Convierte y valida parámetros de entrada crudos
 */
function procesarYValidarParametros(params: { date?: any; days?: any; hours?: any }): { date?: string; days?: number; hours?: number } {
  const { date, days, hours } = params;
  
  const resultado: { date?: string; days?: number; hours?: number } = {};

  // Procesar days
  if (days !== undefined && days !== null && days !== '') {
    if (Array.isArray(days)) {
      throw crearErrorValidacion({
        error: "InvalidParameterType",
        message: "El parámetro 'days' no puede ser un array"
      });
    }
    
    const diasNum = typeof days === 'string' ? parseInt(days, 10) : Number(days);
    if (isNaN(diasNum)) {
      throw crearErrorValidacion({
        error: "InvalidParameterType", 
        message: "El parámetro 'days' debe ser un número válido"
      });
    }
    resultado.days = diasNum;
  }

  // Procesar hours
  if (hours !== undefined && hours !== null && hours !== '') {
    if (Array.isArray(hours)) {
      throw crearErrorValidacion({
        error: "InvalidParameterType",
        message: "El parámetro 'hours' no puede ser un array"
      });
    }
    
    const horasNum = typeof hours === 'string' ? parseInt(hours, 10) : Number(hours);
    if (isNaN(horasNum)) {
      throw crearErrorValidacion({
        error: "InvalidParameterType",
        message: "El parámetro 'hours' debe ser un número válido"
      });
    }
    resultado.hours = horasNum;
  }

  // Procesar date
  if (date !== undefined && date !== null && date !== '') {
    if (Array.isArray(date)) {
      throw crearErrorValidacion({
        error: "InvalidParameterType",
        message: "El parámetro 'date' no puede ser un array"
      });
    }
    resultado.date = String(date);
  }

  return resultado;
}

/**
 * Función principal que calcula la fecha laboral resultante
 */
export function calcularDiaTrabajo(params: { 
  date?: any; 
  days?: any; 
  hours?: any; 
}): string {
  // Primero procesar y convertir parámetros
  const parametrosProcesados = procesarYValidarParametros(params);
  const { date, days, hours } = parametrosProcesados;

  // Luego validar parámetros requeridos
  const errorRequeridos = validarParametrosRequeridos(days, hours);
  if (errorRequeridos) throw crearErrorValidacion(errorRequeridos);

  // Validar parámetros individuales
  const errors: ValidationError[] = [];
  
  const errorDays = validarDays(days);
  if (errorDays) errors.push(errorDays);
  
  const errorHours = validarHours(hours);
  if (errorHours) errors.push(errorHours);
  
  const errorDate = validarDate(date);
  if (errorDate) errors.push(errorDate);

  // Si hay errores, lanzar el primero
  if (errors.length > 0) {
    throw crearErrorValidacion(errors[0]);
  }

  try {
    // Usar la lógica ya implementada en tiempoUtiles
    const fechaResultanteColombia = calcularFechaResultante(days, hours, date);
    const fechaResultanteUTC = tiempoColombiaUTC(fechaResultanteColombia);
    
    return fechaResultanteUTC;
  } catch (error) {
    // Relanzar el error con un mensaje más específico
    if (error instanceof Error) {
      throw crearErrorCalculacion(error.message);
    }
    
    throw crearErrorCalculacion("Error desconocido en el cálculo");
  }
}