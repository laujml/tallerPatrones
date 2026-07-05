# Spec 2 · Show — GET /posts/{id}

## Contexto

Se requiere un endpoint para obtener el detalle de un post específico utilizando su identificador único "id". Este endpoint debe ser restrictivo respecto al estado del post, ocultando aquellos que se encuentren en la papelera "trash".


## Alcance

Endpoint GET /posts/:id

Devuelve la información del post (incluyendo campos relevantes como id, title, content, slug, status, author_id, created_at, updated_at, etc.).

Retorna 404 Not Found si el post no existe en el sistema.

Retorna 404 Not Found si el post existe pero su estado es "trash"


## Fuera de alcance

Obtener posts por slug mediante este endpoint (el parámetro debe ser numérico).

Recuperación de posts eliminados (en estado trash) mediante este endpoint.


## Plan de Pruebas
Se implementarán pruebas de integración en "src/__tests__/posts.test.ts" para cubrir:

1. Retorno exitoso "200 OK" para un post existente y activo.

2. Retorno "404 Not Found" para un post inexistente.

3. Retorno "404 Not Found" para un post cuyo estado sea "trash".
