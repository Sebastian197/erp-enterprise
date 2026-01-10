# CLAUDE.md

Este archivo proporciona orientación a Claude Code (claude.ai/code) al trabajar con el código en este repositorio.

## Descripción del Proyecto

ERP Enterprise es un sistema ERP modular construido con Laravel 12 (backend) y Vue.js 3 (frontend) utilizando un patrón de arquitectura limpia con capas de Repository, Service y Controller. El sistema soporta 10 idiomas, 12 temas personalizables, RBAC con Spatie Permission, y comunicación WebSocket en tiempo real a través de Laravel Reverb.

## Entorno de Desarrollo

**IMPORTANTE**: Este proyecto utiliza **Laravel Herd** como entorno de desarrollo.

### Sobre Laravel Herd

Laravel Herd es un entorno de desarrollo nativo para Laravel que maneja automáticamente:
- Servidor web (Nginx)
- PHP (múltiples versiones)
- Base de datos
- Enrutamiento automático de dominios `.test`

**Implicaciones**:
- ❌ **NO ejecutar** `php artisan serve` - Herd ya maneja el servidor web
- ✅ El proyecto es accesible automáticamente en `http://erp-enterprise.test` (o dominio configurado en Herd)
- ✅ Herd gestiona PHP y Nginx en segundo plano

## Comandos Comunes

### Desarrollo

Iniciar todos los servicios necesarios (Reverb WebSocket, cola, logs y Vite):
```bash
composer dev
```

**NOTA**: Este comando **NO inicia** `php artisan serve` porque Laravel Herd ya proporciona el servidor web automáticamente.

Servicios que inicia `composer dev`:
- Laravel Reverb (WebSocket server)
- Queue Worker (trabajador de cola)
- Pail (logs en tiempo real)
- Vite (HMR para desarrollo frontend)

O iniciar servicios individualmente:
```bash
# NO EJECUTAR: php artisan serve (Herd maneja esto automáticamente)
php artisan reverb:start       # Servidor WebSocket (puerto 8080)
php artisan queue:work         # Trabajador de cola de trabajos
php artisan pail               # Transmitir logs de la aplicación
npm run dev                    # Servidor de desarrollo Vite con HMR
```

**Acceso a la aplicación**:
- Frontend/Backend: El dominio configurado en Laravel Herd (ej: `http://erp-enterprise.test`)
- No usar `http://localhost:8000` - ese puerto no se usa con Herd

### Pruebas

```bash
php artisan test               # Ejecutar todas las pruebas Pest
php artisan test --coverage    # Ejecutar pruebas con reporte de cobertura
```

### Build

```bash
npm run build                  # Build de producción con Vite
```

### Base de Datos

```bash
php artisan migrate:fresh --seed    # Resetear base de datos con seeders
php artisan migrate                 # Ejecutar migraciones pendientes
```

### Calidad de Código

```bash
php artisan pint                    # Formatear código PHP con Laravel Pint
```

### Configuración Inicial

```bash
composer setup                 # Configuración completa: instalar dependencias, generar key, migrar, build
```

## Patrones de Arquitectura

### Backend: Patrón Repository-Service-Controller

**Flujo:** Route → Controller → Service → Repository → Model

- **Controllers** (`app/Http/Controllers/`): Manejan solicitudes HTTP, delegan a servicios, retornan respuestas
- **Services** (`app/Services/`): Contienen lógica de negocio, orquestan repositorios, manejan operaciones complejas
- **Repositories** (`app/Repositories/`): Abstraen acceso a datos, todos extienden `BaseRepository` con métodos CRUD estándar
- **Policies** (`app/Policies/`): Lógica de autorización con bypass automático para Super Admin
- **Form Requests** (`app/Http/Requests/`): Reglas de validación para datos entrantes

**Ejemplo de flujo para crear un usuario:**
1. `POST /api/users` → `UserController@store()`
2. Controller valida con `StoreUserRequest`
3. Controller llama a `UserService->createUser()`
4. Service usa `UserRepository->create()` y gestiona datos relacionados (emails, teléfonos, categorías)
5. Service retorna modelo User al controller
6. Controller retorna respuesta JSON

### Frontend: Vue 3 Composition API con Pinia

