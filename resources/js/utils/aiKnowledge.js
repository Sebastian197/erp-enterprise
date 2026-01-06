/**
 * AI Knowledge Base
 * Contains structured information about system functionalities
 * This helps the AI assistant answer user questions about the software
 * Now supports multiple languages
 */

// Spanish knowledge base
const knowledgeES = {
  // General system information
  general: {
    name: 'ERP Enterprise',
    type: 'Sistema de Gestión Empresarial Naval',
    description: 'Sistema integral para la gestión de reparaciones navales, usuarios, recursos y operaciones empresariales.',
    mainFeatures: [
      'Gestión de usuarios y permisos',
      'Control de grupos y categorías',
      'Sistema de roles y permisos granulares',
      'Dashboard con métricas en tiempo real',
      'Sistema de notificaciones',
      'Múltiples idiomas y temas',
      'Asistente de IA contextual',
    ],
  },

  // Module-specific knowledge
  modules: {
    dashboard: {
      name: 'Tablero Principal',
      description: 'Vista general del sistema con estadísticas y accesos rápidos',
      features: [
        'Visualización de métricas en tiempo real',
        'Widgets personalizables',
        'Accesos rápidos a tareas comunes',
        'Resumen de actividad reciente',
        'Estadísticas visuales con gráficos',
      ],
      howTo: {
        'ver estadísticas': 'Las estadísticas se muestran automáticamente en los widgets del dashboard. Puedes actualizar los datos haciendo clic en el ícono de actualizar en cada widget.',
        'acceder a módulos': 'Usa el menú lateral izquierdo para navegar entre los diferentes módulos del sistema.',
        'personalizar vista': 'Puedes reorganizar los widgets arrastrándolos a diferentes posiciones.',
      },
    },

    users: {
      name: 'Gestión de Usuarios',
      description: 'Administración completa de usuarios del sistema',
      features: [
        'Crear, editar y eliminar usuarios',
        'Asignar roles y permisos',
        'Gestionar grupos de usuarios',
        'Ver historial de actividad',
        'Activar/desactivar cuentas',
        'Restablecer contraseñas',
      ],
      howTo: {
        'crear usuario': 'Ve a la sección de Usuarios y haz clic en el botón "Nuevo Usuario". Completa el formulario con los datos requeridos (nombre, email, rol) y guarda.',
        'editar usuario': 'En la lista de usuarios, haz clic en el ícono de editar junto al usuario que deseas modificar. Realiza los cambios necesarios y guarda.',
        'asignar rol': 'Al crear o editar un usuario, selecciona el rol apropiado del menú desplegable. Los roles determinan los permisos del usuario.',
        'desactivar usuario': 'En la vista de detalle del usuario, usa el interruptor de estado para activar o desactivar la cuenta.',
      },
    },

    groups: {
      name: 'Grupos',
      description: 'Organización de usuarios en grupos para mejor gestión',
      features: [
        'Crear grupos personalizados',
        'Asignar usuarios a grupos',
        'Definir permisos por grupo',
        'Ver miembros del grupo',
        'Gestionar jerarquías',
      ],
      howTo: {
        'crear grupo': 'Ve a Grupos > Nuevo Grupo. Asigna un nombre descriptivo y selecciona los permisos base del grupo.',
        'agregar usuarios': 'En la edición del grupo, usa el selector múltiple para agregar usuarios al grupo.',
        'definir permisos': 'Los permisos del grupo se pueden configurar en la pestaña de permisos dentro de la edición del grupo.',
      },
    },

    categories: {
      name: 'Categorías',
      description: 'Sistema de clasificación y organización',
      features: [
        'Crear categorías jerárquicas',
        'Asignar colores e íconos',
        'Organizar recursos',
        'Filtrar por categoría',
      ],
      howTo: {
        'crear categoría': 'Ve a Categorías > Nueva Categoría. Define el nombre, color e ícono representativo.',
        'organizar jerarquía': 'Puedes crear subcategorías seleccionando una categoría padre al crear una nueva.',
      },
    },

    roles: {
      name: 'Roles y Permisos',
      description: 'Control granular de accesos y permisos',
      features: [
        'Crear roles personalizados',
        'Asignar permisos específicos',
        'Control de acceso por módulo',
        'Permisos de lectura/escritura/eliminación',
        'Roles predefinidos del sistema',
      ],
      howTo: {
        'crear rol': 'Ve a Roles > Nuevo Rol. Define el nombre y selecciona los permisos específicos que tendrá este rol.',
        'asignar permisos': 'Solo los usuarios de los grupos Webmaster y Administradores, o quienes tengan el permiso específico para gestionar permisos, pueden asignar permisos. En la creación/edición del rol, marca las casillas de los permisos que deseas otorgar.',
        'dar permisos': 'Los permisos solo pueden ser otorgados por miembros de los grupos Webmaster y Administradores, o por usuarios que tengan el permiso específico de gestión de permisos.',
        'quien puede dar permisos': 'Solo los grupos Webmaster y Administradores, o usuarios con el permiso específico de gestión de permisos, pueden otorgar permisos a otros usuarios.',
        'roles predefinidos': 'El sistema incluye roles como Super Admin, Admin, Manager y Usuario con permisos preconfigurados.',
      },
    },

    profile: {
      name: 'Perfil de Usuario',
      description: 'Gestión de información personal y preferencias',
      features: [
        'Actualizar datos personales',
        'Cambiar contraseña',
        'Subir foto de perfil',
        'Configurar preferencias',
        'Ver historial de sesiones',
      ],
      howTo: {
        'cambiar contraseña': 'Ve a Perfil > Seguridad > Cambiar Contraseña. Ingresa tu contraseña actual y la nueva.',
        'actualizar foto': 'En tu perfil, haz clic en la imagen actual y selecciona una nueva foto desde tu dispositivo.',
        'configurar idioma': 'Usa el selector de idiomas en la barra superior para cambiar el idioma de la interfaz.',
      },
    },

    settings: {
      name: 'Configuración',
      description: 'Ajustes generales del sistema',
      features: [
        'Configurar preferencias de idioma',
        'Seleccionar tema visual',
        'Configurar notificaciones',
        'Ajustar zona horaria',
        'Personalizar interfaz',
      ],
      howTo: {
        'cambiar tema': 'Ve a Configuración > Apariencia y selecciona el tema que prefieras de la galería disponible.',
        'configurar notificaciones': 'En Configuración > Notificaciones, activa o desactiva los tipos de notificaciones que deseas recibir.',
      },
    },
  },

  // Common questions and answers
  faq: {
    '¿cómo navego por el sistema?': 'Usa el menú lateral izquierdo para acceder a los diferentes módulos. Puedes colapsar el menú haciendo clic en el ícono de hamburguesa para tener más espacio.',

    '¿cómo busco información?': 'Usa la barra de búsqueda en la parte superior. Puedes buscar usuarios, grupos, categorías y más escribiendo palabras clave.',

    '¿cómo cambio mi contraseña?': 'Ve a tu Perfil (ícono de usuario arriba a la derecha) > Seguridad > Cambiar Contraseña.',

    '¿qué son los roles?': 'Los roles definen qué puede hacer un usuario en el sistema. Por ejemplo, un Admin puede gestionar usuarios, mientras que un Usuario normal solo puede ver información.',

    '¿cómo asigno permisos?': 'Los permisos se asignan a través de roles. Solo los usuarios de los grupos Webmaster y Administradores, o quienes tengan el permiso específico para gestionar permisos, pueden asignarlos. Ve a Roles, edita el rol deseado y marca los permisos que quieres otorgar.',

    '¿quién puede dar permisos?': 'Solo los miembros de los grupos Webmaster y Administradores, o usuarios que tengan el permiso específico de gestión de permisos, pueden otorgar permisos a otros usuarios.',

    '¿puedo personalizar la interfaz?': 'Sí, puedes cambiar el tema, idioma y personalizar algunos widgets del dashboard según tus preferencias.',

    '¿cómo veo las notificaciones?': 'Haz clic en el ícono de campana en la barra superior para ver tus notificaciones recientes.',

    '¿qué idiomas están disponibles?': 'El sistema está disponible en 10 idiomas: Español, Inglés, Francés, Alemán, Italiano, Portugués, Chino, Japonés, Árabe y Ruso.',

    '¿cómo filtro la información?': 'La mayoría de las tablas tienen filtros en la parte superior. Puedes filtrar por fecha, estado, categoría y más.',

    '¿cómo exporto datos?': 'Busca el botón de exportar (ícono de descarga) en las tablas. Puedes exportar a Excel, PDF o CSV.',
  },

  // Keywords for better matching
  keywords: {
    crear: ['crear', 'agregar', 'nuevo', 'añadir', 'insertar', 'create', 'add', 'new'],
    editar: ['editar', 'modificar', 'actualizar', 'cambiar', 'edit', 'modify', 'update', 'change'],
    eliminar: ['eliminar', 'borrar', 'quitar', 'remover', 'delete', 'remove'],
    ver: ['ver', 'mostrar', 'visualizar', 'listar', 'view', 'show', 'display', 'list'],
    buscar: ['buscar', 'encontrar', 'search', 'find'],
    filtrar: ['filtrar', 'filter'],
    exportar: ['exportar', 'descargar', 'export', 'download'],
    usuario: ['usuario', 'usuarios', 'user', 'users'],
    grupo: ['grupo', 'grupos', 'group', 'groups'],
    rol: ['rol', 'roles', 'role', 'roles', 'permiso', 'permisos', 'permission', 'permissions'],
    categoría: ['categoria', 'categorias', 'category', 'categories'],
    contraseña: ['contraseña', 'contrasena', 'password', 'clave', 'pass'],
    perfil: ['perfil', 'profile', 'cuenta', 'account'],
    configuración: ['configuracion', 'settings', 'config', 'ajustes', 'preferencias'],
    notificación: ['notificacion', 'notificaciones', 'notification', 'notifications', 'alerta', 'alertas', 'aviso', 'avisos'],
    tema: ['tema', 'theme', 'apariencia', 'appearance'],
    idioma: ['idioma', 'language', 'lenguaje'],
    permiso: ['permiso', 'permisos', 'permission', 'permissions', 'autorizar', 'autorizacion', 'dar permisos', 'otorgar permisos', 'gestionar permisos'],
  },

  // Action patterns for intent detection
  actionPatterns: {
    crear: ['como crear', 'como creo', 'como hago', 'como agrego', 'como añado', 'quiero crear', 'necesito crear', 'agregar', 'nuevo', 'crear', 'creo', 'crea', 'creando'],
    editar: ['como editar', 'como edito', 'como modifico', 'como cambio', 'como actualizo', 'modificar', 'cambiar', 'editar', 'edito', 'edita', 'editando'],
    eliminar: ['como elimino', 'como borro', 'como quito', 'eliminar', 'borrar', 'elimino', 'elimina', 'eliminando', 'borro', 'borra', 'borrando'],
    asignar: ['como asigno', 'como doy', 'asignar', 'dar permisos', 'otorgar', 'asigno', 'asigna', 'asignando', 'doy', 'da', 'dando', 'otorgo', 'otorga', 'otorgando'],
    ver: ['como veo', 'donde veo', 'como miro', 'donde esta', 'ver', 'mostrar', 'veo', 've', 'viendo', 'miro', 'mira', 'mirando'],
    cambiar: ['como cambio', 'cambiar', 'modificar', 'cambio', 'cambia', 'cambiando'],
    dar: ['como dar', 'como doy', 'dar', 'otorgar', 'dar permisos', 'otorgar permisos', 'doy', 'da', 'dando', 'otorgo', 'otorga', 'quien puede dar', 'quien puede otorgar'],
  },
};

