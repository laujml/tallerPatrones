# 04 - Persona 4: Store y Update de posts

## Contexto

Implementación de los endpoints de creación y actualización de posts, junto con el store en memoria compartido para el resto del equipo.

---

## Archivos creados

- `src/data/postsStore.ts` — store en memoria compartido entre rutas
- `src/routes/posts.ts` — rutas POST, PUT y PATCH
- `src/__tests__/posts.test.ts` — 18 tests

---

## Endpoints implementados

### POST /posts

- Campos requeridos: `title`, `content`, `slug`, `author_id`
- `status` por defecto: `"draft"`
- Si `status` es `"publish"` al crear, setea `published_at`
- Si `status` es `"trash"` al crear, setea `deleted_at`
- Retorna 201 con el post creado
- Retorna 400 si faltan campos requeridos o el status es inválido
- Retorna 409 si el slug ya existe

### PUT /posts/:id

- Actualiza cualquier campo del post
- Retorna 400 si el status es inválido
- Retorna 400 si se intenta pasar de `"trash"` a `"publish"` directamente
- Retorna 404 si el id no existe
- Retorna 409 si el nuevo slug ya lo usa otro post
- Setea `published_at` la primera vez que pasa a `"publish"`
- Setea `deleted_at` la primera vez que pasa a `"trash"`
- Actualiza `updated_at` en cada modificación

### PATCH /posts/:id

- Misma lógica que PUT, para actualizaciones parciales

---

## Reglas de transición de estado

| Desde | Hacia | Permitido |
|-------|-------|-----------|
| cualquiera | draft / pending / private | ✔ |
| cualquiera | publish | ✔ (setea published_at) |
| cualquiera | trash | ✔ (setea deleted_at) |
| trash | publish | ✘ (400) |

---

## Store compartido (`postsStore.ts`)

Exporta el array `posts` y funciones utilitarias para que otras personas puedan importarlas sin duplicar lógica:

- `findById(id)` — busca por id
- `findBySlug(slug)` — busca por slug
- `createPost(data)` — inserta y retorna el post nuevo
- `updatePost(id, data)` — aplica cambios y retorna el post actualizado
- `resetStore()` — limpia el store entre tests

---

## Tests (18 en total)

### POST /posts
- Crea post válido → 201
- Status por defecto es "draft"
- Acepta status explícito válido
- Setea `published_at` si se crea con status "publish"
- 400 si falta title / content / slug / author_id
- 400 si el status es inválido
- 409 si el slug ya existe

### PUT /posts/:id
- Actualiza post existente → 200
- Actualiza `updated_at` al modificar
- 404 si el id no existe
- Setea `published_at` al pasar a "publish"
- Setea `deleted_at` al pasar a "trash"
- 400 al intentar publicar un post en trash directamente
- 400 si el status es inválido
- 409 si el nuevo slug ya lo usa otro post

### PATCH /posts/:id
- Actualiza parcialmente → 200
- 404 si el id no existe
