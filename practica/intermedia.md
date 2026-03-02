# Práctica Intermedia: Gestión de Usuarios — BildyApp

## Descripción

Desarrolla el backend de **BildyApp**, una API REST con Node.js y Express para la gestión de albaranes de obra. En esta práctica intermedia implementarás el módulo completo de **gestión de usuarios**, incluyendo registro, autenticación, onboarding y administración de cuentas.

Esta práctica evalúa los conocimientos adquiridos en los **temas T1 a T7** del curso.

---

## Tecnologías requeridas

| Categoría | Tecnología | Tema |
|-----------|------------|------|
| Runtime | Node.js 22+ con ESM (`"type": "module"`) | T1 |
| Patrones async | async/await, Promises | T2 |
| Protocolo | HTTP, códigos de estado, cabeceras | T3 |
| Framework | Express 5, middleware | T4 |
| Validación | Zod | T4, T6 |
| Base de datos | MongoDB Atlas + Mongoose | T5 |
| Arquitectura | MVC (models, controllers, routes) | T5 |
| Subida de archivos | Multer | T5 |
| Errores | Clase AppError, middleware centralizado | T6 |
| Seguridad | Helmet, rate limiting, sanitización NoSQL | T6 |
| Soft delete | Borrado lógico con Mongoose | T6 |
| Autenticación | JWT (jsonwebtoken) + bcryptjs | T7 |
| Roles | Sistema de roles (admin, guest) | T7 |

---

## Modelos de datos

### Relación entre entidades

```
┌──────────┐          ┌──────────┐
│ Company  │◄──owner──│   User   │
│          │──1:N────►│          │
└──────────┘          └──────────┘
     │
     │  (en la práctica final)
     ├──1:N──► Client
     ├──1:N──► Project
     └──1:N──► DeliveryNote
```

Una **Company** puede tener N usuarios. El usuario que la crea es el `owner` (role `admin`). Los usuarios que se unen a una compañía existente (porque el CIF ya está registrado) o los invitados se asocian a la misma Company con role `guest`. Un autónomo simplemente crea una Company donde él es el único miembro, con `isFreelance: true` y el CIF igual a su NIF.

### Company (Compañía)

```javascript
{
  owner: ObjectId,           // ref: 'User' — admin que creó la compañía
  name: String,              // Nombre de la empresa
  cif: String,               // CIF de la empresa
  address: {
    street: String,
    number: String,
    postal: String,
    city: String,
    province: String
  },
  logo: String,              // URL del logo (imagen subida con Multer)
  isFreelance: Boolean,      // true si es autónomo (1 sola persona)
  deleted: Boolean,          // Soft delete
  createdAt: Date,
  updatedAt: Date
}
```

### User (Usuario)

```javascript
{
  email: String,             // Único (index: unique), validado con Zod
  password: String,          // Cifrada con bcrypt
  name: String,              // Nombre
  lastName: String,          // Apellidos
  nif: String,               // Documento de identidad
  role: 'admin' | 'guest',            // Por defecto: 'admin'
  status: 'pending' | 'verified',     // Estado de verificación del email (index)
  verificationCode: String,  // Código aleatorio de 6 dígitos
  verificationAttempts: Number, // Intentos restantes (máximo 3)
  company: ObjectId,         // ref: 'Company' — se asigna en el onboarding (index)
  address: {
    street: String,
    number: String,
    postal: String,
    city: String,
    province: String
  },
  deleted: Boolean,          // Soft delete
  createdAt: Date,
  updatedAt: Date
}

// Virtual (no se almacena, se calcula):
// fullName → name + ' ' + lastName
```

> **Indexes recomendados:** `email` (unique), `company`, `status`, `role`. Los indexes aceleran las consultas frecuentes (T5).

> **Virtual `fullName`:** Define un virtual en Mongoose que devuelva `name + ' ' + lastName`. Asegúrate de configurar `toJSON: { virtuals: true }` en el schema (T5).

