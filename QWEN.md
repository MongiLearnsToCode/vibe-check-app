# Vibe Check App - Project Context

This project is a web application called "Vibe Check" designed for couples to track their daily moods and gain insights into their relationship dynamics. It consists of a Laravel PHP backend and a React/TypeScript frontend.

## Project Structure

*   **Backend:** Laravel 12.x application located in the root directory (`/home/dlaminimongi/vibe-check-app`). Handles API endpoints, user authentication (Laravel Sanctum), database interactions, and business logic.
*   **Frontend:** React 19.x / TypeScript application located in the `/frontend` directory. Provides the user interface for signup, login, vibe submission, and dashboard viewing. It uses Vite as the build tool.
*   **Database:** The application uses a database (likely MySQL, PostgreSQL, or SQLite, configured in `.env`) with tables for `users`, `relationships`, `relationship_user` (pivot), and `vibes`.
*   **Authentication:** Laravel Sanctum is used for API authentication.

## Key Features (MVP)

Based on the `build-order.md`:

1.  **User Authentication:** Register, Login, Logout via Laravel Breeze and Sanctum.
2.  **Relationship Management:**
    *   Create a relationship (generates a unique code).
    *   Join a relationship using the code.
3.  **Vibe Tracking:**
    *   Submit a daily mood (1-5) and an optional note.
    *   View recent vibes (today and past 7 days) for the relationship.
4.  **Frontend Pages:** Signup, Login, Vibe Check, Dashboard.
5.  **PWA:** Implemented using `vite-plugin-pwa` for installability and offline capabilities.
6.  **Offline Sync:** Vibes submitted offline are stored locally and synced when online.

## Technologies Used

*   **Backend:**
    *   PHP 8.2+
    *   Laravel Framework 12.x
    *   Laravel Sanctum (Authentication)
    *   Laravel Breeze (Auth scaffolding)
*   **Frontend:**
    *   React 19.x
    *   TypeScript
    *   Vite
    *   Tailwind CSS
    *   Axios (HTTP client)
    *   Recharts (for dashboard charts)
    *   Headless UI / Heroicons (UI components)
    *   Radix UI (UI primitives)
    *   `vite-plugin-pwa` (PWA support)
*   **Database:** (Specific driver set in `.env`) Eloquent ORM is used.

## Development Setup

1.  **Backend Setup:**
    *   Install PHP dependencies: `composer install`
    *   Copy `.env.example` to `.env` and configure database and other settings.
    *   Generate application key: `php artisan key:generate`
    *   Run database migrations: `php artisan migrate`
    *   (Optional) Seed the database if seeders exist.
2.  **Frontend Setup (in `/frontend`):**
    *   Install Node.js dependencies: `npm install`
    *   Start the development server: `npm run dev` (This command also starts the Laravel backend dev server, queue listener, log tailer, and Vite dev server as defined in `composer.json`).
3.  **Combined Dev Command:**
    *   The root `composer.json` defines a `dev` script: `composer run dev`. This command uses `concurrently` to start the Laravel server (`php artisan serve`), queue listener, log tailer, and the Vite dev server (`npm run dev` in the `frontend` directory) simultaneously.

## Building and Running

*   **Backend:** Run `php artisan serve` or use a web server like Apache/Nginx configured to point to the `public` directory. Ensure `php artisan queue:listen` is running if background jobs are used.
*   **Frontend:** Run `npm run build` in the `/frontend` directory to create a production build. The output will be in the `dist` folder.
*   **Development:** Use `composer run dev` from the project root to start both backend and frontend development servers.

## Testing

*   **Backend:** PHPUnit is configured. Run tests using `php artisan test` or the `test` script defined in `composer.json` (`composer run test`).
*   **Frontend:** Testing setup is not explicitly defined in `package.json` scripts, but Jest or Vitest are common choices for Vite/React projects.

## Deployment

*   **Backend:** Deploy the Laravel application to a server that meets its requirements (PHP, database access, web server). Run `php artisan migrate` on the production database. Configure environment variables in the production `.env` file.
*   **Frontend:** Build the frontend using `npm run build` in `/frontend`. The resulting static files can be deployed to a CDN or served by the Laravel backend (e.g., by copying the `dist` contents to `public` and configuring routing) or a static hosting service like Vercel/Netlify.