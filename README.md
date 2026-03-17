# Krylo Ecommerce (Frontend)

Krylo is a frontend ecommerce app built with React, TypeScript, Vite, Redux Toolkit, React Query, and Tailwind CSS.

## Tech Stack

- React 19 + TypeScript
- Vite
- React Router
- Redux Toolkit + React Redux
- TanStack Query
- Tailwind CSS
- React Hook Form + Zod
- Vitest + Testing Library

## Project Structure

- `src/app`: app setup (router, providers, store, hooks)
- `src/components`: reusable UI and layout components
- `src/features`: feature modules (auth, cart, catalog)
- `src/pages`: route-level pages
- `src/data`: static categories/products data
- `src/lib`: utility and API simulation layer
- `public/images`: product and category images

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Start dev server:

```bash
npm run dev
```

3. Open:

- `http://localhost:5173`

## Scripts

- `npm run dev`: start local dev server
- `npm run build`: typecheck + production build
- `npm run preview`: preview built app
- `npm run lint`: run ESLint
- `npm run test -- --run`: run tests once
- `npm run test:ui`: Vitest UI mode
- `npm run test:e2e`: run Playwright end-to-end tests
- `npm run test:e2e:ui`: run Playwright with interactive UI
- `npm run test:e2e:headed`: run Playwright in headed mode
- `npm run format`: format source files with Prettier

## Image Conventions

Product images are referenced from `src/data/products.ts` and served from:

- `public/images/products/<file>.png`

Category images are referenced from `src/data/categories.ts` and served from:

- `public/images/categories/<file>.png`

## Current Auth Model

- Frontend-only auth
- User records + session stored in localStorage (`krylo-users-v1`, `krylo-auth-v1`)
- This is for demo/prototype usage only (not production security)

## Current Testing Coverage

Included:

- Cart reducer behavior
- Auth storage service behavior
- Catalog filtering/sorting/pagination utility behavior
- Order lifecycle progression/reconciliation behavior
- Product data integrity checks (`imagesByColor` mappings)
- Browser E2E flow coverage (shopping, auth, route guards, edge paths)

Still recommended next:

- Component-level tests for ProductDetails image/color interactions
- Error-boundary rendering tests (route `errorElement`)
- API-contract tests if/when backend integration is added

## Security

- Latest audit status: `0` vulnerabilities
- Verify anytime with:
  - `npm audit`
