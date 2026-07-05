
---

#  doc/ai/plans/00-foundation.md

```md id="spec-final"
# 00 - Foundation

##  Contexto
Se requiere establecer la base del proyecto CMS API para gestionar posts. Esta base incluye configuración del servidor, estructura del proyecto, testing inicial y definición del modelo de datos.

---

##  Alcance

- Configuración de Express con TypeScript
- Estructura base del proyecto
- Endpoint GET /health
- Configuración de testing con Jest
- Definición del modelo Post (solo estructura)

---

##  Fuera de alcance

- CRUD de posts
- Base de datos
- Autenticación
- Lógica de negocio

---

##  Modelo Post (TypeScript)

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