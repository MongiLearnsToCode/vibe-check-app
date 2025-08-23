# Project Overview

This is a Laravel project, a PHP web application framework. It appears to be a fresh installation of the framework, with the default file structure and configurations. The project is set up to use Vite for frontend asset bundling, with Tailwind CSS for styling.

# Building and Running

## Backend

To run the backend development server, use the following command:

```bash
php artisan serve
```

To run the queue worker, use the following command:

```bash
php artisan queue:listen
```

To view the application logs, use the following command:

```bash
php artisan pail
```

## Frontend

To build the frontend assets, use the following command:

```bash
npm run build
```

To run the frontend development server, use the following command:

```bash
npm run dev
```

## All-in-one

The `composer.json` file includes a `dev` script that runs all the necessary development servers concurrently:

```bash
composer run dev
```

# Testing

To run the test suite, use the following command:

```bash
composer test
```

# Development Conventions

The project follows the standard Laravel development conventions.

*   **Routing:** Web routes are defined in `routes/web.php`, and API routes are in `routes/api.php`.
*   **Controllers:** Controllers are located in `app/Http/Controllers`.
*   **Models:** Models are located in `app/Models`.
*   **Views:** Views are located in `resources/views` and use the Blade templating engine.
*   **Frontend Assets:** Frontend assets are located in `resources/js` and `resources/css`.
*   **Configuration:** Configuration files are located in the `config` directory.
*   **Environment Variables:** Environment variables are defined in the `.env` file.
