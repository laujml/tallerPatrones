# Spec 4 – Update (PUT/PATCH /posts/:id)

## Propósito
Implementar endpoints para actualizar posts existentes con control de cambios de estado, validaciones parciales (PATCH) y completas (PUT), y suite de tests exhaustiva.

---

## Alcance

### ✅ QUE ABARCA
- Endpoint `PUT /posts/:id` - Reemplaza todos los campos (requiere todos excepto ID)
- Endpoint `PATCH /posts/:id` - Actualiza solo los campos proporcionados
- Validaciones de campos actualizables
- Validaciones de tipos de datos
- Control de cambios de estado (draft ↔ published)
- Validación de existencia del post
- Respuesta con código 200 (OK) y el post actualizado
- Timestamps automáticos (updatedAt se actualiza)
- Manejo de errores estandarizado
- Manejo de conflictos (e.g., actualizar posts no existentes)
- Tests unitarios y de integración
- Documentación de API

### ❌ QUE NO ABARCA
- Autenticación y autorización de usuarios (asumir verificado)
- Validación de permisos (quién puede actualizar)
- Historial de versiones/cambios
- Revertir cambios
- Transacciones complejas
- Soft deletes
- Migración de posts entre categorías
- Cambio de propietario del post

---

## Especificación Técnica

### PUT Request (Reemplazar Completo)
```json
PUT /posts/:id
Content-Type: application/json

{
  "title": "string (1-200 caracteres)",
  "content": "string (10-5000 caracteres)",
  "author": "string (3-100 caracteres)",
  "tags": ["string"] (opcional, max 5 tags de 50 caracteres c/u),
  "status": "draft" | "published" (opcional, default: no cambia)
}
```

### PATCH Request (Actualización Parcial)
```json
PATCH /posts/:id
Content-Type: application/json

{
  "title": "string" (opcional),
  "content": "string" (opcional),
  "author": "string" (opcional),
  "tags": ["string"] (opcional),
  "status": "draft" | "published" (opcional)
}
```

### Response Success (200)
```json
{
  "id": "uuid",
  "title": "string",
  "content": "string",
  "author": "string",
  "tags": ["string"],
  "status": "draft" | "published",
  "createdAt": "ISO8601",
  "updatedAt": "ISO8601"
}
```

### Response Errors

#### 404 - Post Not Found
```json
{
  "error": {
    "code": "POST_NOT_FOUND",
    "message": "El post con ID 'xyz' no existe",
    "details": {
      "post_id": ["Post not found"]
    },
    "timestamp": "ISO8601"
  }
}
```

