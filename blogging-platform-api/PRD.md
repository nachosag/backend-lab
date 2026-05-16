# PRD - API RESTful de Plataforma de Blogs

## 1. Descripción del Proyecto

### 1.1 Propósito

Desarrollar una API RESTful para una plataforma de blogs personal que permita a los usuarios realizar operaciones CRUD sobre publicaciones. El proyecto tiene como objetivo principal el aprendizaje profundo de TypeScript, Express.js, MongoDB con driver nativo, y buenas prácticas de testing con Vitest aplicando TDD.

### 1.2 Objetivos de Aprendizaje

| Área             | Objetivos Específicos                                                                                                   |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------- |
| **TypeScript**   | Tipado estricto, tipos personalizados, generics, manejo de tipos async                                                  |
| **Express.js**   | Middlewares, routing, manejo de errores, validación con Zod, Swagger                                                    |
| **MongoDB**      | Driver nativo, diseño de esquemas, operaciones CRUD, índices, relaciones embebidas, agregaciones, MongoDB Atlas (cloud) |
| **Testing**      | Unit testing, integración, E2E, mocking, alta cobertura (~100%)                                                         |
| **Arquitectura** | Arquitectura en capas, Repository Pattern, Dependency Injection                                                         |

---

## 2. Scope del Proyecto

### 2.1 Incluye (In Scope)

- ✅ CRUD completo de publicaciones de blog
- ✅ Filtrado de posts por término de búsqueda en title, content, category
- ✅ Validación de entrada con Zod
- ✅ Documentación de API con Swagger/OpenAPI
- ✅ Arquitectura en capas (Controllers, Services, Repositories)
- ✅ Repository Pattern con MongoDB driver nativo
- ✅ Dependency Injection manual
- ✅ Manejo centralizado de errores HTTP
- ✅ Unit tests con Vitest
- ✅ Integration tests contra base de datos de prueba
- ✅ E2E tests simulating requests HTTP
- ✅ Mocking de dependencias
- ✅ Cobertura objetivo: ~100%
- ✅ Variables de entorno (.env)

### 2.2 Excluye (Out of Scope)

- ❌ Autenticación y autorización
- ❌ Paginación
- ❌ Usuarios y roles
- ❌ Upload de imágenes
- ❌ Comentarios en posts
- ❌ Tags dinámicos (solo lectura/escritura simple)
- ❌ Docker (se usa MongoDB Atlas para la base de datos)
- ❌ Healthchecks en Docker (complejidad innecesaria)
- ❌ Testing con datos persistentes (usar contenedor efímero o in-memory)

---

## 3. Requisitos Funcionales

### 3.1 Crear Publicación (POST /posts)

| Requisito      | Detalle                                                                                                               |
| -------------- | --------------------------------------------------------------------------------------------------------------------- |
| **Input**      | `{ title: string, content: string, category: string, tags: string[] }`                                                |
| **Validación** | Todos los campos requeridos; title: 1-200 chars; content: 1-10000 chars; category: 1-50 chars; tags: array de strings |
| **Output 201** | `{ id: string, title, content, category, tags, createdAt: ISO8601, updatedAt: ISO8601 }`                              |
| **Output 400** | `{ errors: [{ field: string, message: string }] }`                                                                    |

### 3.2 Actualizar Publicación (PUT /posts/:id)

| Requisito      | Detalle                                          |
| -------------- | ------------------------------------------------ |
| **Input**      | Mismo que POST, todos los campos opcionales      |
| **Validación** | Mismo que POST; id debe existir                  |
| **Output 200** | Publicación actualizada con updatedAt modificado |
| **Output 400** | Errores de validación                            |
| **Output 404** | Post no encontrado                               |

### 3.3 Eliminar Publicación (DELETE /posts/:id)

| Requisito      | Detalle                        |
| -------------- | ------------------------------ |
| **Input**      | ID del post en path            |
| **Output 204** | Eliminación exitosa (sin body) |
| **Output 404** | Post no encontrado             |

### 3.4 Obtener Un Post (GET /posts/:id)