// English knowledge base
const knowledgeEN = {
  general: {
    name: 'ERP Enterprise',
    type: 'Naval Business Management System',
    description: 'Comprehensive system for managing naval repairs, users, resources and business operations.',
    mainFeatures: [
      'User and permission management',
      'Group and category control',
      'Granular role and permission system',
      'Dashboard with real-time metrics',
      'Notification system',
      'Multiple languages and themes',
      'Contextual AI assistant',
    ],
  },

  modules: {
    dashboard: {
      name: 'Main Dashboard',
      description: 'System overview with statistics and quick access',
      features: [
        'Real-time metrics visualization',
        'Customizable widgets',
        'Quick access to common tasks',
        'Recent activity summary',
        'Visual statistics with charts',
      ],
      howTo: {
        'view statistics': 'Statistics are automatically displayed in the dashboard widgets. You can refresh the data by clicking the refresh icon on each widget.',
        'access modules': 'Use the left side menu to navigate between different system modules.',
        'customize view': 'You can rearrange widgets by dragging them to different positions.',
      },
    },

    users: {
      name: 'User Management',
      description: 'Complete system user administration',
      features: [
        'Create, edit and delete users',
        'Assign roles and permissions',
        'Manage user groups',
        'View activity history',
        'Activate/deactivate accounts',
        'Reset passwords',
      ],
      howTo: {
        'create user': 'Go to the Users section and click the "New User" button. Fill in the form with required data (name, email, role) and save.',
        'edit user': 'In the user list, click the edit icon next to the user you want to modify. Make necessary changes and save.',
        'assign role': 'When creating or editing a user, select the appropriate role from the dropdown menu. Roles determine user permissions.',
        'deactivate user': 'In the user detail view, use the status toggle to activate or deactivate the account.',
      },
    },

    groups: {
      name: 'Groups',
      description: 'User organization in groups for better management',
      features: [
        'Create custom groups',
        'Assign users to groups',
        'Define group permissions',
        'View group members',
        'Manage hierarchies',
      ],
      howTo: {
        'create group': 'Go to Groups > New Group. Assign a descriptive name and select base group permissions.',
        'add users': 'In group editing, use the multi-select to add users to the group.',
        'define permissions': 'Group permissions can be configured in the permissions tab within group editing.',
      },
    },

    categories: {
      name: 'Categories',
      description: 'Classification and organization system',
      features: [
        'Create hierarchical categories',
        'Assign colors and icons',
        'Organize resources',
        'Filter by category',
      ],
      howTo: {
        'create category': 'Go to Categories > New Category. Define the name, color and representative icon.',
        'organize hierarchy': 'You can create subcategories by selecting a parent category when creating a new one.',
      },
    },

    roles: {
      name: 'Roles and Permissions',
      description: 'Granular access and permission control',
      features: [
        'Create custom roles',
        'Assign specific permissions',
        'Module-level access control',
        'Read/write/delete permissions',
        'Predefined system roles',
      ],
      howTo: {
        'create role': 'Go to Roles > New Role. Define the name and select specific permissions this role will have.',
        'assign permissions': 'Only users in Webmaster and Administrators groups, or those with specific permission management permission, can assign permissions. In role creation/editing, check the boxes for permissions you want to grant.',
        'give permissions': 'Permissions can only be granted by members of Webmaster and Administrators groups, or by users with specific permission management permission.',
        'who can give permissions': 'Only Webmaster and Administrators groups, or users with specific permission management permission, can grant permissions to other users.',
        'predefined roles': 'The system includes roles like Super Admin, Admin, Manager and User with preconfigured permissions.',
      },
    },

    profile: {
      name: 'User Profile',
      description: 'Personal information and preference management',
      features: [
        'Update personal data',
        'Change password',
        'Upload profile picture',
        'Configure preferences',
        'View session history',
      ],
      howTo: {
        'change password': 'Go to Profile > Security > Change Password. Enter your current password and the new one.',
        'update photo': 'In your profile, click on the current image and select a new photo from your device.',
        'configure language': 'Use the language selector in the top bar to change the interface language.',
      },
    },

    settings: {
      name: 'Settings',
      description: 'General system settings',
      features: [
        'Configure language preferences',
        'Select visual theme',
        'Configure notifications',
        'Adjust time zone',
        'Customize interface',
      ],
      howTo: {
        'change theme': 'Go to Settings > Appearance and select your preferred theme from the available gallery.',
        'configure notifications': 'In Settings > Notifications, enable or disable the types of notifications you want to receive.',
      },
    },
  },

  faq: {
    'how do I navigate the system?': 'Use the left side menu to access different modules. You can collapse the menu by clicking the hamburger icon for more space.',
    'how do I search for information?': 'Use the search bar at the top. You can search for users, groups, categories and more by typing keywords.',
    'how do I change my password?': 'Go to your Profile (user icon top right) > Security > Change Password.',
    'what are roles?': 'Roles define what a user can do in the system. For example, an Admin can manage users, while a normal User can only view information.',
    'how do I assign permissions?': 'Permissions are assigned through roles. Only users in Webmaster and Administrators groups, or those with specific permission management permission, can assign them. Go to Roles, edit the desired role and check the permissions you want to grant.',
    'who can give permissions?': 'Only members of Webmaster and Administrators groups, or users with specific permission management permission, can grant permissions to other users.',
    'can I customize the interface?': 'Yes, you can change the theme, language and customize some dashboard widgets according to your preferences.',
    'how do I view notifications?': 'Click the bell icon in the top bar to see your recent notifications.',
    'what languages are available?': 'The system is available in 10 languages: Spanish, English, French, German, Italian, Portuguese, Chinese, Japanese, Arabic and Russian.',
    'how do I filter information?': 'Most tables have filters at the top. You can filter by date, status, category and more.',
    'how do I export data?': 'Look for the export button (download icon) in tables. You can export to Excel, PDF or CSV.',
  },

  keywords: {
    crear: ['create', 'add', 'new', 'insert', 'make'],
    editar: ['edit', 'modify', 'update', 'change', 'alter'],
    eliminar: ['delete', 'remove', 'erase', 'clear'],
    ver: ['view', 'show', 'display', 'list', 'see'],
    buscar: ['search', 'find', 'lookup', 'locate'],
    filtrar: ['filter', 'sort'],
    exportar: ['export', 'download', 'save'],
    usuario: ['user', 'users', 'account', 'accounts'],
    grupo: ['group', 'groups', 'team', 'teams'],
    rol: ['role', 'roles', 'permission', 'permissions', 'access'],
    categoría: ['category', 'categories', 'type', 'types'],
    contraseña: ['password', 'pass', 'passphrase', 'credential'],
    perfil: ['profile', 'account', 'settings'],
    configuración: ['settings', 'configuration', 'config', 'preferences', 'options'],
    notificación: ['notification', 'notifications', 'alert', 'alerts', 'notice'],
    tema: ['theme', 'appearance', 'style', 'skin'],
    idioma: ['language', 'locale', 'tongue'],
    permiso: ['permission', 'permissions', 'authorize', 'authorization', 'grant permissions', 'give permissions', 'manage permissions'],
  },

  actionPatterns: {
    crear: ['how to create', 'how do i create', 'create', 'add', 'new', 'make', 'creating', 'i want to create', 'i need to create'],
    editar: ['how to edit', 'how do i edit', 'edit', 'modify', 'update', 'change', 'editing', 'modifying'],
    eliminar: ['how to delete', 'how do i delete', 'delete', 'remove', 'erase', 'deleting', 'removing'],
    asignar: ['how to assign', 'how do i assign', 'assign', 'give permissions', 'grant', 'assigning', 'granting'],
    ver: ['how to view', 'how do i see', 'view', 'show', 'display', 'where is', 'viewing', 'seeing'],
    cambiar: ['how to change', 'how do i change', 'change', 'modify', 'alter', 'changing'],
    dar: ['how to give', 'how do i give', 'give', 'grant', 'give permissions', 'grant permissions', 'who can give', 'who can grant'],
  },
};

// French knowledge base
const knowledgeFR = {
  general: {
    name: 'ERP Enterprise',
    type: 'Système de Gestion d\'Entreprise Navale',
    description: 'Système intégral pour la gestion des réparations navales, utilisateurs, ressources et opérations commerciales.',
    mainFeatures: [
      'Gestion des utilisateurs et permissions',
      'Contrôle des groupes et catégories',
      'Système de rôles et permissions granulaires',
      'Tableau de bord avec métriques en temps réel',
      'Système de notifications',
      'Plusieurs langues et thèmes',
      'Assistant IA contextuel',
    ],
  },

  modules: {
    dashboard: {
      name: 'Tableau de Bord Principal',
      description: 'Vue d\'ensemble du système avec statistiques et accès rapides',
      features: [
        'Visualisation de métriques en temps réel',
        'Widgets personnalisables',
        'Accès rapides aux tâches communes',
        'Résumé d\'activité récente',
        'Statistiques visuelles avec graphiques',
      ],
      howTo: {
        'voir statistiques': 'Les statistiques s\'affichent automatiquement dans les widgets du tableau de bord. Vous pouvez actualiser les données en cliquant sur l\'icône de rafraîchissement sur chaque widget.',
        'accéder modules': 'Utilisez le menu latéral gauche pour naviguer entre les différents modules du système.',
        'personnaliser vue': 'Vous pouvez réorganiser les widgets en les faisant glisser vers différentes positions.',
      },
    },

    users: {
      name: 'Gestion des Utilisateurs',
      description: 'Administration complète des utilisateurs du système',
      features: [
        'Créer, éditer et supprimer des utilisateurs',
        'Attribuer des rôles et permissions',
        'Gérer les groupes d\'utilisateurs',
        'Voir l\'historique d\'activité',
        'Activer/désactiver des comptes',
        'Réinitialiser les mots de passe',
      ],
      howTo: {
        'créer utilisateur': 'Allez dans la section Utilisateurs et cliquez sur le bouton "Nouvel Utilisateur". Remplissez le formulaire avec les données requises (nom, email, rôle) et enregistrez.',
        'éditer utilisateur': 'Dans la liste des utilisateurs, cliquez sur l\'icône d\'édition à côté de l\'utilisateur que vous souhaitez modifier. Apportez les modifications nécessaires et enregistrez.',
        'attribuer rôle': 'Lors de la création ou de l\'édition d\'un utilisateur, sélectionnez le rôle approprié dans le menu déroulant. Les rôles déterminent les permissions de l\'utilisateur.',
        'désactiver utilisateur': 'Dans la vue détaillée de l\'utilisateur, utilisez le bouton bascule de statut pour activer ou désactiver le compte.',
      },
    },

    groups: {
      name: 'Groupes',
      description: 'Organisation des utilisateurs en groupes pour une meilleure gestion',
      features: [
        'Créer des groupes personnalisés',
        'Attribuer des utilisateurs aux groupes',
        'Définir les permissions par groupe',
        'Voir les membres du groupe',
        'Gérer les hiérarchies',
      ],
      howTo: {
        'créer groupe': 'Allez dans Groupes > Nouveau Groupe. Attribuez un nom descriptif et sélectionnez les permissions de base du groupe.',
        'ajouter utilisateurs': 'Dans l\'édition du groupe, utilisez le sélecteur multiple pour ajouter des utilisateurs au groupe.',
        'définir permissions': 'Les permissions du groupe peuvent être configurées dans l\'onglet permissions dans l\'édition du groupe.',
      },
    },

    categories: {
      name: 'Catégories',
      description: 'Système de classification et organisation',
      features: [
        'Créer des catégories hiérarchiques',
        'Attribuer des couleurs et icônes',
        'Organiser les ressources',
        'Filtrer par catégorie',
      ],
      howTo: {
        'créer catégorie': 'Allez dans Catégories > Nouvelle Catégorie. Définissez le nom, la couleur et l\'icône représentative.',
        'organiser hiérarchie': 'Vous pouvez créer des sous-catégories en sélectionnant une catégorie parente lors de la création d\'une nouvelle.',
      },
    },

    roles: {
      name: 'Rôles et Permissions',
      description: 'Contrôle granulaire des accès et permissions',
      features: [
        'Créer des rôles personnalisés',
        'Attribuer des permissions spécifiques',
        'Contrôle d\'accès par module',
        'Permissions de lecture/écriture/suppression',
        'Rôles prédéfinis du système',
      ],
      howTo: {
        'créer rôle': 'Allez dans Rôles > Nouveau Rôle. Définissez le nom et sélectionnez les permissions spécifiques que ce rôle aura.',
        'attribuer permissions': 'Seuls les utilisateurs des groupes Webmaster et Administrateurs, ou ceux ayant la permission spécifique de gestion des permissions, peuvent attribuer des permissions. Dans la création/édition du rôle, cochez les cases des permissions que vous souhaitez accorder.',
        'donner permissions': 'Les permissions ne peuvent être accordées que par les membres des groupes Webmaster et Administrateurs, ou par les utilisateurs ayant la permission spécifique de gestion des permissions.',
        'qui peut donner permissions': 'Seuls les groupes Webmaster et Administrateurs, ou les utilisateurs avec la permission spécifique de gestion des permissions, peuvent accorder des permissions à d\'autres utilisateurs.',
        'rôles prédéfinis': 'Le système inclut des rôles comme Super Admin, Admin, Manager et Utilisateur avec des permissions préconfigurées.',
      },
    },

    profile: {
      name: 'Profil Utilisateur',
      description: 'Gestion des informations personnelles et préférences',
      features: [
        'Mettre à jour les données personnelles',
        'Changer le mot de passe',
        'Télécharger la photo de profil',
        'Configurer les préférences',
        'Voir l\'historique des sessions',
      ],
      howTo: {
        'changer mot de passe': 'Allez dans Profil > Sécurité > Changer le Mot de Passe. Entrez votre mot de passe actuel et le nouveau.',
        'mettre à jour photo': 'Dans votre profil, cliquez sur l\'image actuelle et sélectionnez une nouvelle photo depuis votre appareil.',
        'configurer langue': 'Utilisez le sélecteur de langue dans la barre supérieure pour changer la langue de l\'interface.',
      },
    },

    settings: {
      name: 'Paramètres',
      description: 'Paramètres généraux du système',
      features: [
        'Configurer les préférences de langue',
        'Sélectionner le thème visuel',
        'Configurer les notifications',
        'Ajuster le fuseau horaire',
        'Personnaliser l\'interface',
      ],
      howTo: {
        'changer thème': 'Allez dans Paramètres > Apparence et sélectionnez le thème de votre choix dans la galerie disponible.',
        'configurer notifications': 'Dans Paramètres > Notifications, activez ou désactivez les types de notifications que vous souhaitez recevoir.',
      },
    },
  },

  faq: {
    'comment naviguer dans le système?': 'Utilisez le menu latéral gauche pour accéder aux différents modules. Vous pouvez réduire le menu en cliquant sur l\'icône hamburger pour avoir plus d\'espace.',
    'comment rechercher des informations?': 'Utilisez la barre de recherche en haut. Vous pouvez rechercher des utilisateurs, groupes, catégories et plus en tapant des mots-clés.',
    'comment changer mon mot de passe?': 'Allez dans votre Profil (icône utilisateur en haut à droite) > Sécurité > Changer le Mot de Passe.',
    'qu\'est-ce que les rôles?': 'Les rôles définissent ce qu\'un utilisateur peut faire dans le système. Par exemple, un Admin peut gérer les utilisateurs, tandis qu\'un Utilisateur normal ne peut que voir les informations.',
    'comment attribuer des permissions?': 'Les permissions sont attribuées via les rôles. Seuls les utilisateurs des groupes Webmaster et Administrateurs, ou ceux ayant la permission spécifique de gestion des permissions, peuvent les attribuer. Allez dans Rôles, éditez le rôle souhaité et cochez les permissions que vous souhaitez accorder.',
    'qui peut donner des permissions?': 'Seuls les membres des groupes Webmaster et Administrateurs, ou les utilisateurs avec la permission spécifique de gestion des permissions, peuvent accorder des permissions à d\'autres utilisateurs.',
    'puis-je personnaliser l\'interface?': 'Oui, vous pouvez changer le thème, la langue et personnaliser certains widgets du tableau de bord selon vos préférences.',
    'comment voir les notifications?': 'Cliquez sur l\'icône de cloche dans la barre supérieure pour voir vos notifications récentes.',
    'quelles langues sont disponibles?': 'Le système est disponible en 10 langues: Espagnol, Anglais, Français, Allemand, Italien, Portugais, Chinois, Japonais, Arabe et Russe.',
    'comment filtrer les informations?': 'La plupart des tableaux ont des filtres en haut. Vous pouvez filtrer par date, statut, catégorie et plus.',
    'comment exporter des données?': 'Cherchez le bouton d\'export (icône de téléchargement) dans les tableaux. Vous pouvez exporter vers Excel, PDF ou CSV.',
  },

  keywords: {
    crear: ['créer', 'ajouter', 'nouveau', 'nouvelle', 'insérer'],
    editar: ['éditer', 'modifier', 'mettre à jour', 'changer', 'altérer'],
    eliminar: ['supprimer', 'effacer', 'retirer', 'enlever'],
    ver: ['voir', 'afficher', 'montrer', 'lister', 'visualiser'],
    buscar: ['chercher', 'rechercher', 'trouver', 'localiser'],
    filtrar: ['filtrer', 'trier'],
    exportar: ['exporter', 'télécharger', 'sauvegarder'],
    usuario: ['utilisateur', 'utilisateurs', 'compte', 'comptes'],
    grupo: ['groupe', 'groupes', 'équipe', 'équipes'],
    rol: ['rôle', 'rôles', 'permission', 'permissions', 'accès'],
    categoría: ['catégorie', 'catégories', 'type', 'types'],
    contraseña: ['mot de passe', 'passe', 'credential'],
    perfil: ['profil', 'compte', 'paramètres'],
    configuración: ['paramètres', 'configuration', 'config', 'préférences', 'options'],
    notificación: ['notification', 'notifications', 'alerte', 'alertes', 'avis'],
    tema: ['thème', 'apparence', 'style', 'skin'],
    idioma: ['langue', 'langage', 'idiome'],
    permiso: ['permission', 'permissions', 'autoriser', 'autorisation', 'donner permissions', 'accorder permissions', 'gérer permissions'],
  },

  actionPatterns: {
    crear: ['comment créer', 'créer', 'ajouter', 'nouveau', 'nouvelle', 'faire', 'je veux créer', 'j\'ai besoin de créer', 'création'],
    editar: ['comment éditer', 'éditer', 'modifier', 'mettre à jour', 'changer', 'édition', 'modification'],
    eliminar: ['comment supprimer', 'supprimer', 'effacer', 'retirer', 'suppression', 'effacement'],
    asignar: ['comment attribuer', 'attribuer', 'donner permissions', 'accorder', 'attribution', 'accordage'],
    ver: ['comment voir', 'voir', 'afficher', 'montrer', 'où est', 'visualisation', 'affichage'],
    cambiar: ['comment changer', 'changer', 'modifier', 'altérer', 'changement'],
    dar: ['comment donner', 'donner', 'accorder', 'donner permissions', 'accorder permissions', 'qui peut donner', 'qui peut accorder'],
  },
};

