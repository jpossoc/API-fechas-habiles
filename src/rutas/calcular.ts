import { Router } from "express";
import { calcularDiaTrabajo } from "../servicios/calcularDiaTrabajo";
import { parsearError } from "../utiles/manejadorErrores";

const router = Router();

router.get("/", (req, res) => {
  try {
    const { days, hours, date } = req.query;

    // Convertir parámetros de forma simple - la validación fuerte está en el servicio
    const dias = days ? parseInt(days as string) : undefined;
    const horas = hours ? parseInt(hours as string) : undefined;
    const fechaUTC = date as string | undefined;

    // Usar la función principal (ella hace toda la validación)
    const fechaResultante = calcularDiaTrabajo({
      date: fechaUTC,
      days: dias,
      hours: horas
    });

    return res.json({ date: fechaResultante });

  } catch (error) {
    console.error("Error en el cálculo:", error);
    
    // Manejar errores de validación
    const errorValidacion = parsearError(error);
    if (errorValidacion) {
      return res.status(400).json(errorValidacion);
    }

    // Error interno
    return res.status(503).json({
      error: "InternalServerError",
      message: "Error interno del servidor"
    });
  }
});

export default router;