#### 400/422 - Validation Error
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Los datos proporcionados no son válidos",
    "details": {
      "title": ["Must be between 1 and 200 characters"],
      "status": ["Invalid status value"]
    },
    "timestamp": "ISO8601"
  }
}
```

#### 500 - Server Error
```json
{
  "error": {
    "code": "DATABASE_ERROR" | "SERVER_ERROR",
    "message": "Error al actualizar el post",
    "timestamp": "ISO8601"
  }
}
```

### Validaciones para PUT y PATCH

#### Campo: title (si se proporciona)
- Tipo: string
- Longitud mínima: 1 carácter
- Longitud máxima: 200 caracteres
- No puede ser solo espacios en blanco
- Error: `TITLE_INVALID`

#### Campo: content (si se proporciona)
- Tipo: string
- Longitud mínima: 10 caracteres
- Longitud máxima: 5000 caracteres
- No puede ser solo espacios en blanco
- Error: `CONTENT_INVALID`

#### Campo: author (si se proporciona)
- Tipo: string
- Longitud mínima: 3 caracteres
- Longitud máxima: 100 caracteres
- Patrón: Solo letras, números, espacios y guiones
- Error: `AUTHOR_INVALID`

#### Campo: tags (si se proporciona)
- Tipo: array de strings
- Máximo: 5 tags
- Cada tag: 1-50 caracteres
- No permite duplicados
- Puede ser vacío []
- Error: `TAGS_INVALID`

#### Campo: status (si se proporciona)
- Tipo: string enum
- Valores permitidos: "draft", "published"
- Transiciones válidas:
  - "draft" → "published" ✅
  - "published" → "draft" ✅
  - "draft" → "draft" ✅ (sin cambio)
  - "published" → "published" ✅ (sin cambio)
- Error: `STATUS_INVALID`

### Diferencias PUT vs PATCH

| Aspecto | PUT | PATCH |
|---------|-----|-------|
| **Requiere ID** | Sí | Sí |
| **Campos obligatorios** | title, content, author | Ninguno |
| **Campos opcionales** | tags, status | Todos |
| **Semántica** | Reemplazar completo | Actualizar parcial |
| **Campos faltantes** | Se ignoran o validan según implementación | Solo se actualizan los proporcionados |

---

## Plan de Implementación

### Fase 1: Preparación
- [ ] Crear rama de feature (`feature/update-endpoints`)
- [ ] Reutilizar validadores del Store (Spec 3)
- [ ] Definir lógica de cambios de estado
- [ ] Definir timestamps de actualización

### Fase 2: Implementación PUT
- [ ] Implementar ruta PUT /posts/:id
- [ ] Validar existencia del post (404)
- [ ] Validar datos completos
- [ ] Actualizar todos los campos proporcionados
- [ ] Actualizar timestamp updatedAt
- [ ] Responder con 200 + post actualizado

### Fase 3: Implementación PATCH
- [ ] Implementar ruta PATCH /posts/:id
- [ ] Validar existencia del post (404)
- [ ] Validar solo campos proporcionados
- [ ] Actualizar solo campos proporcionados
- [ ] Mantener campos no proporcionados
- [ ] Actualizar timestamp updatedAt
- [ ] Responder con 200 + post actualizado

### Fase 4: Validación de Cambios de Estado
- [ ] Permitir transiciones válidas
- [ ] Rechazar transiciones no permitidas
- [ ] Registrar cambios de estado en logs

### Fase 5: Testing
- [ ] Tests unitarios para validadores
- [ ] Tests de integración para PUT
- [ ] Tests de integración para PATCH
- [ ] Tests de cambios de estado
- [ ] Tests de manejo de errores
- [ ] Tests de conflictos y edge cases

### Fase 6: Revisión y Merge
- [ ] Revisión de código
- [ ] Revisión de tests
- [ ] Verificación manual
- [ ] Merge a main

---

## Criterios de Evaluación

### Funcionalidad - PUT
- ✅ El endpoint actualiza el post exitosamente
- ✅ Todos los campos se actualizan correctamente
- ✅ Retorna código 200
- ✅ La respuesta incluye el post actualizado
- ✅ El timestamp updatedAt se actualiza
- ✅ El ID y createdAt no cambian

### Funcionalidad - PATCH
- ✅ Solo los campos proporcionados se actualizan
- ✅ Los campos no proporcionados se mantienen
- ✅ Retorna código 200
- ✅ La respuesta incluye el post actualizado
- ✅ El timestamp updatedAt se actualiza

### Funcionalidad - Cambios de Estado
- ✅ Transiciones válidas funcionan
- ✅ Cambios de draft a published permiten
- ✅ Cambios de published a draft permiten
- ✅ Estados se persisten en base de datos

### Errores
- ✅ Retorna 404 para posts no existentes
- ✅ Retorna 422 para validaciones fallidas
- ✅ Retorna 500 para errores de servidor
- ✅ Todos los errores incluyen código y mensaje
- ✅ Los detalles del error indican qué falló

### Validaciones
- ✅ Las mismas validaciones que Store (Spec 3)
- ✅ En PATCH solo se validan campos proporcionados
- ✅ En PUT se requieren campos obligatorios

### Seguridad
- ✅ No hay SQL injection
- ✅ No hay XSS
- ✅ Manejo seguro de errores
- ✅ Validación de tipos de datos
- ✅ No se actualizan campos sensibles sin permiso

### Tests
- ✅ Cobertura mínima: 85%
- ✅ Tests de happy path (PUT y PATCH)
- ✅ Tests de validación
- ✅ Tests de cambios de estado
- ✅ Tests de errores (404, 422, 500)
- ✅ Tests con base de datos real
- ✅ 40+ test cases totales
- ✅ Todos los tests pasan

### Código
- ✅ Reutiliza validadores del Store
- ✅ Sigue el estilo del proyecto
- ✅ Manejo centralizado de errores
- ✅ Sin código duplicado
- ✅ Documentación clara

---

## Pasos Verificables

### 1. Setup Inicial
```bash
# Verificar rama
git branch -a | grep feature/update-endpoints

