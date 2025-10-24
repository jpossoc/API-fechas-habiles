import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { isHoliday } from "../servicios/festivosServicio";

// Configurar plugins de dayjs
dayjs.extend(utc);
dayjs.extend(timezone);

const ZONA_HORARIA_COLOMBIA = "America/Bogota";
const HORA_INICIO_LABORAL = 8; // 8:00 AM
const HORA_FIN_LABORAL = 17; // 5:00 PM (INCLUSIVE)
const HORA_INICIO_ALMUERZO = 12; // 12:00 PM
const HORA_FIN_ALMUERZO = 13; // 1:00 PM

/**
 * Verifica si una fecha es día laboral (lunes a viernes y no festivo)
 */
export function esDiaTrabajo(fecha: dayjs.Dayjs): boolean {
  const diaSemana = fecha.day(); // 0 = domingo, 6 = sábado
  const esFinDeSemana = diaSemana === 0 || diaSemana === 6;
  
  if (esFinDeSemana) return false;
  
  return !isHoliday(fecha);
}

/**
 * Verifica si una fecha está dentro del horario laboral
 * 12:00 PM exacto y 5:00 PM exacto SON horarios laborales
 */
export function esHoratrabajo(fecha: dayjs.Dayjs): boolean {
  const hora = fecha.hour();
  const minuto = fecha.minute();
  
  const minutosActuales = hora * 60 + minuto;
  const minutosInicioLaboral = HORA_INICIO_LABORAL * 60;
  const minutosFinLaboral = HORA_FIN_LABORAL * 60;
  const minutosInicioAlmuerzo = HORA_INICIO_ALMUERZO * 60;
  const minutosFinAlmuerzo = HORA_FIN_ALMUERZO * 60;
  
  // Fuera del horario laboral completo (antes de 8:00 AM o después de 5:00 PM)
  if (minutosActuales < minutosInicioLaboral || minutosActuales > minutosFinLaboral) {
    return false;
  }
  
  // En horario de almuerzo (entre 12:00 PM y 1:00 PM) pero 12:00 PM EXACTO SÍ es laboral
  if (minutosActuales > minutosInicioAlmuerzo && minutosActuales < minutosFinAlmuerzo) {
    return false;
  }
  
  return true;
}

/**
 * Aproxima una fecha al día/hora laboral más cercano hacia ATRÁS
 */
export function aproximarAFechaLaboral(fecha: dayjs.Dayjs): dayjs.Dayjs {
  let fechaAproximada = fecha.clone();
  const minutosOriginal = fecha.minute();
  const segundosOriginal = fecha.second();
  const milisegundosOriginal = fecha.millisecond();

  // 1. Primero aproximar el DÍA hacia atrás hasta encontrar día laboral
  while (!esDiaTrabajo(fechaAproximada)) {
    fechaAproximada = fechaAproximada.subtract(1, 'day')
      .set('hour', HORA_FIN_LABORAL) // 5:00 PM (última hora laboral INCLUSIVE)
      .set('minute', minutosOriginal)
      .set('second', segundosOriginal)
      .set('millisecond', milisegundosOriginal);
  }

  // 2. Luego aproximar la HORA dentro del día laboral
  const hora = fechaAproximada.hour();
  const minuto = fechaAproximada.minute();
  const minutosActuales = hora * 60 + minuto;

  const minutosInicioLaboral = HORA_INICIO_LABORAL * 60;
  const minutosFinLaboral = HORA_FIN_LABORAL * 60;
  const minutosInicioAlmuerzo = HORA_INICIO_ALMUERZO * 60;
  const minutosFinAlmuerzo = HORA_FIN_ALMUERZO * 60;

  // Si está antes del horario laboral (< 8:00 AM)
  if (minutosActuales < minutosInicioLaboral) {
    return fechaAproximada.subtract(1, 'day')
      .set('hour', HORA_FIN_LABORAL) // 5:00 PM día anterior
      .set('minute', minutosOriginal)
      .set('second', segundosOriginal)
      .set('millisecond', milisegundosOriginal);
  }

  // Si está después del horario laboral (> 5:00 PM)
  if (minutosActuales > minutosFinLaboral) {
    return fechaAproximada
      .set('hour', HORA_FIN_LABORAL) // 5:00 PM mismo día
      .set('minute', minutosOriginal)
      .set('second', segundosOriginal)
      .set('millisecond', milisegundosOriginal);
  }

  // Si está en horario de almuerzo (entre 12:00 PM y 1:00 PM, aproximar HACIA ATRÁS a 12:00 PM exacto)
  if (minutosActuales > minutosInicioAlmuerzo && minutosActuales < minutosFinAlmuerzo) {
    return fechaAproximada
      .set('hour', HORA_INICIO_ALMUERZO) // 12:00 PM
      .set('minute', 0) // Aproximar a hora exacta, no mantener minutos
      .set('second', 0)
      .set('millisecond', 0);
  }

  // Si ya está en horario laboral válido, mantener la fecha original
  return fechaAproximada;
}

/**
 * Obtiene la fecha actual en zona horaria de Colombia
 */
export function getTiempoActualColombia(): dayjs.Dayjs {
  return dayjs().tz(ZONA_HORARIA_COLOMBIA);
}

/**
 * Convierte una fecha UTC a zona horaria de Colombia
 */
export function utcATiempoColombia(utcDate: string): dayjs.Dayjs {
  return dayjs.utc(utcDate).tz(ZONA_HORARIA_COLOMBIA);
}

/**
 * Convierte una fecha de Colombia a UTC
 */
export function tiempoColombiaUTC(colombiaDate: dayjs.Dayjs): string {
  return colombiaDate.utc().format("YYYY-MM-DDTHH:mm:ss[Z]");
}

