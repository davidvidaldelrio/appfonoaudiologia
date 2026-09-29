# Convenciones del proyecto

- Expo SDK 57: consultar la documentación versionada antes de añadir APIs nativas.
- Las rutas viven en `app/` y los componentes reutilizables en `components/`.
- No guardar secretos en el repositorio; usar `.env` a partir de `.env.example`.
- El contenido visible debe pasar por `services/i18n.ts`.
- Las funciones puras de progreso, puntuación y rachas deben tener tests.
- La evaluación de voz se integra detrás de un servicio, nunca directamente en las pantallas.