# Verificar archivo de rutas
grep -E "PUT|PATCH" src/routes/posts.js

# Debe contener ambas rutas
```

### 2. Verificación de PUT
```bash
# Crear un post primero
RESPONSE=$(curl -s -X POST http://localhost:3000/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title":"Original Title",
    "content":"Original content with enough characters",
    "author":"Original Author"
  }')

POST_ID=$(echo $RESPONSE | jq -r '.id')

# Actualizar con PUT (reemplazar completo)
curl -X PUT http://localhost:3000/posts/$POST_ID \
  -H "Content-Type: application/json" \
  -d '{
    "title":"Updated Title",
    "content":"Updated content with enough characters required",
    "author":"Updated Author",
    "status":"published"
  }'

# Esperado: 200 con todos los campos actualizados
```

### 3. Verificación de PATCH
```bash
# Actualizar solo título con PATCH
curl -X PATCH http://localhost:3000/posts/$POST_ID \
  -H "Content-Type: application/json" \
  -d '{"title":"Only Title Changed"}'

# Esperado: 200 con título cambiado, otros campos sin cambio
```

### 4. Verificación de Cambios de Estado
```bash
# Cambiar de draft a published
curl -X PATCH http://localhost:3000/posts/$POST_ID \
  -H "Content-Type: application/json" \
  -d '{"status":"published"}'

# Esperado: 200 con status: "published"

# Cambiar de published a draft
curl -X PATCH http://localhost:3000/posts/$POST_ID \
  -H "Content-Type: application/json" \
  -d '{"status":"draft"}'

# Esperado: 200 con status: "draft"
```

### 5. Verificación de Errores
```bash
# Intentar actualizar post inexistente
curl -X PUT http://localhost:3000/posts/nonexistent-id \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","content":"Test content here","author":"Test"}'

# Esperado: 404 con código POST_NOT_FOUND

# Intentar actualizar con datos inválidos
curl -X PATCH http://localhost:3000/posts/$POST_ID \
  -H "Content-Type: application/json" \
  -d '{"title":"","content":"Short"}'

# Esperado: 422 con errores de validación
```

### 6. Verificación de Persistencia
```bash
# Obtener el post para verificar cambios
curl -s http://localhost:3000/posts/$POST_ID | jq

# Esperado: Datos reflejan los cambios realizados
# updatedAt debe ser más reciente que createdAt
```

### 7. Verificación de Tests
```bash
# Ejecutar tests
npm test -- tests/endpoints/posts.update.test.js

# Output esperado:
# ✓ PUT should update all fields
# ✓ PUT should return 200 status
# ✓ PATCH should update only provided fields
# ✓ PATCH should preserve unprovided fields
# ✓ Should reject non-existent posts
# ✓ Should validate fields correctly
# ✓ Should handle status transitions
# ... (40+ tests)
```

### 8. Verificación de Cobertura
```bash
npm test -- --coverage tests/endpoints/posts.update.test.js