/**
 * Suma días hábiles a una fecha
 */
export function agregarDiaTrabajo(fechaInicio: dayjs.Dayjs, dias: number): dayjs.Dayjs {
  let fechaResultado = fechaInicio.clone();
  let diasRestantes = dias;
  
  while (diasRestantes > 0) {
    fechaResultado = fechaResultado.add(1, 'day');
    if (esDiaTrabajo(fechaResultado)) {
      diasRestantes--;
    }
  }
  
  return fechaResultado;
}

/**
 * Obtiene el fin del período laboral actual (mañana: 12PM, tarde: 5PM)
 */
function getFinalDePeriodo(fecha: dayjs.Dayjs): dayjs.Dayjs {
  const hour = fecha.hour();
  if (hour >= 8 && hour < 12) {
    return fecha.set('hour', 12).set('minute', 0).set('second', 0).set('millisecond', 0);
  } else if (hour >= 13 && hour < 17) {
    return fecha.set('hour', 17).set('minute', 0).set('second', 0).set('millisecond', 0);
  } else {
    // No debería llegar aquí si se llama correctamente
    return fecha;
  }
}

/**
 * Verifica si la fecha está en un período laboral (mañana o tarde)
 */
function EstaEnPeriodoTrabajo(fecha: dayjs.Dayjs): boolean {
  const hour = fecha.hour();
  return (hour >= 8 && hour < 12) || (hour >= 13 && hour < 17);
}

/**
 * Encuentra el inicio del siguiente período laboral
 */
function getInicioSiguientePeriodo(fecha: dayjs.Dayjs): dayjs.Dayjs {
  let candidato = fecha.clone();
  while (true) {
    if (esDiaTrabajo(candidato) && EstaEnPeriodoTrabajo(candidato)) {
      return candidato;
    }
    candidato = candidato.add(1, 'hour').set('minute', 0).set('second', 0).set('millisecond', 0);
    // Si llega a 12:00, saltar a 13:00
    if (candidato.hour() === 12) {
      candidato = candidato.set('hour', 13);
    }
    // Si llega a 18:00 o más, ir al siguiente día 8:00
    if (candidato.hour() >= 18 || candidato.hour() < 8) {
      candidato = candidato.add(1, 'day').set('hour', 8).set('minute', 0).set('second', 0).set('millisecond', 0);
    }
  }
}

/**
 * Suma horas hábiles a una fecha (VERSIÓN CORREGIDA CON FRACCIONES)
 */
export function agregarHorasTrabajo(fechaInicio: dayjs.Dayjs, horas: number): dayjs.Dayjs {
  if (horas <= 0) return fechaInicio.clone();
  
  let fecha = fechaInicio.clone();
  let horasRestantes = horas;
  
  while (horasRestantes > 0) {
    // Si no está en un período laboral, ir al inicio del siguiente
    if (!EstaEnPeriodoTrabajo(fecha)) {
      fecha = getInicioSiguientePeriodo(fecha);
    }
    
    // Calcular horas disponibles hasta el fin del período actual
    const endOfPeriod = getFinalDePeriodo(fecha);
    const availableHours = endOfPeriod.diff(fecha, 'hour', true);
    
    // Si no hay horas disponibles (ej. exactamente al final del día), saltar al siguiente período
    if (availableHours <= 0) {
      fecha = getInicioSiguientePeriodo(fecha);
      continue;
    }
    
    // Horas a agregar en este período
    const hoursToAdd = Math.min(horasRestantes, availableHours);
    
    // Agregar las horas
    fecha = fecha.add(hoursToAdd, 'hour');
    
    // Reducir horas restantes
    horasRestantes -= hoursToAdd;
  }
  
  return fecha;
}

/**
 * Función principal que calcula la fecha resultante según los parámetros
 */
export function calcularFechaResultante(
  dias?: number, 
  horas?: number, 
  fechaUTC?: string
): dayjs.Dayjs {
  // Validar que al menos un parámetro esté presente
  if (dias === undefined && horas === undefined && !fechaUTC) {
    throw new Error("Se requiere al menos uno de los parámetros: days o hours");
  }
  
  // Validar que sean números positivos si están presentes
  if (dias !== undefined && dias < 0) {
    throw new Error("El parámetro 'days' debe ser un número positivo");
  }
  
  if (horas !== undefined && horas < 0) {
    throw new Error("El parámetro 'hours' debe ser un número positivo");
  }
  
  // Obtener fecha inicial
  let fechaInicial: dayjs.Dayjs;
  if (fechaUTC) {
    fechaInicial = utcATiempoColombia(fechaUTC);
  } else {
    fechaInicial = getTiempoActualColombia();
  }
  
  // Aproximar a la fecha laboral más cercana HACIA ATRÁS
  let fechaCalculo = aproximarAFechaLaboral(fechaInicial);
  
  // Aplicar días primero si existen
  if (dias !== undefined && dias > 0) {
    fechaCalculo = agregarDiaTrabajo(fechaCalculo, dias);
    // Después de sumar días, asegurar que el día resultante sea laboral (saltar si no lo es)
    while (!esDiaTrabajo(fechaCalculo)) {
      fechaCalculo = fechaCalculo.add(1, 'day');
    }
    // Si la hora no es laboral, ajustar a 8:00 AM
    if (!esHoratrabajo(fechaCalculo)) {
      fechaCalculo = fechaCalculo.set('hour', 8).set('minute', 0).set('second', 0).set('millisecond', 0);
    }
  }
  
  // Aplicar horas después si existen
  if (horas !== undefined && horas > 0) {
    fechaCalculo = agregarHorasTrabajo(fechaCalculo, horas);
  }
  
  return fechaCalculo;
}