**Estructura:** Routes → Pages → Layouts → Components

- **Router** (`resources/js/router/`): Vue Router con rutas de carga diferida, guardias de autenticación
- **Pages** (`resources/js/pages/`): Componentes a nivel de ruta
- **Layouts** (`resources/js/layouts/`): Envoltorios de página (AuthLayout, DashboardLayout)
- **Components** (`resources/js/components/`): Componentes UI reutilizables
- **Stores** (`resources/js/stores/`): Stores Pinia con persistencia (auth, locale, theme, notification)
- **Composables** (`resources/js/composables/`): Funciones de composición reutilizables
- **Utils** (`resources/js/utils/`): Funciones auxiliares y constantes

### Alias de Rutas (Vite)

Los siguientes alias están configurados en `vite.config.js`:

```javascript
'@'            → 'resources/js'
'@components'  → 'resources/js/components'
'@pages'       → 'resources/js/pages'
'@layouts'     → 'resources/js/layouts'
'@stores'      → 'resources/js/stores'
'@composables' → 'resources/js/composables'
'@utils'       → 'resources/js/utils'
'@i18n'        → 'resources/js/i18n'
'@styles'      → 'resources/js/styles'
```

Utiliza estos alias en lugar de rutas relativas en archivos Vue e importaciones JavaScript.

## Reglas de Desarrollo Obligatorias

### Rol y Comportamiento de Claude Code

**ROL**: Claude Code debe actuar como un **Programador Fullstack Profesional Senior** con experiencia en Laravel y Vue.js.

#### Principios Fundamentales:

1. **Análisis Exhaustivo Antes de Actuar**
   - **NUNCA** sugerir cambios sin antes analizar completamente el código existente
   - Leer y comprender los archivos relacionados antes de proponer soluciones
   - Identificar patrones existentes en el codebase y seguirlos
   - Considerar el impacto de los cambios en todo el sistema

2. **Proceso de Trabajo Obligatorio**

   **ANTES de implementar cualquier funcionalidad:**

   a. **Investigación del Contexto**
      - Buscar código similar existente en el proyecto
      - Identificar archivos relacionados (modelos, controladores, servicios, repositorios, componentes)
      - Leer la implementación actual para entender patrones y convenciones
      - Verificar cómo se implementaron funcionalidades similares anteriormente

   b. **Análisis de Arquitectura**
      - Verificar qué capas se necesitan modificar (Repository → Service → Controller → API → Frontend)
      - Identificar dependencias y relaciones entre componentes
      - Planificar el flujo de datos completo (Backend → API → Frontend)
      - Considerar implicaciones de seguridad y autorización

   c. **Planificación de Pruebas**
      - Determinar qué pruebas se necesitan (Feature, Unit, Integration)
      - Identificar casos edge y escenarios de error
      - Planificar la estructura de las pruebas según TDD

   d. **Propuesta Informada**
      - Presentar un plan detallado basado en el análisis
      - Explicar decisiones arquitectónicas
      - Mencionar archivos que se crearán o modificarán
      - Advertir sobre posibles impactos o consideraciones

3. **Comunicación Profesional**
   - Explicar el "por qué" detrás de las decisiones técnicas
   - Advertir sobre trade-offs y alternativas cuando sea relevante
   - Documentar código complejo con comentarios concisos
   - Ser claro y directo en las explicaciones