// German knowledge base
const knowledgeDE = {
  general: {
    name: 'ERP Enterprise',
    type: 'Maritimes Unternehmensführungssystem',
    description: 'Umfassendes System zur Verwaltung von Schiffsreparaturen, Benutzern, Ressourcen und Geschäftsprozessen.',
    mainFeatures: [
      'Benutzer- und Berechtigungsverwaltung',
      'Gruppen- und Kategoriekontrolle',
      'Granulares Rollen- und Berechtigungssystem',
      'Dashboard mit Echtzeit-Metriken',
      'Benachrichtigungssystem',
      'Mehrere Sprachen und Themes',
      'Kontextueller KI-Assistent',
    ],
  },

  modules: {
    dashboard: {
      name: 'Haupt-Dashboard',
      description: 'Systemübersicht mit Statistiken und Schnellzugriff',
      features: [
        'Echtzeit-Metrik-Visualisierung',
        'Anpassbare Widgets',
        'Schnellzugriff auf häufige Aufgaben',
        'Zusammenfassung aktueller Aktivitäten',
        'Visuelle Statistiken mit Diagrammen',
      ],
      howTo: {
        'Statistiken anzeigen': 'Statistiken werden automatisch in den Dashboard-Widgets angezeigt. Sie können die Daten aktualisieren, indem Sie auf das Aktualisierungssymbol in jedem Widget klicken.',
        'Module zugreifen': 'Verwenden Sie das linke Seitenmenü, um zwischen verschiedenen Systemmodulen zu navigieren.',
        'Ansicht anpassen': 'Sie können Widgets neu anordnen, indem Sie sie an verschiedene Positionen ziehen.',
      },
    },

    users: {
      name: 'Benutzerverwaltung',
      description: 'Vollständige Systembenutzer-Administration',
      features: [
        'Benutzer erstellen, bearbeiten und löschen',
        'Rollen und Berechtigungen zuweisen',
        'Benutzergruppen verwalten',
        'Aktivitätsverlauf anzeigen',
        'Konten aktivieren/deaktivieren',
        'Passwörter zurücksetzen',
      ],
      howTo: {
        'Benutzer erstellen': 'Gehen Sie zum Benutzerbereich und klicken Sie auf die Schaltfläche "Neuer Benutzer". Füllen Sie das Formular mit den erforderlichen Daten (Name, E-Mail, Rolle) aus und speichern Sie.',
        'Benutzer bearbeiten': 'Klicken Sie in der Benutzerliste auf das Bearbeitungssymbol neben dem Benutzer, den Sie ändern möchten. Nehmen Sie die erforderlichen Änderungen vor und speichern Sie.',
        'Rolle zuweisen': 'Beim Erstellen oder Bearbeiten eines Benutzers wählen Sie die entsprechende Rolle aus dem Dropdown-Menü. Rollen bestimmen die Berechtigungen des Benutzers.',
        'Benutzer deaktivieren': 'Verwenden Sie in der Benutzerdetailansicht den Statusschalter, um das Konto zu aktivieren oder zu deaktivieren.',
      },
    },

    groups: {
      name: 'Gruppen',
      description: 'Organisation von Benutzern in Gruppen für bessere Verwaltung',
      features: [
        'Benutzerdefinierte Gruppen erstellen',
        'Benutzer zu Gruppen zuweisen',
        'Gruppenberechtigungen definieren',
        'Gruppenmitglieder anzeigen',
        'Hierarchien verwalten',
      ],
      howTo: {
        'Gruppe erstellen': 'Gehen Sie zu Gruppen > Neue Gruppe. Vergeben Sie einen beschreibenden Namen und wählen Sie die Grundberechtigungen der Gruppe.',
        'Benutzer hinzufügen': 'Verwenden Sie in der Gruppenbearbeitung die Mehrfachauswahl, um Benutzer zur Gruppe hinzuzufügen.',
        'Berechtigungen definieren': 'Gruppenberechtigungen können im Berechtigungsreiter innerhalb der Gruppenbearbeitung konfiguriert werden.',
      },
    },

    categories: {
      name: 'Kategorien',
      description: 'Klassifizierungs- und Organisationssystem',
      features: [
        'Hierarchische Kategorien erstellen',
        'Farben und Symbole zuweisen',
        'Ressourcen organisieren',
        'Nach Kategorie filtern',
      ],
      howTo: {
        'Kategorie erstellen': 'Gehen Sie zu Kategorien > Neue Kategorie. Definieren Sie den Namen, die Farbe und das repräsentative Symbol.',
        'Hierarchie organisieren': 'Sie können Unterkategorien erstellen, indem Sie beim Erstellen einer neuen Kategorie eine übergeordnete Kategorie auswählen.',
      },
    },

    roles: {
      name: 'Rollen und Berechtigungen',
      description: 'Granulare Zugriffs- und Berechtigungskontrolle',
      features: [
        'Benutzerdefinierte Rollen erstellen',
        'Spezifische Berechtigungen zuweisen',
        'Modulbasierte Zugriffskontrolle',
        'Lese-/Schreib-/Löschberechtigungen',
        'Vordefinierte Systemrollen',
      ],
      howTo: {
        'Rolle erstellen': 'Gehen Sie zu Rollen > Neue Rolle. Definieren Sie den Namen und wählen Sie die spezifischen Berechtigungen aus, die diese Rolle haben wird.',
        'Berechtigungen zuweisen': 'Nur Benutzer der Gruppen Webmaster und Administratoren oder solche mit spezifischer Berechtigungsverwaltungsberechtigung können Berechtigungen zuweisen. Aktivieren Sie beim Erstellen/Bearbeiten der Rolle die Kontrollkästchen für die Berechtigungen, die Sie gewähren möchten.',
        'Berechtigungen erteilen': 'Berechtigungen können nur von Mitgliedern der Gruppen Webmaster und Administratoren oder von Benutzern mit spezifischer Berechtigungsverwaltungsberechtigung erteilt werden.',
        'wer kann Berechtigungen erteilen': 'Nur die Gruppen Webmaster und Administratoren oder Benutzer mit spezifischer Berechtigungsverwaltungsberechtigung können anderen Benutzern Berechtigungen erteilen.',
        'vordefinierte Rollen': 'Das System enthält Rollen wie Super Admin, Admin, Manager und Benutzer mit vorkonfigurierten Berechtigungen.',
      },
    },

    profile: {
      name: 'Benutzerprofil',
      description: 'Verwaltung persönlicher Informationen und Einstellungen',
      features: [
        'Persönliche Daten aktualisieren',
        'Passwort ändern',
        'Profilbild hochladen',
        'Einstellungen konfigurieren',
        'Sitzungsverlauf anzeigen',
      ],
      howTo: {
        'Passwort ändern': 'Gehen Sie zu Profil > Sicherheit > Passwort ändern. Geben Sie Ihr aktuelles Passwort und das neue ein.',
        'Foto aktualisieren': 'Klicken Sie in Ihrem Profil auf das aktuelle Bild und wählen Sie ein neues Foto von Ihrem Gerät aus.',
        'Sprache konfigurieren': 'Verwenden Sie den Sprachauswähler in der oberen Leiste, um die Sprache der Benutzeroberfläche zu ändern.',
      },
    },

    settings: {
      name: 'Einstellungen',
      description: 'Allgemeine Systemeinstellungen',
      features: [
        'Spracheinstellungen konfigurieren',
        'Visuelles Theme auswählen',
        'Benachrichtigungen konfigurieren',
        'Zeitzone anpassen',
        'Benutzeroberfläche anpassen',
      ],
      howTo: {
        'Theme ändern': 'Gehen Sie zu Einstellungen > Erscheinungsbild und wählen Sie Ihr bevorzugtes Theme aus der verfügbaren Galerie.',
        'Benachrichtigungen konfigurieren': 'Aktivieren oder deaktivieren Sie in Einstellungen > Benachrichtigungen die Arten von Benachrichtigungen, die Sie erhalten möchten.',
      },
    },
  },

  faq: {
    'Wie navigiere ich durch das System?': 'Verwenden Sie das linke Seitenmenü, um auf verschiedene Module zuzugreifen. Sie können das Menü durch Klicken auf das Hamburger-Symbol einklappen, um mehr Platz zu haben.',
    'Wie suche ich nach Informationen?': 'Verwenden Sie die Suchleiste oben. Sie können nach Benutzern, Gruppen, Kategorien und mehr suchen, indem Sie Schlüsselwörter eingeben.',
    'Wie ändere ich mein Passwort?': 'Gehen Sie zu Ihrem Profil (Benutzersymbol oben rechts) > Sicherheit > Passwort ändern.',
    'Was sind Rollen?': 'Rollen definieren, was ein Benutzer im System tun kann. Zum Beispiel kann ein Admin Benutzer verwalten, während ein normaler Benutzer nur Informationen anzeigen kann.',
    'Wie weise ich Berechtigungen zu?': 'Berechtigungen werden über Rollen zugewiesen. Nur Benutzer der Gruppen Webmaster und Administratoren oder solche mit spezifischer Berechtigungsverwaltungsberechtigung können sie zuweisen. Gehen Sie zu Rollen, bearbeiten Sie die gewünschte Rolle und aktivieren Sie die Berechtigungen, die Sie gewähren möchten.',
    'Wer kann Berechtigungen erteilen?': 'Nur Mitglieder der Gruppen Webmaster und Administratoren oder Benutzer mit spezifischer Berechtigungsverwaltungsberechtigung können anderen Benutzern Berechtigungen erteilen.',
    'Kann ich die Benutzeroberfläche anpassen?': 'Ja, Sie können das Theme, die Sprache ändern und einige Dashboard-Widgets nach Ihren Vorlieben anpassen.',
    'Wie sehe ich Benachrichtigungen?': 'Klicken Sie auf das Glockensymbol in der oberen Leiste, um Ihre aktuellen Benachrichtigungen anzuzeigen.',
    'Welche Sprachen sind verfügbar?': 'Das System ist in 10 Sprachen verfügbar: Spanisch, Englisch, Französisch, Deutsch, Italienisch, Portugiesisch, Chinesisch, Japanisch, Arabisch und Russisch.',
    'Wie filtere ich Informationen?': 'Die meisten Tabellen haben Filter oben. Sie können nach Datum, Status, Kategorie und mehr filtern.',
    'Wie exportiere ich Daten?': 'Suchen Sie nach der Export-Schaltfläche (Download-Symbol) in Tabellen. Sie können nach Excel, PDF oder CSV exportieren.',
  },

  keywords: {
    crear: ['erstellen', 'hinzufügen', 'neu', 'einfügen', 'machen'],
    editar: ['bearbeiten', 'ändern', 'aktualisieren', 'modifizieren'],
    eliminar: ['löschen', 'entfernen', 'löschen'],
    ver: ['anzeigen', 'zeigen', 'darstellen', 'auflisten', 'sehen'],
    buscar: ['suchen', 'finden', 'nachschlagen', 'lokalisieren'],
    filtrar: ['filtern', 'sortieren'],
    exportar: ['exportieren', 'herunterladen', 'speichern'],
    usuario: ['benutzer', 'konto', 'konten'],
    grupo: ['gruppe', 'gruppen', 'team', 'teams'],
    rol: ['rolle', 'rollen', 'berechtigung', 'berechtigungen', 'zugriff'],
    categoría: ['kategorie', 'kategorien', 'typ', 'typen'],
    contraseña: ['passwort', 'kennwort', 'pass'],
    perfil: ['profil', 'konto', 'einstellungen'],
    configuración: ['einstellungen', 'konfiguration', 'config', 'präferenzen', 'optionen'],
    notificación: ['benachrichtigung', 'benachrichtigungen', 'warnung', 'warnungen', 'hinweis'],
    tema: ['theme', 'erscheinungsbild', 'stil', 'skin'],
    idioma: ['sprache', 'locale'],
    permiso: ['berechtigung', 'berechtigungen', 'autorisieren', 'autorisierung', 'berechtigungen erteilen', 'berechtigungen verwalten'],
  },

  actionPatterns: {
    crear: ['wie erstelle ich', 'erstellen', 'hinzufügen', 'neu', 'machen', 'erstellen', 'ich möchte erstellen', 'ich muss erstellen'],
    editar: ['wie bearbeite ich', 'bearbeiten', 'ändern', 'aktualisieren', 'modifizieren', 'bearbeitung'],
    eliminar: ['wie lösche ich', 'löschen', 'entfernen', 'löschen', 'entfernung'],
    asignar: ['wie weise ich zu', 'zuweisen', 'berechtigungen erteilen', 'gewähren', 'zuweisung'],
    ver: ['wie sehe ich', 'anzeigen', 'zeigen', 'darstellen', 'wo ist', 'ansicht'],
    cambiar: ['wie ändere ich', 'ändern', 'modifizieren', 'änderung'],
    dar: ['wie erteile ich', 'erteilen', 'gewähren', 'berechtigungen erteilen', 'wer kann erteilen'],
  },
};

