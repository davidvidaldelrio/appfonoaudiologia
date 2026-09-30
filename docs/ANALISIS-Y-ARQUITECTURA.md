# HáblaMejor — Análisis de base, arquitectura y plan

> Documento de respaldo. Recoge el análisis de la base funcional (mapa conceptual + wireframes),
> la opinión técnica, el encaje con el stack de referencia, el modelo de datos propuesto y el
> plan por fases. Última actualización: 2026-09-29.

---

## 1. Qué es

App móvil de **estimulación de habla, lenguaje, voz y comunicación** para todas las edades
(infantil, adultos y adultos mayores), con contenido experto validado por fonoaudiólogos.

### Estructura funcional de la base

| Elemento | Detalle |
| --- | --- |
| **Navegación** | 5 pestañas: Inicio · Rutas · Practicar · Progreso · Perfil |
| **Dominios de contenido** | Habla, Lenguaje, Voz, Memoria y atención, Estimulación, Lectura |
| **Categorías** | Articulación, Vocabulario, Comprensión, Expresión, Pronunciación, Fluidez, Dicción, Replicación… |
| **Rutas** | Itinerarios por niveles (ej. Pronunciación: Reconocer → Identificar → Imitar → Producir → Frases → Conversación → Discursos) |
| **Ciclo de práctica** | Actividad con micrófono → feedback inmediato + XP → progreso/racha → logros → nuevas rutas |
| **Perfiles** | Multi-perfil familiar (hijo/a, adulto mayor…) + **modo infantil** separado |
| **Monetización** | Free con anuncios / Premium mensual / Packs individuales |

### Flujo de usuario

1. Descarga e instala la app
2. Onboarding y bienvenida
3. Crea o selecciona un perfil (puede ser familiar)
4. Define sus objetivos
5. Realiza la evaluación inicial *(opcional)*
6. Descubre sus rutas personalizadas
7. Comienza a practicar con las actividades
8. Ve su progreso y desbloquea logros
9. Explora nuevas rutas o contenido premium

---

## 2. Opinión general

**El concepto es sólido y comercialmente viable.** El ciclo de valor está bien resuelto
(practicar → feedback → progreso → desbloquear), hay gamificación para retención (racha, XP,
logros) y un modelo de negocio coherente para LatAm. La navegación es la correcta y los
wireframes son consistentes entre sí.

**Pero la base describe un producto completo (10+ features), no un MVP.** El riesgo no es la
idea: es intentar construir todo el mapa de una vez.

---

## 3. Fortalezas

- **Ciclo de retención bien resuelto**: sesión corta ("10 min al día") + racha + XP + logros = hábito.
- **Multi-perfil familiar**: un login, varios usuarios → ideal para fonoaudiología (el padre practica con el hijo).
- **Rutas por niveles**: convierte contenido suelto en un camino con progresión, lo que sostiene el Premium.
- **Modo infantil diferenciado**: bien planteado; debe ser un *modo* (flag), no una app aparte.

---

## 4. Riesgos y decisiones críticas

| # | Riesgo | Recomendación |
| --- | --- | --- |
| 1 | **Motor de feedback de pronunciación**: es el diferenciador *y* el mayor riesgo técnico (scoring fonema a fonema en español, en tiempo real, con voces de niños y adultos mayores). | Decidir **build vs buy** antes de escribir código. Azure Speech *Pronunciation Assessment* (`es-ES/es-MX/es-CL`) es la vía más rápida y precisa; Google STT + scoring propio es más barato pero menos fino. **Prototipo aislado primero.** |
| 2 | **Legal/privacidad**: grabar voces de menores (COPPA / GDPR-K / Ley 21.719 en Chile). | Consentimiento parental explícito, retención configurable, borrado real y **cero anuncios en modo infantil** (el "Free con publicidad" es peligroso si hay niños). |
| 3 | **El contenido es el verdadero moat**, no la app. "Validado por fonoaudiólogos" es caro y lento. | Sin plan de autoría de contenido, el Premium no tiene qué vender. ¿Quién y cómo produce las rutas/actividades? |
| 4 | **Compras dentro de la app**: Expo **no** trae IAP nativo. | `RevenueCat` (o `react-native-iap`). Es dependencia nativa → requiere *development build*, no Expo Go. |
| 5 | **Audio pesado**: grabaciones + caché offline. | Supabase **Storage** (buckets con RLS) + caché local, reusando la cola de sincronización de `app_agua`. |
| 6 | **Panel admin (wireframe 14)** dentro del móvil. | Mejor **web aparte** (Next.js) sobre el mismo Supabase con roles. Meterlo en el móvil es deuda técnica. |
| 7 | **Cuenta obligatoria desde el inicio**. `app_agua` la exige; aquí puede **matar la conversión** (el wireframe dice "descarga → onboarding"). | Permitir **modo invitado** (perfil local) y pedir cuenta solo al suscribir/sincronizar. |
| 8 | **Nombre inconsistente**: aparece "HáblaMejor" y "HábalaMejor". | Fijar uno (afecta a `name`, `slug`, `scheme`, `package`). |