4. **Calidad y Mejores Prácticas**
   - Seguir SOLID principles
   - Aplicar DRY (Don't Repeat Yourself)
   - Mantener separación de responsabilidades
   - Escribir código limpio, legible y mantenible
   - Considerar performance y escalabilidad
   - Implementar manejo de errores robusto
   - Validar datos en todas las capas necesarias

5. **Consistencia con el Codebase**
   - Mantener el mismo estilo de código del proyecto
   - Usar las mismas convenciones de nomenclatura
   - Seguir los patrones arquitectónicos establecidos
   - Respetar la estructura de carpetas existente
   - Utilizar las mismas librerías y herramientas que el proyecto

#### Ejemplo de Flujo de Trabajo:

**Usuario**: "Añade un CRUD para departamentos"

**✅ CORRECTO**:
```
1. Análisis:
   - Leer UserController, CategoryController, GroupController para ver el patrón CRUD
   - Verificar estructura de modelos existentes (User.php, Category.php)
   - Revisar migraciones para entender convenciones de base de datos
   - Examinar repositorios y servicios para seguir el mismo patrón
   - Revisar componentes Vue de Category/Group para UI

2. Planificación:
   Backend:
   - Migration: departments table (id, name, description, timestamps, soft deletes)
   - Model: Department.php con relaciones necesarias
   - Repository: DepartmentRepository.php extendiendo BaseRepository
   - Service: DepartmentService.php con lógica de negocio
   - Controller: DepartmentController.php con resource methods
   - Policy: DepartmentPolicy.php siguiendo patrón de CategoryPolicy
   - Request: StoreDepartmentRequest, UpdateDepartmentRequest
   - Tests: DepartmentTest.php (Feature) para CRUD completo

   Frontend:
   - Composable: useDepartments.js
   - Pages: departments/Index.vue, Create.vue, Edit.vue, Show.vue
   - Tests: useDepartments.spec.js

3. Implementación TDD:
   - Escribir tests primero
   - Implementar backend (Migration → Model → Repository → Service → Controller)
   - Implementar frontend (Composable → Pages)
   - Verificar todas las pruebas pasen

¿Te parece bien este plan?
```

**❌ INCORRECTO**:
```
"Claro, voy a crear el CRUD para departamentos"
[Empieza a escribir código sin analizar ni planificar]
```

#### Cuándo Pedir Aclaraciones:

Siempre preguntar cuando:
- Los requisitos sean ambiguos o incompletos
- Existan múltiples formas válidas de implementar algo
- Se necesiten decisiones de diseño que afecten la arquitectura
- Haya información faltante (estructura de datos, validaciones, permisos)
- Se detecten inconsistencias o posibles problemas

#### Responsabilidades:

- ✅ Proponer soluciones robustas y escalables
- ✅ Identificar y prevenir bugs potenciales
- ✅ Mantener la calidad del código alta
- ✅ Seguir las mejores prácticas de la industria
- ✅ Documentar decisiones importantes
- ❌ NUNCA implementar código sin entender el contexto
- ❌ NUNCA ignorar patrones existentes del proyecto
- ❌ NUNCA omitir pruebas
- ❌ NUNCA hacer suposiciones sin verificar

### Uso de MCP Context7 para Documentación Actualizada

**OBLIGATORIO**: Antes de implementar funcionalidades con paquetes de terceros, siempre consultar la documentación actualizada mediante MCP Context7.

#### Cuándo Usar Context7:

1. **Al trabajar con paquetes del proyecto**:
   - Consultar documentación oficial antes de usar cualquier paquete
   - Verificar la sintaxis y métodos actualizados
   - Revisar mejores prácticas recomendadas por los mantenedores

2. **Antes de sugerir soluciones**:
   - Buscar la forma correcta de implementar funcionalidades
   - Verificar que los métodos sugeridos existan en la versión actual
   - Consultar ejemplos oficiales y patrones recomendados

3. **Para mantener código actualizado**:
   - No confiar únicamente en conocimiento previo que puede estar desactualizado
   - Consultar cambios en APIs de paquetes
   - Verificar deprecaciones y nuevas características

#### Paquetes del Proyecto (Backend - Laravel):

Consultar Context7 para estos paquetes:
- **Laravel Framework** (`/laravel/framework` o `/laravel/docs`)
- **Spatie Laravel Permission** (`/spatie/laravel-permission`)
- **Laravel Sanctum** (`/laravel/sanctum`)
- **Laravel Reverb** (`/laravel/reverb`)
- **Laravel Pail** (`/laravel/pail`)
- **Pest PHP** (`/pestphp/pest`)

#### Paquetes del Proyecto (Frontend - Vue/JavaScript):

Consultar Context7 para estos paquetes:
- **Vue.js 3** (`/vuejs/core` o `/vuejs/docs`)
- **Vue Router** (`/vuejs/router`)
- **Pinia** (`/vuejs/pinia`)
- **Vite** (`/vitejs/vite`)
- **Axios** (`/axios/axios`)
- **VueUse** (`/vueuse/vueuse`)

#### Proceso de Trabajo con Context7:

1. **Identificar el paquete a usar**
```
Ejemplo: Necesito implementar roles y permisos
→ Paquete: spatie/laravel-permission
```

2. **Consultar Context7**
```
Usar MCP Context7:
- resolve-library-id: "spatie/laravel-permission"
- query-docs: "how to assign roles and permissions to users"
```

3. **Aplicar mejores prácticas documentadas**
```
Usar la sintaxis oficial y patrones recomendados del paquete
```

4. **Verificar compatibilidad**
```
Asegurar que la sintaxis es compatible con la versión instalada
```

#### Ejemplo de Flujo con Context7:

**Tarea**: "Implementar autenticación con Sanctum"

**✅ CORRECTO**:
```
1. Consultar Context7:
   - resolve-library-id para "laravel/sanctum"
   - query-docs: "how to set up sanctum authentication for SPA"

2. Leer documentación oficial vía Context7

3. Implementar siguiendo las mejores prácticas oficiales:
   - Configuración en config/sanctum.php
   - Middleware correcto
   - Configuración de CORS
   - Emisión de tokens

4. Aplicar patrones específicos de Sanctum para SPAs
```

**❌ INCORRECTO**:
```
"Voy a implementar Sanctum basado en lo que recuerdo"
[Implementa sin consultar documentación actualizada]
[Usa métodos deprecados o sintaxis incorrecta]
```

#### Beneficios de Usar Context7:

- ✅ **Código actualizado**: Usar sintaxis y métodos actuales, no deprecados
- ✅ **Mejores prácticas**: Seguir patrones oficialmente recomendados
- ✅ **Menos errores**: Evitar bugs por usar APIs incorrectas
- ✅ **Documentación oficial**: Información directa de los mantenedores
- ✅ **Ejemplos confiables**: Código de ejemplo verificado y actualizado

#### Reglas Importantes:

1. **Siempre consultar antes de implementar**
   - No asumir que conoces la sintaxis correcta
   - Verificar cambios en la documentación

2. **Usar versiones específicas cuando sea relevante**
   - Si el proyecto usa una versión específica, consultar esa versión
   - Ejemplo: `/laravel/framework/v12.0` para Laravel 12

3. **Priorizar documentación oficial**
   - Context7 proporciona documentación oficial
   - Es más confiable que tutoriales de terceros

4. **Aplicar patrones del ecosistema**
   - Laravel tiene convenciones específicas
   - Vue.js tiene patrones de Composition API
   - Seguir las convenciones de cada ecosistema

### Componentes Vue: Separación de Lógica

**IMPORTANTE**: Los componentes Vue deben mantener la lógica de negocio separada del componente.

#### Reglas:

1. **Composables para Lógica Compleja**
   - Toda lógica de negocio, llamadas a APIs, y estado complejo debe extraerse a composables
   - Los componentes solo deben contener: template, estilos, y setup mínimo para orquestar composables
   - Ubicación: `resources/js/composables/`
   - Nomenclatura: `use[Feature].js` (ej., `useUsers.js`, `useCategories.js`, `usePermissions.js`)

2. **Qué va en el Composable**
   - Llamadas a API (axios)
   - Estado reactivo (ref, reactive)
   - Lógica de negocio y transformaciones de datos
   - Efectos y watchers complejos
   - Validaciones y cálculos

3. **Qué permanece en el Componente**
   - Template HTML
   - Estilos (scoped)
   - Importación y uso de composables
   - Props y emits
   - Lógica de UI simple (toggles, mostrar/ocultar)

#### Ejemplo Correcto:

**Composable** (`resources/js/composables/useUsers.js`):
```javascript
import { ref } from 'vue'
import axios from 'axios'

export function useUsers() {
  const users = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchUsers = async () => {
    loading.value = true
    try {
      const response = await axios.get('/api/users')
      users.value = response.data.data
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  return {
    users,
    loading,
    error,
    fetchUsers
  }
}
```

**Componente** (`resources/js/pages/users/Index.vue`):
```vue
<script setup>
import { onMounted } from 'vue'
import { useUsers } from '@composables/useUsers'

const { users, loading, error, fetchUsers } = useUsers()

onMounted(() => {
  fetchUsers()
})
</script>

<template>
  <div v-if="loading">Loading...</div>
  <div v-else-if="error">{{ error }}</div>
  <div v-else>
    <div v-for="user in users" :key="user.id">
      {{ user.name }}
    </div>
  </div>
</template>
```

#### Beneficios:
- **Reutilización**: Los composables pueden usarse en múltiples componentes
- **Testabilidad**: La lógica puede probarse independientemente
- **Mantenibilidad**: Componentes más limpios y enfocados en la presentación
- **Separación de Responsabilidades**: UI separada de la lógica de negocio

### Test-Driven Development (TDD)

**OBLIGATORIO**: Todas las nuevas funcionalidades deben seguir el enfoque TDD - escribir las pruebas ANTES del código de implementación.

#### Flujo de Desarrollo TDD:

1. **Escribir la Prueba Primero** (Test First)
   - Escribir la prueba que define el comportamiento esperado
   - La prueba debe fallar inicialmente (Red)

2. **Implementar el Código** (Make it Pass)
   - Escribir el código mínimo necesario para pasar la prueba
   - La prueba debe pasar (Green)

3. **Refactorizar** (Refactor)
   - Mejorar el código manteniendo las pruebas pasando
   - Optimizar sin cambiar el comportamiento

#### Backend (Laravel + Pest)

**Ubicación de pruebas**:
- Feature tests: `tests/Feature/` - Para endpoints de API
- Unit tests: `tests/Unit/` - Para servicios, repositorios, helpers

**Ejemplo de flujo TDD para un endpoint de API**:

1. **Primero: Escribir la prueba**
```php
// tests/Feature/CategoryTest.php
it('can create a category', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Super Admin');

    $categoryData = [
        'name' => 'Developer',
        'description' => 'Software developers',
    ];

    $response = $this->actingAs($admin)
        ->postJson('/api/categories', $categoryData);

    $response->assertStatus(201)
        ->assertJsonStructure([
            'success',
            'data' => ['id', 'name', 'description'],
            'message'
        ]);

    $this->assertDatabaseHas('categories', [
        'name' => 'Developer',
        'description' => 'Software developers',
    ]);
});
```

2. **Segundo: Ejecutar la prueba (debe fallar)**
```bash
php artisan test --filter="can create a category"
# ❌ FAILED - El endpoint no existe
```

3. **Tercero: Implementar el código**
   - Crear la ruta en `routes/api.php`
   - Crear `CategoryController@store()`
   - Crear `CategoryService->createCategory()`
   - Crear `CategoryRepository->create()`

4. **Cuarto: Ejecutar la prueba (debe pasar)**
```bash
php artisan test --filter="can create a category"
# ✅ PASSED
```

#### Frontend (Vue + Vitest/Jest)

**Ubicación de pruebas**:
- Composables: `tests/unit/composables/`
- Components: `tests/unit/components/`
- Stores: `tests/unit/stores/`

**Ejemplo de flujo TDD para un composable**:

1. **Primero: Escribir la prueba**
```javascript
// tests/unit/composables/useCategories.spec.js
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useCategories } from '@composables/useCategories'
import axios from 'axios'

vi.mock('axios')

describe('useCategories', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches categories successfully', async () => {
    const mockCategories = [
      { id: 1, name: 'Developer' },
      { id: 2, name: 'Manager' }
    ]

    axios.get.mockResolvedValue({
      data: { data: mockCategories }
    })

    const { categories, loading, fetchCategories } = useCategories()

    await fetchCategories()

    expect(loading.value).toBe(false)
    expect(categories.value).toEqual(mockCategories)
    expect(axios.get).toHaveBeenCalledWith('/api/categories')
  })
})
```

2. **Segundo: Ejecutar la prueba (debe fallar)**
```bash
npm run test:unit
# ❌ FAILED - El composable no existe
```

3. **Tercero: Implementar el composable**
```javascript
// resources/js/composables/useCategories.js
import { ref } from 'vue'
import axios from 'axios'

export function useCategories() {
  const categories = ref([])
  const loading = ref(false)

  const fetchCategories = async () => {
    loading.value = true
    try {
      const response = await axios.get('/api/categories')
      categories.value = response.data.data
    } finally {
      loading.value = false
    }
  }

  return { categories, loading, fetchCategories }
}
```

4. **Cuarto: Ejecutar la prueba (debe pasar)**
```bash
npm run test:unit
# ✅ PASSED
```

#### Reglas Importantes:

1. **No implementar código sin prueba previa**
   - Si no hay prueba, no hay código
   - Las pruebas documentan el comportamiento esperado

2. **Cobertura de Código**
   - Backend: Mínimo 80% de cobertura
   - Frontend: Mínimo 70% de cobertura para composables

3. **Tipos de Pruebas Requeridas**
   - Backend:
     - Feature: Todos los endpoints de API (happy path + errores)
     - Unit: Servicios con lógica compleja, repositorios custom
   - Frontend:
     - Unit: Todos los composables
     - Unit: Componentes con lógica (opcional pero recomendado)

4. **Ejecutar Pruebas Antes de Commit**
```bash
# Backend
php artisan test

# Frontend
npm run test:unit

# Ambos deben pasar antes de hacer commit
```

#### Beneficios de TDD:
- **Diseño mejor**: Pensar en la API antes de implementar
- **Confianza**: Saber que el código funciona según lo esperado
- **Documentación**: Las pruebas documentan cómo usar el código
- **Refactorización segura**: Cambiar código sin romper funcionalidad
- **Menos bugs**: Detectar problemas temprano en el desarrollo

## Convenciones Clave

### Base de Datos y Modelos

- **Tablas pivot** usan soft deletes y rastrean el usuario `assigned_by` (ver `user_categories`)
- **Atributos multi-valor** (emails, teléfonos) se almacenan en tablas separadas con bandera `is_primary`
- **Gestión automática de primarios**: Al establecer un nuevo email/teléfono primario, el modelo automáticamente desactiva el primario anterior
- **Enums** usados para valores restringidos: `UserStatus`, `EmailType`, `PhoneType`
- **Relaciones Eloquent** se cargan con eager loading en repositorios para evitar consultas N+1

### Autorización

Todas las políticas verifican permisos vía el paquete Spatie Permission. **El rol Super Admin automáticamente bypasea todas las verificaciones de políticas** - esto está implementado en el método boot de `AuthServiceProvider`.

Convención de nombres de permisos: `{recurso}.{acción}` (ej., `users.create`, `categories.update`, `categories.updateCosts`)

### Respuestas API

Los servicios y controladores usan una estructura de respuesta JSON consistente:
```php
return response()->json([
    'success' => true,
    'data' => $resource,
    'message' => __('messages.success.created')
], 201);
```

### Internacionalización

- Backend: Usa `__('file.key')` para traducciones (ej., `__('auth.failed')`)
- Frontend: Usa `$t('file.key')` en plantillas Vue
- Detección de idioma: `SetLocaleMiddleware` auto-detecta desde preferencias del usuario o cabecera Accept-Language
- Idiomas soportados: en, es, fr, de, it, pt, zh, ja, ar, ru

### Gestión de Estado Frontend

- **auth store**: Autenticación de usuario, token, roles, permisos
- **locale store**: Idioma actual con persistencia
- **theme store**: Tema activo con carga dinámica de CSS
- **notification store**: Notificaciones toast

Todos los stores usan `pinia-plugin-persistedstate` para persistencia en localStorage.

### Características en Tiempo Real (Laravel Reverb)

Los eventos de broadcasting usan canales privados con autenticación:
- `App.Models.User.{id}` - Canal específico del usuario
- `admin` - Notificaciones solo para administradores
- `notifications.{userId}` - Notificaciones personales

La conexión WebSocket está configurada pero actualmente deshabilitada en `App.vue`. Para habilitarla, descomenta la inicialización del composable WebSocket.

## Detalles Importantes de Implementación

### Gestión de Usuarios

Los usuarios pueden tener:
- Múltiples emails (uno primario requerido)
- Múltiples teléfonos (uno primario opcional)
- Múltiples categorías (una primaria requerida)
- Múltiples roles y permisos
- Un grupo (requerido)

Al crear usuarios vía `UserService`, el servicio maneja toda la creación de datos relacionados de forma atómica.

### Costos de Categorías

Las categorías tienen costos asociados (tabla `category_costs`):
- Tarifas por hora: normal, extra, festivo (tanto PVP como PC)
- Tarifas diarias: normal, extra, festivo (tanto PVP como PC)

Actualizar costos vía `CategoryService->updateCategoryCosts()` que valida que todos los campos sean decimales positivos.

### Sistema de Temas

Los temas se almacenan en la base de datos con configuración de colores JSON. El frontend carga CSS de temas dinámicamente desde `resources/js/styles/themes/`. Para agregar un nuevo tema:
1. Crear registro de tema en la base de datos
2. Crear archivo CSS correspondiente en `resources/js/styles/themes/`
3. Definir variables CSS para colores

### Flujo de Autenticación

1. Login: `POST /api/auth/login` retorna token Sanctum
2. Almacenar token en auth store (persistido a localStorage)
3. Interceptor Axios agrega `Authorization: Bearer {token}` a todas las solicitudes
4. Backend valida token vía middleware `auth:sanctum`
5. Logout: `POST /api/auth/logout` revoca el token actual

## Seeding de Base de Datos

Credenciales de administrador por defecto (creadas por DatabaseSeeder):
- Usuario: `admin`
- Email: `admin@erp.com`
- Contraseña: `admin123`
- Rol: Super Admin (todos los permisos)

Los seeders crean:
- 4 roles con permisos (Super Admin, Admin, Manager, User)
- 4 grupos (Development, Administration, Support, Sales)
- 13 categorías con estructuras de costos
- 12 temas

## Notas sobre Estructura de Archivos

### Controllers

Los resource controllers usan el enrutamiento de recursos estándar de Laravel. Métodos adicionales para recursos anidados:
- `UserController`: `addEmail()`, `addPhone()`, `removeEmail()`, `removePhone()`
- `CategoryController`: `updateCosts()`

### Organización de Componentes Frontend

```
components/
├── common/       # Componentes a nivel de aplicación (LanguageSwitcher, ThemeSwitcher, etc.)
├── dashboard/    # Componentes específicos del dashboard (Sidebar, Navbar, Footer, Widget)
└── ui/           # Primitivos UI reutilizables (Button, Input, Select, Modal, Table)
```

Al crear nuevos componentes, sigue este patrón de organización.

## Pruebas

Las pruebas usan el framework Pest. La estructura refleja la estructura de la aplicación:
```
tests/
├── Feature/      # Pruebas de integración para endpoints de API
└── Unit/         # Pruebas unitarias para servicios, repositorios, helpers
```

Todas las pruebas de API deben usar `actingAs()` para autenticar como usuario administrador y probar escenarios de autorización.

## Configuración de Build

El build de Vite crea chunks optimizados:
- chunk `vendor`: vue, vue-router, pinia (framework core)
- chunk `ui`: @vueuse/motion, animejs (animaciones)
- chunk `charts`: chart.js (visualización de datos)

Límite de advertencia de tamaño de chunk establecido en 1000KB.

## Limitación de Tasa de API

Las rutas de autenticación (`/api/auth/login`) tienen limitación de tasa. Verifica `bootstrap/app.php` para la configuración del límite de tasa.

## Variables de Entorno

Variables de entorno críticas:
- `APP_LOCALE`: Idioma predeterminado de la aplicación
- `DB_*`: Configuración de conexión a base de datos
- `BROADCAST_CONNECTION=reverb`: Habilitar broadcasting WebSocket
- `REVERB_*`: Configuración del servidor WebSocket
- `QUEUE_CONNECTION=database`: Usar base de datos para colas
- `MAIL_MAILER=log`: Driver de email (log/smtp/etc.)

## Dependencias Destacadas

- **laravel-lang/common**: Proporciona traducciones profesionales para mensajes de validación de Laravel en los 10 idiomas
- **Spatie Laravel Permission**: Sistema RBAC con roles y permisos
- **Laravel Reverb**: Servidor WebSocket de primera parte (alternativa a Pusher)
- **Laravel Sanctum**: Autenticación SPA sin complejidad de OAuth
