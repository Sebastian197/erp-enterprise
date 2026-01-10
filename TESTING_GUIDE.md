# 🧪 Guía de Pruebas - Módulo de Permisos y Roles

## 📋 Índice
1. [Preparación](#preparación)
2. [Pruebas de UI - Gestión de Roles](#pruebas-de-ui---gestión-de-roles)
3. [Pruebas de UI - Matriz de Permisos](#pruebas-de-ui---matriz-de-permisos)
4. [Pruebas de Tiempo Real (WebSocket)](#pruebas-de-tiempo-real-websocket)
5. [Pruebas del Sistema de Grupos Privilegiados](#pruebas-del-sistema-de-grupos-privilegiados)
6. [Pruebas de Permisos Negativos](#pruebas-de-permisos-negativos)
7. [Verificación del Backend](#verificación-del-backend)

---

## 1. Preparación

### Iniciar Servicios

Ya iniciados en ventanas separadas:
- ✅ Laravel Server: http://localhost:8000
- ✅ Laravel Reverb (WebSocket): ws://localhost:8080
- ✅ Vite (Frontend): http://localhost:5173

### Login

1. Abrir navegador en: http://localhost:8000
2. Hacer login con:
   - **Username**: `admin`
   - **Password**: `admin123`

---

## 2. Pruebas de UI - Gestión de Roles

### 2.1 Ver Lista de Roles

1. En el menú lateral, ir a: **WebMaster → Roles**
2. **Verificar:**
   - ✅ Se muestra la lista de roles
   - ✅ Se ven 4 roles: Super Admin, Admin, Manager, User
   - ✅ Cada rol muestra su cantidad de permisos
   - ✅ Hay botones de Ver, Editar, Eliminar

### 2.2 Crear Nuevo Rol

1. Clic en botón **"+ Crear Rol"**
2. Llenar el formulario:
   - **Nombre**: `Editor`
   - **Guard Name**: dejar vacío o poner `web`
3. Clic en **"Crear"**
4. **Verificar:**
   - ✅ Redirige a la lista de roles
   - ✅ El nuevo rol "Editor" aparece en la lista
   - ✅ Sin recargar la página (navegación con await router.push)

### 2.3 Ver Detalles de un Rol

1. En la lista, clic en **"Ver"** del rol "Admin"
2. **Verificar:**
   - ✅ Se muestra el nombre del rol
   - ✅ Se muestra el guard name
   - ✅ Se muestra la cantidad de permisos
   - ✅ Se muestra la fecha de creación
   - ✅ Se lista todos los permisos asignados en badges azules

### 2.4 Editar Rol

1. Clic en **"Editar"** desde la vista de detalles
2. Cambiar el nombre (ej: agregar " Updated")
3. Clic en **"Actualizar"**
4. **Verificar:**
   - ✅ El nombre se actualiza
   - ✅ Redirige a la lista
   - ✅ El cambio se refleja inmediatamente

### 2.5 Eliminar Rol

1. En la lista, clic en **"Eliminar"** del rol "Editor"
2. Confirmar en el diálogo
3. **Verificar:**
   - ✅ El rol desaparece de la lista
   - ✅ Sin recargar la página

---

## 3. Pruebas de UI - Matriz de Permisos

### 3.1 Acceder a la Matriz

1. Ir a la lista de roles
2. Clic en **"Editar"** del rol "Manager"
3. Scroll hacia abajo hasta la sección **"Matriz de Permisos"**

### 3.2 Explorar la Matriz

**Verificar que se muestra:**
- ✅ Permisos agrupados por módulo (users, groups, categories, permissions, roles)
- ✅ Cada módulo tiene su propia tarjeta colapsable
- ✅ Checkboxes para cada permiso individual
- ✅ Botones "Seleccionar todos" y "Deseleccionar todos" globales
- ✅ Botones "Seleccionar todos" y "Deseleccionar todos" por módulo

### 3.3 Asignar Permisos

1. **Desmarcar todos** los permisos con el botón global
2. **Seleccionar manualmente** algunos permisos:
   - ✅ users.view
   - ✅ users.create
   - ✅ categories.view
   - ✅ roles.view
3. Clic en **"Guardar Permisos"**
4. **Verificar:**
   - ✅ Mensaje de éxito: "Permisos guardados correctamente"
   - ✅ Los checkboxes permanecen marcados

### 3.4 Usar Selección por Módulo

1. Ir al módulo **"permissions"**
2. Clic en **"Seleccionar todos"** del módulo
3. **Verificar:**
   - ✅ Se marcan todos los permisos: permissions.view, permissions.create, permissions.update, permissions.delete
4. Clic en **"Deseleccionar todos"** del módulo
5. **Verificar:**
   - ✅ Se desmarcan todos los permisos del módulo

### 3.5 Guardar Cambios

1. Marcar/desmarcar algunos permisos
2. Clic en **"Guardar Permisos"**
3. Salir de la página y volver a entrar
4. **Verificar:**
   - ✅ Los permisos guardados se mantienen marcados

---

## 4. Pruebas de Tiempo Real (WebSocket)

### 4.1 Preparación

1. **Abrir 2 navegadores diferentes** (o 2 ventanas en incógnito):
   - Navegador A: Chrome
   - Navegador B: Firefox/Safari
2. **Login en ambos** con las mismas credenciales
3. **En ambos navegadores**, ir a: WebMaster → Roles

### 4.2 Prueba: Crear Rol en Tiempo Real

**En Navegador A:**
1. Clic en **"+ Crear Rol"**
2. Crear rol: `Tester`
3. Guardar

**En Navegador B:**
- ✅ **SIN RECARGAR**: El nuevo rol "Tester" aparece automáticamente en la lista

### 4.3 Prueba: Actualizar Rol en Tiempo Real

**En Navegador A:**
1. Editar el rol "Tester"
2. Cambiar nombre a "QA Tester"
3. Guardar

**En Navegador B:**
- ✅ **SIN RECARGAR**: El nombre del rol se actualiza a "QA Tester"

### 4.4 Prueba: Eliminar Rol en Tiempo Real

**En Navegador A:**
1. Eliminar el rol "QA Tester"

**En Navegador B:**
- ✅ **SIN RECARGAR**: El rol desaparece de la lista

### 4.5 Prueba: Actualizar Permisos en Tiempo Real

**Preparación:**
- En ambos navegadores, abrir la edición del rol "Manager" (en la sección de matriz de permisos)

**En Navegador A:**
1. Marcar el permiso `users.delete`
2. Guardar

**En Navegador B:**
- ✅ **SIN RECARGAR**: El checkbox de `users.delete` se marca automáticamente

**En Navegador B:**
1. Desmarcar `users.delete`
2. Guardar

**En Navegador A:**
- ✅ **SIN RECARGAR**: El checkbox se desmarca automáticamente

---

## 5. Pruebas del Sistema de Grupos Privilegiados

### 5.1 Verificar Grupos Privilegiados Existentes

**Abrir tinker:**
```bash
php artisan tinker
```

**Ejecutar:**
```php
// Ver grupos privilegiados
App\Models\Group::whereIn('name', ['Administradores', 'Webmaster'])->get(['id', 'name', 'description']);
```

**Verificar:**
- ✅ Existe grupo "Administradores"
- ✅ Existe grupo "Webmaster"
- ✅ Descripción menciona "full system access unless explicitly denied"

### 5.2 Crear Usuario en Grupo Privilegiado

**En tinker:**
```php
// Crear usuario en grupo Administradores
$adminGroup = App\Models\Group::where('name', 'Administradores')->first();
$user = App\Models\User::factory()->create([
    'group_id' => $adminGroup->id,
    'username' => 'testadmin',
    'name' => 'Test Admin User'
]);

// Ver datos del usuario
$user->load('emails', 'group');
echo "Username: " . $user->username . PHP_EOL;
echo "Email: " . $user->emails->first()->email . PHP_EOL;
echo "Grupo: " . $user->group->name . PHP_EOL;
```

### 5.3 Verificar Acceso Automático Total

**En tinker:**
```php
// Probar acceso a diferentes permisos SIN asignarlos
$user->can('users.create');        // true
$user->can('users.delete');        // true
$user->can('permissions.update');  // true
$user->can('roles.delete');        // true
$user->can('categories.create');   // true
$user->can('cualquier.permiso');   // true - ¡incluso permisos que no existen!

// Verificar que NO tiene permisos directos asignados
$user->permissions()->count();     // 0 - no tiene permisos asignados
$user->roles()->count();           // 0 - no tiene roles asignados
```

**Verificar:**
- ✅ Todos los `can()` retornan `true`
- ✅ El usuario NO tiene permisos ni roles asignados
- ✅ El acceso es automático por estar en grupo privilegiado

### 5.4 Comparar con Usuario Normal

**En tinker:**
```php
// Crear usuario en grupo normal (Development)
$normalGroup = App\Models\Group::where('name', 'Development')->first();
$normalUser = App\Models\User::factory()->create([
    'group_id' => $normalGroup->id,
    'username' => 'testnormal',
    'name' => 'Test Normal User'
]);

// Probar acceso
$normalUser->can('users.create');      // false - no tiene acceso
$normalUser->can('permissions.view');  // false - no tiene acceso
```

**Verificar:**
- ✅ Usuario normal NO tiene acceso automático
- ✅ Solo usuarios en grupos privilegiados tienen acceso total

---

## 6. Pruebas de Permisos Negativos

### 6.1 Denegar Permiso Específico

**En tinker:**
```php
// Usar el usuario del grupo Administradores creado antes
$user = App\Models\User::where('username', 'testadmin')->first();

// Verificar acceso antes de denegar
$user->can('users.delete');  // true - tiene acceso

// Denegar explícitamente el permiso users.delete
$permission = Spatie\Permission\Models\Permission::findByName('users.delete');
$user->permissions()->attach($permission->id, ['is_negative' => true]);

// Limpiar caché de permisos
app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();
$user = $user->fresh();

// Verificar acceso después de denegar
$user->can('users.delete');   // false - DENEGADO
$user->can('users.create');   // true - sigue teniendo acceso
$user->can('users.update');   // true - sigue teniendo acceso
$user->can('permissions.delete'); // true - sigue teniendo acceso
```

**Verificar:**
- ✅ Solo el permiso denegado retorna `false`
- ✅ Todos los demás permisos siguen retornando `true`

### 6.2 Verificar en Base de Datos

**En tinker:**
```php
// Ver el permiso negativo en la base de datos
DB::table('model_has_permissions')
    ->where('model_id', $user->id)
    ->where('model_type', 'App\Models\User')
    ->get(['permission_id', 'is_negative']);
```

**Verificar:**
- ✅ Existe un registro con `is_negative = 1`

### 6.3 Remover Denegación

**En tinker:**
```php
// Remover la denegación
$user->permissions()->detach($permission->id);

// Limpiar caché
app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();
$user = $user->fresh();

// Verificar que vuelve a tener acceso
$user->can('users.delete');  // true - acceso restaurado
```

**Verificar:**
- ✅ El permiso vuelve a estar disponible
- ✅ El acceso automático se restaura

---

## 7. Verificación del Backend

### 7.1 Verificar Endpoints API

**Probar con cURL o Postman:**

```bash
# 1. Login y obtener token
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Copiar el token de la respuesta y usarlo en las siguientes peticiones

# 2. Listar roles
curl http://localhost:8000/api/roles \
  -H "Authorization: Bearer TU_TOKEN_AQUI"

# 3. Crear rol
curl -X POST http://localhost:8000/api/roles \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{"name":"API Test Role"}'

# 4. Listar permisos
curl http://localhost:8000/api/permissions \
  -H "Authorization: Bearer TU_TOKEN_AQUI"

# 5. Asignar permisos a rol (reemplazar {roleId})
curl -X POST http://localhost:8000/api/roles/{roleId}/permissions \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{"permission_ids":[1,2,3]}'
```

**Verificar:**
- ✅ Todos los endpoints retornan código 200/201
- ✅ Las respuestas tienen formato JSON correcto
- ✅ Los datos se persisten en la base de datos

### 7.2 Verificar Broadcasting Events

**En la consola donde corre Reverb, buscar logs:**

Cuando creas/editas/eliminas roles o permisos, deberías ver:
```
✓ Broadcasting role.created to admin
✓ Broadcasting role.updated to admin
✓ Broadcasting role.permissions.updated to admin
✓ Broadcasting permission.created to admin
```

**Verificar:**
- ✅ Los eventos se disparan correctamente
- ✅ Se envían al canal correcto (`admin`)

### 7.3 Verificar Policies

**En tinker:**
```php
// Crear usuario SIN grupo privilegiado y SIN permisos
$user = App\Models\User::factory()->create([
    'username' => 'nopermissions',
    'group_id' => App\Models\Group::where('name', 'Development')->first()->id
]);

// Verificar que las policies niegan acceso
$user->can('roles.view');    // false
$user->can('roles.create');  // false
$user->can('roles.update');  // false
$user->can('roles.delete');  // false

// Asignar un permiso
$user->givePermissionTo('roles.view');

// Verificar que ahora tiene acceso solo a ese permiso
$user->can('roles.view');    // true
$user->can('roles.create');  // false - sigue sin acceso
```

**Verificar:**
- ✅ Policies funcionan correctamente
- ✅ Solo usuarios con permisos tienen acceso

---

## 🎯 Checklist Final

### Backend
- [ ] Migration `is_negative` ejecutada correctamente
- [ ] User model tiene métodos `isPrivilegedGroup()` y `hasExplicitDenyPermission()`
- [ ] Gate::before() hook funciona en AuthServiceProvider
- [ ] Grupos "Administradores" y "Webmaster" existen
- [ ] 11 nuevos permisos creados (permissions.*, roles.*)
- [ ] Repositories, Services, Controllers funcionan
- [ ] Policies permiten/niegan acceso correctamente
- [ ] API endpoints responden correctamente
- [ ] Broadcasting events se disparan

### Frontend
- [ ] Router tiene rutas de roles configuradas
- [ ] Composables funcionan correctamente
- [ ] Página de lista de roles se carga
- [ ] Crear rol funciona
- [ ] Editar rol funciona
- [ ] Ver detalles de rol funciona
- [ ] Eliminar rol funciona
- [ ] Matriz de permisos se muestra
- [ ] Guardar permisos funciona
- [ ] WebSocket actualiza en tiempo real
- [ ] Traducciones en español/inglés funcionan
- [ ] Navegación con `await router.push()` funciona

### Sistema de Grupos Privilegiados
- [ ] Usuarios en "Administradores" tienen acceso total
- [ ] Usuarios en "Webmaster" tienen acceso total
- [ ] Acceso automático funciona para TODOS los permisos
- [ ] Permisos negativos niegan acceso específico
- [ ] Usuarios normales NO tienen acceso automático
- [ ] Gate::before() retorna correctamente (true/false/null)

---

## 📞 En Caso de Problemas

### Problema: "Column not found: email"
**Solución:** Ya corregido - UserFactory actualizado para usar username y tablas relacionadas

### Problema: WebSocket no actualiza
**Solución:** Verificar que Reverb esté corriendo: `php artisan reverb:start`

### Problema: Permisos negativos no funcionan
**Solución:** Limpiar caché: `app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();`

### Problema: 403 Forbidden en rutas
**Solución:** Verificar que el usuario tenga grupo "Administradores" o los permisos necesarios

---

## 🚀 Comandos Útiles

```bash
# Limpiar todo y resetear
php artisan migrate:fresh --seed

# Ver logs en tiempo real
php artisan pail

# Verificar rutas API
php artisan route:list --path=api

# Limpiar caché de permisos
php artisan permission:cache-reset

# Crear usuario de prueba
php artisan tinker
```

---

¡Buena suerte con las pruebas! 🎉
