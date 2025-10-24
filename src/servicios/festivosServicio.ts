import axios from "axios";
import dayjs, { Dayjs } from "dayjs";

let festivos: Dayjs[] = [];
let festivosCargados = false;

/**
 * Descarga los festivos desde el JSON remoto y los guarda en memoria.
 */
export async function cargarFestivos(): Promise<void> {
  try {
    console.log("📥 Cargando festivos DESDE EL JSON OFICIAL...");
    const url = "https://content.capta.co/Recruitment/WorkingDays.json";
    const response = await axios.get(url);

    // LIMPIAR array completamente
    festivos = [];
    
    // SOLO usar los festivos del JSON, ignorar cualquier otro
    festivos = response.data.map((f: string) => dayjs(f));
    festivosCargados = true;

    console.log(`✅ ${festivos.length} festivos cargados EXCLUSIVAMENTE del JSON`);
    
    
    // Mostrar todos los festivos para verificación
   
    
  } catch (error) {
    console.error("❌ Error al cargar los festivos:", error);
    festivosCargados = false;
    throw error;
  }
}

/**
 * Retorna true si la fecha es festivo.
 * SOLO considera festivos del JSON, ignora cualquier otro.
 */
export function isHoliday(date: Dayjs): boolean {
  if (!festivosCargados) {
    console.warn("⚠️ Festivos no cargados aún - asumiendo día laboral");
    return false;
  }
  
  // SOLO verificar contra nuestra lista del JSON
  const esFestivo = festivos.some((f) => f.isSame(date, "day"));
  
  // LOG de depuración para diagnóstico
  const fechaStr = date.format('YYYY-MM-DD');
  if (fechaStr === '2025-07-01') {
  }
  
  return esFestivo;
}

/**
 * Retorna todos los festivos cargados (para depuración o pruebas).
 */
export function getFestivos(): string[] {
  return festivos.map((f) => f.format("YYYY-MM-DD"));
}

/**
 * Verifica si una fecha específica está en la lista del JSON
 */
export function esFestivoSegunJSON(fecha: string): boolean {
  const fechaDayjs = dayjs(fecha);
  return festivos.some(f => f.isSame(fechaDayjs, 'day'));
}