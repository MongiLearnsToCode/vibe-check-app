# Build Order Document – Relationship Vibe App (Phase 1 MVP)

✅ **Purpose**: This task list outlines the step-by-step build order for the Relationship Vibe App MVP, based on the approved PRD.  
Each main task includes subtasks to guide development, testing, and deployment.

---

## ✅ 1. Backend Setup

- [x] Initialize Laravel project: `laravel new backend`
- [x] Install Laravel Breeze for authentication scaffolding
- [x] Configure `.env` with database credentials
- [x] Create and run database migrations:
  - [x] `users` table
  - [x] `relationships` table (with unique `code`)
  - [x] `relationship_user` pivot table
  - [x] `vibes` table (include `date` derived from `created_at`)
- [x] Set up database indexes:
  - [x] Index on `vibes(date, relationship_id)`
  - [x] Index on `relationships(code)`
- [x] Run `php artisan migrate` and verify tables in DB

---

## ✅ 2. API Endpoint Development

- [x] Define API routes in `routes/api.php`
- [x] Apply `auth:sanctum` or session middleware where needed

### Subtask: Authentication Endpoints
- [x] `POST /api/auth/register` – Register user and start session
- [x] `POST /api/auth/login` – Log in and return session
- [x] `POST /api/auth/logout` – Optional, for clean session handling

### Subtask: Relationship Management
- [x] `POST /api/relationships` – Authenticated user creates a relationship, generates unique invite `code`
- [x] `POST /api/relationships/join` – User joins using invite `code`, creates pivot record

### Subtask: Vibe Submission & Retrieval
- [x] `POST /api/vibes` – Submit daily vibe (mood 1–5, optional note)
  - [x] Enforce one entry per user per day
- [x] `GET /api/vibes/{relationshipId}` – Return today’s vibe + past 7 days grouped by date
  - [x] Format response as `{ date: "2025-04-05", userA: { mood, note }, userB: { mood, note } }`

---

## ✅ 3. Frontend Project Setup

- [x] Create React app: `npm create vite@latest frontend -- --template react-ts`
- [x] Install dependencies:
  - [x] `axios` for API calls
  - [x] `tailwindcss`, `postcss`, `autoprefixer`
  - [x] `@headlessui/react`, `@heroicons/react`
- [x] Initialize Tailwind: `npx tailwindcss init -p`
- [x] Set up shadcn/ui (optional components: Button, Card, Input, Label)
- [x] Configure `vite.config.ts` with:
  - [x] Base path for Laravel proxy (if needed)
  - [x] TypeScript and React plugin support

---

## ✅ 4. PWA Integration

- [x] Install Vite PWA plugin: `npm install vite-plugin-pwa -D`
- [x] Configure plugin in `vite.config.ts`:
  - [x] App name, short name, theme color
  - [x] Icons (192x192, 512x512) in `/public/icons/`
  - [x] Generate `manifest.json` and service worker
- [x] Add `manifest.json` to `/public/`
- [x] Verify PWA install prompt appears in browser
- [x] Test offline caching of core assets (HTML, CSS, JS)

---

## ✅ 5. Frontend Pages & Components

### Subtask: Authentication Flow
- [x] Create `Signup` page (name, email, password)
- [x] Create `Login` page
- [x] Connect forms to Laravel API endpoints
- [x] Handle CSRF tokens (Laravel includes via `/sanctum/csrf-cookie`)

### Subtask: Vibe Check Page
- [x] Create `VibeCheck` component
- [x] Implement emoji slider (1–5: 😩 → 😊)
- [x] Add optional text input (max 140 characters)
- [x] Disable submit if entry already exists for today
- [x] Show success confirmation

### Subtask: Dashboard
- [x] Create `Dashboard` page
- [x] Fetch and display today's vibes side by side
- [x] Render 7-day mood line chart using Recharts
- [x] Display static insight (e.g., "You're both feeling balanced this week.")

---

## ✅ 6. Offline Sync Functionality

- [x] On vibe submit:
  - [x] Check network status
  - [x] If online → send to `/api/vibes`
  - [x] If offline → save to `localStorage` with timestamp and relationship ID
- [x] On app load:
  - [x] Check `localStorage` for unsent vibes
  - [x] Attempt to sync pending entries to API
  - [x] Remove from `localStorage` after successful sync
- [x] Show user feedback: "Vibe saved offline. Will sync when online."

---

## ✅ 7. API & Frontend Integration

- [x] Set up Axios instance in `lib/api.ts`
- [x] Implement API service functions:
  - [x] `registerUser()`
  - [x] `loginUser()`
  - [x] `createRelationship()`
  - [x] `joinRelationship(code)`
  - [x] `submitVibe(mood, note)`
  - [x] `getVibes(relationshipId)`
- [x] Handle loading and error states in UI
- [x] Test all API calls with Postman or browser dev tools

---

## ✅ 8. Deployment

### Subtask: Backend Deployment
- [x] Deploy Laravel app to Laravel Forge / VPS / shared hosting
- [x] Set up domain and SSL
- [x] Configure `.env` (APP_URL, DB, etc.)
- [x] Run `php artisan migrate` on production
- [x] Verify API endpoints are accessible

### Subtask: Frontend Deployment
- [x] Build frontend: `npm run build`
- [x] Deploy to Vercel or Netlify
- [x] Or serve via Laravel (if using Inertia.js in future)
- [x] Set up custom domain and HTTPS
- [x] Verify PWA manifest and installability

---

## ✅ 9. Closed Beta Testing

- [x] Recruit 5–10 real couples
- [x] Provide onboarding instructions
- [x] Monitor key metrics:
  - [x] Activation rate (joined relationships)
  - [x] Daily check-in rate
  - [x] Retention at day 30
- [x] Collect qualitative feedback:
  - [x] Is the vibe check easy and fast?
  - [x] Do partners feel more connected?
  - [x] Any bugs or UX issues?
- [x] Review backend logs for errors

---

## ✅ 10. Post-MVP Evaluation

- [x] Analyze success metrics:
  - [x] Activation ≥70%?
  - [x] Engagement ≥60%?
  - [x] Retention ≥40%?
- [x] Decide: Proceed to Phase 2 or iterate?
- [x] Document learnings and user feedback

---

🚀 **Next Steps (If MVP Succeeds)**  
- Push notifications for daily reminders  
- AI-generated weekly reflections  
- Deep talk prompts  
- Streaks & gamification  

> This build order ensures a focused, testable, and user-centered MVP. Let’s ship it. 💘