> **Nota sobre el autónomo:** Cuando un usuario es autónomo, crea una Company con `isFreelance: true`. Los datos de la compañía (nombre, CIF, dirección) serán los mismos datos personales del usuario. La relación sigue siendo `User.company → Company._id`, simplemente la Company tiene un solo miembro.

---

## Endpoints a implementar

### 1) Registro de usuario — `POST /api/user/register` (1 punto)

Especificaciones técnicas:
- Validar con **Zod** que el email sea un email válido. Usar `.transform()` para normalizar el email a minúsculas.
- Validar con **Zod** que la contraseña contenga al menos 8 caracteres.
- No se podrá registrar con un email ya existente (y validado) en la base de datos (devuelve un error **409 Conflict**).
- La contraseña se guardará **cifrada** en base de datos con **bcryptjs**.
- Se generará un **código aleatorio de 6 dígitos** y un número máximo de intentos (3) en base de datos para la posterior validación del email.
- El usuario se crea con role **`admin`** por defecto (podrá cambiar a `guest` durante el onboarding de compañía; ver punto 4).
- La respuesta devolverá los datos del usuario (email, status y role), un **access token JWT** (corta duración, p. ej. 15 min) y un **refresh token** (larga duración, p. ej. 7 días).

### 2) Validación del email — `PUT /api/user/validation` (1 punto)

Especificaciones técnicas:
- Requiere el **token JWT** recibido en la respuesta del registro (cabecera `Authorization: Bearer <token>`).
- Validar con **Zod** que el código tenga exactamente 6 dígitos.
- En el cuerpo de la petición se enviará el `code` (en teoría llegaría por correo; por ahora, consúltalo directamente en la base de datos para ese usuario).
- Si el código recibido es correcto (coincide con el almacenado en base de datos para el usuario identificado por el token JWT), se modifica el `status` a `verified` y se devuelve un ACK.
- Si el código es incorrecto, se decrementa el contador de intentos y se devuelve un error de cliente **4XX**.
- Si se agotan los intentos, se devuelve un error **429 Too Many Requests**.

### 3) Login — `POST /api/user/login` (1 punto)

Especificaciones técnicas:
- Validar con **Zod** el email y la contraseña enviados en el cuerpo de la petición.
- Si las credenciales son válidas, devolver los datos del usuario, un **access token** y un **refresh token**.
- Si las credenciales son incorrectas, devolver un error **401 Unauthorized**.

### 4) Onboarding — Datos personales y de compañía

**Datos personales** — `PUT /api/user/register` (1 punto):
- Requiere token JWT.
- Validar con **Zod** los datos del cuerpo (nombre, apellidos y NIF).
- Actualizar el usuario con estos datos.

**Datos de la compañía** — `PATCH /api/user/company` (1 punto):
- Requiere token JWT.
- Validar con **Zod** los datos (nombre, CIF, dirección, `isFreelance`).
- **Lógica de asignación según el CIF:**
  - Si **no existe** ninguna Company con ese CIF → se crea un nuevo documento **Company**, el usuario se asigna como `owner` y mantiene su role `admin`.
  - Si **ya existe** una Company con ese CIF → el usuario se une a esa compañía existente y su role cambia a `guest`.
- Si el usuario indica que es autónomo (`isFreelance: true`), el CIF de la compañía será su propio NIF y los datos de la compañía se rellenan automáticamente con sus datos personales (nombre, NIF, dirección).

### 5) Logo de la compañía — `PATCH /api/user/logo` (1 punto)

Especificaciones técnicas:
- Requiere token JWT. El usuario debe tener una compañía asociada.
- Recibe una imagen como logo mediante `multipart/form-data` (usa **Multer**).
- Controla el tamaño máximo del archivo (por ejemplo, 5 MB).
- Guarda el logo en disco (carpeta `uploads/`) o en la nube, y almacena la URL en el campo `logo` del documento **Company** del usuario.

### 6) Obtener usuario — `GET /api/user` (1 punto)

