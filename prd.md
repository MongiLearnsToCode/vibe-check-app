# Product Requirements Document (PRD) – Relationship Vibe App (Phase 1 MVP, Laravel Backend)

---

## 1. Overview

The **Relationship Vibe App** is a lightweight **Progressive Web App (PWA)** designed for couples to track and share their daily moods — referred to as “vibes.”

The primary goal of **Phase 1 (MVP)** is to validate whether couples will engage in **consistent daily check-ins**.

Future features such as deep conversation prompts, AI-driven insights, and gamification will **only be developed if Phase 1 meets key engagement metrics**.

---

## 1.1 Hypothesis

Couples will consistently use a lightweight daily mood check-in tool if it is:

* Private and shared only between partners
* Quick to use (<30 seconds per check-in)
* Visually simple and emotionally intuitive (emojis, minimal text)
* Accessible on mobile via a PWA (no app store friction)

---

## 2. Problem Statement

* Couples often fail to notice subtle emotional shifts in each other.
* Minor frustrations or stressors accumulate over time due to lack of emotional visibility.
* Existing relationship apps are either too clinical (therapy-focused) or overly playful (game-based), leaving a gap for a **simple, daily emotional sync tool**.

---

## 3. Solution (MVP Scope)

Phase 1 delivers **one core experience**: the *Daily Vibe Check*, paired with a shared dashboard.

Key functionality includes:

* Each partner selects a mood on a **1–5 scale with emojis**.
* Option to add a **short text note (max 140 characters)**.
* Both partners’ daily vibes are displayed **side by side** on a shared dashboard.
* A **7-day mood history chart** visualizes emotional trends.
* Fully functional as a **PWA** — installable, responsive, and supports offline input with sync-on-connect.

---

## 4. Core Features (Phase 1 Only)

### 1. **Auth & Relationship Linking**

* Email/password authentication using **Laravel Breeze/Fortify**.
* User A creates a new relationship → system generates a unique **invite code**.
* User B signs up and uses the invite code to join the relationship.
* Relationship is established via a pivot table linking two users.
* Optional logout endpoint provided for clean session handling.

### 2. **Daily Vibe Check**

* Mood selection via **emoji slider or numeric scale (1–5)**.
* Optional note field (**max 140 characters**).
* One submission allowed per user per day.
* Prevents duplicate entries after submission.

### 3. **Shared Dashboard**

* Displays **today’s vibes** for both partners side by side.
* Shows a **7-day mood chart** (line graph using Recharts).
* Includes a **static one-liner insight** (e.g., “You’re both feeling balanced this week.”) — no AI involved.

### 4. **PWA Support**

* Installable on **iOS and Android** via browser (via Web App Manifest).
* Service worker caches core assets for **offline access**.
* Offline capability: users can submit a vibe while offline; data stored in `localStorage` and synced when back online.

---

## 5. Out of Scope (Phase 1)

These features will **not** be included in Phase 1:

* ❌ AI-generated insights or sentiment analysis
* ❌ Deep talk prompts or guided conversations
* ❌ Gamification (streaks, badges, rewards)
* ❌ Push notifications or reminders
* ❌ Monetization, subscriptions, or in-app purchases
* ❌ Social sharing or multi-user groups

> These may be considered in future phases based on MVP engagement data.

---

## 6. Success Metrics

To determine whether to proceed to Phase 2, we must achieve the following within the first 30 days of launch:

| Metric               | Target                                                               |
| -------------------- | -------------------------------------------------------------------- |
| **Activation Rate**  | ≥70% of invited partners successfully join a relationship            |
| **Daily Engagement** | ≥60% daily check-in rate across couples over first 14 days           |
| **30-Day Retention** | ≥40% of couples remain active (at least one check-in in last 7 days) |

> **Definition of "Active Couple"**: A couple is considered *active* if at least one partner submitted a vibe in the last 7 days.

---

## 7. Tech Stack

### Backend (Laravel 11)

