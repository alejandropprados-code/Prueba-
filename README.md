# MediApp · Portal sanitario (demo)

Aplicación de **prueba** que simula un portal sanitario con dos roles bien
diferenciados: **médico** y **paciente**. Permite gestionar **citas** y
**recetas** según quién inicie sesión.

> ⚠️ Es una demo educativa. No usa backend real ni autenticación: los datos
> de ejemplo se guardan en el `localStorage` del navegador. **No introduzcas
> datos médicos reales.**

## Características

### 👩‍⚕️ Vista del médico

- **Inicio**: indicadores (citas de hoy, citas por confirmar, recetas activas,
  nº de pacientes) y agenda del día.
- **Agenda**: lista de citas con acciones para **confirmar**, **completar**
  (añadiendo notas de consulta) o **cancelar**, y alta de nuevas citas.
- **Pacientes**: listado con ficha de cada paciente (edad, grupo sanguíneo,
  alergias, historial de citas y recetas) y opción de **emitir recetas**.
- **Recetas**: listado de recetas emitidas, con opción de finalizarlas o crear
  nuevas.

### 🧑 Vista del paciente

- **Inicio**: resumen con próximas citas y tratamientos activos.
- **Mis citas**: solicitar citas (eligiendo profesional, fecha y motivo),
  consultarlas y anularlas.
- **Mis recetas**: tratamientos prescritos con dosis, frecuencia, duración e
  instrucciones.
- **Mi perfil**: datos personales y médicos.

## Stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite 7](https://vite.dev/) como bundler / servidor de desarrollo
- [Tailwind CSS 4](https://tailwindcss.com/) para los estilos
- [lucide-react](https://lucide.dev/) para los iconos
- Estado global mediante React Context + persistencia en `localStorage`

No hay dependencias de backend: la app es autónoma y arranca al instante.

## Puesta en marcha

```bash
# instalar dependencias (también funciona con npm o pnpm)
bun install

# servidor de desarrollo en http://localhost:5173
bun run dev

# compilar para producción
bun run build && bun run preview
```

## Cómo probarla

1. En la pantalla de acceso elige **Médico** o **Paciente**.
2. Selecciona uno de los perfiles de demostración.
3. Explora las distintas secciones. Los cambios (citas, recetas, estados) se
   guardan en tu navegador, así que persisten al recargar.
4. Cierra sesión para cambiar de rol y ver la experiencia desde el otro lado
   (p. ej. una receta emitida por la **Dra. Elena Ríos** a **Lucía Fernández**
   aparece en «Mis recetas» de Lucía).

## Estructura

```
src/
├── apps/            # Aplicaciones por rol (DoctorApp, PatientApp)
├── components/      # UI reutilizable (Layout, tarjetas, formularios, primitivas)
├── data/seed.ts     # Datos de ejemplo (médicos, pacientes, citas, recetas)
├── lib/format.ts    # Utilidades de fecha/edad
├── store/           # Estado global + persistencia (AppContext)
├── types.ts         # Modelo de datos
└── App.tsx          # Enrutado según el rol del usuario
```
