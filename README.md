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
 ├── __tests__/
 │     └── health.test.ts

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

##  Endpoint disponible

GET /health

Respuesta:

{
  "status": "ok"
}

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
- POST /posts
- PUT /posts/:id

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
✔ tests pasando  
✔ estructura lista  

---

##  Proyecto académico

Simulación de backend real con arquitectura modular, testing y trabajo en equipo.