01 - Spec 1: Index (GET /posts)

Contexto

Los usuarios de la API necesitan poder listar los posts existentes, con
capacidad de filtrar, buscar, ordenar y paginar resultados — sin esto, no
hay forma de consumir el catálogo completo de contenido del CMS.


Alcance


Endpoint GET /posts
Filtros por status y author_id
Búsqueda parcial en title/content (search)
Ordenamiento por campo (sortBy) y dirección (order)
Paginación (page, limit)
Exclusión automática de posts con soft delete (deleted_at)
Lectura desde el store compartido (data/postsStore.ts), sin duplicar datos


Fuera de alcance


Obtener un post individual (GET /posts/:id) — Spec 2 (Persona 3)
Crear, actualizar o eliminar posts — Specs 3, 4, 5 (Personas 3 y 4)
Autenticación o autorización de quién puede listar
Base de datos real (se usa el store en memoria compartido)
Formato de error unificado a nivel de todo el proyecto (pendiente de
decisión en equipo)



Criterios de aceptación


GET /posts sin parámetros devuelve 200 con page=1, limit=10 por defecto
GET /posts?status=publish devuelve solo posts con ese status
GET /posts?author_id=1 devuelve solo posts de ese autor
GET /posts?search=texto devuelve posts cuyo title o content contienen el texto
GET /posts?sortBy=title&order=asc devuelve los resultados ordenados correctamente
GET /posts?page=2&limit=5 devuelve la página correcta y el meta correcto (total, totalPages)
Un limit mayor a 100 se capea a 100 sin error
Posts con deleted_at definido nunca aparecen en el listado
GET /posts?sortBy=campoInvalido devuelve 400
GET /posts?status=noexiste devuelve 400
GET /posts?author_id=abc (no numérico) devuelve 400
GET /posts?page=-1 devuelve 400
Un post creado vía POST /posts aparece en GET /posts (test de integración cruzada con Persona 4)


Todos verificados con tests automatizados (ver src/__tests__/posts.index.test.ts, 12 tests).


Plan de implementación (pasos verificables)


Test: escribir posts.index.test.ts con el caso "200 con defaults" → Código: crear routes/post.routes.ts + controllers/post.controller.ts con respuesta fija → test pasa.
Test: agregar caso de filtro por status → Código: implementar filtro en services/post.service.ts → test pasa.
Test: agregar caso de filtro por author_id → Código: agregar filtro en el service → test pasa.
Test: agregar caso de search → Código: implementar búsqueda parcial en título/contenido → test pasa.
Test: agregar caso de orden (sortBy/order) → Código: implementar sort con whitelist de campos → test pasa.
Test: agregar casos de paginación (page, limit, cap a 100) → Código: implementar slice + cálculo de meta → test pasa.
Test: agregar casos 400 (params inválidos) → Código: agregar validaciones en el controller → test pasa.
Test: agregar caso de exclusión de soft-deleted → Código: filtrar deleted_at en el service → test pasa.
Test: agregar test de integración cruzada (crear con POST, verificar en GET) → confirma integración con el store compartido de Persona 4.
Documentar el endpoint en README.md.



Archivos creados


src/models/post.ts — reexporta Post/PostStatus desde el store compartido
src/services/post.service.ts — lógica de filtros, búsqueda, orden y paginación
src/controllers/post.controller.ts — validación de query params y respuesta
src/routes/post.routes.ts — ruta GET /posts
src/__tests__/posts.index.test.ts — 12 tests


Integración con el store compartido

Este endpoint no mantiene su propio store: lee directamente del array posts
exportado por src/data/postsStore.ts (el mismo que usan POST/PUT/PATCH
de Persona 4), garantizando consistencia de datos entre features.