// Italian knowledge base
const knowledgeIT = {
  general: {
    name: 'ERP Enterprise',
    type: 'Sistema di Gestione Aziendale Navale',
    description: 'Sistema integrale per la gestione di riparazioni navali, utenti, risorse e operazioni aziendali.',
    mainFeatures: [
      'Gestione utenti e permessi',
      'Controllo gruppi e categorie',
      'Sistema di ruoli e permessi granulari',
      'Dashboard con metriche in tempo reale',
      'Sistema di notifiche',
      'Più lingue e temi',
      'Assistente IA contestuale',
    ],
  },

  modules: {
    dashboard: {
      name: 'Dashboard Principale',
      description: 'Panoramica del sistema con statistiche e accessi rapidi',
      features: [
        'Visualizzazione metriche in tempo reale',
        'Widget personalizzabili',
        'Accessi rapidi alle attività comuni',
        'Riepilogo attività recente',
        'Statistiche visive con grafici',
      ],
      howTo: {
        'visualizzare statistiche': 'Le statistiche vengono visualizzate automaticamente nei widget del dashboard. Puoi aggiornare i dati cliccando sull\'icona di aggiornamento su ogni widget.',
        'accedere moduli': 'Usa il menu laterale sinistro per navigare tra i diversi moduli del sistema.',
        'personalizzare vista': 'Puoi riorganizzare i widget trascinandoli in diverse posizioni.',
      },
    },

    users: {
      name: 'Gestione Utenti',
      description: 'Amministrazione completa degli utenti del sistema',
      features: [
        'Creare, modificare ed eliminare utenti',
        'Assegnare ruoli e permessi',
        'Gestire gruppi di utenti',
        'Visualizzare cronologia attività',
        'Attivare/disattivare account',
        'Reimpostare password',
      ],
      howTo: {
        'creare utente': 'Vai alla sezione Utenti e clicca sul pulsante "Nuovo Utente". Compila il modulo con i dati richiesti (nome, email, ruolo) e salva.',
        'modificare utente': 'Nell\'elenco degli utenti, clicca sull\'icona di modifica accanto all\'utente che desideri modificare. Apporta le modifiche necessarie e salva.',
        'assegnare ruolo': 'Quando crei o modifichi un utente, seleziona il ruolo appropriato dal menu a tendina. I ruoli determinano i permessi dell\'utente.',
        'disattivare utente': 'Nella vista dettagli utente, usa l\'interruttore di stato per attivare o disattivare l\'account.',
      },
    },

    groups: {
      name: 'Gruppi',
      description: 'Organizzazione degli utenti in gruppi per una migliore gestione',
      features: [
        'Creare gruppi personalizzati',
        'Assegnare utenti ai gruppi',
        'Definire permessi per gruppo',
        'Visualizzare membri del gruppo',
        'Gestire gerarchie',
      ],
      howTo: {
        'creare gruppo': 'Vai a Gruppi > Nuovo Gruppo. Assegna un nome descrittivo e seleziona i permessi base del gruppo.',
        'aggiungere utenti': 'Nella modifica del gruppo, usa il selettore multiplo per aggiungere utenti al gruppo.',
        'definire permessi': 'I permessi del gruppo possono essere configurati nella scheda permessi all\'interno della modifica del gruppo.',
      },
    },

    categories: {
      name: 'Categorie',
      description: 'Sistema di classificazione e organizzazione',
      features: [
        'Creare categorie gerarchiche',
        'Assegnare colori e icone',
        'Organizzare risorse',
        'Filtrare per categoria',
      ],
      howTo: {
        'creare categoria': 'Vai a Categorie > Nuova Categoria. Definisci il nome, il colore e l\'icona rappresentativa.',
        'organizzare gerarchia': 'Puoi creare sottocategorie selezionando una categoria padre quando crei una nuova.',
      },
    },

    roles: {
      name: 'Ruoli e Permessi',
      description: 'Controllo granulare di accessi e permessi',
      features: [
        'Creare ruoli personalizzati',
        'Assegnare permessi specifici',
        'Controllo accessi per modulo',
        'Permessi di lettura/scrittura/eliminazione',
        'Ruoli predefiniti del sistema',
      ],
      howTo: {
        'creare ruolo': 'Vai a Ruoli > Nuovo Ruolo. Definisci il nome e seleziona i permessi specifici che questo ruolo avrà.',
        'assegnare permessi': 'Solo gli utenti dei gruppi Webmaster e Amministratori, o coloro che hanno il permesso specifico di gestione permessi, possono assegnare permessi. Nella creazione/modifica del ruolo, spunta le caselle dei permessi che desideri concedere.',
        'dare permessi': 'I permessi possono essere concessi solo da membri dei gruppi Webmaster e Amministratori, o da utenti con permesso specifico di gestione permessi.',
        'chi può dare permessi': 'Solo i gruppi Webmaster e Amministratori, o utenti con permesso specifico di gestione permessi, possono concedere permessi ad altri utenti.',
        'ruoli predefiniti': 'Il sistema include ruoli come Super Admin, Admin, Manager e Utente con permessi preconfigurati.',
      },
    },

    profile: {
      name: 'Profilo Utente',
      description: 'Gestione informazioni personali e preferenze',
      features: [
        'Aggiornare dati personali',
        'Cambiare password',
        'Caricare foto profilo',
        'Configurare preferenze',
        'Visualizzare cronologia sessioni',
      ],
      howTo: {
        'cambiare password': 'Vai a Profilo > Sicurezza > Cambia Password. Inserisci la tua password attuale e quella nuova.',
        'aggiornare foto': 'Nel tuo profilo, clicca sull\'immagine attuale e seleziona una nuova foto dal tuo dispositivo.',
        'configurare lingua': 'Usa il selettore di lingua nella barra superiore per cambiare la lingua dell\'interfaccia.',
      },
    },

    settings: {
      name: 'Impostazioni',
      description: 'Impostazioni generali del sistema',
      features: [
        'Configurare preferenze lingua',
        'Selezionare tema visivo',
        'Configurare notifiche',
        'Regolare fuso orario',
        'Personalizzare interfaccia',
      ],
      howTo: {
        'cambiare tema': 'Vai a Impostazioni > Aspetto e seleziona il tema preferito dalla galleria disponibile.',
        'configurare notifiche': 'In Impostazioni > Notifiche, attiva o disattiva i tipi di notifiche che desideri ricevere.',
      },
    },
  },

  faq: {
    'come navigo nel sistema?': 'Usa il menu laterale sinistro per accedere ai diversi moduli. Puoi comprimere il menu cliccando sull\'icona hamburger per avere più spazio.',
    'come cerco informazioni?': 'Usa la barra di ricerca in alto. Puoi cercare utenti, gruppi, categorie e altro digitando parole chiave.',
    'come cambio la mia password?': 'Vai al tuo Profilo (icona utente in alto a destra) > Sicurezza > Cambia Password.',
    'cosa sono i ruoli?': 'I ruoli definiscono cosa un utente può fare nel sistema. Ad esempio, un Admin può gestire utenti, mentre un Utente normale può solo visualizzare informazioni.',
    'come assegno i permessi?': 'I permessi vengono assegnati tramite ruoli. Solo gli utenti dei gruppi Webmaster e Amministratori, o coloro con permesso specifico di gestione permessi, possono assegnarli. Vai a Ruoli, modifica il ruolo desiderato e spunta i permessi che vuoi concedere.',
    'chi può dare permessi?': 'Solo i membri dei gruppi Webmaster e Amministratori, o utenti con permesso specifico di gestione permessi, possono concedere permessi ad altri utenti.',
    'posso personalizzare l\'interfaccia?': 'Sì, puoi cambiare il tema, la lingua e personalizzare alcuni widget del dashboard secondo le tue preferenze.',
    'come visualizzo le notifiche?': 'Clicca sull\'icona della campana nella barra superiore per vedere le tue notifiche recenti.',
    'quali lingue sono disponibili?': 'Il sistema è disponibile in 10 lingue: Spagnolo, Inglese, Francese, Tedesco, Italiano, Portoghese, Cinese, Giapponese, Arabo e Russo.',
    'come filtro le informazioni?': 'La maggior parte delle tabelle ha filtri in alto. Puoi filtrare per data, stato, categoria e altro.',
    'come esporto i dati?': 'Cerca il pulsante di esportazione (icona download) nelle tabelle. Puoi esportare in Excel, PDF o CSV.',
  },

  keywords: {
    crear: ['creare', 'aggiungere', 'nuovo', 'nuova', 'inserire'],
    editar: ['modificare', 'cambiare', 'aggiornare', 'alterare'],
    eliminar: ['eliminare', 'rimuovere', 'cancellare'],
    ver: ['visualizzare', 'mostrare', 'vedere', 'elencare'],
    buscar: ['cercare', 'trovare', 'ricercare', 'localizzare'],
    filtrar: ['filtrare', 'ordinare'],
    exportar: ['esportare', 'scaricare', 'salvare'],
    usuario: ['utente', 'utenti', 'account'],
    grupo: ['gruppo', 'gruppi', 'team'],
    rol: ['ruolo', 'ruoli', 'permesso', 'permessi', 'accesso'],
    categoría: ['categoria', 'categorie', 'tipo', 'tipi'],
    contraseña: ['password', 'pass', 'parola d\'ordine'],
    perfil: ['profilo', 'account', 'impostazioni'],
    configuración: ['impostazioni', 'configurazione', 'config', 'preferenze', 'opzioni'],
    notificación: ['notifica', 'notifiche', 'avviso', 'avvisi', 'allarme'],
    tema: ['tema', 'aspetto', 'stile', 'skin'],
    idioma: ['lingua', 'linguaggio', 'idioma'],
    permiso: ['permesso', 'permessi', 'autorizzare', 'autorizzazione', 'dare permessi', 'concedere permessi', 'gestire permessi'],
  },

  actionPatterns: {
    crear: ['come creare', 'creare', 'aggiungere', 'nuovo', 'nuova', 'fare', 'voglio creare', 'devo creare', 'creazione'],
    editar: ['come modificare', 'modificare', 'cambiare', 'aggiornare', 'modifica'],
    eliminar: ['come eliminare', 'eliminare', 'rimuovere', 'cancellare', 'eliminazione'],
    asignar: ['come assegnare', 'assegnare', 'dare permessi', 'concedere', 'assegnazione'],
    ver: ['come vedere', 'vedere', 'visualizzare', 'mostrare', 'dove è', 'visualizzazione'],
    cambiar: ['come cambiare', 'cambiare', 'modificare', 'alterare', 'cambio'],
    dar: ['come dare', 'dare', 'concedere', 'dare permessi', 'concedere permessi', 'chi può dare', 'chi può concedere'],
  },
};

