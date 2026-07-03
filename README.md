#  CMS API - Taller de Patrones de Diseño

##  Descripción general

Este proyecto es una API REST tipo CMS (Content Management System) construida con Node.js, Express y TypeScript.

Permite gestionar posts (tipo blog) mediante una arquitectura modular dividida por “personas”, simulando trabajo en equipo real.

---

##  Tecnologías utilizadas

- Node.js
- Express
- TypeScript
- Jest
- ts-node-dev

---

##  Estructura del proyecto

src/
 ├── app.ts
 ├── server.ts
 ├── data/
 │     └── postsStore.ts
 ├── routes/
 │     └── posts.ts
 ├── __tests__/
 │     ├── health.test.ts
 │     └── posts.test.ts

doc/
 └── ai/plans/
       └── 00-foundation.md

package.json
tsconfig.json
README.md
.gitignore

---

##  Instalación

npm install

---

##  Ejecutar el proyecto

npm run dev

http://localhost:3000

---

##  Endpoints disponibles

GET /health

Respuesta:

{
  "status": "ok"
}

---

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

npm test

---

##  Personas del proyecto

Persona 1:
- Setup del proyecto
- Express + TypeScript
- /health endpoint
- Jest configurado

Persona 2:
- GET /posts

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

##  Modelo Post

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

---

##  Documento de diseño

doc/ai/plans/00-foundation.md

Contiene:
- diseño del sistema
- alcance
- modelo de datos
- criterios de aceptación

---

##  Estado actual

✔ servidor funcionando  
✔ /health activo  
✔ tests pasando (21 en total)  
✔ estructura lista  
✔ POST /posts implementado  
✔ PUT /posts/:id implementado  
✔ PATCH /posts/:id implementado  
✔ store en memoria compartido  

---

##  Proyecto académico

Simulación de backend real con arquitectura modular, testing y trabajo en equipo.