Especificaciones técnicas:
- Requiere token JWT.
- Devuelve los datos del usuario autenticado.
- Usa **`populate`** para incluir los datos completos de la Company asociada (no solo el ObjectId).
- El virtual `fullName` debe aparecer en la respuesta JSON.

### 7) Gestión de sesión — `POST /api/user/refresh` y `POST /api/user/logout` (1 punto)

**Refresh token** — `POST /api/user/refresh`:
- Recibe el `refreshToken` en el cuerpo de la petición.
- Si el refresh token es válido y no ha expirado, devuelve un nuevo **access token** (y opcionalmente rota el refresh token).
- Si el refresh token es inválido o ha expirado, devuelve un error **401 Unauthorized**.

**Logout** — `POST /api/user/logout`:
- Requiere token JWT.
- Invalida el refresh token del usuario (por ejemplo, eliminándolo de la base de datos o añadiéndolo a una lista negra).
- Devuelve un ACK confirmando el cierre de sesión.

### 8) Eliminar usuario — `DELETE /api/user` (1 punto)

Especificaciones técnicas:
- Requiere token JWT.
- Soporta hard o soft delete en función del parámetro query `?soft=true`.
- El soft delete utiliza el patrón de borrado lógico (T6).

### 9) Cambiar contraseña — `PUT /api/user/password` (1 punto)

Especificaciones técnicas:
- Requiere token JWT.
- Recibe en el cuerpo la contraseña actual y la nueva contraseña.
- Usar **Zod `.refine()`** para validar que la nueva contraseña sea diferente de la actual.
- Verificar que la contraseña actual es correcta antes de actualizarla.

### 10) Invitar compañeros — `POST /api/user/invite` (1 punto)

Especificaciones técnicas:
- Requiere token JWT. Solo usuarios con role `admin` pueden invitar.
- Se crea un nuevo usuario con los datos proporcionados y se le asigna el mismo `company` (ObjectId) del usuario que invita, con role `guest`.
- Se emite un **evento** `user:invited` mediante EventEmitter (ver requisitos técnicos).

---

## Requisitos técnicos obligatorios

Estos requisitos reflejan los conceptos aprendidos en T1-T7 y son de **cumplimiento obligatorio**:

| Requisito | Tema | Descripción |
|-----------|------|-------------|
| ESM | T1 | Usar `"type": "module"` en `package.json` y sentencias `import`/`export` |
| Node.js 22+ | T1 | Usar `--watch` y `--env-file=.env` en los scripts de desarrollo |
| Async/await | T2 | Todas las operaciones asíncronas deben usar `async`/`await` |
| EventEmitter | T2 | Implementar un servicio de eventos que emita notificaciones en el ciclo de vida del usuario: `user:registered`, `user:verified`, `user:invited`, `user:deleted`. Registrar listeners que hagan log de cada evento por consola (en la práctica final se enviarán a Slack) |
| Arquitectura MVC | T5 | Organizar el código en `models/`, `controllers/`, `routes/`, `middleware/`, `validators/` |
| Validación Zod | T4, T6 | Todos los cuerpos de petición deben validarse con esquemas Zod. Usar `.transform()` para normalizar datos (p. ej. email a minúsculas, trim de strings) y `.refine()` para validaciones cruzadas (p. ej. nueva contraseña ≠ actual) |
| MongoDB + Mongoose | T5 | Usar MongoDB Atlas como base de datos y Mongoose como ODM |
| Populate | T5 | Usar `populate` en las consultas que devuelvan referencias a otros modelos (p. ej. User → Company) |
| Virtuals | T5 | Definir al menos un virtual (`fullName`) en el modelo User. Configurar `toJSON: { virtuals: true }` |
| Indexes | T5 | Definir indexes en los campos de consulta frecuente: `email` (unique), `company`, `status`, `role` |
| AppError | T6 | Implementar la clase `AppError` con métodos factoría y un middleware centralizado de errores |
| Seguridad | T6 | Incluir Helmet, rate limiting (`express-rate-limit`) y sanitización (`express-mongo-sanitize`) |
| JWT + bcrypt | T7 | Access token de corta duración + refresh token de larga duración. Contraseñas cifradas con bcryptjs |
| Roles | T7 | Middleware de autorización basado en roles |

