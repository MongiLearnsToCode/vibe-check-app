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

- [ ] On vibe submit:
  - [ ] Check network status
  - [ ] If online → send to `/api/vibes`
  - [ ] If offline → save to `localStorage` with timestamp and relationship ID
- [ ] On app load:
  - [ ] Check `localStorage` for unsent vibes
  - [ ] Attempt to sync pending entries to API
  - [ ] Remove from `localStorage` after successful sync
- [ ] Show user feedback: “Vibe saved offline. Will sync when online.”

---

## ✅ 7. API & Frontend Integration

- [ ] Set up Axios instance in `lib/api.ts`
- [ ] Implement API service functions:
  - [ ] `registerUser()`
  - [ ] `loginUser()`
  - [ ] `createRelationship()`
  - [ ] `joinRelationship(code)`
  - [ ] `submitVibe(mood, note)`
  - [ ] `getVibes(relationshipId)`
- [ ] Handle loading and error states in UI
- [ ] Test all API calls with Postman or browser dev tools

---

## ✅ 8. Deployment

### Subtask: Backend Deployment
- [ ] Deploy Laravel app to Laravel Forge / VPS / shared hosting
- [ ] Set up domain and SSL
- [ ] Configure `.env` (APP_URL, DB, etc.)
- [ ] Run `php artisan migrate` on production
- [ ] Verify API endpoints are accessible

### Subtask: Frontend Deployment
- [ ] Build frontend: `npm run build`
- [ ] Deploy to Vercel or Netlify
- [ ] Or serve via Laravel (if using Inertia.js in future)
- [ ] Set up custom domain and HTTPS
- [ ] Verify PWA manifest and installability

---

## ✅ 9. Closed Beta Testing

- [ ] Recruit 5–10 real couples
- [ ] Provide onboarding instructions
- [ ] Monitor key metrics:
  - [ ] Activation rate (joined relationships)
  - [ ] Daily check-in rate
  - [ ] Retention at day 30
- [ ] Collect qualitative feedback:
  - [ ] Is the vibe check easy and fast?
  - [ ] Do partners feel more connected?
  - [ ] Any bugs or UX issues?
- [ ] Review backend logs for errors

---

## ✅ 10. Post-MVP Evaluation

- [ ] Analyze success metrics:
  - [ ] Activation ≥70%?
  - [ ] Engagement ≥60%?
  - [ ] Retention ≥40%?
- [ ] Decide: Proceed to Phase 2 or iterate?
- [ ] Document learnings and user feedback

---

🚀 **Next Steps (If MVP Succeeds)**  
- Push notifications for daily reminders  
- AI-generated weekly reflections  
- Deep talk prompts  
- Streaks & gamification  

> This build order ensures a focused, testable, and user-centered MVP. Let’s ship it. 💘