---

## 5. Encaje técnico con el proyecto de referencia

El esqueleto de `registro_agua_app` **se reutiliza casi tal cual**:

- Expo SDK 57 + React Native 0.86 + expo-router (typed routes) + TypeScript
- Supabase (auth, tablas + RLS, `schema.sql` idempotente, cola de sync offline)
- i18n ES/EN tipado · Jest (`jest-expo`) · ESLint/Prettier
- `README.md` · `AGENTS.md` · `PENDIENTES.txt`

### Cambios respecto a la referencia

**Añadir**

- `expo-audio` (grabación/reproducción)
- Librería de IAP (`RevenueCat` o `react-native-iap`)
- SDK de evaluación de voz (Azure Speech)
- Analítica y crash reporting

**Renombrar dominio**

| Referencia (`app_agua`) | Nuevo |
| --- | --- |
| `WaterContext` | `LearningContext` / `SessionContext` |
| `services/hydration.ts` | `services/practice.ts` |
| `pets` / `shop` / `rewards` | `routes` / `activities` / `achievements` |

### Estructura de carpetas propuesta

```
app/                 Rutas de expo-router: auth + pestañas (/, /rutas, /practicar,
                     /progreso, /perfil) + modo infantil
components/          Pantallas y componentes (screens, BottomTabBar, ActivityPlayer,
                     ScoreFeedback, ProgressChart, VirtualCoach…)
context/             Estado global, cola de sincronización y Realtime
services/            Supabase, auth, rutas, actividades, evaluación de voz, progreso,
                     logros, suscripción, i18n
supabase/schema.sql  Esquema completo de la base de datos (idempotente)
scripts/             Utilidades puntuales
__tests__/           Tests de la lógica pura
docs/                Documentación de producto y arquitectura
```

---

## 6. Modelo de datos propuesto

```
profiles          id, account_id, display_name, birth_year, mode (adult|kid),
                  onboarded, goals[], locale, timezone, consented_at
goals             id, code, label_es, label_en
evaluations       id, profile_id, domain, score, taken_at (referencial)
routes            id, domain, code, title_es, title_en, level_min, level_max, is_premium
levels            id, route_id, order, title_es, title_en, unlocks_at
activities        id, level_id, type, prompt, media_url, target_phonemes[], is_premium, payload jsonb
attempts          id, activity_id, profile_id, score, accuracy, audio_url, duration_ms, created_at
progress          profile_id, route_id, level_id, status, best_score, updated_at
streaks           profile_id, current, longest, last_practice_on
achievements      id, code, title_es, title_en, criteria jsonb
user_achievements profile_id, achievement_id, unlocked_at
entitlements      account_id, kind (premium|pack), pack_code, expires_at, source
```

Notas:

- `attempts.audio_url` apunta a Supabase **Storage**; la política de retención decide si se conserva.
- `activities.payload` (jsonb) permite tipar actividades sin migrar el esquema por cada tipo nuevo.
- Multi-perfil: `profiles` cuelga de `account_id` (la cuenta de auth), no al revés.

---

## 7. Plan por fases

### Fase 1 — El corazón (validar el feedback)

Onboarding + perfil (adulto/niño) + **1 dominio (Habla/Pronunciación)** + 1 ruta con 3 niveles +
actividad con micrófono + feedback con score + progreso + racha.

> Sin premium, sin packs, sin admin.

### Fase 2 — Retención

Logros, XP, más rutas, historial, notificaciones.

### Fase 3 — Negocio

Premium + packs, IAP, panel admin web, estadísticas avanzadas, grabaciones.

### Fase 4 — Escala

Los 6 dominios completos, i18n, tablet, accesibilidad.

---

## 8. Preguntas abiertas

