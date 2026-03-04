# AGENTS.md

Guidance for AI coding agents operating in this repository.

## Project Overview

Next.js 16 backoffice app using the App Router (`src/app/`), React 19, TypeScript strict mode, and Tailwind CSS v4. Package manager is **npm**.

## Build / Lint / Test Commands

```bash
npm run dev          # Development server
npm run build        # Production build (also runs type-check)
npm run lint         # ESLint 9 flat config (no args needed)
npm run start        # Start production server (requires build first)
npx tsc --noEmit     # Quick type-check without building
```

### Testing

No test framework is configured yet. When one is added (likely Vitest), update this section.

```bash
npm test                                # Run all tests (once configured)
npx vitest run path/to/file.test.ts     # Run a single test file
npx vitest run -t "pattern"             # Run tests matching a name pattern
```

### Pre-commit Checklist

Run `npm run lint` and `npm run build` before committing. Both must pass.

## Project Structure

```
src/
  app/                  # Next.js App Router pages and layouts
    layout.tsx          # Root layout (Geist fonts, global CSS import)
    page.tsx            # Landing page
    globals.css         # Tailwind v4 theme (@theme inline), CSS custom properties
    backoffice/
      login/
        page.tsx        # Login form (Server Component using form action)
        actions.ts      # Server Actions ("use server")
public/                 # Static assets (SVGs)
```

## Code Style Guidelines

### TypeScript

- **Strict mode** is enabled (`"strict": true`). Target: ES2017, module resolution: `bundler`.
- Use explicit types for function parameters and return values on exported functions.
- Prefer `import type` when importing only types: `import type { Foo } from "bar"`.
- Wrap component props in `Readonly<>`:
  ```ts
  export default function RootLayout({
    children,
  }: Readonly<{ children: React.ReactNode }>) {
  ```

### Path Aliases

Use the `@/*` alias (maps to `src/*`) for non-relative imports:

```ts
import { Button } from "@/components/Button";   // Good
import { Button } from "../../../components/Button"; // Bad
```

### Import Order

Separate groups with blank lines, ordered as:

1. React / Next.js built-ins (`react`, `next/*`)
2. Third-party libraries
3. Internal aliases (`@/*`)
4. Relative imports
5. CSS / style imports last

### Components

- Use **function declarations** with `export default`: `export default function PageName()`.
- Route pages go in `src/app/<route>/page.tsx`, layouts in `layout.tsx`.
- Shared components go in `src/components/` (PascalCase filenames: `Button.tsx`).
- **Server Components by default.** Only add `"use client"` when the component needs browser APIs, event handlers, or React hooks (`useState`, `useEffect`, etc.).

### Server Actions

- Place in a separate `actions.ts` file with `"use server"` directive at the top.
- Accept `FormData` for form submissions. Throw on errors (do not silently fail).
  ```ts
  "use server";
  export async function loginAction(formData: FormData) {
    const email = formData.get("email");
    // ...
    if (!response.ok) throw new Error("Login failed");
  }
  ```

### Naming Conventions

| Item                | Convention                  | Example              |
|---------------------|-----------------------------|----------------------|
| Component files     | PascalCase or `page.tsx`/`layout.tsx` | `Button.tsx`  |
| Component functions | PascalCase                  | `LoginForm`          |
| Hooks               | camelCase, `use` prefix     | `useAuth`            |
| Utility functions   | camelCase                   | `formatDate`         |
| Constants           | UPPER_SNAKE_CASE            | `MAX_RETRIES`        |
| Types / Interfaces  | PascalCase                  | `UserProfile`        |
| CSS files           | kebab-case                  | `globals.css`        |
| Directories         | kebab-case                  | `backoffice/login/`  |

### Styling

- **Tailwind CSS v4** via PostCSS plugin (`@tailwindcss/postcss`). No `tailwind.config.*` file -- theme is configured in `globals.css` using `@theme inline`.
- Use Tailwind utility classes directly in `className` attributes.
- Support light/dark modes with `dark:` variant classes and `prefers-color-scheme`.
- Fonts: Geist Sans (`--font-geist-sans`) and Geist Mono (`--font-geist-mono`).

### Formatting

No Prettier configured. Follow existing code style:

- 2-space indentation.
- **Double quotes** for all JS/TS/JSX strings.
- Semicolons at end of statements.
- Trailing commas in multi-line structures.
- Template literals for string interpolation (never concatenation).

### Error Handling

- Use try/catch for async operations in Server Components and API routes.
- Provide Next.js `error.tsx` boundary files for route-level error handling.
- Never silently swallow errors -- always log or re-throw.
- Validate external data (API responses, form inputs) at the boundary.

### ESLint

ESLint 9 flat config (`eslint.config.mjs`) extends:
- `eslint-config-next/core-web-vitals` -- performance and a11y rules
- `eslint-config-next/typescript` -- TypeScript-specific rules

## Environment Variables

- `.env*` files are gitignored. **Never commit secrets.**
- Use `NEXT_PUBLIC_` prefix for client-side environment variables.
- Access server-side env vars via `process.env.VAR_NAME` in Server Components or API routes only.

## Git Practices

- Do not commit `node_modules/`, `.next/`, `.env*`, or `*.tsbuildinfo`.
- Verify lint and build pass before committing (see Pre-commit Checklist above).

## Adding Dependencies

```bash
npm install <package>            # Production dependency
npm install --save-dev <package> # Dev dependency
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
