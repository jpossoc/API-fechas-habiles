# 📘 API - fechas habiles

Esta API permite agendar un horario en funcion de una fecha especifica, o una hora o un dia especifico de manera que se evalue solo en horario laboral teniendo en cuenta los festivos del pais. 
## 🧑‍💻 Johan Sebastian Posso Castaño



---

## 🚀 Instalación y ejecución local

### 1️⃣ Requisitos previos
- [Node.js](https://nodejs.org/) (versión 18 o superior)
- [npm](https://www.npmjs.com/)

---

### 2️⃣ Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/tu-repositorio.git
cd tu-repositorio
```

---

### 3️⃣ Instalar dependencias
```bash
npm install
```

---

### 4️⃣ Ejecutar el servidor en desarrollo
```bash
npm run dev
```

O en modo producción:
```bash
npm run build
npm start
```

El servidor se ejecutará por defecto en:
```
http://localhost:3000
```

---

## 🧩 Endpoints disponibles

### **GET /**
Calcula los días de trabajo según los parámetros enviados.

#### **Parámetros (query):**
| Nombre | Tipo | Descripción |
|---------|------|-------------|
| `days` | Número | Días trabajados |
| `hours` | Número | Horas trabajadas |
| `date` | String | Fecha de inicio (en formato inglés, ej: `2025-10-23`) |

#### **Ejemplo de petición**
```
GET http://localhost:3000/?days=5&hours=8&date=2025-10-23
GET https://api-fechas-habiles-psi.vercel.app/calcular?days=4
```

#### **Ejemplo de respuesta**
```json
{
  "message": "Día de trabajo calculado correctamente",
  "result": "2025-10-28"
}
```

---

## ⚙️ Estructura del proyecto

```
src/
├── rutas/
│   └── calcular.ts
├── servicios/
│   └── calcularDiaTrabajo.ts
│   └── festivosServicio.ts
├── utiles/
│   └── manejadorErrores.ts
|   └── tiempoUtiles.ts
|   └── validadores.ts
└── index.ts
```

---

## 🧱 Tecnologías principales
- **Node.js** (v18+)
- **Express**
- **TypeScript**

---

## ⚠️ Manejo de errores
Los errores se controlan mediante un manejador central en `manejadorErrores.ts`,  
el cual devuelve respuestas estandarizadas con el mensaje y código del error.

---