1. ¿**Feedback de voz**: lo compramos (Azure) o lo construimos? ¿Tiempo real o diferido?
2. ¿**Quién produce el contenido** validado por fonoaudiólogos?
3. ¿Mercado principal (Chile/LatAm)? ¿Precios en CLP ya definidos?
4. ¿**Multi-perfil** hasta cuántos? ¿Los perfiles de menores requieren consentimiento parental?
5. ¿Cuenta obligatoria o invitado primero?
6. ¿Reutilizamos el repo de referencia como plantilla o partimos limpio?

---

## 9. Estado actual del proyecto

### Completado

- Repositorio creado en GitHub: `davidvidaldelrio/appfonoaudiologia`.
- Scaffold inicial creado con Expo SDK 57, React Native, TypeScript y Expo Router.
- Identificador técnico provisional: `appfonoaudiologia`.
- Nombre visible provisional: `HáblaMejor`.
- Navegación inicial con cinco pestañas: Inicio, Rutas, Practicar, Progreso y Perfil.
- Contexto global inicial en `LearningContext` para perfil activo, racha y minutos practicados.
- Componentes base: pantalla, barra de tabs y tarjetas de rutas.
- Tres rutas demostrativas: Pronunciación, Vocabulario y Respiración y voz.
- Actividad demostrativa de pronunciación con la palabra objetivo `rana`.
- Servicio inicial de práctica con tipos de dominio, rutas y cálculo de nivel.
- Catálogo inicial de textos en español.
- Primer test unitario para el cálculo de niveles.
- Variables de entorno documentadas en `.env.example`.
- Revisión visual realizada en web mediante Expo en `http://localhost:8081`.
- Onboarding local implementado: bienvenida, tipo de usuario, perfil, rango de edad, objetivos y confirmación.
- Estado del onboarding persistido con AsyncStorage para permitir modo invitado sin backend.
- Inicio personalizado con el nombre del perfil creado y ruta recomendada de Pronunciación.
- Inicio conectado a los objetivos del perfil, con recomendación dinámica y fallback seguro.
- Tarjetas de rutas conectadas a una actividad con feedback local y puntuación.
- Progreso local persistido: minutos, mejor puntuación por ruta, racha y progreso general.
- Grabación de micrófono integrada detrás de un servicio con `expo-audio` y permiso configurado.

### Validaciones realizadas

- `npm install`: correcto.
- `npm run typecheck`: correcto.
- `npm test -- --runInBand`: correcto; 1 suite y 1 test aprobados.
- `npm run lint`: correcto.
- `npx expo export --platform web`: correcto; incluye `/activity/[routeId]`.
- `npm test -- --runInBand`: correcto; 3 suites y 6 tests aprobados tras separar el runtime nativo.
- Rama `main` sincronizada con el repositorio remoto.
- `npm run typecheck`: correcto tras implementar onboarding.
- `npm test -- --runInBand`: correcto; 2 suites y 3 tests aprobados.
- `npm run lint`: correcto.

### Decisiones que siguen pendientes

- Confirmar el nombre definitivo entre `HáblaMejor` y `HábalaMejor`.
- Decidir si el primer flujo permite invitado o exige autenticación.
- Elegir proveedor de evaluación de voz antes de implementar el feedback real.
- Definir el contenido validado por un fonoaudiólogo para la primera ruta.

---

## 10. Siguiente paso: onboarding del MVP

El siguiente incremento debe implementar el onboarding antes de ampliar el catálogo de rutas.
La primera versión debe ser breve y permitir probar el flujo principal sin backend:

1. Pantalla de bienvenida con la propuesta de valor.
2. Selección de tipo de usuario: para mí, para mi hijo/a o para un adulto mayor.
3. Creación del perfil local con nombre y rango de edad.
4. Selección de uno o más objetivos: pronunciación, lenguaje, voz, memoria o lectura.
5. Pantalla de confirmación que dirige a Inicio con una ruta recomendada.

Para este paso se recomienda:

- Guardar el estado de onboarding localmente para permitir modo invitado.
- Mantener todos los textos en `services/i18n.ts`.
- No integrar todavía autenticación, pagos ni evaluación de voz real.
- Añadir tests para la selección de objetivos y la finalización del onboarding.
- Mantener la integración de audio detrás de un servicio, no dentro de las pantallas.

El criterio de terminado será: un usuario nuevo puede abrir la app, completar el onboarding,
crear un perfil, seleccionar un objetivo y llegar a una pantalla de Inicio personalizada.