---

## Estructura esperada del proyecto

```
bildyapp-api/
├── src/
│   ├── config/
│   │   └── index.js            # Configuración centralizada
│   ├── controllers/
│   │   └── user.controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js   # Verificación JWT
│   │   ├── error-handler.js    # Middleware centralizado de errores
│   │   ├── role.middleware.js   # Autorización por roles
│   │   ├── upload.js           # Configuración de Multer
│   │   └── validate.js         # Middleware de validación Zod
│   ├── models/
│   │   ├── User.js             # Modelo Mongoose (con virtuals e indexes)
│   │   └── Company.js          # Modelo Mongoose
│   ├── routes/
│   │   └── user.routes.js
│   ├── services/
│   │   └── notification.service.js  # EventEmitter para eventos del usuario
│   ├── utils/
│   │   └── AppError.js         # Clase de errores personalizada
│   ├── validators/
│   │   └── user.validator.js   # Esquemas Zod (con transform y refine)
│   ├── app.js                  # Configuración de Express
│   └── index.js                # Punto de entrada
├── uploads/                    # Archivos subidos (logo)
├── .env
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## Entrega

- **Repositorio de GitHub** con el código fuente.
- Incluir un fichero **`.env.example`** con las variables de entorno necesarias (sin valores reales).
- Incluir ficheros **`.http`** o colección de Postman/Thunder Client con ejemplos de cada endpoint.
- Realizar **commits progresivos** (no subir todo el código de golpe).
- Incluir un **`README.md`** con instrucciones de instalación y ejecución.

---

## Rúbrica (10 puntos)

| Endpoint / Funcionalidad | Puntuación |
|--------------------------|------------|
| Registro de usuario (`POST /api/user/register`) | 1 punto |
| Validación del email (`PUT /api/user/validation`) | 1 punto |
| Login (`POST /api/user/login`) | 1 punto |
| Onboarding: datos personales (`PUT /api/user/register`) | 1 punto |
| Onboarding: crear compañía (`PATCH /api/user/company`) | 1 punto |
| Logo de la compañía (`PATCH /api/user/logo`) | 1 punto |
| Obtener usuario con populate (`GET /api/user`) | 1 punto |
| Gestión de sesión: refresh + logout | 1 punto |
| Eliminar usuario hard/soft (`DELETE /api/user`) | 1 punto |
| Invitar compañeros (`POST /api/user/invite`) | 1 punto |

> Además de la funcionalidad de cada endpoint, se evaluará el cumplimiento de los **requisitos técnicos obligatorios**: ESM, async/await, EventEmitter, MVC, Zod (transform/refine), Mongoose (populate/virtuals/indexes), AppError, seguridad, JWT (access + refresh tokens). El incumplimiento de estos requisitos podrá suponer una **penalización de hasta el 30 %** sobre la nota total.

### Bonus (puntos extra)

| Funcionalidad | Puntuación extra |
|---------------|-----------------|
| Cambiar contraseña (`PUT /api/user/password`) con `.refine()` para validar que nueva ≠ actual | +0,5 puntos |
| Zod `discriminatedUnion` para validación condicional del onboarding según `isFreelance` | +0,5 puntos |

---

## Recursos

- [Teoría T1: Introducción a Node.js](../teoria/T1.md)
- [Teoría T2: Eventos y Asincronía](../teoria/T2.md)
- [Teoría T3: HTTP y Enrutamiento](../teoria/T3.md)
- [Teoría T4: Framework Express](../teoria/T4.md)
- [Teoría T5: MVC y MongoDB con Mongoose](../teoria/T5.md)
- [Teoría T6: Validación Avanzada y Manejo de Errores](../teoria/T6.md)
- [Teoría T7: Autenticación y Autorización con JWT](../teoria/T7.md)
- [Ejemplos de código](../codigo/)
