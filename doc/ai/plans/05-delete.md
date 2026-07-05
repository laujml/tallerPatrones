# Spec 5 · Delete — DELETE /posts/{id}

## Contexto
Se requiere dotar a la API de la capacidad de eliminar posts. Se contemplan dos tipos de eliminación:

1. Eliminación suave (Soft Delete): El post cambia su estado a "trash" (papelera), preservando sus datos y registrando la fecha de eliminación (deleted_at). Este es el comportamiento por defecto.

2. Eliminación forzosa (Hard Delete): El post se remueve de forma permanente e irreversible del almacén de datos si se provee el query parameter "?force=true".


## Alcance

Endpoint DELETE /posts/:id.

Soporte para eliminación predeterminada (Soft Delete):
  - Modifica el status del post a "trash".
  - Registra el timestamp actual en el atributo "deleted_at".

Soporte para eliminación permanente (Hard Delete):
  - Se activa con el query parameter "force=true" (ej. DELETE /posts/1?force=true).
  - Remueve el registro por completo del almacén de datos.

Retorna "204 No Content" si la operación es exitosa.

Retorna "404 Not Found" si el post no existe.


## Fuera de alcance

Restauración de posts desde la papelera por medio de este endpoint.

Eliminación en lote o por lote de posts.


## Plan de Pruebas
Se implementarán pruebas de integración en "src/__tests__/posts.test.ts" para cubrir:

1. Soft-delete por defecto, verificando que el post cambie su estado a "trash", se le asigne un "deleted_at" y responda con "204 No Content".

2. Hard-delete al especificar "?force=true", verificando que el post sea eliminado físicamente del store y responda con "204 No Content".

3. Retorno "404 Not Found" si se intenta eliminar un post inexistente.
