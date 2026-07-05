# Spec 3 – Store (POST /posts)

## Propósito
Implementar el endpoint para crear nuevos posts con validaciones exhaustivas, manejo de errores estandarizado y suite de tests completa.

---

## Alcance

### ✅ QUE ABARCA
- Endpoint `POST /posts` que recibe datos del post
- Validaciones de campos requeridos (título, contenido, autor)
- Validaciones de tipos de datos
- Validaciones de longitudes y límites
- Persistencia en base de datos
- Respuesta con código 201 (Created) y el post creado
- Manejo de errores con formato estandarizado
- Tests unitarios y de integración
- Documentación de API (OpenAPI/Swagger si aplica)

### ❌ QUE NO ABARCA
- Autenticación y autorización (asumir usuario autenticado)
- Carga de archivos adjuntos
- Publicación automática en redes sociales
- Caché o invalidación de caché
- Auditoría de cambios
- Soft deletes en posts

---

## Especificación Técnica

### Request
```json
POST /posts
Content-Type: application/json

{
  "title": "string (1-200 caracteres)",
  "content": "string (10-5000 caracteres)",
  "author": "string (3-100 caracteres)",
  "tags": ["string"] (opcional, max 5 tags de 50 caracteres c/u),
  "status": "draft" | "published" (opcional, default: "draft")
}
```

### Response Success (201)
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

### Response Error (400/422/500)
```json
{
  "error": {
    "code": "VALIDATION_ERROR" | "DATABASE_ERROR" | "SERVER_ERROR",
    "message": "Descripción del error",
    "details": {
      "field_name": ["Error message 1", "Error message 2"]
    },
    "timestamp": "ISO8601"
  }
}
```

### Validaciones

#### Campo: title
- Requerido
- Tipo: string
- Longitud mínima: 1 carácter
- Longitud máxima: 200 caracteres
- No puede ser solo espacios en blanco
- Error: `TITLE_INVALID`

#### Campo: content
- Requerido
- Tipo: string
- Longitud mínima: 10 caracteres
- Longitud máxima: 5000 caracteres
- No puede ser solo espacios en blanco
- Error: `CONTENT_INVALID`

#### Campo: author
- Requerido
- Tipo: string
- Longitud mínima: 3 caracteres
- Longitud máxima: 100 caracteres
- Patrón: Solo letras, números, espacios y guiones
- Error: `AUTHOR_INVALID`

#### Campo: tags (opcional)
- Tipo: array de strings
- Máximo: 5 tags
- Cada tag: 1-50 caracteres
- No permite duplicados
- Error: `TAGS_INVALID`

#### Campo: status (opcional)
- Tipo: string enum
- Valores permitidos: "draft", "published"
- Default: "draft"
- Error: `STATUS_INVALID`

---

## Plan de Implementación

### Fase 1: Preparación (Responsable: Persona 4)
- [ ] Crear ramas de feature (`feature/store-endpoint`)
- [ ] Configurar validadores reutilizables
- [ ] Definir modelo/schema de Post

### Fase 2: Desarrollo del Endpoint
- [ ] Implementar ruta POST /posts
- [ ] Implementar middleware de validación
- [ ] Implementar lógica de creación en base de datos
- [ ] Implementar manejo de errores
- [ ] Implementar respuesta con código 201

### Fase 3: Testing
- [ ] Tests unitarios para validadores
- [ ] Tests de integración para el endpoint
- [ ] Tests de casos edge
- [ ] Tests de manejo de errores

### Fase 4: Revisión y Merge
- [ ] Revisión de código
- [ ] Revisión de tests
- [ ] Verificación manual
- [ ] Merge a main

---

## Criterios de Evaluación

### Funcionalidad
- ✅ El endpoint crea un post exitosamente con datos válidos
- ✅ Retorna código 201 (Created)
- ✅ La respuesta incluye el post creado con ID generado
- ✅ El post se persiste en la base de datos
- ✅ Las validaciones funcionan correctamente para cada campo

### Seguridad
- ✅ No hay SQL injection (inputs sanitizados)
- ✅ No hay XSS (contenido escapado)
- ✅ Manejo seguro de errores (no expone detalles sensibles)
- ✅ Validación de tipos de datos

