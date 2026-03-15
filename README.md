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

Still recommended next:

- Integration tests for checkout -> order confirmation -> account history
- Route protection and redirect tests
- End-to-end tests for key shopping flow
