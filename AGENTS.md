# AGENTS.md

This file provides guidance for AI coding agents operating in this repository.

## Project Overview

Next.js 16 backoffice application using the App Router (`src/app/`), TypeScript with strict mode, and Tailwind CSS v4. Package manager is **npm**.

## Build / Lint / Test Commands

```bash
# Development server
npm run dev

# Production build (also serves as type-check)
npm run build

# Lint (ESLint 9 flat config, no args needed)
npm run lint

# Start production server (requires build first)
npm run start
```

### Testing

No test framework is configured yet. When one is added (likely Vitest given the ecosystem), update this section. Expected patterns:

```bash
# Run all tests (once configured)
npm test

# Run a single test file
npx vitest run path/to/file.test.ts

# Run tests matching a name pattern
npx vitest run -t "pattern"
```

### Type Checking

There is no standalone `tsc` script. Use `npm run build` to catch type errors (Next.js runs TypeScript compilation during build). For a quick type-check without building:

```bash
npx tsc --noEmit
```

## Project Structure

```
src/
  app/                  # Next.js App Router pages and layouts
    layout.tsx          # Root layout (Geist fonts, global CSS)
    page.tsx            # Landing page
    globals.css         # Tailwind v4 import, CSS custom properties
    backoffice/
      login/
        page.tsx        # Login form
public/                 # Static assets (SVGs)
```

## Code Style Guidelines

### TypeScript

- **Strict mode** is enabled (`"strict": true` in tsconfig.json).
- Target: ES2017. Module resolution: `bundler`.
- Use explicit types for function parameters and return values on exported functions.
- Prefer `type` imports when importing only types: `import type { Foo } from "bar"`.
- Use `Readonly<>` wrapper for component props (see `layout.tsx` pattern).

### Path Aliases

Use the `@/*` alias for imports from `src/`:

```ts
// Good
import { Button } from "@/components/Button";

// Bad
import { Button } from "../../../components/Button";
```

### Imports

Order imports as follows (separated by blank lines):

1. React / Next.js built-ins (`react`, `next/*`)
2. Third-party libraries
3. Internal aliases (`@/*`)
4. Relative imports
5. CSS / style imports last

### Components

- Use **function declarations** for page/layout components: `export default function PageName()`.
- Place each route's page component in `src/app/<route>/page.tsx`.
- Layouts go in `src/app/<route>/layout.tsx`.
- Shared components should go in `src/components/` (create when needed).
- Keep components as **Server Components** by default. Only add `"use client"` when the component needs browser APIs, event handlers, or React hooks (`useState`, `useEffect`, etc.).

### Naming Conventions

| Item                    | Convention         | Example                     |
|-------------------------|--------------------|-----------------------------|
| Component files         | PascalCase or `page.tsx`/`layout.tsx` for routes | `Button.tsx`, `page.tsx` |
| Component functions     | PascalCase         | `LoginForm`                 |
| Hooks                   | camelCase, `use` prefix | `useAuth`              |
| Utility functions       | camelCase          | `formatDate`                |
| Constants               | UPPER_SNAKE_CASE   | `MAX_RETRIES`               |
| Types / Interfaces      | PascalCase         | `UserProfile`               |
| CSS files               | kebab-case         | `globals.css`               |
| Directories             | kebab-case         | `backoffice/login/`         |

### Styling

- **Tailwind CSS v4** via PostCSS plugin (`@tailwindcss/postcss`).
- Use Tailwind utility classes directly in JSX `className` attributes.
- Global CSS variables are defined in `src/app/globals.css` using `@theme inline` and `:root`.
- Support both light and dark modes using `dark:` variant classes and `prefers-color-scheme` media query.
- Fonts: Geist Sans (`--font-geist-sans`) and Geist Mono (`--font-geist-mono`).

### Formatting

- No Prettier is configured. Follow existing code style:
  - 2-space indentation.
  - Double quotes for JSX attribute strings; double quotes for JS/TS strings (match ESLint defaults).
  - Semicolons at end of statements.
  - Trailing commas in multi-line structures.
  - Use template literals for string interpolation instead of concatenation.

### Error Handling

- Use try/catch for async operations in Server Components and API routes.
- Provide Next.js `error.tsx` boundary files for route-level error handling.
- Never silently swallow errors -- always log or re-throw.
- Validate external data (API responses, form inputs) at the boundary.

### ESLint

ESLint 9 flat config is in `eslint.config.mjs`. It extends:
- `eslint-config-next/core-web-vitals` -- performance rules for Next.js
- `eslint-config-next/typescript` -- TypeScript-specific rules

Run `npm run lint` before committing. Fix all warnings and errors.

## Environment Variables

- `.env*` files are gitignored. Never commit secrets.
- Use `NEXT_PUBLIC_` prefix for client-side environment variables.
- Access server-side env vars via `process.env.VAR_NAME` in Server Components or API routes only.

## Git Practices

- Do not commit `node_modules/`, `.next/`, `.env*`, or `*.tsbuildinfo`.
- Verify `npm run lint` and `npm run build` pass before committing.

## Adding Dependencies

```bash
# Production dependency
npm install <package>

# Dev dependency
npm install --save-dev <package>
```

Prefer well-maintained, widely-adopted packages. Check bundle size impact for client-side dependencies.

## Key Configuration Files

| File                 | Purpose                                    |
|----------------------|--------------------------------------------|
| `next.config.ts`     | Next.js configuration                      |
| `tsconfig.json`      | TypeScript compiler options (strict mode)  |
| `eslint.config.mjs`  | ESLint 9 flat config                       |
| `postcss.config.mjs` | PostCSS with Tailwind CSS v4 plugin        |
| `package.json`       | Dependencies and npm scripts               |