### Errores
- ✅ Validaciones devuelven 422 (Unprocessable Entity)
- ✅ Errores de servidor devuelven 500
- ✅ Todos los errores incluyen código y mensaje
- ✅ Los detalles del error indican qué campo falló

### Tests
- ✅ Cobertura mínima: 85%
- ✅ Tests de happy path
- ✅ Tests de validación (casos inválidos)
- ✅ Tests de edge cases
- ✅ Tests con base de datos real (no mocks)
- ✅ Todos los tests pasan

### Código
- ✅ Sigue el estilo del proyecto
- ✅ Validadores reutilizables y bien documentados
- ✅ Manejo de errores centralizado
- ✅ Sin código duplicado
- ✅ Documentación clara (comentarios donde sea necesario)

---

## Pasos Verificables

### 1. Setup Inicial
```bash
# Verificar que la rama existe
git branch -a | grep feature/store-endpoint

# Verificar que los validadores existen
ls -la src/validators/postValidator.js  # o tu lenguaje
```

### 2. Validación de Endpoint
```bash
# Iniciar servidor
npm start  # o equivalent

# Verificar que el endpoint existe
curl -X POST http://localhost:3000/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","content":"Test content is here","author":"John"}'

# Debe devolver 201 con el post creado
```

### 3. Validación de Validaciones
```bash
# Probar título vacío (debe fallar)
curl -X POST http://localhost:3000/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"","content":"Test content","author":"John"}'
# Esperado: 422 con error TITLE_INVALID

# Probar content muy corto (debe fallar)
curl -X POST http://localhost:3000/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","content":"Short","author":"John"}'
# Esperado: 422 con error CONTENT_INVALID

# Probar author inválido (debe fallar)
curl -X POST http://localhost:3000/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","content":"Valid content here","author":"J@#"}'
# Esperado: 422 con error AUTHOR_INVALID
```

### 4. Validación de Persistencia
```bash
# Crear un post
RESPONSE=$(curl -s -X POST http://localhost:3000/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"Persistent","content":"This should be saved","author":"Test"}')

# Extraer ID de la respuesta
POST_ID=$(echo $RESPONSE | jq -r '.id')

# Verificar en base de datos
# SELECT * FROM posts WHERE id = $POST_ID;
# Debe existir el registro
```

### 5. Validación de Tests
```bash
# Ejecutar tests
npm test -- tests/endpoints/posts.store.test.js  # o equivalent

# Output esperado:
# ✓ Should create a post with valid data
# ✓ Should return 201 status code
# ✓ Should validate title field
# ✓ Should validate content field
# ✓ Should validate author field
# ✓ Should handle database errors
# ✓ Should not allow duplicate posts
# ✓ Should handle optional fields (tags, status)
# ...
# 10+ tests passing
```

### 6. Validación de Cobertura
```bash
# Verificar cobertura de tests
npm test -- --coverage tests/endpoints/posts.store.test.js

# Output esperado:
# File                      | % Stmts | % Branch | % Funcs | % Lines
# -------------------------|---------|----------|---------|----------
# Store.js                  | 85+     | 80+      | 90+     | 85+
```

---

## Suite de Tests (Estructura Esperada)

### Ubicación: `tests/endpoints/posts.store.test.js`

