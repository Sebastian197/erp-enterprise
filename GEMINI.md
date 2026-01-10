# GEMINI.md - Context & Instructions for Gemini Agents

## 1. Project Overview
**ERP Enterprise** is a modular, scalable ERP system built with a **Laravel 12** backend and a **Vue.js 3** frontend (SPA). It features a clean architecture (Repository-Service-Controller), strict RBAC (Role-Based Access Control), real-time capabilities via WebSockets (Reverb), and multi-language support.

**System Context:**
- **Operating System:** macOS (darwin)
- **Development Environment:** **Laravel Herd** (Nginx + PHP handled automatically).
- **Project Path:** `/Users/sebastianmorenosaavedra/Herd/erp-enterprise`

## 2. Tech Stack

### Backend
- **Framework:** Laravel 12.44.0
- **Language:** PHP 8.2+
- **Database:** MySQL 8.x
- **Authentication:** Laravel Sanctum (SPA Authentication)
- **Real-time:** Laravel Reverb (WebSockets)
- **Permissions:** Spatie Laravel Permission
- **Testing:** Pest PHP
- **Linting:** Laravel Pint

### Frontend
- **Framework:** Vue.js 3 (Composition API)
- **Build Tool:** Vite
- **State Management:** Pinia (with persistence)
- **Routing:** Vue Router
- **Styling:** Tailwind CSS
- **HTTP Client:** Axios
- **Internationalization:** Vue i18n
- **Animations:** Anime.js, VueUse Motion

## 3. Architecture & Patterns

### Backend: Repository-Service-Controller
The project strictly enforces a layered architecture:
1.  **Route** (`routes/api.php`)
2.  **Controller** (`app/Http/Controllers`): Handles HTTP request/response. Delegates logic to Service.
3.  **Service** (`app/Services`): Contains business logic. Orchestrates Repositories.
4.  **Repository** (`app/Repositories`): Abstracs database access. Extends `BaseRepository`.
5.  **Model** (`app/Models`): Eloquent models.

**Key Conventions:**
- **Policies:** All authorization checks use Policies (bypassed for Super Admin).
- **Requests:** Strict validation using Form Requests.
- **Responses:** Consistent JSON structure (`success`, `data`, `message`).

### Frontend: Modular SPA
1.  **Composables** (`resources/js/composables`): **MANDATORY** for all business logic, API calls, and state management. Components should be logic-free.
2.  **Stores** (`resources/js/stores`): Global state (Auth, Theme, Locale).
3.  **Components** (`resources/js/components`): Presentational units.
4.  **Pages** (`resources/js/pages`): Route views.

## 4. Operational Guidelines

### ⚠️ Critical Rules
1.  **NEVER run `php artisan serve`**. This project runs on **Laravel Herd**. The app is available at `http://erp-enterprise.test`.
2.  **TDD is Mandatory**. Write tests **BEFORE** implementing code.
    - Backend: `tests/Feature` (API endpoints) and `tests/Unit` (Services/Repositories).
    - Frontend: Unit tests for Composables (Note: Frontend testing setup currently appears incomplete in `package.json`, verify before running).
3.  **Use `composer dev`** to start development services (Reverb, Queue, Pail, Vite).
4.  **Consult Context7**: When using libraries, strictly follow the `CLAUDE.md` guideline to verify up-to-date usage via available documentation tools if needed.

### Key Commands
| Action | Command | Description |
| :--- | :--- | :--- |
| **Start Dev** | `composer dev` | Starts Reverb, Queue, Pail, and Vite. |
| **Frontend** | `npm run dev` | Starts Vite server (included in `composer dev`). |
| **Tests** | `php artisan test` | Runs Pest tests. |
| **Code Style** | `php artisan pint` | Fixes PHP code style. |
| **DB Setup** | `php artisan migrate:fresh --seed` | Resets DB and runs seeders. |
| **WebSockets** | `php artisan reverb:start` | Starts WebSocket server (included in `composer dev`). |

## 5. Directory Structure
```
/
├── app/
│   ├── Http/Controllers/  # Controllers
│   ├── Services/          # Business Logic
│   ├── Repositories/      # Data Access
│   ├── Models/            # Eloquent Models
│   └── Policies/          # Authorization Logic
├── resources/js/
│   ├── components/        # UI Components
│   ├── composables/       # Business Logic (Hooks)
│   ├── pages/             # Route Views
│   ├── stores/            # Pinia Stores
│   └── utils/             # Helpers
├── routes/
│   └── api.php            # Main API Routes
└── tests/
    ├── Feature/           # API Integration Tests
    └── Unit/              # Logic Unit Tests
```

## 6. Implementation Workflow (Agent Instructions)
1.  **Analyze**: Read `CLAUDE.md`, `README.md`, and related code files.
2.  **Plan**: Define the Architecture (Migration -> Model -> Repo -> Service -> Controller -> Route).
3.  **Test (TDD)**: Create the failing test case first.
4.  **Implement**: Write the code to pass the test, adhering to the Repository-Service pattern.
5.  **Verify**: Run `php artisan test` and `php artisan pint`.
