# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Backoffice admin panel for a boardgames application. Built with Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS v4.

## Commands

- `npm run dev` — start dev server (localhost:3000)
- `npm run build` — production build
- `npm run lint` — run ESLint (flat config, `eslint.config.mjs`)
- No test framework is currently configured

## Architecture

- **App Router** with `src/` directory structure — all routes under `src/app/`
- **Backend API**: Fastify server at `http://127.0.0.1:8080` (configurable via `BACKOFFICE_API_URL` env var)
- **Auth flow**: Login via Server Action (`src/app/backoffice/login/actions.ts`) posts credentials to the backend API, stores JWT in an HTTP-only cookie (`auth_token`)
- **Auth utilities** in `src/lib/auth.ts`: `setAuthCookie`, `clearAuthCookie`, `getAuthToken`, `getAuthHeaders` — use `getAuthHeaders()` for authenticated backend requests
- **Route protection**: Middleware in `src/proxy.ts` redirects unauthenticated users to `/backoffice/login` for all `/backoffice/*` routes (public paths: `/backoffice/login`)
- **Path alias**: `@/*` maps to `./src/*`