// Portuguese knowledge base
const knowledgePT = {
  general: {
    name: 'ERP Enterprise',
    type: 'Sistema de Gestão Empresarial Naval',
    description: 'Sistema integral para gestão de reparações navais, utilizadores, recursos e operações empresariais.',
    mainFeatures: [
      'Gestão de utilizadores e permissões',
      'Controlo de grupos e categorias',
      'Sistema de funções e permissões granulares',
      'Painel com métricas em tempo real',
      'Sistema de notificações',
      'Vários idiomas e temas',
      'Assistente de IA contextual',
    ],
  },

  modules: {
    dashboard: {
      name: 'Painel Principal',
      description: 'Visão geral do sistema com estatísticas e acessos rápidos',
      features: [
        'Visualização de métricas em tempo real',
        'Widgets personalizáveis',
        'Acessos rápidos a tarefas comuns',
        'Resumo de atividade recente',
        'Estatísticas visuais com gráficos',
      ],
      howTo: {
        'ver estatísticas': 'As estatísticas são exibidas automaticamente nos widgets do painel. Pode atualizar os dados clicando no ícone de atualização em cada widget.',
        'aceder módulos': 'Use o menu lateral esquerdo para navegar entre os diferentes módulos do sistema.',
        'personalizar vista': 'Pode reorganizar os widgets arrastando-os para diferentes posições.',
      },
    },

    users: {
      name: 'Gestão de Utilizadores',
      description: 'Administração completa de utilizadores do sistema',
      features: [
        'Criar, editar e eliminar utilizadores',
        'Atribuir funções e permissões',
        'Gerir grupos de utilizadores',
        'Ver histórico de atividade',
        'Ativar/desativar contas',
        'Redefinir palavras-passe',
      ],
      howTo: {
        'criar utilizador': 'Vá para a secção de Utilizadores e clique no botão "Novo Utilizador". Preencha o formulário com os dados necessários (nome, email, função) e guarde.',
        'editar utilizador': 'Na lista de utilizadores, clique no ícone de editar junto ao utilizador que deseja modificar. Faça as alterações necessárias e guarde.',
        'atribuir função': 'Ao criar ou editar um utilizador, selecione a função apropriada no menu pendente. As funções determinam as permissões do utilizador.',
        'desativar utilizador': 'Na vista de detalhes do utilizador, use o botão de estado para ativar ou desativar a conta.',
      },
    },

    groups: {
      name: 'Grupos',
      description: 'Organização de utilizadores em grupos para melhor gestão',
      features: [
        'Criar grupos personalizados',
        'Atribuir utilizadores a grupos',
        'Definir permissões por grupo',
        'Ver membros do grupo',
        'Gerir hierarquias',
      ],
      howTo: {
        'criar grupo': 'Vá a Grupos > Novo Grupo. Atribua um nome descritivo e selecione as permissões base do grupo.',
        'adicionar utilizadores': 'Na edição do grupo, use o seletor múltiplo para adicionar utilizadores ao grupo.',
        'definir permissões': 'As permissões do grupo podem ser configuradas no separador de permissões dentro da edição do grupo.',
      },
    },

    categories: {
      name: 'Categorias',
      description: 'Sistema de classificação e organização',
      features: [
        'Criar categorias hierárquicas',
        'Atribuir cores e ícones',
        'Organizar recursos',
        'Filtrar por categoria',
      ],
      howTo: {
        'criar categoria': 'Vá a Categorias > Nova Categoria. Defina o nome, cor e ícone representativo.',
        'organizar hierarquia': 'Pode criar subcategorias selecionando uma categoria pai ao criar uma nova.',
      },
    },

    roles: {
      name: 'Funções e Permissões',
      description: 'Controlo granular de acessos e permissões',
      features: [
        'Criar funções personalizadas',
        'Atribuir permissões específicas',
        'Controlo de acesso por módulo',
        'Permissões de leitura/escrita/eliminação',
        'Funções predefinidas do sistema',
      ],
      howTo: {
        'criar função': 'Vá a Funções > Nova Função. Defina o nome e selecione as permissões específicas que esta função terá.',
        'atribuir permissões': 'Apenas utilizadores dos grupos Webmaster e Administradores, ou aqueles com permissão específica de gestão de permissões, podem atribuir permissões. Na criação/edição da função, marque as caixas das permissões que deseja conceder.',
        'dar permissões': 'As permissões só podem ser concedidas por membros dos grupos Webmaster e Administradores, ou por utilizadores com permissão específica de gestão de permissões.',
        'quem pode dar permissões': 'Apenas os grupos Webmaster e Administradores, ou utilizadores com permissão específica de gestão de permissões, podem conceder permissões a outros utilizadores.',
        'funções predefinidas': 'O sistema inclui funções como Super Admin, Admin, Manager e Utilizador com permissões pré-configuradas.',
      },
    },

    profile: {
      name: 'Perfil de Utilizador',
      description: 'Gestão de informações pessoais e preferências',
      features: [
        'Atualizar dados pessoais',
        'Alterar palavra-passe',
        'Carregar foto de perfil',
        'Configurar preferências',
        'Ver histórico de sessões',
      ],
      howTo: {
        'alterar palavra-passe': 'Vá a Perfil > Segurança > Alterar Palavra-passe. Insira a sua palavra-passe atual e a nova.',
        'atualizar foto': 'No seu perfil, clique na imagem atual e selecione uma nova foto do seu dispositivo.',
        'configurar idioma': 'Use o seletor de idioma na barra superior para alterar o idioma da interface.',
      },
    },

    settings: {
      name: 'Definições',
      description: 'Definições gerais do sistema',
      features: [
        'Configurar preferências de idioma',
        'Selecionar tema visual',
        'Configurar notificações',
        'Ajustar fuso horário',
        'Personalizar interface',
      ],
      howTo: {
        'alterar tema': 'Vá a Definições > Aparência e selecione o tema preferido da galeria disponível.',
        'configurar notificações': 'Em Definições > Notificações, ative ou desative os tipos de notificações que deseja receber.',
      },
    },
  },

  faq: {
    'como navego no sistema?': 'Use o menu lateral esquerdo para aceder aos diferentes módulos. Pode recolher o menu clicando no ícone hamburger para ter mais espaço.',
    'como pesquiso informação?': 'Use a barra de pesquisa no topo. Pode pesquisar utilizadores, grupos, categorias e mais escrevendo palavras-chave.',
    'como altero a minha palavra-passe?': 'Vá ao seu Perfil (ícone de utilizador no canto superior direito) > Segurança > Alterar Palavra-passe.',
    'o que são funções?': 'As funções definem o que um utilizador pode fazer no sistema. Por exemplo, um Admin pode gerir utilizadores, enquanto um Utilizador normal só pode ver informações.',
    'como atribuo permissões?': 'As permissões são atribuídas através de funções. Apenas utilizadores dos grupos Webmaster e Administradores, ou aqueles com permissão específica de gestão de permissões, podem atribuí-las. Vá a Funções, edite a função desejada e marque as permissões que quer conceder.',
    'quem pode dar permissões?': 'Apenas membros dos grupos Webmaster e Administradores, ou utilizadores com permissão específica de gestão de permissões, podem conceder permissões a outros utilizadores.',
    'posso personalizar a interface?': 'Sim, pode alterar o tema, idioma e personalizar alguns widgets do painel conforme as suas preferências.',
    'como vejo as notificações?': 'Clique no ícone de sino na barra superior para ver as suas notificações recentes.',
    'que idiomas estão disponíveis?': 'O sistema está disponível em 10 idiomas: Espanhol, Inglês, Francês, Alemão, Italiano, Português, Chinês, Japonês, Árabe e Russo.',
    'como filtro a informação?': 'A maioria das tabelas tem filtros no topo. Pode filtrar por data, estado, categoria e mais.',
    'como exporto dados?': 'Procure o botão de exportar (ícone de download) nas tabelas. Pode exportar para Excel, PDF ou CSV.',
  },

  keywords: {
    crear: ['criar', 'adicionar', 'novo', 'nova', 'inserir'],
    editar: ['editar', 'modificar', 'atualizar', 'alterar'],
    eliminar: ['eliminar', 'apagar', 'remover'],
    ver: ['ver', 'mostrar', 'visualizar', 'listar'],
    buscar: ['pesquisar', 'procurar', 'encontrar', 'localizar'],
    filtrar: ['filtrar', 'ordenar'],
    exportar: ['exportar', 'descarregar', 'guardar'],
    usuario: ['utilizador', 'utilizadores', 'conta', 'contas'],
    grupo: ['grupo', 'grupos', 'equipa', 'equipas'],
    rol: ['função', 'funções', 'permissão', 'permissões', 'acesso'],
    categoría: ['categoria', 'categorias', 'tipo', 'tipos'],
    contraseña: ['palavra-passe', 'senha', 'pass'],
    perfil: ['perfil', 'conta', 'definições'],
    configuración: ['definições', 'configuração', 'config', 'preferências', 'opções'],
    notificación: ['notificação', 'notificações', 'alerta', 'alertas', 'aviso'],
    tema: ['tema', 'aparência', 'estilo', 'skin'],
    idioma: ['idioma', 'língua', 'linguagem'],
    permiso: ['permissão', 'permissões', 'autorizar', 'autorização', 'dar permissões', 'conceder permissões', 'gerir permissões'],
  },

  actionPatterns: {
    crear: ['como criar', 'criar', 'adicionar', 'novo', 'nova', 'fazer', 'quero criar', 'preciso criar', 'criação'],
    editar: ['como editar', 'editar', 'modificar', 'atualizar', 'alterar', 'edição'],
    eliminar: ['como eliminar', 'eliminar', 'apagar', 'remover', 'eliminação'],
    asignar: ['como atribuir', 'atribuir', 'dar permissões', 'conceder', 'atribuição'],
    ver: ['como ver', 'ver', 'visualizar', 'mostrar', 'onde está', 'visualização'],
    cambiar: ['como alterar', 'alterar', 'modificar', 'mudar', 'alteração'],
    dar: ['como dar', 'dar', 'conceder', 'dar permissões', 'conceder permissões', 'quem pode dar', 'quem pode conceder'],
  },
};