# Output esperado:
# File                      | % Stmts | % Branch | % Funcs | % Lines
# -------------------------|---------|----------|---------|----------
# Update.js                 | 85+     | 80+      | 90+     | 85+
```

---

## Suite de Tests (Estructura Esperada)

### Ubicación: `tests/endpoints/posts.update.test.js`

```javascript
describe('PUT & PATCH /posts/:id - Update', () => {
  let postId;
  let originalPost;

  beforeEach(async () => {
    // Create a post to update
    const response = await request(app)
      .post('/posts')
      .send({
        title: 'Original Title',
        content: 'Original content with enough characters',
        author: 'Original Author'
      });
    
    postId = response.body.id;
    originalPost = response.body;
  });

  describe('PUT - Full Replacement', () => {
    test('Should update all fields with valid data', async () => {
      const updates = {
        title: 'New Title',
        content: 'Completely new content with enough characters',
        author: 'New Author',
        tags: ['updated', 'tag'],
        status: 'published'
      };

      const response = await request(app)
        .put(`/posts/${postId}`)
        .send(updates);

      expect(response.status).toBe(200);
      expect(response.body.title).toBe(updates.title);
      expect(response.body.content).toBe(updates.content);
      expect(response.body.author).toBe(updates.author);
      expect(response.body.tags).toEqual(updates.tags);
      expect(response.body.status).toBe(updates.status);
    });

    test('Should preserve ID and createdAt', async () => {
      const response = await request(app)
        .put(`/posts/${postId}`)
        .send({
          title: 'New Title',
          content: 'New content with enough characters',
          author: 'New Author'
        });

      expect(response.body.id).toBe(postId);
      expect(response.body.createdAt).toBe(originalPost.createdAt);
    });

    test('Should update the updatedAt timestamp', async () => {
      const response = await request(app)
        .put(`/posts/${postId}`)
        .send({
          title: 'New Title',
          content: 'New content with enough characters',
          author: 'New Author'
        });

      expect(response.body.updatedAt).toBeDefined();
      expect(new Date(response.body.updatedAt) > new Date(originalPost.updatedAt)).toBe(true);
    });

    test('Should accept optional fields in PUT', async () => {
      const response = await request(app)
        .put(`/posts/${postId}`)
        .send({
          title: 'Updated Title',
          content: 'Updated content with enough characters',
          author: 'Updated Author'
          // status and tags are optional
        });

      expect(response.status).toBe(200);
      expect(response.body.title).toBe('Updated Title');
    });

    test('Should persist changes to database', async () => {
      const updates = {
        title: 'Database Test Title',
        content: 'Database test content with minimum required length',
        author: 'Database Tester'
      };

      await request(app)
        .put(`/posts/${postId}`)
        .send(updates);

      const dbPost = await Post.findById(postId);
      expect(dbPost.title).toBe(updates.title);
      expect(dbPost.content).toBe(updates.content);
    });
  });

  describe('PATCH - Partial Update', () => {
    test('Should update only provided fields', async () => {
      const response = await request(app)
        .patch(`/posts/${postId}`)
        .send({ title: 'Only Title Updated' });

      expect(response.status).toBe(200);
      expect(response.body.title).toBe('Only Title Updated');
      expect(response.body.content).toBe(originalPost.content);
      expect(response.body.author).toBe(originalPost.author);
    });

    test('Should preserve unprovided fields', async () => {
      const updates = {
        content: 'New content with minimum required length'
      };

      const response = await request(app)
        .patch(`/posts/${postId}`)
        .send(updates);

      expect(response.body.title).toBe(originalPost.title);
      expect(response.body.author).toBe(originalPost.author);
      expect(response.body.content).toBe(updates.content);
    });

    test('Should allow updating only status', async () => {
      const response = await request(app)
        .patch(`/posts/${postId}`)
        .send({ status: 'published' });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('published');
      expect(response.body.title).toBe(originalPost.title);
    });

    test('Should allow updating only tags', async () => {
      const response = await request(app)
        .patch(`/posts/${postId}`)
        .send({ tags: ['new', 'tags'] });

      expect(response.status).toBe(200);
      expect(response.body.tags).toEqual(['new', 'tags']);
      expect(response.body.title).toBe(originalPost.title);
    });

    test('Should allow clearing tags with empty array', async () => {
      // First set tags
      await request(app)
        .patch(`/posts/${postId}`)
        .send({ tags: ['tag1', 'tag2'] });

      // Then clear them
      const response = await request(app)
        .patch(`/posts/${postId}`)
        .send({ tags: [] });

      expect(response.body.tags).toEqual([]);
    });

    test('Should update timestamp on PATCH', async () => {
      const response = await request(app)
        .patch(`/posts/${postId}`)
        .send({ title: 'Patched Title' });

      expect(new Date(response.body.updatedAt) > new Date(originalPost.updatedAt)).toBe(true);
    });

    test('Should allow multiple PATCH operations', async () => {
      await request(app)
        .patch(`/posts/${postId}`)
        .send({ title: 'First Patch' });

      const response = await request(app)
        .patch(`/posts/${postId}`)
        .send({ content: 'Second patch content with enough characters' });

      expect(response.body.title).toBe('First Patch');
      expect(response.body.content).toBe('Second patch content with enough characters');
    });
  });

  describe('Status Transitions', () => {
    test('Should allow draft to published transition', async () => {
      const response = await request(app)
        .patch(`/posts/${postId}`)
        .send({ status: 'published' });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('published');
    });

    test('Should allow published to draft transition', async () => {
      // First publish
      await request(app)
        .patch(`/posts/${postId}`)
        .send({ status: 'published' });

      // Then revert to draft
      const response = await request(app)
        .patch(`/posts/${postId}`)
        .send({ status: 'draft' });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('draft');
    });

    test('Should allow same status update (idempotent)', async () => {
      const response = await request(app)
        .patch(`/posts/${postId}`)
        .send({ status: 'draft' });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('draft');
    });

    test('Should reject invalid status values', async () => {
      const response = await request(app)
        .patch(`/posts/${postId}`)
        .send({ status: 'archived' });

      expect(response.status).toBe(422);
      expect(response.body.error.details.status).toBeDefined();
    });
  });

  describe('Validation Errors', () => {
    test('Should reject title longer than 200 characters', async () => {
      const response = await request(app)
        .put(`/posts/${postId}`)
        .send({
          title: 'A'.repeat(201),
          content: 'Valid content here',
          author: 'Valid Author'
        });

      expect(response.status).toBe(422);
      expect(response.body.error.details.title).toBeDefined();
    });

    test('Should reject content shorter than 10 characters', async () => {
      const response = await request(app)
        .patch(`/posts/${postId}`)
        .send({ content: 'Short' });

      expect(response.status).toBe(422);
      expect(response.body.error.details.content).toBeDefined();
    });

    test('Should reject author with invalid characters in PATCH', async () => {
      const response = await request(app)
        .patch(`/posts/${postId}`)
        .send({ author: 'Invalid@#$' });

      expect(response.status).toBe(422);
      expect(response.body.error.details.author).toBeDefined();
    });

    test('Should reject more than 5 tags', async () => {
      const response = await request(app)
        .patch(`/posts/${postId}`)
        .send({
          tags: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5', 'tag6']
        });

      expect(response.status).toBe(422);
      expect(response.body.error.details.tags).toBeDefined();
    });

    test('Should reject duplicate tags', async () => {
      const response = await request(app)
        .patch(`/posts/${postId}`)
        .send({
          tags: ['javascript', 'testing', 'javascript']
        });

      expect(response.status).toBe(422);
      expect(response.body.error.details.tags).toBeDefined();
    });

    test('Should reject tags longer than 50 characters', async () => {
      const response = await request(app)
        .patch(`/posts/${postId}`)
        .send({
          tags: ['A'.repeat(51)]
        });

      expect(response.status).toBe(422);
      expect(response.body.error.details.tags).toBeDefined();
    });
  });

  describe('Not Found Errors', () => {
    test('Should return 404 for non-existent post with PUT', async () => {
      const response = await request(app)
        .put('/posts/nonexistent-id')
        .send({
          title: 'Any Title',
          content: 'Any content with enough length',
          author: 'Any Author'
        });

      expect(response.status).toBe(404);
      expect(response.body.error.code).toBe('POST_NOT_FOUND');
    });

    test('Should return 404 for non-existent post with PATCH', async () => {
      const response = await request(app)
        .patch('/posts/nonexistent-id')
        .send({ title: 'Any Title' });

      expect(response.status).toBe(404);
      expect(response.body.error.code).toBe('POST_NOT_FOUND');
    });

    test('Should include post ID in 404 error details', async () => {
      const response = await request(app)
        .patch('/posts/missing-post-123')
        .send({ title: 'Title' });

      expect(response.status).toBe(404);
      expect(response.body.error.details.post_id).toBeDefined();
    });
  });

  describe('Database Errors', () => {
    test('Should return 500 on database error with PUT', async () => {
      jest.spyOn(Post, 'findByIdAndUpdate').mockRejectedValueOnce(new Error('DB Error'));

      const response = await request(app)
        .put(`/posts/${postId}`)
        .send({
          title: 'Valid Title',
          content: 'Valid content with enough characters',
          author: 'Valid Author'
        });

      expect(response.status).toBe(500);
      expect(response.body.error.code).toBe('DATABASE_ERROR');
    });

    test('Should return 500 on database error with PATCH', async () => {
      jest.spyOn(Post, 'findByIdAndUpdate').mockRejectedValueOnce(new Error('DB Error'));

      const response = await request(app)
        .patch(`/posts/${postId}`)
        .send({ title: 'New Title' });

      expect(response.status).toBe(500);
      expect(response.body.error.code).toBe('DATABASE_ERROR');
    });
  });

  describe('Content Security', () => {
    test('Should escape HTML in updated content', async () => {
      const maliciousContent = '<script>alert("XSS")</script> with enough characters to pass validation';

      const response = await request(app)
        .patch(`/posts/${postId}`)
        .send({ content: maliciousContent });

      expect(response.status).toBe(201);
      const savedPost = await Post.findById(postId);
      expect(savedPost.content).not.toContain('<script>');
    });

    test('Should sanitize HTML tags in title updates', async () => {
      const response = await request(app)
        .patch(`/posts/${postId}`)
        .send({ title: 'Title with <b>bold</b> tags' });

      expect(response.body.title).not.toContain('<b>');
    });

    test('Should handle SQL injection attempts in updates', async () => {
      const response = await request(app)
        .patch(`/posts/${postId}`)
        .send({
          title: "'; DROP TABLE posts; --",
          content: 'Legitimately long content'
        });

      // Should either reject or sanitize
      expect(response.status).toMatch(/^(200|422)$/);

      // Table should still exist
      const allPosts = await Post.find();
      expect(allPosts).toBeDefined();
    });
  });

  describe('Idempotency', () => {
    test('PATCH should be idempotent', async () => {
      const updates = { title: 'Idempotent Title' };

      const response1 = await request(app)
        .patch(`/posts/${postId}`)
        .send(updates);

      const response2 = await request(app)
        .patch(`/posts/${postId}`)
        .send(updates);

      expect(response1.body).toEqual(response2.body);
    });

    test('Multiple PATCHes should accumulate correctly', async () => {
      await request(app)
        .patch(`/posts/${postId}`)
        .send({ title: 'Title A' });

      await request(app)
        .patch(`/posts/${postId}`)
        .send({ content: 'New content with enough length required' });

      const response = await request(app)
        .get(`/posts/${postId}`);

      expect(response.body.title).toBe('Title A');
      expect(response.body.content).toBe('New content with enough length required');
    });
  });

  describe('Edge Cases', () => {
    test('Should handle empty PATCH body', async () => {
      const response = await request(app)
        .patch(`/posts/${postId}`)
        .send({});

      // Should return 200 with unchanged post
      expect(response.status).toBe(200);
      expect(response.body.id).toBe(postId);
    });

    test('Should handle special characters in updates', async () => {
      const response = await request(app)
        .patch(`/posts/${postId}`)
        .send({
          title: 'Title with "quotes" and \'apostrophes\'',
          content: 'Content with "quotes", \'apostrophes\', and special chars: @#$%'
        });

      expect(response.status).toBe(200);
      expect(response.body.title).toContain('quotes');
    });

    test('Should handle unicode characters in updates', async () => {
      const response = await request(app)
        .patch(`/posts/${postId}`)
        .send({
          title: '日本語 Título Español',
          author: 'José García-López'
        });

      expect(response.status).toBe(200);
      expect(response.body.title).toContain('日本語');
    });

    test('Should trim whitespace in updates', async () => {
      const response = await request(app)
        .patch(`/posts/${postId}`)
        .send({
          title: '  Trimmed Title  ',
          author: '  Trimmed Author  '
        });

      expect(response.body.title).toBe('Trimmed Title');
      expect(response.body.author).toBe('Trimmed Author');
    });

    test('Should handle concurrent updates (last write wins)', async () => {
      const promises = Array(3).fill(null).map((_, i) =>
        request(app)
          .patch(`/posts/${postId}`)
          .send({ title: `Title ${i}` })
      );

      const responses = await Promise.all(promises);

      responses.forEach(res => {
        expect(res.status).toBe(200);
      });

      // Final state should reflect one of the updates
      const finalPost = await Post.findById(postId);
      expect(/Title \d/.test(finalPost.title)).toBe(true);
    });

    test('Should not update createdAt on PATCH', async () => {
      const firstCreatedAt = originalPost.createdAt;

      // Wait a bit
      await new Promise(resolve => setTimeout(resolve, 100));

      const response = await request(app)
        .patch(`/posts/${postId}`)
        .send({ title: 'Updated Later' });

      expect(response.body.createdAt).toBe(firstCreatedAt);
    });

    test('Should not update createdAt on PUT', async () => {
      const firstCreatedAt = originalPost.createdAt;

      await new Promise(resolve => setTimeout(resolve, 100));

      const response = await request(app)
        .put(`/posts/${postId}`)
        .send({
          title: 'Completely Updated',
          content: 'Completely new content with required length',
          author: 'New Author'
        });

      expect(response.body.createdAt).toBe(firstCreatedAt);
    });
  });

  describe('Response Format', () => {
    test('PUT response should include all post fields', async () => {
      const response = await request(app)
        .put(`/posts/${postId}`)
        .send({
          title: 'Complete Response',
          content: 'This should return complete response',
          author: 'Response Tester'
        });

      expect(response.body.id).toBeDefined();
      expect(response.body.title).toBeDefined();
      expect(response.body.content).toBeDefined();
      expect(response.body.author).toBeDefined();
      expect(response.body.tags).toBeDefined();
      expect(response.body.status).toBeDefined();
      expect(response.body.createdAt).toBeDefined();
      expect(response.body.updatedAt).toBeDefined();
    });

    test('PATCH response should include all post fields', async () => {
      const response = await request(app)
        .patch(`/posts/${postId}`)
        .send({ title: 'Partial Update' });

      expect(response.body.id).toBeDefined();
      expect(response.body.title).toBeDefined();
      expect(response.body.content).toBeDefined();
      expect(response.body.author).toBeDefined();
      expect(response.body.status).toBeDefined();
      expect(response.body.createdAt).toBeDefined();
      expect(response.body.updatedAt).toBeDefined();
    });

    test('Error response should include timestamp', async () => {
      const response = await request(app)
        .patch(`/posts/${postId}`)
        .send({ title: '' });

      expect(response.body.error.timestamp).toBeDefined();
      expect(new Date(response.body.error.timestamp)).toBeInstanceOf(Date);
    });
  });

  describe('Performance', () => {
    test('PUT should complete within reasonable time', async () => {
      const start = Date.now();

      await request(app)
        .put(`/posts/${postId}`)
        .send({
          title: 'Perf Test',
          content: 'Testing performance of update operation',
          author: 'Perf Tester'
        });

      const duration = Date.now() - start;
      expect(duration).toBeLessThan(1000); // Should complete within 1 second
    });

    test('PATCH should complete within reasonable time', async () => {
      const start = Date.now();

      await request(app)
        .patch(`/posts/${postId}`)
        .send({ title: 'Perf Test' });

      const duration = Date.now() - start;
      expect(duration).toBeLessThan(1000);
    });
  });
});
```

---

## Definición de "Hecho"

El feature se considera completado cuando:

1. ✅ Los endpoints `PUT /posts/:id` y `PATCH /posts/:id` existen
2. ✅ PUT actualiza todos los campos correctamente
3. ✅ PATCH actualiza solo campos proporcionados
4. ✅ Los cambios de estado funcionan correctamente
5. ✅ Ambas operaciones retornan 200 para casos válidos
6. ✅ Los posts se persisten correctamente en base de datos
7. ✅ Retorna 404 para posts no existentes
8. ✅ Retorna 422 para validaciones fallidas
9. ✅ Existe una suite de tests con 50+ test cases
10. ✅ La cobertura de código es ≥ 85%
11. ✅ Todos los tests pasan
12. ✅ No hay vulnerabilidades de seguridad
13. ✅ Se reutilizan validadores del Store (Spec 3)
14. ✅ Código revisado y aprobado por otro miembro del equipo
15. ✅ Documentación actualizada
16. ✅ Feature merged a `main`

---

## Notas de Implementación

- **Reutilizar validadores** del Store (Spec 3) - No duplicar código
- **Implementar helper para detectar campos proporcionados en PATCH** para diferenciar entre null y no proporcionado
- **Usar `new Date()` automáticamente** para updatedAt en cada actualización
- **Mantener createdAt sin cambios** en todas las actualizaciones
- **Logging de cambios de estado** para auditoría (draft → published)
- **Verificar existencia antes de actualizar** y retornar 404 apropiado
- **Transacciones si es necesario** para operaciones múltiples
- **Índices en campos frecuentemente buscados**
- **Timestamps en formato ISO8601** consistentemente

---

## Relación con Spec 3 (Store)

| Aspecto | Store (POST) | Update (PUT/PATCH) |
|---------|-------------|------------------|
| **Validaciones** | Todas las especificadas | Reutilizar del Store |
| **Manejo de errores** | Formato estandarizado | Mismo formato |
| **Timestamps** | createdAt, updatedAt | Solo updatedAt se modifica |
| **Base de datos** | Crea registro | Modifica registro |
| **Tests** | ~30 test cases | ~50 test cases |
| **Código base** | Establecido en Store | Extiende del Store |

