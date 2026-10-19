# HáblaMejor (app_fonoau)

App móvil de estimulación de **habla, lenguaje, voz y comunicación** para todas las edades.

Este repositorio está en fase de **definición**: la base funcional, el análisis de riesgos,
la arquitectura propuesta y el plan por fases viven en:

- [`docs/ANALISIS-Y-ARQUITECTURA.md`](docs/ANALISIS-Y-ARQUITECTURA.md)

Proyecto de referencia (stack y convenciones): `registro_agua_app`.

## Estado

- [x] Análisis de la base funcional (mapa conceptual + wireframes)
- [x] Arquitectura y modelo de datos propuestos
- [x] Scaffold del proyecto y navegación principal
- [x] MVP Fase 1: onboarding, perfiles, rutas, práctica y progreso base
- [ ] Integración de evaluación de voz real con servicio externo
- [ ] Persistencia completa con Supabase y sincronización offline
- [ ] Validación Nativo/QA con Expo y dispositivos reales

## Siguiente prioridad

La siguiente fase real no es monetización ni panel admin: es cerrar la evaluación de voz y la persistencia real.

1. Definir el servicio de scoring: Azure Speech Pronunciation Assessment vs. alternativa interna.
2. Aislar la lógica de evaluación detrás de `services/voice.ts` para poder cambiar proveedor sin tocar pantallas.
3. Conectar `services/supabase.ts` con perfiles, rutas y progreso reales.
4. Validar flujo completo en dispositivo: onboarding → práctica con micrófono → feedback → progreso → racha.

## Nombre

> El proyecto quedó definido como **"HáblaMejor"** para mantener consistencia en `app.json`, `scheme` y branding visual.