// Chinese knowledge base
const knowledgeZH = {
  general: {
    name: 'ERP Enterprise',
    type: '海事企业管理系统',
    description: '用于管理船舶维修、用户、资源和业务运营的综合系统。',
    mainFeatures: ['用户和权限管理', '组和类别控制', '细粒度角色和权限系统', '实时指标仪表板', '通知系统', '多语言和主题', '上下文AI助手'],
  },
  modules: {
    dashboard: { name: '主仪表板', description: '系统概览，包含统计信息和快速访问', features: ['实时指标可视化', '可自定义小部件', '常用任务快速访问', '最近活动摘要', '图表可视化统计'], howTo: { '查看统计': '统计信息会自动显示在仪表板小部件中。您可以点击每个小部件上的刷新图标来更新数据。', '访问模块': '使用左侧菜单在不同系统模块之间导航。', '自定义视图': '您可以通过拖动小部件到不同位置来重新排列它们。' } },
    users: { name: '用户管理', description: '完整的系统用户管理', features: ['创建、编辑和删除用户', '分配角色和权限', '管理用户组', '查看活动历史', '激活/停用帐户', '重置密码'], howTo: { '创建用户': '转到用户部分，点击"新用户"按钮。填写所需数据（姓名、电子邮件、角色）并保存。', '编辑用户': '在用户列表中，点击要修改的用户旁边的编辑图标。进行必要的更改并保存。', '分配角色': '创建或编辑用户时，从下拉菜单中选择适当的角色。角色决定用户权限。', '停用用户': '在用户详细信息视图中，使用状态开关来激活或停用帐户。' } },
    groups: { name: '组', description: '将用户组织成组以便更好地管理', features: ['创建自定义组', '将用户分配到组', '定义组权限', '查看组成员', '管理层次结构'], howTo: { '创建组': '转到组 > 新组。分配描述性名称并选择组的基本权限。', '添加用户': '在组编辑中，使用多选器将用户添加到组。', '定义权限': '可以在组编辑中的权限选项卡中配置组权限。' } },
    categories: { name: '类别', description: '分类和组织系统', features: ['创建分层类别', '分配颜色和图标', '组织资源', '按类别筛选'], howTo: { '创建类别': '转到类别 > 新类别。定义名称、颜色和代表性图标。', '组织层次结构': '您可以通过在创建新类别时选择父类别来创建子类别。' } },
    roles: { name: '角色和权限', description: '细粒度访问和权限控制', features: ['创建自定义角色', '分配特定权限', '按模块访问控制', '读/写/删除权限', '预定义系统角色'], howTo: { '创建角色': '转到角色 > 新角色。定义名称并选择此角色将具有的特定权限。', '分配权限': '只有Webmaster和管理员组的用户，或拥有特定权限管理权限的用户才能分配权限。在角色创建/编辑中，勾选要授予的权限复选框。', '授予权限': '只有Webmaster和管理员组的成员，或拥有特定权限管理权限的用户才能授予权限。', '谁可以授予权限': '只有Webmaster和管理员组，或拥有特定权限管理权限的用户才能向其他用户授予权限。', '预定义角色': '系统包括超级管理员、管理员、经理和用户等预配置权限的角色。' } },
    profile: { name: '用户资料', description: '个人信息和偏好设置管理', features: ['更新个人数据', '更改密码', '上传个人资料照片', '配置偏好设置', '查看会话历史'], howTo: { '更改密码': '转到个人资料 > 安全 > 更改密码。输入当前密码和新密码。', '更新照片': '在您的个人资料中，点击当前图像并从设备中选择新照片。', '配置语言': '使用顶部栏的语言选择器来更改界面语言。' } },
    settings: { name: '设置', description: '系统常规设置', features: ['配置语言偏好', '选择视觉主题', '配置通知', '调整时区', '自定义界面'], howTo: { '更改主题': '转到设置 > 外观，从可用库中选择您喜欢的主题。', '配置通知': '在设置 > 通知中，启用或禁用您想接收的通知类型。' } },
  },
  faq: {
    '如何导航系统？': '使用左侧菜单访问不同的模块。您可以通过点击汉堡图标来折叠菜单以获得更多空间。',
    '如何搜索信息？': '使用顶部的搜索栏。您可以通过输入关键字来搜索用户、组、类别等。',
    '如何更改密码？': '转到您的个人资料（右上角用户图标） > 安全 > 更改密码。',
    '什么是角色？': '角色定义用户在系统中可以执行的操作。例如，管理员可以管理用户，而普通用户只能查看信息。',
    '如何分配权限？': '权限通过角色分配。只有Webmaster和管理员组的用户，或拥有特定权限管理权限的用户才能分配它们。转到角色，编辑所需角色并勾选要授予的权限。',
    '谁可以授予权限？': '只有Webmaster和管理员组的成员，或拥有特定权限管理权限的用户才能向其他用户授予权限。',
    '我可以自定义界面吗？': '是的，您可以根据自己的偏好更改主题、语言和自定义某些仪表板小部件。',
    '如何查看通知？': '点击顶部栏中的铃铛图标查看最近的通知。',
    '有哪些语言可用？': '系统提供10种语言：西班牙语、英语、法语、德语、意大利语、葡萄牙语、中文、日语、阿拉伯语和俄语。',
    '如何筛选信息？': '大多数表格顶部都有筛选器。您可以按日期、状态、类别等进行筛选。',
    '如何导出数据？': '在表格中查找导出按钮（下载图标）。您可以导出为Excel、PDF或CSV。',
  },
  keywords: {
    crear: ['创建', '添加', '新建', '插入'],
    editar: ['编辑', '修改', '更新', '更改'],
    eliminar: ['删除', '移除', '清除'],
    ver: ['查看', '显示', '列表'],
    buscar: ['搜索', '查找', '定位'],
    filtrar: ['筛选', '排序'],
    exportar: ['导出', '下载', '保存'],
    usuario: ['用户', '帐户'],
    grupo: ['组', '团队'],
    rol: ['角色', '权限', '访问'],
    categoría: ['类别', '类型'],
    contraseña: ['密码', '口令'],
    perfil: ['资料', '帐户', '设置'],
    configuración: ['设置', '配置', '偏好', '选项'],
    notificación: ['通知', '提醒', '警报'],
    tema: ['主题', '外观', '样式'],
    idioma: ['语言', '语言环境'],
    permiso: ['权限', '授权', '授予权限', '管理权限'],
  },
  actionPatterns: {
    crear: ['如何创建', '创建', '添加', '新建', '我想创建', '我需要创建'],
    editar: ['如何编辑', '编辑', '修改', '更新', '更改'],
    eliminar: ['如何删除', '删除', '移除', '清除'],
    asignar: ['如何分配', '分配', '授予权限', '授予'],
    ver: ['如何查看', '查看', '显示', '在哪里'],
    cambiar: ['如何更改', '更改', '修改', '改变'],
    dar: ['如何授予', '授予', '给予', '授予权限', '谁可以授予'],
  },
};

// Japanese knowledge base
const knowledgeJA = {
  general: {
    name: 'ERP Enterprise',
    type: '海事企業管理システム',
    description: '船舶修理、ユーザー、リソース、業務運営を管理するための総合システム。',
    mainFeatures: ['ユーザーと権限管理', 'グループとカテゴリの制御', '詳細な役割と権限システム', 'リアルタイムメトリクスダッシュボード', '通知システム', '多言語とテーマ', 'コンテキストAIアシスタント'],
  },
  modules: {
    dashboard: { name: 'メインダッシュボード', description: '統計情報とクイックアクセスを含むシステム概要', features: ['リアルタイムメトリクスの可視化', 'カスタマイズ可能なウィジェット', '一般的なタスクへのクイックアクセス', '最近のアクティビティ概要', 'グラフ付き視覚的統計'], howTo: { '統計を表示': '統計はダッシュボードウィジェットに自動的に表示されます。各ウィジェットの更新アイコンをクリックしてデータを更新できます。', 'モジュールにアクセス': '左側のメニューを使用して、異なるシステムモジュール間を移動します。', 'ビューをカスタマイズ': 'ウィジェットを別の位置にドラッグして再配置できます。' } },
    users: { name: 'ユーザー管理', description: 'システムユーザーの完全な管理', features: ['ユーザーの作成、編集、削除', '役割と権限の割り当て', 'ユーザーグループの管理', 'アクティビティ履歴の表示', 'アカウントの有効化/無効化', 'パスワードのリセット'], howTo: { 'ユーザーを作成': 'ユーザーセクションに移動し、「新規ユーザー」ボタンをクリックします。必要なデータ（名前、メール、役割）を入力して保存します。', 'ユーザーを編集': 'ユーザーリストで、変更したいユーザーの横にある編集アイコンをクリックします。必要な変更を行って保存します。', '役割を割り当て': 'ユーザーの作成または編集時に、ドロップダウンメニューから適切な役割を選択します。役割はユーザーの権限を決定します。', 'ユーザーを無効化': 'ユーザー詳細ビューで、ステータススイッチを使用してアカウントを有効化または無効化します。' } },
    groups: { name: 'グループ', description: 'より良い管理のためにユーザーをグループに編成', features: ['カスタムグループの作成', 'グループへのユーザー割り当て', 'グループ権限の定義', 'グループメンバーの表示', '階層の管理'], howTo: { 'グループを作成': 'グループ > 新規グループに移動します。説明的な名前を割り当て、グループの基本権限を選択します。', 'ユーザーを追加': 'グループ編集で、マルチセレクトを使用してグループにユーザーを追加します。', '権限を定義': 'グループの権限は、グループ編集内の権限タブで設定できます。' } },
    categories: { name: 'カテゴリ', description: '分類と整理システム', features: ['階層カテゴリの作成', '色とアイコンの割り当て', 'リソースの整理', 'カテゴリによるフィルタリング'], howTo: { 'カテゴリを作成': 'カテゴリ > 新規カテゴリに移動します。名前、色、代表的なアイコンを定義します。', '階層を整理': '新しいカテゴリを作成するときに親カテゴリを選択することで、サブカテゴリを作成できます。' } },
    roles: { name: '役割と権限', description: '詳細なアクセスと権限制御', features: ['カスタム役割の作成', '特定の権限の割り当て', 'モジュールレベルのアクセス制御', '読み取り/書き込み/削除権限', '事前定義されたシステム役割'], howTo: { '役割を作成': '役割 > 新規役割に移動します。名前を定義し、この役割が持つ特定の権限を選択します。', '権限を割り当て': 'WebmasterおよびAdministratorsグループのユーザー、または特定の権限管理権限を持つユーザーのみが権限を割り当てることができます。役割の作成/編集で、付与したい権限のチェックボックスをオンにします。', '権限を与える': '権限は、WebmasterおよびAdministratorsグループのメンバー、または特定の権限管理権限を持つユーザーのみが付与できます。', '誰が権限を与えられるか': 'WebmasterおよびAdministratorsグループ、または特定の権限管理権限を持つユーザーのみが、他のユーザーに権限を付与できます。', '事前定義された役割': 'システムには、Super Admin、Admin、Manager、Userなどの事前設定された権限を持つ役割が含まれています。' } },
    profile: { name: 'ユーザープロフィール', description: '個人情報と設定の管理', features: ['個人データの更新', 'パスワードの変更', 'プロフィール写真のアップロード', '設定の構成', 'セッション履歴の表示'], howTo: { 'パスワードを変更': 'プロフィール > セキュリティ > パスワード変更に移動します。現在のパスワードと新しいパスワードを入力します。', '写真を更新': 'プロフィールで、現在の画像をクリックして、デバイスから新しい写真を選択します。', '言語を設定': '上部バーの言語セレクターを使用して、インターフェース言語を変更します。' } },
    settings: { name: '設定', description: 'システムの一般設定', features: ['言語設定の構成', 'ビジュアルテーマの選択', '通知の設定', 'タイムゾーンの調整', 'インターフェースのカスタマイズ'], howTo: { 'テーマを変更': '設定 > 外観に移動し、利用可能なギャラリーから好みのテーマを選択します。', '通知を設定': '設定 > 通知で、受信したい通知の種類を有効または無効にします。' } },
  },
  faq: {
    'システムをナビゲートするには？': '左側のメニューを使用して、異なるモジュールにアクセスします。ハンバーガーアイコンをクリックしてメニューを折りたたむと、より多くのスペースを確保できます。',
    '情報を検索するには？': '上部の検索バーを使用します。キーワードを入力して、ユーザー、グループ、カテゴリなどを検索できます。',
    'パスワードを変更するには？': 'プロフィール（右上のユーザーアイコン） > セキュリティ > パスワード変更に移動します。',
    '役割とは何ですか？': '役割は、ユーザーがシステムで何ができるかを定義します。例えば、管理者はユーザーを管理できますが、通常のユーザーは情報を表示することしかできません。',
    '権限を割り当てるには？': '権限は役割を通じて割り当てられます。WebmasterおよびAdministratorsグループのユーザー、または特定の権限管理権限を持つユーザーのみが割り当てることができます。役割に移動し、目的の役割を編集して、付与したい権限をチェックします。',
    '誰が権限を与えられますか？': 'WebmasterおよびAdministratorsグループのメンバー、または特定の権限管理権限を持つユーザーのみが、他のユーザーに権限を付与できます。',
    'インターフェースをカスタマイズできますか？': 'はい、好みに応じてテーマ、言語を変更し、一部のダッシュボードウィジェットをカスタマイズできます。',
    '通知を表示するには？': '上部バーのベルアイコンをクリックして、最近の通知を表示します。',
    'どの言語が利用可能ですか？': 'システムは10言語で利用可能です：スペイン語、英語、フランス語、ドイツ語、イタリア語、ポルトガル語、中国語、日本語、アラビア語、ロシア語。',
    '情報をフィルタリングするには？': 'ほとんどのテーブルには上部にフィルターがあります。日付、ステータス、カテゴリなどでフィルタリングできます。',
    'データをエクスポートするには？': 'テーブルでエクスポートボタン（ダウンロードアイコン）を探します。Excel、PDF、またはCSVにエクスポートできます。',
  },
  keywords: {
    crear: ['作成', '追加', '新規', '挿入'],
    editar: ['編集', '変更', '更新', '修正'],
    eliminar: ['削除', '除去', 'クリア'],
    ver: ['表示', '見る', 'リスト'],
    buscar: ['検索', '探す', '見つける'],
    filtrar: ['フィルター', 'ソート'],
    exportar: ['エクスポート', 'ダウンロード', '保存'],
    usuario: ['ユーザー', 'アカウント'],
    grupo: ['グループ', 'チーム'],
    rol: ['役割', '権限', 'アクセス'],
    categoría: ['カテゴリ', 'タイプ'],
    contraseña: ['パスワード', 'パス'],
    perfil: ['プロフィール', 'アカウント', '設定'],
    configuración: ['設定', '構成', '設定', 'オプション'],
    notificación: ['通知', 'アラート', '警告'],
    tema: ['テーマ', '外観', 'スタイル'],
    idioma: ['言語', 'ロケール'],
    permiso: ['権限', '承認', '権限を与える', '権限を管理'],
  },
  actionPatterns: {
    crear: ['作成する方法', '作成', '追加', '新規', '作成したい', '作成する必要がある'],
    editar: ['編集する方法', '編集', '変更', '更新', '修正'],
    eliminar: ['削除する方法', '削除', '除去', 'クリア'],
    asignar: ['割り当てる方法', '割り当て', '権限を与える', '付与'],
    ver: ['表示する方法', '表示', '見る', 'どこ'],
    cambiar: ['変更する方法', '変更', '修正', '変える'],
    dar: ['与える方法', '与える', '付与', '権限を与える', '誰が与えられる'],
  },
};

