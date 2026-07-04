CMS API - Taller de Patrones de Diseño

Descripción general

Este proyecto es una API REST tipo CMS (Content Management System) construida con Node.js, Express y TypeScript.

Permite gestionar posts (tipo blog) mediante una arquitectura modular dividida por "personas", simulando trabajo en equipo real.


Tecnologías utilizadas


Node.js
Express
TypeScript
Jest
ts-node-dev



Estructura del proyecto

src/
 ├── app.ts
 ├── server.ts
 ├── models/
 │     └── post.ts
 ├── data/
 │     └── postsStore.ts
 ├── services/
 │     └── post.service.ts
 ├── controllers/
 │     └── post.controller.ts
 ├── routes/
 │     ├── post.routes.ts
 │     └── posts.ts
 └── __tests__/
       ├── health.test.ts
       ├── posts.index.test.ts
       └── posts.test.ts

doc/
 └── ai/plans/
       ├── 00-foundation.md
       ├── 01-index.md
       └── 04-persona4-store-update.md

package.json
tsconfig.json
README.md
.gitignore


Instalación

npm install


Ejecutar el proyecto

npm run dev

http://localhost:3000


Endpoints disponibles

GET /health

Respuesta:

json{
  "status": "ok"
}

GET /posts

Lista los posts existentes con filtros, búsqueda, orden y paginación. Excluye automáticamente los posts con soft delete (deleted_at).

Query params:

ParamTipoDefaultDescripciónpagenumber1Página actuallimitnumber10Registros por página (máx. 100)statusstring-draft | publish | pending | private | trashauthor_idnumber-Filtra por autorsearchstring-Búsqueda parcial en title/contentsortBystringcreated_atcreated_at | updated_at | title | statusorderstringdescasc | desc

Respuesta (200 OK):

json{
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

Errores (400):

json{
  "error": {
    "message": "...",
    "code": "INVALID_QUERY_PARAM"
  }
}

Ejemplos: page/limit no numéricos, status fuera del enum, sortBy no permitido, author_id no numérico.

POST /posts

Body requerido: title, content, slug, author_id
Body opcional: excerpt, status (default: "draft")

Respuestas:


201 — post creado
400 — campos requeridos faltantes o status inválido
409 — slug duplicado


PUT /posts/:id · PATCH /posts/:id

Body: cualquier campo del post (actualización parcial)

Respuestas:


200 — post actualizado
400 — status inválido o transición de estado no permitida
404 — post no encontrado
409 — slug duplicado


Reglas de estado:


Al pasar a "publish" se setea published_at
Al pasar a "trash" se setea deleted_at
No se puede pasar de "trash" a "publish" directamente



Tests

npm test


Personas del proyecto

Persona 1:


Setup del proyecto
Express + TypeScript
/health endpoint
Jest configurado


Persona 2:


GET /posts — listado con filtros, búsqueda, orden y paginación ✔


Persona 3:


GET /posts/:id
DELETE /posts/:id


Persona 4:


POST /posts (crear post con validaciones)
PUT /posts/:id (actualización completa)
PATCH /posts/:id (actualización parcial)
Validaciones: campos requeridos, slug único, status válido
Manejo de transiciones de estado (published_at, deleted_at)



Modelo Post

tsexport type Post = {
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

Definido en src/data/postsStore.ts — es el store compartido: todas las
features (Index, Store, Update, y a futuro Show/Delete) leen y escriben ahí,
para que los datos sean consistentes entre endpoints.


Documento de diseño

doc/ai/plans/00-foundation.md

Contiene:


diseño del sistema
alcance
modelo de datos
criterios de aceptación


doc/ai/plans/01-index.md — spec y plan de GET /posts.

doc/ai/plans/04-persona4-store-update.md — spec de POST/PUT/PATCH /posts.


Estado actual

✔ servidor funcionando
✔ /health activo
✔ GET /posts activo (filtros, búsqueda, orden, paginación)
✔ POST /posts implementado
✔ PUT /posts/:id implementado
✔ PATCH /posts/:id implementado
✔ store en memoria compartido
✔ tests pasando (33 en total)
✔ estructura lista


Proyecto académico

Simulación de backend real con arquitectura modular, testing y trabajo en equipo.