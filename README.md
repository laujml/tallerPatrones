# CMS API - Taller de Patrones de Diseño

## Descripción general

Este proyecto es una API REST tipo CMS (Content Management System) construida con Node.js, Express y TypeScript.

Permite gestionar posts (tipo blog) mediante una arquitectura modular dividida por "personas", simulando trabajo en equipo real.

---

## Tecnologías utilizadas

- Node.js
- Express
- TypeScript
- Jest
- ts-node-dev

---

## Estructura del proyecto

```
src/
 ├── app.ts
 ├── server.ts
<<<<<<< HEAD
 ├── models/
 │     └── post.ts
 ├── data/
 │     └── posts.store.ts
 ├── services/
 │     └── post.service.ts
 ├── controllers/
 │     └── post.controller.ts
 ├── routes/
 │     └── post.routes.ts
 └── __tests__/
       ├── health.test.ts
       └── posts.index.test.ts
=======
 ├── data/
 │     └── postsStore.ts
 ├── routes/
 │     └── posts.ts
 ├── __tests__/
 │     ├── health.test.ts
 │     └── posts.test.ts
>>>>>>> origin/main

doc/
 └── ai/plans/
       ├── 00-foundation.md
       └── 01-index.md

package.json
tsconfig.json
README.md
.gitignore
```

---

## Instalación

```
npm install
```

---

## Ejecutar el proyecto

```
npm run dev
```

http://localhost:3000

---

<<<<<<< HEAD
## Endpoints disponibles
=======
##  Endpoints disponibles
>>>>>>> origin/main

### GET /health

Respuesta:

```json
{
  "status": "ok"
}
```

### GET /posts

Lista los posts existentes con filtros, búsqueda, orden y paginación. Excluye automáticamente los posts con soft delete (`deleted_at`).

**Query params:**

| Param       | Tipo   | Default      | Descripción                                              |
|-------------|--------|--------------|------------------------------------------------------------|
| `page`      | number | `1`          | Página actual                                               |
| `limit`     | number | `10`         | Registros por página (máx. 100)                             |
| `status`    | string | -            | `draft` \| `publish` \| `pending` \| `private` \| `trash`   |
| `author_id` | number | -            | Filtra por autor                                            |
| `search`    | string | -            | Búsqueda parcial en `title`/`content`                       |
| `sortBy`    | string | `created_at` | `created_at` \| `updated_at` \| `title` \| `status`          |
| `order`     | string | `desc`       | `asc` \| `desc`                                              |

**Respuesta (200 OK):**

```json
{
  "data": [
    {
      "id": 1,
      "title": "Introducción a TypeScript",
      "content": "...",
      "slug": "introduccion-a-typescript",
      "status": "publish",
      "author_id": 1,
      "created_at": "2026-06-01T10:00:00.000Z",
      "updated_at": "2026-06-01T10:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 4,
    "totalPages": 1
  }
}
```

**Errores (400):**

```json
{
  "error": {
    "message": "...",
    "code": "INVALID_QUERY_PARAM"
  }
}
```

Ejemplos: `page`/`limit` no numéricos, `status` fuera del enum, `sortBy` no permitido, `author_id` no numérico.

---

<<<<<<< HEAD
## Tests
=======
POST /posts

Body requerido: title, content, slug, author_id
Body opcional: excerpt, status (default: "draft")

Respuestas:
- 201 — post creado
- 400 — campos requeridos faltantes o status inválido
- 409 — slug duplicado

---

PUT /posts/:id
PATCH /posts/:id

Body: cualquier campo del post (actualización parcial)

Respuestas:
- 200 — post actualizado
- 400 — status inválido o transición de estado no permitida
- 404 — post no encontrado
- 409 — slug duplicado

Reglas de estado:
- Al pasar a "publish" se setea published_at
- Al pasar a "trash" se setea deleted_at
- No se puede pasar de "trash" a "publish" directamente

---

##  Tests
>>>>>>> origin/main

```
npm test
```

---

## Personas del proyecto

Persona 1:
- Setup del proyecto
- Express + TypeScript
- /health endpoint
- Jest configurado

Persona 2:
- GET /posts — listado con filtros, búsqueda, orden y paginación ✔

Persona 3:
- GET /posts/:id
- DELETE /posts/:id

Persona 4:
- POST /posts (crear post con validaciones)
- PUT /posts/:id (actualización completa)
- PATCH /posts/:id (actualización parcial)
- Validaciones: campos requeridos, slug único, status válido
- Manejo de transiciones de estado (published_at, deleted_at)
- 18 tests cubriendo happy path y casos de error

---

## Modelo Post

```ts
export type Post = {
  id: number;
  title: string;
  content: string;
  excerpt?: string;
  slug: string;
  status: "draft" | "publish" | "pending" | "private" | "trash";
  author_id: number;
  created_at: string;
  updated_at: string;
  published_at?: string;
  deleted_at?: string;
};
```

---

## Documento de diseño

`doc/ai/plans/00-foundation.md`

Contiene:
- diseño del sistema
- alcance
- modelo de datos
- criterios de aceptación

`doc/ai/plans/01-index.md`

<<<<<<< HEAD
Contiene:
- spec y plan de implementación de GET /posts
=======
##  Estado actual

✔ servidor funcionando  
✔ /health activo  
✔ tests pasando (21 en total)  
✔ estructura lista  
✔ POST /posts implementado  
✔ PUT /posts/:id implementado  
✔ PATCH /posts/:id implementado  
✔ store en memoria compartido  
>>>>>>> origin/main

---

## Estado actual

✔ servidor funcionando
✔ /health activo
✔ GET /posts activo (filtros, búsqueda, orden, paginación)
✔ tests pasando (12/12)
✔ estructura lista

---

## Proyecto académico

Simulación de backend real con arquitectura modular, testing y trabajo en equipo.