// Arabic knowledge base
const knowledgeAR = {
  general: {
    name: 'ERP Enterprise',
    type: 'نظام إدارة الأعمال البحرية',
    description: 'نظام شامل لإدارة إصلاحات السفن والمستخدمين والموارد والعمليات التجارية.',
    mainFeatures: ['إدارة المستخدمين والأذونات', 'التحكم في المجموعات والفئات', 'نظام أدوار وأذونات دقيق', 'لوحة معلومات بمقاييس فورية', 'نظام الإشعارات', 'لغات وثيمات متعددة', 'مساعد ذكاء اصطناعي سياقي'],
  },
  modules: {
    dashboard: { name: 'لوحة التحكم الرئيسية', description: 'نظرة عامة على النظام مع إحصائيات ووصول سريع', features: ['تصور المقاييس الفورية', 'أدوات قابلة للتخصيص', 'وصول سريع للمهام الشائعة', 'ملخص النشاط الحديث', 'إحصائيات مرئية مع رسوم بيانية'], howTo: { 'عرض الإحصائيات': 'تعرض الإحصائيات تلقائيًا في أدوات لوحة التحكم. يمكنك تحديث البيانات بالنقر على أيقونة التحديث في كل أداة.', 'الوصول إلى الوحدات': 'استخدم القائمة الجانبية اليسرى للتنقل بين وحدات النظام المختلفة.', 'تخصيص العرض': 'يمكنك إعادة ترتيب الأدوات عن طريق سحبها إلى مواضع مختلفة.' } },
    users: { name: 'إدارة المستخدمين', description: 'إدارة كاملة لمستخدمي النظام', features: ['إنشاء وتحرير وحذف المستخدمين', 'تعيين الأدوار والأذونات', 'إدارة مجموعات المستخدمين', 'عرض سجل النشاط', 'تفعيل/إلغاء تفعيل الحسابات', 'إعادة تعيين كلمات المرور'], howTo: { 'إنشاء مستخدم': 'انتقل إلى قسم المستخدمين وانقر على زر "مستخدم جديد". املأ النموذج بالبيانات المطلوبة (الاسم، البريد الإلكتروني، الدور) واحفظ.', 'تحرير مستخدم': 'في قائمة المستخدمين، انقر على أيقونة التحرير بجوار المستخدم الذي تريد تعديله. قم بإجراء التغييرات اللازمة واحفظ.', 'تعيين دور': 'عند إنشاء أو تحرير مستخدم، حدد الدور المناسب من القائمة المنسدلة. تحدد الأدوار أذونات المستخدم.', 'إلغاء تفعيل مستخدم': 'في عرض تفاصيل المستخدم، استخدم مفتاح الحالة لتفعيل أو إلغاء تفعيل الحساب.' } },
    groups: { name: 'المجموعات', description: 'تنظيم المستخدمين في مجموعات لإدارة أفضل', features: ['إنشاء مجموعات مخصصة', 'تعيين المستخدمين للمجموعات', 'تحديد أذونات المجموعة', 'عرض أعضاء المجموعة', 'إدارة التسلسلات الهرمية'], howTo: { 'إنشاء مجموعة': 'انتقل إلى المجموعات > مجموعة جديدة. قم بتعيين اسم وصفي واختر الأذونات الأساسية للمجموعة.', 'إضافة مستخدمين': 'في تحرير المجموعة، استخدم محدد متعدد لإضافة مستخدمين إلى المجموعة.', 'تحديد الأذونات': 'يمكن تكوين أذونات المجموعة في علامة التبويب الأذونات داخل تحرير المجموعة.' } },
    categories: { name: 'الفئات', description: 'نظام التصنيف والتنظيم', features: ['إنشاء فئات هرمية', 'تعيين الألوان والأيقونات', 'تنظيم الموارد', 'التصفية حسب الفئة'], howTo: { 'إنشاء فئة': 'انتقل إلى الفئات > فئة جديدة. حدد الاسم واللون والأيقونة التمثيلية.', 'تنظيم التسلسل الهرمي': 'يمكنك إنشاء فئات فرعية عن طريق تحديد فئة أصل عند إنشاء فئة جديدة.' } },
    roles: { name: 'الأدوار والأذونات', description: 'تحكم دقيق في الوصول والأذونات', features: ['إنشاء أدوار مخصصة', 'تعيين أذونات محددة', 'التحكم في الوصول على مستوى الوحدة', 'أذونات القراءة/الكتابة/الحذف', 'أدوار النظام المحددة مسبقًا'], howTo: { 'إنشاء دور': 'انتقل إلى الأدوار > دور جديد. حدد الاسم واختر الأذونات المحددة التي سيمتلكها هذا الدور.', 'تعيين الأذونات': 'فقط المستخدمون في مجموعات Webmaster و Administrators، أو أولئك الذين لديهم إذن إدارة أذونات محدد، يمكنهم تعيين الأذونات. في إنشاء/تحرير الدور، حدد مربعات الأذونات التي تريد منحها.', 'منح الأذونات': 'يمكن منح الأذونات فقط من قبل أعضاء مجموعات Webmaster و Administrators، أو المستخدمين الذين لديهم إذن إدارة أذونات محدد.', 'من يمكنه منح الأذونات': 'فقط مجموعات Webmaster و Administrators، أو المستخدمون الذين لديهم إذن إدارة أذونات محدد، يمكنهم منح أذونات لمستخدمين آخرين.', 'الأدوار المحددة مسبقًا': 'يتضمن النظام أدوارًا مثل Super Admin و Admin و Manager و User مع أذونات معدة مسبقًا.' } },
    profile: { name: 'ملف المستخدم', description: 'إدارة المعلومات الشخصية والتفضيلات', features: ['تحديث البيانات الشخصية', 'تغيير كلمة المرور', 'تحميل صورة الملف الشخصي', 'تكوين التفضيلات', 'عرض سجل الجلسات'], howTo: { 'تغيير كلمة المرور': 'انتقل إلى الملف الشخصي > الأمان > تغيير كلمة المرور. أدخل كلمة مرورك الحالية والجديدة.', 'تحديث الصورة': 'في ملفك الشخصي، انقر على الصورة الحالية واختر صورة جديدة من جهازك.', 'تكوين اللغة': 'استخدم محدد اللغة في الشريط العلوي لتغيير لغة الواجهة.' } },
    settings: { name: 'الإعدادات', description: 'الإعدادات العامة للنظام', features: ['تكوين تفضيلات اللغة', 'اختيار الثيم المرئي', 'تكوين الإشعارات', 'ضبط المنطقة الزمنية', 'تخصيص الواجهة'], howTo: { 'تغيير الثيم': 'انتقل إلى الإعدادات > المظهر واختر الثيم المفضل من المعرض المتاح.', 'تكوين الإشعارات': 'في الإعدادات > الإشعارات، قم بتفعيل أو إلغاء تفعيل أنواع الإشعارات التي تريد تلقيها.' } },
  },
  faq: {
    'كيف أتنقل في النظام؟': 'استخدم القائمة الجانبية اليسرى للوصول إلى الوحدات المختلفة. يمكنك طي القائمة بالنقر على أيقونة الهامبرغر للحصول على مساحة أكبر.',
    'كيف أبحث عن المعلومات؟': 'استخدم شريط البحث في الأعلى. يمكنك البحث عن المستخدمين والمجموعات والفئات والمزيد عن طريق كتابة الكلمات الرئيسية.',
    'كيف أغير كلمة المرور؟': 'انتقل إلى ملفك الشخصي (أيقونة المستخدم في الأعلى اليمين) > الأمان > تغيير كلمة المرور.',
    'ما هي الأدوار؟': 'تحدد الأدوار ما يمكن للمستخدم القيام به في النظام. على سبيل المثال، يمكن للمسؤول إدارة المستخدمين، بينما يمكن للمستخدم العادي فقط عرض المعلومات.',
    'كيف أعين الأذونات؟': 'يتم تعيين الأذونات من خلال الأدوار. فقط المستخدمون في مجموعات Webmaster و Administrators، أو أولئك الذين لديهم إذن إدارة أذونات محدد، يمكنهم تعيينها. انتقل إلى الأدوار، حرر الدور المطلوب وحدد الأذونات التي تريد منحها.',
    'من يمكنه منح الأذونات؟': 'فقط أعضاء مجموعات Webmaster و Administrators، أو المستخدمون الذين لديهم إذن إدارة أذونات محدد، يمكنهم منح أذونات لمستخدمين آخرين.',
    'هل يمكنني تخصيص الواجهة؟': 'نعم، يمكنك تغيير الثيم واللغة وتخصيص بعض أدوات لوحة التحكم حسب تفضيلاتك.',
    'كيف أعرض الإشعارات؟': 'انقر على أيقونة الجرس في الشريط العلوي لرؤية إشعاراتك الحديثة.',
    'ما هي اللغات المتاحة؟': 'النظام متاح بـ 10 لغات: الإسبانية، الإنجليزية، الفرنسية، الألمانية، الإيطالية، البرتغالية، الصينية، اليابانية، العربية، الروسية.',
    'كيف أصفي المعلومات؟': 'معظم الجداول لديها فلاتر في الأعلى. يمكنك التصفية حسب التاريخ والحالة والفئة والمزيد.',
    'كيف أصدر البيانات؟': 'ابحث عن زر التصدير (أيقونة التنزيل) في الجداول. يمكنك التصدير إلى Excel أو PDF أو CSV.',
  },
  keywords: {
    crear: ['إنشاء', 'إضافة', 'جديد', 'إدراج'],
    editar: ['تحرير', 'تعديل', 'تحديث', 'تغيير'],
    eliminar: ['حذف', 'إزالة', 'مسح'],
    ver: ['عرض', 'إظهار', 'قائمة'],
    buscar: ['بحث', 'إيجاد', 'تحديد موقع'],
    filtrar: ['تصفية', 'فرز'],
    exportar: ['تصدير', 'تنزيل', 'حفظ'],
    usuario: ['مستخدم', 'حساب'],
    grupo: ['مجموعة', 'فريق'],
    rol: ['دور', 'إذن', 'وصول'],
    categoría: ['فئة', 'نوع'],
    contraseña: ['كلمة مرور', 'كلمة السر'],
    perfil: ['ملف', 'حساب', 'إعدادات'],
    configuración: ['إعدادات', 'تكوين', 'تفضيلات', 'خيارات'],
    notificación: ['إشعار', 'تنبيه', 'تحذير'],
    tema: ['ثيم', 'مظهر', 'نمط'],
    idioma: ['لغة', 'لهجة'],
    permiso: ['إذن', 'تفويض', 'منح أذونات', 'إدارة أذونات'],
  },
  actionPatterns: {
    crear: ['كيف أنشئ', 'إنشاء', 'إضافة', 'جديد', 'أريد إنشاء', 'أحتاج إنشاء'],
    editar: ['كيف أحرر', 'تحرير', 'تعديل', 'تحديث', 'تغيير'],
    eliminar: ['كيف أحذف', 'حذف', 'إزالة', 'مسح'],
    asignar: ['كيف أعين', 'تعيين', 'منح أذونات', 'منح'],
    ver: ['كيف أعرض', 'عرض', 'إظهار', 'أين'],
    cambiar: ['كيف أغير', 'تغيير', 'تعديل', 'تبديل'],
    dar: ['كيف أمنح', 'منح', 'إعطاء', 'منح أذونات', 'من يمكنه منح'],
  },
};

