# 🏢 ERP Enterprise - Sistema Modular

Sistema ERP moderno, seguro y escalable construido con Laravel 12 y Vue.js 3.

---

## 📋 CONTENIDO

- [Características Principales](#-características-principales)
- [Stack Tecnológico](#-stack-tecnológico)
- [Estructura del Backend](#-estructura-del-backend)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Uso](#-uso)
- [API Documentation](#-api-documentation)
- [Licencia](#-licencia)

---

## ✨ CARACTERÍSTICAS PRINCIPALES

- ✅ **Autenticación Robusta** - Login seguro con Sanctum (SPA)
- ✅ **Sistema de Roles y Permisos** - Control granular con Spatie Permission
- ✅ **Multilenguaje** - 10 idiomas completos (EN, ES, FR, DE, IT, PT, ZH, JA, AR, RU)
- ✅ **Sistema de Temas** - 12 temas personalizables con dark mode
- ✅ **WebSockets en Tiempo Real** - Laravel Reverb para notificaciones
- ✅ **Gestión de Usuarios Avanzada** - Emails y teléfonos múltiples
- ✅ **Categorías con Costes** - Sistema de costes por horas y días (PVP/PC)
- ✅ **Dashboard AdminLTE** - Diseño moderno y responsive
- ✅ **API RESTful** - Completa y documentada
- ✅ **Arquitectura Limpia** - Repository + Service + Controller pattern

---

## 🛠 STACK TECNOLÓGICO

### Backend
- **Laravel 12.44.0** - Framework PHP
- **Laravel Sanctum** - Autenticación API SPA
- **Laravel Reverb** - WebSockets en tiempo real
- **Spatie Laravel Permission** - Roles y permisos
- **MySQL** - Base de datos

### Frontend
- **Vue.js 3** - Framework JavaScript progresivo
- **Vue Router** - Navegación SPA
- **Pinia** - State management
- **Vue i18n** - Internacionalización
- **Tailwind CSS** - Framework CSS
- **Vite** - Build tool

---

## 📁 ESTRUCTURA DEL BACKEND

### 1. CONFIGURACIÓN BASE

| Componente | Estado | Versión |
|------------|--------|---------|
| Laravel | ✅ | 12.44.0 |
| MySQL | ✅ | 8.x |
| Sanctum | ✅ | 4.2 |
| Reverb | ✅ | 1.6 |
| Spatie Permission | ✅ | 6.24 |

---

### 2. BASE DE DATOS (13 tablas)

| # | Tabla | Descripción |
|---|-------|-------------|
| 1 | `users` | Usuarios (username, password, avatar, status, group_id) |
| 2 | `password_reset_tokens` | Tokens para recuperación de contraseña |
| 3 | `sessions` | Sesiones de usuarios |
| 4 | `groups` | Grupos de trabajo (Development, Admin, Support, Sales) |
| 5 | `categories` | Categorías laborales por grupo |
| 6 | `user_categories` | Pivot usuarios-categorías con **is_primary** |
| 7 | `category_costs` | Costes: horas normales, extras, festivas, día (PVP + PC) |
| 8 | `user_emails` | Emails múltiples por usuario (tipos + is_primary) |
| 9 | `user_phones` | Teléfonos múltiples (tipos + is_primary) |
| 10 | `user_preferences` | Preferencias: locale, theme_id, timezone |
| 11 | `themes` | 12 temas del sistema con colores JSON |
| 12 | `roles` + `permissions` | Sistema Spatie Permission |
| 13 | `personal_access_tokens` | Tokens Sanctum |

---

### 3. MODELOS ELOQUENT (9 modelos)

| Modelo | Relaciones Principales |
|--------|------------------------|
| **User** | group, emails, phones, preference, categories, roles, permissions |
| **Group** | users, categories |
| **Category** | group, users, categoryCost |
| **UserCategory** | user, category, assignedBy (pivot con is_primary) |
| **CategoryCost** | category |
| **UserEmail** | user (gestión automática de primario) |
| **UserPhone** | user (gestión automática de primario) |
| **UserPreference** | user, theme |
| **Theme** | userPreferences |

**Enums:** UserStatus, EmailType, PhoneType

---

### 4. ARQUITECTURA (Repository + Service + Controller)

#### Repositorios (8)
- UserRepository
- UserEmailRepository
- UserPhoneRepository
- GroupRepository
- CategoryRepository
- CategoryCostRepository
- ThemeRepository
- UserPreferenceRepository

#### Servicios (7)
- AuthService (login, logout, tokens, profile, password)
- UserService (CRUD + emails/phones/categories/roles)
- GroupService (CRUD)
- CategoryService (CRUD + costes)
- ThemeService (gestión de temas)
- PreferenceService (preferencias de usuario)
- PasswordResetService (recuperación de contraseña)

#### Controladores (7)
- Auth/AuthController
- Auth/PasswordResetController
- UserController (Resource + métodos adicionales)
- GroupController (Resource)
- CategoryController (Resource + costes)
- ThemeController
- PreferenceController

---

### 5. VALIDACIÓN - FORM REQUESTS (13)

| Request | Uso |
|---------|-----|
| LoginRequest | Validación de login |
| UpdateProfileRequest | Actualizar perfil |
| UpdatePasswordRequest | Cambiar contraseña |
| ForgotPasswordRequest | Solicitar reseteo |
| ResetPasswordRequest | Resetear contraseña |
| StoreUserRequest | Crear usuario |
| UpdateUserRequest | Actualizar usuario |
| StoreGroupRequest | Crear grupo |
| UpdateGroupRequest | Actualizar grupo |
| StoreCategoryRequest | Crear categoría |
| UpdateCategoryRequest | Actualizar categoría |
| UpdateCategoryCostsRequest | Actualizar costes |
| UpdatePreferenceRequest | Actualizar preferencias |

---

### 6. AUTORIZACIÓN - POLICIES (5)

| Policy | Permisos |
|--------|----------|
| UserPolicy | viewAny, view, create, update, delete, forceDelete, restore |
| GroupPolicy | viewAny, view, create, update, delete |
| CategoryPolicy | viewAny, view, create, update, delete, updateCosts |
| ThemePolicy | viewAny, view, create, update, delete |
| PreferencePolicy | view, update |

**Todas con bypass automático para Super Admin**

---

### 7. TIEMPO REAL - EVENTOS Y NOTIFICACIONES

#### Eventos Broadcast (3)
| Evento | Canal | Descripción |
|--------|-------|-------------|
| UserCreatedEvent | admin | Se dispara al crear usuario |
| SystemNotificationEvent | notifications.{userId} | Notificaciones personales |
| UserStatusChangedEvent | admin + user.{id} | Cambio de estado de usuario |

#### Notificaciones (2)
- **WelcomeNotification** - Email de bienvenida a nuevos usuarios
- **PasswordResetNotification** - Email para reseteo de contraseña

#### Canales Broadcasting (4)
- `App.Models.User.{id}` - Canal privado del usuario
- `admin` - Super Admin y Admin
- `notifications.{userId}` - Notificaciones personales
- `user.{id}` - Eventos del usuario

---

### 8. RUTAS API

#### Rutas Públicas (3)
```
POST /api/auth/login
POST /api/auth/forgot-password
POST /api/auth/reset-password
```

#### Rutas Protegidas (auth:sanctum)
```
# Autenticación
POST   /api/auth/logout
GET    /api/auth/user
PUT    /api/auth/user
PUT    /api/auth/user/password

# Usuarios
GET    /api/users
POST   /api/users
GET    /api/users/{user}
PUT    /api/users/{user}
DELETE /api/users/{user}
POST   /api/users/{user}/emails
POST   /api/users/{user}/phones
DELETE /api/users/emails/{email}
DELETE /api/users/phones/{phone}

# Grupos
GET    /api/groups
POST   /api/groups
GET    /api/groups/{group}
PUT    /api/groups/{group}
DELETE /api/groups/{group}

# Categorías
GET    /api/categories
POST   /api/categories
GET    /api/categories/{category}
PUT    /api/categories/{category}
DELETE /api/categories/{category}
POST   /api/categories/{category}/costs

# Temas
GET    /api/themes
GET    /api/themes/{theme}

# Preferencias
GET    /api/preferences
PUT    /api/preferences
PUT    /api/preferences/locale
PUT    /api/preferences/theme
```

---

### 9. SISTEMA MULTILENGUAJE (10 idiomas)

#### Infraestructura
- **SetLocaleMiddleware** - Detecta y aplica locale automáticamente
- **LocaleHelper** - 10+ métodos útiles

#### Idiomas Completos

| Código | Idioma | Archivos Traducción |
|--------|--------|---------------------|
| en | English | ✅ 5 archivos |
| es | Español | ✅ 5 archivos |
| fr | Français | ✅ 5 archivos |
| de | Deutsch | ✅ 5 archivos |
| it | Italiano | ✅ 5 archivos |
| pt | Português | ✅ 5 archivos |
| zh | 中文 | ✅ 5 archivos |
| ja | 日本語 | ✅ 5 archivos |
| ar | العربية (RTL) | ✅ 5 archivos |
| ru | Русский | ✅ 5 archivos |

**Archivos por idioma:**
- `auth.php` - Mensajes de autenticación
- `validation.php` - Mensajes de validación
- `messages.php` - Mensajes de la aplicación
- `models.php` - Nombres de modelos y campos
- `passwords.php` - Mensajes de contraseñas

**Total:** 50 archivos de traducción profesionales

---

### 10. DATOS INICIALES - SEEDERS

#### Usuario Administrador
```
Username: admin
Email: admin@erp.com
Password: admin123
Rol: Super Admin
Grupo: Administration
Categoría: Administrator (primaria)
Teléfono: +34 900 000 000
Preferencias: locale=en, theme=Default Light
```

#### Roles y Permisos
- **Super Admin** → Acceso total (*)
- **Admin** → users.*, groups.*, categories.*, themes.view, preferences.*
- **Manager** → users.view, users.create, categories.*, groups.view
- **User** → users.view, themes.view, preferences.*

#### Grupos (4)
- Development
- Administration
- Support
- Sales

#### Categorías (13 con costes)
- Senior Full Stack Developer
- Junior Developer
- Tech Lead
- DevOps Engineer
- Manager
- Administrator
- HR Specialist
- Technical Support
- Customer Service
- Support Lead
- Account Manager
- Sales Representative
- Sales Director

#### Temas (12)
- Default Light
- Default Dark
- Blue Ocean
- Purple Dream
- Green Nature
- Orange Sunset
- Red Fire
- Gray Professional
- Teal Modern
- Pink Soft
- High Contrast
- Custom

---

### 11. SEGURIDAD IMPLEMENTADA

| Protección | Implementación |
|------------|----------------|
| CSRF | Sanctum tokens |
| XSS | Validación de inputs |
| SQL Injection | Eloquent ORM |
| Brute Force | Rate limiting |
| Password Hashing | bcrypt |
| Token Expiration | Sanctum |
| RBAC | Spatie Permission + Policies |
| API Authentication | Sanctum middleware |

---

## 🚀 INSTALACIÓN

### Requisitos Previos
- PHP >= 8.2
- Composer
- Node.js >= 18.x
- MySQL >= 8.x
- NPM o Yarn

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd erp-enterprise
```

2. **Instalar dependencias PHP**
```bash
composer install
```

3. **Instalar dependencias JavaScript**
```bash
npm install
```

4. **Configurar el archivo .env**
```bash
cp .env.example .env
php artisan key:generate
```

5. **Configurar la base de datos en .env**
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=erp_enterprise
DB_USERNAME=root
DB_PASSWORD=
```

6. **Crear la base de datos**
```bash
mysql -u root -e "CREATE DATABASE erp_enterprise"
```

7. **Ejecutar migraciones y seeders**
```bash
php artisan migrate:fresh --seed
```

8. **Generar claves de Reverb (si no existen)**
```bash
php artisan reverb:install
```

---

## ⚙️ CONFIGURACIÓN

### Variables de Entorno Principales

```env
# Aplicación
APP_NAME="ERP Enterprise"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000
APP_LOCALE=en
APP_FALLBACK_LOCALE=en

# Base de datos
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=erp_enterprise
DB_USERNAME=root
DB_PASSWORD=

# Broadcasting (Reverb)
BROADCAST_CONNECTION=reverb
REVERB_APP_ID=your-app-id
REVERB_APP_KEY=your-app-key
REVERB_APP_SECRET=your-app-secret
REVERB_HOST="localhost"
REVERB_PORT=8080
REVERB_SCHEME=http

# Cola
QUEUE_CONNECTION=database

# Email (configurar según necesidad)
MAIL_MAILER=log
```

---

## 🎮 USO

### Iniciar el Sistema

**Terminal 1 - Servidor Laravel:**
```bash
php artisan serve
```
Acceso: http://localhost:8000

**Terminal 2 - WebSockets (Reverb):**
```bash
php artisan reverb:start
```

**Terminal 3 - Cola de Trabajos:**
```bash
php artisan queue:work
```

**Terminal 4 - Frontend (Vite):**
```bash
npm run dev
```

### Acceso al Sistema

**Credenciales de Administrador:**
- URL: http://localhost:8000/login
- Email: `admin@erp.com`
- Password: `admin123`

---

## 📚 API DOCUMENTATION

### Autenticación

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@erp.com",
  "password": "admin123"
}
```

**Respuesta:**
```json
{
  "success": true,
  "token": "1|xxxxxxxxxxx",
  "user": {
    "id": 1,
    "name": "System Administrator",
    "username": "admin",
    "emails": [...],
    "roles": [...],
    "permissions": [...]
  }
}
```

#### Obtener Usuario Autenticado
```http
GET /api/auth/user
Authorization: Bearer {token}
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer {token}
```

### Gestión de Usuarios

#### Listar Usuarios
```http
GET /api/users?page=1&search=john&group_id=1
Authorization: Bearer {token}
```

#### Crear Usuario
```http
POST /api/users
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "password_confirmation": "password123",
  "group_id": 1,
  "status": "active"
}
```

#### Agregar Email a Usuario
```http
POST /api/users/{user}/emails
Authorization: Bearer {token}
Content-Type: application/json

{
  "email": "secondary@example.com",
  "type": "work",
  "is_primary": false
}
```

### Preferencias

#### Cambiar Idioma
```http
PUT /api/preferences/locale
Authorization: Bearer {token}
Content-Type: application/json

{
  "locale": "es"
}
```

#### Cambiar Tema
```http
PUT /api/preferences/theme
Authorization: Bearer {token}
Content-Type: application/json

{
  "theme_id": 2
}
```

---

## 📊 ESTADÍSTICAS DEL PROYECTO

| Categoría | Cantidad |
|-----------|----------|
| Tablas de BD | 13 |
| Modelos Eloquent | 9 |
| Enums | 3 |
| Repositorios | 8 |
| Servicios | 7 |
| Controladores | 7 |
| Form Requests | 13 |
| Policies | 5 |
| Eventos Broadcast | 3 |
| Notificaciones | 2 |
| Seeders | 5 |
| Idiomas Soportados | 10 |
| Archivos Traducción | 50 |
| Endpoints API | 25+ |
| Canales Broadcasting | 4 |
| Temas Predefinidos | 12 |
| Roles del Sistema | 4 |
| Permisos Base | 24 |

---

## 🧪 TESTING

```bash
# Ejecutar tests
php artisan test

# Con cobertura
php artisan test --coverage
```

---

## 🤝 CONTRIBUCIÓN

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📝 LICENCIA

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

## 👥 AUTORES

- **Desarrollador Principal** - Sistema ERP Enterprise

---

## 🙏 AGRADECIMIENTOS

- Laravel Framework
- Vue.js
- Spatie Laravel Permission
- Comunidad Open Source

---

## 📧 CONTACTO

Para preguntas o soporte, por favor contacta a través de:
- Email: support@erp-enterprise.com
- Issues: [GitHub Issues](https://github.com/your-repo/issues)

---

**¡Gracias por usar ERP Enterprise!** 🚀