* **Authentication**: Laravel Breeze / Fortify (email + password)
* **Database**: MySQL or PostgreSQL
* **API Layer**: RESTful JSON API using Laravel controllers
* **Security**: CSRF-protected session-based authentication (no tokens)

  > Using Laravel Fortify with session-based auth. Frontend must first call `/sanctum/csrf-cookie` to receive a CSRF token before making API requests.

### Frontend (Standalone React App)

* **Framework**: Vite + React + TypeScript
* **UI Library**: TailwindCSS + [shadcn/ui](https://ui.shadcn.com/)
* **Charts**: Recharts (lightweight, React-compatible)
* **State & API**: Axios for API calls, localStorage for offline queue

### PWA Tools

* **Vite Plugin**: `vite-plugin-pwa` for manifest and service worker
* **Manifest**: `manifest.json` with icons, name, theme colors
* **Service Worker**: Caches static assets and enables offline use

### Deployment

* **Backend**: Deploy Laravel app via Laravel Forge, VPS, or compatible shared hosting
* **Frontend**: Host on **Vercel** or **Netlify**, or serve through Laravel (if using Inertia.js)

---

## 8. Database Schema (Laravel Migrations)

```sql
-- Users Table
users
- id (BIGINT, PK)
- name (VARCHAR)
- email (VARCHAR, UNIQUE)
- password (VARCHAR)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

-- Relationships Table
relationships
- id (BIGINT, PK)
- code (VARCHAR, UNIQUE) -- Invite code
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

-- Pivot Table: Users ↔ Relationships
relationship_user
- id (BIGINT, PK)
- relationship_id (BIGINT, FK → relationships.id)
- user_id (BIGINT, FK → users.id)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

-- Vibe Submissions
vibes
- id (BIGINT, PK)
- relationship_id (BIGINT, FK → relationships.id)
- user_id (BIGINT, FK → users.id)
- mood (TINYINT, 1–5)
- note (TEXT, nullable, max 140 chars)
- date (DATE, derived from created_at) -- Index on this for daily lookup
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

✅ Indexes:
vibes(date, relationship_id) for fast daily queries
relationships(code) for quick invite lookups
💡 API Note: The /api/vibes/{relationshipId} endpoint should return data grouped by date (e.g., 2025-04-05) with both users' entries for that date.
```

---

## 9. Project Structure

```
relationship-vibe-app/
├── backend/                     # Laravel Project
│   ├── app/
│   ├── routes/api.php           # API Endpoints
│   ├── database/migrations/     # Schema Definitions
│   ├── public/                  # Shared assets (if serving frontend)
│   └── ...
│
├── frontend/                    # React + Vite App
│   ├── public/
│   │   ├── manifest.json        # PWA Manifest
│   │   ├── icons/               # App icons (512x512, 192x192, etc.)
│   │   └── (sw.js - auto-generated by Vite PWA plugin)
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/            # Login, Signup forms
│   │   │   ├── VibeCheck/       # Mood slider + note input
│   │   │   ├── Dashboard/       # Today + 7-day view
│   │   │   └── ui/              # shadcn/ui components
│   │   │
│   │   ├── pages/
│   │   │   ├── index.tsx        # Landing
│   │   │   ├── signup.tsx       # Signup flow
│   │   │   ├── login.tsx        # Login page
│   │   │   ├── dashboard.tsx    # Main app view
│   │   │   └── vibe-check.tsx   # Daily input screen
│   │   │
│   │   ├── lib/
│   │   │   └── api.ts           # Axios instance + API functions
│   │   │
│   │   └── styles/
│   │       └── globals.css      # Tailwind + custom styles
│   │
│   ├── vite.config.ts           # Vite + PWA plugin config
│   └── package.json
```

---

## 10. Step-by-Step Implementation Plan

**Step 1: Backend Setup**

* ✅ Initialize Laravel project (`laravel new relationship-vibe-app/backend`)
* Install Laravel Breeze/Fortify for authentication scaffolding
* Create database migrations for:

  * relationships
  * relationship\_user (pivot)
  * vibes
* Run migrations: `php artisan migrate`

**Step 2: API Development**

* Implement the following REST API endpoints:

| Method | Route                       | Description                                                                      |
| ------ | --------------------------- | -------------------------------------------------------------------------------- |
| POST   | /api/auth/register          | Register user, return session                                                    |
| POST   | /api/auth/login             | Login, start session                                                             |
| POST   | /api/auth/logout            | Logout, end session (optional)                                                   |
| POST   | /api/relationships          | Authenticated user creates a relationship, returns invite code                   |
| POST   | /api/relationships/join     | User joins using invite code                                                     |
| POST   | /api/vibes                  | Submit daily vibe (with mood + note)                                             |
| GET    | /api/vibes/{relationshipId} | Fetch today + last 7 days of vibes (grouped by date with both partners' entries) |

* Ensure middleware: `auth:sanctum` or session protection.
* Use CSRF tokens for security in session-based flow (`/sanctum/csrf-cookie`).

**Step 3: Frontend Scaffolding**

* Create React app: `npm create vite@latest frontend -- --template react-ts`
* Install dependencies:

  ```bash
  npm install axios tailwindcss postcss autoprefixer @headlessui/react @heroicons/react
  npx tailwindcss init -p
  ```
* Add shadcn/ui components as needed (Button, Card, Input, etc.)
* Integrate Vite PWA Plugin:

  ```bash
  npm install vite-plugin-pwa -D
  ```
* Configure in `vite.config.ts` to generate manifest and service worker.

**Step 4: Frontend Pages & Components**

* Build Signup/Login pages (connect to Laravel API)
* Implement Vibe Check Form:

  * Emoji slider (1–5: 😩 → 😊)
  * Text input (140 char limit)
  * Submit disables after daily entry
* Build Dashboard:

  * Show both partners’ today’s vibe
  * Render 7-day chart using Recharts
  * Display static insight (e.g., “You’ve been feeling great together!”)

**Step 5: Offline Support**

* On vibe submit:

  * If online → send to API
  * If offline → save to localStorage with timestamp
* On app load:

  * Check for unsent vibes in localStorage
  * Attempt to sync to API when connection restored
  * Clear after successful sync

**Step 6: Deployment**

* Deploy Laravel backend:

  * Use Laravel Forge, DigitalOcean, or any PHP-compatible host
  * Configure `.env`, database, and storage
* Deploy React frontend:

  * Build: `npm run build`
  * Deploy to Vercel or Netlify
  * Or serve via Laravel (if using Inertia.js in future)

**Step 7: Closed Beta Testing**

* Recruit 5–10 real couples for testing
* Collect feedback on:

  * Usability of daily check-in
  * Clarity of dashboard
  * Desire to continue using after 7 days
* Monitor backend logs and success metrics

✅ **Next Steps After MVP:**
If success metrics are met, proceed to Phase 2, exploring:

* Push notifications for daily reminders
* AI-generated weekly reflections
* Curated deep conversation prompts
* Streaks and light gamification

---

## 11. Risks & Mitigations

* **Low Engagement Risk**: Couples may not return daily → Mitigation: Keep flow under 30 seconds, consider soft reminders in future phases.
* **Technical Debt Risk**: Overcomplication in MVP → Mitigation: Strict scope control (auth, vibe check, dashboard only).
* **Offline Sync Edge Cases**: Data loss if localStorage clears → Mitigation: Prompt users when offline submissions are saved.
* **Privacy Concerns**: Relationship data is sensitive → Mitigation: Enforce HTTPS, CSRF protection, and hashed passwords.

---

## 12. Timeline (Estimated)

* **Week 1**: Backend setup (auth, migrations, API endpoints)
* **Week 2**: Frontend scaffolding + auth pages
* **Week 3**: Vibe check + dashboard
* **Week 4**: PWA setup, offline sync, deployment, closed beta

---

This PRD defines a focused, testable hypothesis: Will couples consistently share daily moods in a simple, private space? Let’s build to find out. 🚀
