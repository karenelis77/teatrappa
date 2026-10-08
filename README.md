# TeatrAppa – demo navegable

Prototipo front-end (React + Vite + TypeScript) con datos de ejemplo. Sin backend: todo se guarda en `localStorage`.

Flujo: splash → login / invitado → home → teatros → ficha → obras → ficha de obra → compra (control de aforo, pago simulado, QR) → Mi ID. Incluye géneros, favoritos, reseñas, suscripciones y un panel de teatro (con reporte CSV).

```bash
npm install
npm run dev     # desarrollo
npm run build   # producción
```

## Despliegue en Vercel
Importar el repo y en **Root Directory** poner `teatrappa-demo`. Framework: Vite (autodetectado). `vercel.json` ya maneja las rutas SPA.