| Requisito      | Detalle                  |
| -------------- | ------------------------ |
| **Input**      | ID del post en path      |
| **Output 200** | Datos completos del post |
| **Output 404** | Post no encontrado       |

### 3.5 ObtenerTodos los Posts (GET /posts)

| Requisito      | Detalle                                                          |
| -------------- | ---------------------------------------------------------------- |
| **Input**      | Query param opcional: `term` (string)                            |
| **Filtro**     | Búsqueda en title, content, category (case-insensitive, parcial) |
| **Output 200** | Array de posts (vacío si no hay resultados)                      |

---

## 4. Diseño de Datos

### 4.1 Schema: Post

```typescript
interface Post {
  _id: ObjectId;
  title: string;
  content: string;
  category: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}
```

### 4.2 Índices Sugeridos

| Índice         | Campos         | Propósito                   |
| -------------- | -------------- | --------------------------- |
| `_id`          | \_id           | Primary key (automático)    |
| `title_text`   | title (text)   | Búsqueda por título         |
| `content_text` | content (text) | Búsqueda por contenido      |
| `category`     | category       | Filter rápido por categoría |

### 4.3 Relaciones Embebidas

- El array `tags` se almacena directamente en el documento Post (relación embebida, no referencia)

---

## 5. Arquitectura

### 5.1 Capas

```
src/
├── application/        # Capa de Aplicación (Lógica de negocio)
│   └── services/       # Services con lógica de negocio
├── domain/             # Capa de Dominio (Entidades e interfaces)
│   ├── entities/       # Entidades del negocio
│   ├── repositories/   # Interfaces de repositorio
│   └── errors/         # Errores domain-specific
├── infrastructure/     # Capa de Infraestructura
│   ├── repositories/   # Implementaciones de repositorio
│   ├── database/       # Conexión MongoDB
│   └── config/         # Configuración
├── presentation/       # Capa de Presentación (Express)
│   ├── controllers/    # Manejan requests/responses
│   ├── middlewares/    # Middlewares Express
│   └── routes/         # Definiciones de rutas
├── shared/             # Compartido
│   ├── types/          # Tipos compartidos
│   └── utils/          # Utilidades
└── tests/              # Tests
    ├── unit/           # Tests unitarios
    ├── integration/    # Tests de integración
    └── e2e/            # Tests E2E
```

### 5.2 Flujo de una Request

```
HTTP Request → Middleware → Controller → Service → Repository → MongoDB Driver
                ↓              ↓            ↓           ↓
           Response    Service      Repository   Result
```

### 5.3 Dependency Injection

```typescript
// Ejemplo de inyección
const postRepository = new MongoPostRepository(connection);
const postService = new PostService(postRepository);
const postController = new PostController(postService);
```

---

## 6. Estrategia de Testing

### 6.1 Niveles de Testing

| Nivel           | Objetivos                        | Cubertura Objetivo       |
| --------------- | -------------------------------- | ------------------------ |
| **Unit**        | Services, Controllers, Utils     | ~100%                    |
| **Integration** | Repositories, Controllers con DB | ~90%                     |
| **E2E**         | Endpoints completos HTTP         | Cobertura de smoke tests |

### 6.2 Tech Stack de Testing

| Herramienta               | Uso                           |
| ------------------------- | ----------------------------- |
| **Vitest**                | Test runner principal         |
| **supertest**             | Testing HTTP endpoints        |
| **mongodb-memory-server** | MongoDB en memoria para tests |
| **Vitest Coverage**       | Istanbul/v8 para coverage     |

### 6.3 Flujo TDD

```
1. Escribir test que falla
2. Escribir código mínimo para pasar
3. Refactorizar
4. Repetir
```

---

## 7. API Documentation

### 7.1 Endpoints

| Método | Path       | Descripción                        |
| ------ | ---------- | ---------------------------------- |
| POST   | /posts     | Crear post                         |
| GET    | /posts     | Listar posts (con filtro opcional) |
| GET    | /posts/:id | Obtener post por ID                |
| PUT    | /posts/:id | Actualizar post                    |
| DELETE | /posts/:id | Eliminar post                      |