// Russian knowledge base
const knowledgeRU = {
  general: {
    name: 'ERP Enterprise',
    type: 'Система управления морским бизнесом',
    description: 'Комплексная система для управления ремонтом судов, пользователями, ресурсами и бизнес-операциями.',
    mainFeatures: ['Управление пользователями и разрешениями', 'Контроль групп и категорий', 'Детализированная система ролей и разрешений', 'Панель управления с метриками в реальном времени', 'Система уведомлений', 'Множество языков и тем', 'Контекстный AI-ассистент'],
  },
  modules: {
    dashboard: { name: 'Главная панель', description: 'Обзор системы со статистикой и быстрым доступом', features: ['Визуализация метрик в реальном времени', 'Настраиваемые виджеты', 'Быстрый доступ к общим задачам', 'Сводка недавней активности', 'Визуальная статистика с графиками'], howTo: { 'просмотреть статистику': 'Статистика автоматически отображается в виджетах панели управления. Вы можете обновить данные, нажав на значок обновления в каждом виджете.', 'получить доступ к модулям': 'Используйте боковое меню слева для навигации между различными модулями системы.', 'настроить вид': 'Вы можете переставлять виджеты, перетаскивая их в разные позиции.' } },
    users: { name: 'Управление пользователями', description: 'Полное администрирование системных пользователей', features: ['Создавать, редактировать и удалять пользователей', 'Назначать роли и разрешения', 'Управлять группами пользователей', 'Просматривать историю активности', 'Активировать/деактивировать учетные записи', 'Сбрасывать пароли'], howTo: { 'создать пользователя': 'Перейдите в раздел "Пользователи" и нажмите кнопку "Новый пользователь". Заполните форму необходимыми данными (имя, email, роль) и сохраните.', 'редактировать пользователя': 'В списке пользователей щелкните значок редактирования рядом с пользователем, которого хотите изменить. Внесите необходимые изменения и сохраните.', 'назначить роль': 'При создании или редактировании пользователя выберите соответствующую роль из выпадающего меню. Роли определяют разрешения пользователя.', 'деактивировать пользователя': 'В представлении сведений о пользователе используйте переключатель состояния для активации или деактивации учетной записи.' } },
    groups: { name: 'Группы', description: 'Организация пользователей в группы для лучшего управления', features: ['Создавать пользовательские группы', 'Назначать пользователей в группы', 'Определять разрешения группы', 'Просматривать членов группы', 'Управлять иерархиями'], howTo: { 'создать группу': 'Перейдите в Группы > Новая группа. Присвойте описательное имя и выберите базовые разрешения группы.', 'добавить пользователей': 'В редактировании группы используйте множественный выбор для добавления пользователей в группу.', 'определить разрешения': 'Разрешения группы могут быть настроены на вкладке разрешений в редактировании группы.' } },
    categories: { name: 'Категории', description: 'Система классификации и организации', features: ['Создавать иерархические категории', 'Назначать цвета и значки', 'Организовывать ресурсы', 'Фильтровать по категориям'], howTo: { 'создать категорию': 'Перейдите в Категории > Новая категория. Определите имя, цвет и репрезентативный значок.', 'организовать иерархию': 'Вы можете создавать подкатегории, выбирая родительскую категорию при создании новой.' } },
    roles: { name: 'Роли и разрешения', description: 'Детальный контроль доступа и разрешений', features: ['Создавать пользовательские роли', 'Назначать конкретные разрешения', 'Контроль доступа на уровне модуля', 'Разрешения на чтение/запись/удаление', 'Предопределенные системные роли'], howTo: { 'создать роль': 'Перейдите в Роли > Новая роль. Определите имя и выберите конкретные разрешения, которые будет иметь эта роль.', 'назначить разрешения': 'Только пользователи групп Webmaster и Administrators или те, у кого есть конкретное разрешение на управление разрешениями, могут назначать разрешения. При создании/редактировании роли отметьте флажки разрешений, которые вы хотите предоставить.', 'предоставить разрешения': 'Разрешения могут быть предоставлены только членами групп Webmaster и Administrators или пользователями с конкретным разрешением на управление разрешениями.', 'кто может предоставлять разрешения': 'Только группы Webmaster и Administrators или пользователи с конкретным разрешением на управление разрешениями могут предоставлять разрешения другим пользователям.', 'предопределенные роли': 'Система включает роли, такие как Super Admin, Admin, Manager и User с предварительно настроенными разрешениями.' } },
    profile: { name: 'Профиль пользователя', description: 'Управление личной информацией и настройками', features: ['Обновлять личные данные', 'Изменять пароль', 'Загружать фото профиля', 'Настраивать предпочтения', 'Просматривать историю сеансов'], howTo: { 'изменить пароль': 'Перейдите в Профиль > Безопасность > Изменить пароль. Введите текущий пароль и новый.', 'обновить фото': 'В вашем профиле щелкните текущее изображение и выберите новое фото с вашего устройства.', 'настроить язык': 'Используйте селектор языка в верхней панели для изменения языка интерфейса.' } },
    settings: { name: 'Настройки', description: 'Общие настройки системы', features: ['Настраивать языковые предпочтения', 'Выбирать визуальную тему', 'Настраивать уведомления', 'Настраивать часовой пояс', 'Настраивать интерфейс'], howTo: { 'изменить тему': 'Перейдите в Настройки > Внешний вид и выберите предпочитаемую тему из доступной галереи.', 'настроить уведомления': 'В Настройки > Уведомления включите или отключите типы уведомлений, которые вы хотите получать.' } },
  },
  faq: {
    'как перемещаться по системе?': 'Используйте боковое меню слева для доступа к различным модулям. Вы можете свернуть меню, нажав на значок гамбургера для большего пространства.',
    'как искать информацию?': 'Используйте строку поиска вверху. Вы можете искать пользователей, группы, категории и многое другое, вводя ключевые слова.',
    'как изменить пароль?': 'Перейдите в ваш Профиль (значок пользователя вверху справа) > Безопасность > Изменить пароль.',
    'что такое роли?': 'Роли определяют, что пользователь может делать в системе. Например, Admin может управлять пользователями, в то время как обычный пользователь может только просматривать информацию.',
    'как назначить разрешения?': 'Разрешения назначаются через роли. Только пользователи групп Webmaster и Administrators или те, у кого есть конкретное разрешение на управление разрешениями, могут их назначать. Перейдите в Роли, отредактируйте желаемую роль и отметьте разрешения, которые вы хотите предоставить.',
    'кто может предоставлять разрешения?': 'Только члены групп Webmaster и Administrators или пользователи с конкретным разрешением на управление разрешениями могут предоставлять разрешения другим пользователям.',
    'могу ли я настроить интерфейс?': 'Да, вы можете изменить тему, язык и настроить некоторые виджеты панели управления в соответствии с вашими предпочтениями.',
    'как просмотреть уведомления?': 'Щелкните значок колокольчика в верхней панели, чтобы увидеть ваши недавние уведомления.',
    'какие языки доступны?': 'Система доступна на 10 языках: испанский, английский, французский, немецкий, итальянский, португальский, китайский, японский, арабский, русский.',
    'как фильтровать информацию?': 'Большинство таблиц имеют фильтры вверху. Вы можете фильтровать по дате, статусу, категории и многому другому.',
    'как экспортировать данные?': 'Ищите кнопку экспорта (значок загрузки) в таблицах. Вы можете экспортировать в Excel, PDF или CSV.',
  },
  keywords: {
    crear: ['создать', 'добавить', 'новый', 'вставить'],
    editar: ['редактировать', 'изменить', 'обновить', 'изменить'],
    eliminar: ['удалить', 'убрать', 'очистить'],
    ver: ['просмотреть', 'показать', 'отобразить', 'список'],
    buscar: ['искать', 'найти', 'найти', 'обнаружить'],
    filtrar: ['фильтровать', 'сортировать'],
    exportar: ['экспортировать', 'скачать', 'сохранить'],
    usuario: ['пользователь', 'учетная запись'],
    grupo: ['группа', 'команда'],
    rol: ['роль', 'разрешение', 'доступ'],
    categoría: ['категория', 'тип'],
    contraseña: ['пароль', 'пасс'],
    perfil: ['профиль', 'учетная запись', 'настройки'],
    configuración: ['настройки', 'конфигурация', 'предпочтения', 'опции'],
    notificación: ['уведомление', 'оповещение', 'предупреждение'],
    tema: ['тема', 'внешний вид', 'стиль'],
    idioma: ['язык', 'локаль'],
    permiso: ['разрешение', 'авторизация', 'предоставить разрешения', 'управлять разрешениями'],
  },
  actionPatterns: {
    crear: ['как создать', 'создать', 'добавить', 'новый', 'я хочу создать', 'мне нужно создать'],
    editar: ['как редактировать', 'редактировать', 'изменить', 'обновить', 'изменить'],
    eliminar: ['как удалить', 'удалить', 'убрать', 'очистить'],
    asignar: ['как назначить', 'назначить', 'предоставить разрешения', 'предоставить'],
    ver: ['как просмотреть', 'просмотреть', 'показать', 'где'],
    cambiar: ['как изменить', 'изменить', 'модифицировать', 'изменить'],
    dar: ['как предоставить', 'предоставить', 'дать', 'предоставить разрешения', 'кто может предоставить'],
  },
};

// Export system knowledge with language support
export const systemKnowledge = {
  es: knowledgeES,
  en: knowledgeEN,
  fr: knowledgeFR,
  de: knowledgeDE,
  it: knowledgeIT,
  pt: knowledgePT,
  zh: knowledgeZH,
  ja: knowledgeJA,
  ar: knowledgeAR,
  ru: knowledgeRU,
};

/**
 * Get knowledge base for specific language
 * Falls back to Spanish if language not available
 */
export function getKnowledgeForLanguage(locale = 'es') {
  return systemKnowledge[locale] || systemKnowledge.es;
}

/**
 * Normalize text for better matching (remove accents, lowercase)
 */
function normalizeText(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, ''); // Remove accents
}

/**
 * Check if query contains any of the keywords
 */
function containsAny(text, keywords) {
  const normalizedText = normalizeText(text);
  return keywords.some(keyword => normalizedText.includes(normalizeText(keyword)));
}

/**
 * Calculate relevance score for a match
 */
function calculateRelevance(query, target) {
  const normalizedQuery = normalizeText(query);
  const normalizedTarget = normalizeText(target);

  // Exact match
  if (normalizedQuery === normalizedTarget) return 100;

  // Contains full query
  if (normalizedTarget.includes(normalizedQuery)) return 80;

  // Query contains target
  if (normalizedQuery.includes(normalizedTarget)) return 70;

  // Count matching words
  const queryWords = normalizedQuery.split(/\s+/);
  const targetWords = normalizedTarget.split(/\s+/);
  const matches = queryWords.filter(word =>
    targetWords.some(targetWord =>
      targetWord.includes(word) || word.includes(targetWord)
    )
  ).length;

  return (matches / Math.max(queryWords.length, targetWords.length)) * 60;
}

/**
 * Detect intent and entities from query
 */
function detectIntent(query, locale = 'es') {
  const normalized = normalizeText(query);
  const knowledge = getKnowledgeForLanguage(locale);
  let action = null;
  let entity = null;

  // Detect action
  for (const [actionType, patterns] of Object.entries(knowledge.actionPatterns)) {
    if (containsAny(query, patterns)) {
      action = actionType;
      break;
    }
  }

  // Detect entity
  for (const [entityType, keywords] of Object.entries(knowledge.keywords)) {
    if (containsAny(query, keywords)) {
      entity = entityType;
      break;
    }
  }

  return { action, entity, normalized };
}

/**
 * Search knowledge base for relevant information
 */
export function searchKnowledge(query, currentModule = 'dashboard', locale = 'es') {
  const results = [];
  const knowledge = getKnowledgeForLanguage(locale);
  const intent = detectIntent(query, locale);

  console.log('🔍 Search query:', query);
  console.log('🌍 Language:', locale);
  console.log('📍 Current module:', currentModule);
  console.log('🎯 Intent detected:', intent);

  // If we have specific action + entity, search across ALL modules
  if (intent.action && intent.entity) {
    console.log('✅ Both action and entity detected, searching all modules...');

    // Search ALL modules (including current) with same logic
    for (const [moduleName, moduleData] of Object.entries(knowledge.modules)) {
      if (moduleData.howTo) {
        for (const [task, instruction] of Object.entries(moduleData.howTo)) {
          const taskContainsAction = containsAny(task, knowledge.actionPatterns[intent.action] || []);
          const taskContainsEntity = containsAny(task, knowledge.keywords[intent.entity] || []);

          // Both action AND entity must match for a strong result
          if (taskContainsAction && taskContainsEntity) {
            const baseRelevance = calculateRelevance(query, task);
            // Give extra boost if both match strongly
            const relevance = baseRelevance + 50;

            console.log(`  ✓ Found match in ${moduleName}: "${task}" (relevance: ${relevance})`);

            results.push({
              type: 'howto',
              task,
              instruction,
              module: moduleData.name,
              relevance,
              intentMatch: true,
            });
          }
        }
      }
    }
  }

  // Check FAQ with relevance scoring
  console.log('📚 Checking FAQ...');
  for (const [question, answer] of Object.entries(knowledge.faq)) {
    const relevance = calculateRelevance(query, question);
    if (relevance > 30) {
      console.log(`  ✓ FAQ match: "${question}" (relevance: ${relevance})`);
      results.push({
        type: 'faq',
        question,
        answer,
        relevance,
      });
    }
  }

  // Check current module how-to (if not already checked with intent)
  if (!intent.action || !intent.entity) {
    console.log('⚠️ No clear intent, checking current module broadly...');
    const module = knowledge.modules[currentModule];
    if (module && module.howTo) {
      for (const [task, instruction] of Object.entries(module.howTo)) {
        const relevance = calculateRelevance(query, task);
        if (relevance > 25) {
          console.log(`  ✓ Current module match: "${task}" (relevance: ${relevance})`);
          results.push({
            type: 'howto',
            task,
            instruction,
            module: module.name,
            relevance,
          });
        }
      }
    }
  }

  // Check if asking about features
  const featureKeywords = ['que puedo', 'funciones', 'caracteristicas', 'features', 'que hace', 'para que sirve'];
  if (containsAny(query, featureKeywords)) {
    const module = knowledge.modules[currentModule];
    if (module) {
      console.log('📋 Asking about features');
      results.push({
        type: 'features',
        module: module.name,
        features: module.features,
        relevance: 50,
      });
    }
  }

  // Check for module-specific questions across all modules
  console.log('🔎 Checking for module-specific questions...');
  for (const [moduleName, moduleData] of Object.entries(knowledge.modules)) {
    const moduleRelevance = Math.max(
      calculateRelevance(query, moduleName),
      calculateRelevance(query, moduleData.name)
    );

    if (moduleRelevance > 40) {
      console.log(`  ✓ Module match: ${moduleName} (relevance: ${moduleRelevance})`);
      results.push({
        type: 'module',
        module: moduleData.name,
        description: moduleData.description,
        features: moduleData.features,
        relevance: moduleRelevance,
      });
    }
  }

  // Sort by relevance and return best match
  if (results.length > 0) {
    results.sort((a, b) => b.relevance - a.relevance);
    console.log('🏆 Best match:', results[0]);
    console.log('📊 All results:', results.map(r => ({ type: r.type, relevance: r.relevance })));
    return results[0];
  }

  console.log('❌ No matches found');
  return null;
}

/**
 * Format knowledge response for display
 */
export function formatKnowledgeResponse(knowledgeResult) {
  if (!knowledgeResult) return null;

  switch (knowledgeResult.type) {
    case 'faq':
      return `**${knowledgeResult.question}**\n\n${knowledgeResult.answer}`;

    case 'features':
      return `**Funcionalidades de ${knowledgeResult.module}:**\n\n${knowledgeResult.features.map((f, i) => `${i + 1}. ${f}`).join('\n')}`;

    case 'howto':
      return `**Cómo ${knowledgeResult.task}:**\n\n${knowledgeResult.instruction}`;

    case 'module':
      return `**${knowledgeResult.module}**\n\n${knowledgeResult.description}\n\n**Funcionalidades principales:**\n${knowledgeResult.features.map((f, i) => `${i + 1}. ${f}`).join('\n')}`;

    default:
      return null;
  }
}
