# Educore

University student platform built with Next.js 14 (App Router), TypeScript, Prisma (MongoDB), NextAuth.js (JWT), and Tailwind CSS.

## Features

- **Profile**: Student profile, semesters, subjects, clubs, sports; score calculation and rule-based suggestions
- **Materials**: Upload and browse materials; generate summary (stub); related resources; bookmarks
- **Clubs**: Club directory; apply to clubs; admin manages applications
- **Support**: Verified lecturers; sessions; session applications; community posts

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

   If you see a peer dependency conflict (e.g. next-auth and nodemailer), run:

   ```bash
   npm install --legacy-peer-deps
   ```

2. **Environment**

   Copy `.env.example` to `.env` and set (required for `npm run build` and runtime):

   - `DATABASE_URL` — MongoDB connection string (e.g. MongoDB Atlas)
   - `NEXTAUTH_SECRET` — Random secret for NextAuth
   - `NEXTAUTH_URL` — App URL (e.g. `http://localhost:3000`)
   - `JWT_SECRET` — Optional; NextAuth uses NEXTAUTH_SECRET for JWT

3. **Database**

   ```bash
   npx prisma generate
   npx prisma db push
   npx ts-node prisma/seed.ts
   ```

4. **Run**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Seed accounts

- **Admin**: `admin@educore.edu` / `admin123`
- **Student**: `student@educore.edu` / `student123`

## Project structure

- `app/(public)` — Landing, about, pricing
- `app/(auth)` — Login, register, forgot-password
- `app/(dashboard)` — Dashboard, profile, materials, clubs, support (authenticated)
- `app/admin` — Admin-only routes (clubs, club-applications, materials, lecturers)
- `app/api` — API routes (auth, profile, materials, clubs, support, health)
- `components/` — UI, layout, profile, materials, clubs, support
- `lib/` — Prisma, auth, validators, services, utils, permissions
- `prisma/` — Schema and seed

## GitHub

```bash
git init
git add .
git commit -m "feat: initial Educore scaffold"
git branch -M main
git remote add origin https://github.com/<your-username>/educore.git
git push -u origin main
```

Replace `<your-username>` with your GitHub username.