```javascript
describe('POST /posts - Store', () => {
  
  describe('Happy Path', () => {
    test('Should create a post with valid data', async () => {
      // Arrange
      const newPost = {
        title: 'Amazing Post',
        content: 'This is a valid post content with enough characters',
        author: 'John Doe'
      };
      
      // Act
      const response = await request(app)
        .post('/posts')
        .send(newPost);
      
      // Assert
      expect(response.status).toBe(201);
      expect(response.body.id).toBeDefined();
      expect(response.body.title).toBe(newPost.title);
      expect(response.body.createdAt).toBeDefined();
    });

    test('Should create post with status "draft" by default', async () => {
      const newPost = {
        title: 'Draft Post',
        content: 'Content with minimum required length',
        author: 'Jane Smith'
      };
      
      const response = await request(app)
        .post('/posts')
        .send(newPost);
      
      expect(response.status).toBe(201);
      expect(response.body.status).toBe('draft');
    });

    test('Should create post with status "published" when specified', async () => {
      const newPost = {
        title: 'Published Post',
        content: 'Content with minimum required length here',
        author: 'Bob Wilson',
        status: 'published'
      };
      
      const response = await request(app)
        .post('/posts')
        .send(newPost);
      
      expect(response.status).toBe(201);
      expect(response.body.status).toBe('published');
    });

    test('Should accept optional tags', async () => {
      const newPost = {
        title: 'Tagged Post',
        content: 'Content with tags included in request',
        author: 'Alice Johnson',
        tags: ['javascript', 'testing']
      };
      
      const response = await request(app)
        .post('/posts')
        .send(newPost);
      
      expect(response.status).toBe(201);
      expect(response.body.tags).toEqual(newPost.tags);
    });

    test('Should persist post to database', async () => {
      const newPost = {
        title: 'Database Test',
        content: 'This post should be in the database',
        author: 'Test Author'
      };
      
      const response = await request(app)
        .post('/posts')
        .send(newPost);
      
      const postId = response.body.id;
      
      // Verify in database
      const dbPost = await Post.findById(postId);
      expect(dbPost).toBeDefined();
      expect(dbPost.title).toBe(newPost.title);
    });
  });

  describe('Validation - Title Field', () => {
    test('Should reject request without title', async () => {
      const response = await request(app)
        .post('/posts')
        .send({
          content: 'Content goes here with valid length',
          author: 'John Doe'
        });
      
      expect(response.status).toBe(422);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
      expect(response.body.error.details.title).toBeDefined();
    });

    test('Should reject title with more than 200 characters', async () => {
      const response = await request(app)
        .post('/posts')
        .send({
          title: 'A'.repeat(201),
          content: 'Content with enough characters here',
          author: 'John Doe'
        });
      
      expect(response.status).toBe(422);
      expect(response.body.error.details.title).toBeDefined();
    });

    test('Should reject empty title (only spaces)', async () => {
      const response = await request(app)
        .post('/posts')
        .send({
          title: '   ',
          content: 'Content with enough characters',
          author: 'John Doe'
        });
      
      expect(response.status).toBe(422);
    });

    test('Should accept title with 1 character', async () => {
      const response = await request(app)
        .post('/posts')
        .send({
          title: 'A',
          content: 'Content with enough characters here',
          author: 'John Doe'
        });
      
      expect(response.status).toBe(201);
      expect(response.body.title).toBe('A');
    });

    test('Should accept title with 200 characters', async () => {
      const response = await request(app)
        .post('/posts')
        .send({
          title: 'A'.repeat(200),
          content: 'Content with enough characters here',
          author: 'John Doe'
        });
      
      expect(response.status).toBe(201);
    });
  });

  describe('Validation - Content Field', () => {
    test('Should reject request without content', async () => {
      const response = await request(app)
        .post('/posts')
        .send({
          title: 'Valid Title',
          author: 'John Doe'
        });
      
      expect(response.status).toBe(422);
      expect(response.body.error.details.content).toBeDefined();
    });

    test('Should reject content shorter than 10 characters', async () => {
      const response = await request(app)
        .post('/posts')
        .send({
          title: 'Valid Title',
          content: 'Short',
          author: 'John Doe'
        });
      
      expect(response.status).toBe(422);
      expect(response.body.error.details.content).toBeDefined();
    });

    test('Should reject content longer than 5000 characters', async () => {
      const response = await request(app)
        .post('/posts')
        .send({
          title: 'Valid Title',
          content: 'A'.repeat(5001),
          author: 'John Doe'
        });
      
      expect(response.status).toBe(422);
      expect(response.body.error.details.content).toBeDefined();
    });

    test('Should accept content with exactly 10 characters', async () => {
      const response = await request(app)
        .post('/posts')
        .send({
          title: 'Valid Title',
          content: 'A'.repeat(10),
          author: 'John Doe'
        });
      
      expect(response.status).toBe(201);
    });

    test('Should accept content with 5000 characters', async () => {
      const response = await request(app)
        .post('/posts')
        .send({
          title: 'Valid Title',
          content: 'A'.repeat(5000),
          author: 'John Doe'
        });
      
      expect(response.status).toBe(201);
    });
  });

  describe('Validation - Author Field', () => {
    test('Should reject request without author', async () => {
      const response = await request(app)
        .post('/posts')
        .send({
          title: 'Valid Title',
          content: 'Content with enough characters'
        });
      
      expect(response.status).toBe(422);
      expect(response.body.error.details.author).toBeDefined();
    });

    test('Should reject author shorter than 3 characters', async () => {
      const response = await request(app)
        .post('/posts')
        .send({
          title: 'Valid Title',
          content: 'Content with enough characters',
          author: 'Jo'
        });
      
      expect(response.status).toBe(422);
    });

    test('Should reject author longer than 100 characters', async () => {
      const response = await request(app)
        .post('/posts')
        .send({
          title: 'Valid Title',
          content: 'Content with enough characters',
          author: 'A'.repeat(101)
        });
      
      expect(response.status).toBe(422);
    });

    test('Should reject author with invalid characters', async () => {
      const response = await request(app)
        .post('/posts')
        .send({
          title: 'Valid Title',
          content: 'Content with enough characters',
          author: 'John@#$%'
        });
      
      expect(response.status).toBe(422);
      expect(response.body.error.details.author).toBeDefined();
    });

    test('Should accept author with letters, numbers, spaces and hyphens', async () => {
      const response = await request(app)
        .post('/posts')
        .send({
          title: 'Valid Title',
          content: 'Content with enough characters',
          author: 'John Doe-Smith 123'
        });
      
      expect(response.status).toBe(201);
    });
  });

  describe('Validation - Tags Field', () => {
    test('Should reject more than 5 tags', async () => {
      const response = await request(app)
        .post('/posts')
        .send({
          title: 'Valid Title',
          content: 'Content with enough characters',
          author: 'John Doe',
          tags: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5', 'tag6']
        });
      
      expect(response.status).toBe(422);
      expect(response.body.error.details.tags).toBeDefined();
    });

    test('Should reject tag longer than 50 characters', async () => {
      const response = await request(app)
        .post('/posts')
        .send({
          title: 'Valid Title',
          content: 'Content with enough characters',
          author: 'John Doe',
          tags: ['A'.repeat(51)]
        });
      
      expect(response.status).toBe(422);
    });

    test('Should reject duplicate tags', async () => {
      const response = await request(app)
        .post('/posts')
        .send({
          title: 'Valid Title',
          content: 'Content with enough characters',
          author: 'John Doe',
          tags: ['javascript', 'testing', 'javascript']
        });
      
      expect(response.status).toBe(422);
      expect(response.body.error.details.tags).toBeDefined();
    });

    test('Should accept up to 5 unique tags', async () => {
      const response = await request(app)
        .post('/posts')
        .send({
          title: 'Valid Title',
          content: 'Content with enough characters',
          author: 'John Doe',
          tags: ['javascript', 'testing', 'patterns']
        });
      
      expect(response.status).toBe(201);
    });
  });

  describe('Error Handling', () => {
    test('Should return 500 on database error', async () => {
      // Mock database error
      jest.spyOn(Post, 'create').mockRejectedValueOnce(new Error('DB Error'));
      
      const response = await request(app)
        .post('/posts')
        .send({
          title: 'Valid Title',
          content: 'Content with enough characters',
          author: 'John Doe'
        });
      
      expect(response.status).toBe(500);
      expect(response.body.error.code).toBe('DATABASE_ERROR');
    });

    test('Should include timestamp in error response', async () => {
      const response = await request(app)
        .post('/posts')
        .send({
          title: '',
          content: 'Valid content',
          author: 'John Doe'
        });
      
      expect(response.status).toBe(422);
      expect(response.body.error.timestamp).toBeDefined();
      expect(new Date(response.body.error.timestamp)).toBeInstanceOf(Date);
    });

    test('Should not expose sensitive error details', async () => {
      const response = await request(app)
        .post('/posts')
        .send({
          title: 'Valid Title',
          content: 'Valid content here',
          author: 'John Doe'
        });
      
      // Should not expose database query or stack trace
      expect(JSON.stringify(response.body)).not.toMatch(/SELECT|INSERT|password|stack/i);
    });
  });

  describe('Content Security', () => {
    test('Should escape HTML in content', async () => {
      const maliciousContent = '<script>alert("XSS")</script> with enough characters';
      
      const response = await request(app)
        .post('/posts')
        .send({
          title: 'Valid Title',
          content: maliciousContent,
          author: 'John Doe'
        });
      
      expect(response.status).toBe(201);
      // Content should be escaped in database
      const savedPost = await Post.findById(response.body.id);
      expect(savedPost.content).not.toContain('<script>');
    });

    test('Should handle SQL injection attempts', async () => {
      const response = await request(app)
        .post('/posts')
        .send({
          title: "'; DROP TABLE posts; --",
          content: 'Valid content with enough characters',
          author: 'John Doe'
        });
      
      // Should either reject or sanitize, not execute
      expect(response.status).toMatch(/^(201|422)$/);
      
      // Table should still exist
      const allPosts = await Post.find();
      expect(allPosts).toBeDefined();
    });
  });

  describe('Edge Cases', () => {
    test('Should handle special characters in title', async () => {
      const response = await request(app)
        .post('/posts')
        .send({
          title: 'Title with "quotes" and \'apostrophes\'',
          content: 'Content with enough characters',
          author: 'John Doe'
        });
      
      expect(response.status).toBe(201);
      expect(response.body.title).toBe('Title with "quotes" and \'apostrophes\'');
    });

    test('Should handle unicode characters', async () => {
      const response = await request(app)
        .post('/posts')
        .send({
          title: '日本語 Título Español Título',
          content: 'Content with unicode characters and minimum length requirement',
          author: 'José García'
        });
      
      expect(response.status).toBe(201);
    });

    test('Should handle content with newlines', async () => {
      const response = await request(app)
        .post('/posts')
        .send({
          title: 'Title with content',
          content: 'Line 1\nLine 2\nLine 3\nWith minimum length',
          author: 'John Doe'
        });
      
      expect(response.status).toBe(201);
    });

    test('Should trim whitespace from fields', async () => {
      const response = await request(app)
        .post('/posts')
        .send({
          title: '  Title with spaces  ',
          content: '  Content with spaces and minimum length  ',
          author: '  John Doe  '
        });
      
      expect(response.status).toBe(201);
      expect(response.body.title).toBe('Title with spaces');
      expect(response.body.author).toBe('John Doe');
    });

    test('Should handle concurrent post creation', async () => {
      const promises = Array(5).fill(null).map((_, i) => 
        request(app)
          .post('/posts')
          .send({
            title: `Concurrent Post ${i}`,
            content: 'Content with enough characters for this test',
            author: `Author ${i}`
          })
      );
      
      const responses = await Promise.all(promises);
      
      responses.forEach(res => {
        expect(res.status).toBe(201);
        expect(res.body.id).toBeDefined();
      });
      
      // Verify all posts were created
      const count = await Post.countDocuments();
      expect(count).toBeGreaterThanOrEqual(5);
    });
  });
});
```

---

## Definición de "Hecho"

El feature se considera completado cuando:

1. ✅ El endpoint `POST /posts` existe y es accesible
2. ✅ Todas las validaciones funcionan correctamente
3. ✅ La respuesta es 201 para casos válidos
4. ✅ El post se persiste en la base de datos
5. ✅ Los errores se manejan con formato estandarizado (422/500)
6. ✅ Existe una suite de tests con 30+ test cases
7. ✅ La cobertura de código es ≥ 85%
8. ✅ Todos los tests pasan
9. ✅ No hay vulnerabilidades de seguridad
10. ✅ Código revisado y aprobado por otro miembro del equipo
11. ✅ Documentación actualizada (README, API docs)
12. ✅ Feature merged a `main`

---

## Notas de Implementación

- **Usar validadores reutilizables** para compartir lógica con Update (Spec 4)
- **Centralizar manejo de errores** en middleware
- **Usar UUID para IDs** (evitar auto-incrementales)
- **Timestamps automáticos** (createdAt, updatedAt)
- **Índices en base de datos** para campos de búsqueda frecuente
- **Logging** de creaciones exitosas para auditoría