### 7.2 Códigos de Estado

| Código | Uso                   |
| ------ | --------------------- |
| 200    | OK                    |
| 201    | Created               |
| 204    | No Content            |
| 400    | Bad Request           |
| 404    | Not Found             |
| 500    | Internal Server Error |

### 7.3 Documentación Swagger

- Endpoint: `/api/docs`
- Formato: OpenAPI 3.0
- UI interactiva disponible

---

## 8. MongoDB Atlas

### 8.1 Configuración

El proyecto utiliza MongoDB Atlas como base de datos en la nube. La conexión se configura mediante variables de entorno.

### 8.2 Variables de Entorno (.env)

```
APP_PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<usuario>:<password>@<cluster>.mongodb.net/blogging-platform?retryWrites=true&w=majority
```

### 8.3 Consideraciones de Seguridad

- La URI de conexión nunca se expone en el código fuente
- Las credenciales se almacenan exclusivamente en `.env`
- El archivo `.env` está excluido del control de versiones

---

## 9. Criterios de Aceptación

| ID    | Feature           | Criterio                                                  |
| ----- | ----------------- | --------------------------------------------------------- |
| AC-01 | POST /posts       | Retorna 201 + post creado con id y timestamps             |
| AC-02 | POST /posts       | Retorna 400 si validación falla                           |
| AC-03 | GET /posts        | Retorna 200 con array de posts                            |
| AC-04 | GET /posts?term   | Filtra posts por term en title/content/category           |
| AC-05 | GET /posts/:id    | Retorna 200 con post específico                           |
| AC-06 | GET /posts/:id    | Retorna 404 si no existe                                  |
| AC-07 | PUT /posts/:id    | Retorna 200 + post actualizado                            |
| AC-08 | PUT /posts/:id    | Retorna 404 si no existe                                  |
| AC-09 | DELETE /posts/:id | Retorna 204 si eliminado                                  |
| AC-10 | DELETE /posts/:id | Retorna 404 si no existe                                  |
| AC-11 | Testing           | Coverage >90% total                                       |
| AC-12 | MongoDB Atlas     | app conectándose a MongoDB Atlas con variables de entorno |
| AC-13 | Swagger           | Documentación accesible en /api/docs                      |

---

## 10. Roadmap de Implementación

### Fase 1: Fundamentos

- [x] Setup proyecto TypeScript + Express
- [x] Configuración de variables de entorno
- [x] Conexión a MongoDB Atlas
- [x] Estructura de carpetas (arquitectura en capas)

### Fase 2: Dominio

- [x] Entidad Post
- [x] Interfaz Repository
- [x] Errores del dominio

### Fase 3:Infraestructura

- [x] Implementación MongoPostRepository (create, findAll, findById, update, delete)
- [x] Índices (category: 1, createdAt: -1)

### Fase 4: Application

- [ ] Post Service (CRUD)

### Fase 5: Presentación

- [ ] PostController
- [ ] Rutas
- [ ] Middlewares
- [ ] Validación Zod

### Fase 6: Testing

- [ ] Unit tests (services, controllers)
- [ ] Integration tests (repositories)
- [ ] E2E tests

### Fase 7: Documentación

- [ ] Swagger/OpenAPI
- [ ] README

---

## 11. Notas de Aprendizaje

### Conceptos Clave a Cubrir

1. **Repository Pattern**: Abstracción de la capa de datos
2. **Dependency Injection**: Inversión de control sin framework
3. **TDD**: Ciclo rojo-verde-refactor
4. **MongoDB Driver**: Operaciones nativas vs ODM
5. **Arquitectura Hexagonal-lite**: Capas con puertos y adaptadoresimplícitos

### Errores Comunes a Evitar

- Acoplamiento directo entre capas
- Mongoose (usar driver nativo para aprender)
- No testear casos de error
- Variables hardcodeadas
- No documentar la API
- Exponer credenciales de base de datos
