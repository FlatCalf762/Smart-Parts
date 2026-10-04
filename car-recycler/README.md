# Smart Parts / Car Recycler

A modern Next.js app for a vehicle parts recycling, sourcing, and inventory workflow. The project is scaffolded as a responsive web app with a polished UI, reusable components, and a clean App Router structure.

## Overview

This codebase is built with:

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- shadcn-style reusable UI primitives
- optional Supabase + Drizzle integration for future data persistence

The default project starter has been customized to provide a strong foundation for building a car recycler or auto parts management dashboard.

## Project structure

```text
car-recycler/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   └── ui/
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── select.tsx
│       └── ...
├── public/
├── .eslintrc.* / config files
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
├── next.config.ts
├── postcss.config.mjs
├── components.json
└── README.md
```

## Key files

- `app/page.tsx` – main page entry for the landing or dashboard screen
- `app/layout.tsx` – root layout and metadata
- `app/globals.css` – global theme and Tailwind styles
- `components/ui/` – reusable UI primitives for buttons, inputs, select menus, cards, and forms

## Prerequisites

Before running the app, make sure you have:

- Node.js 20+
- pnpm 9+

## Getting started

1. Install dependencies:

```bash
pnpm install
```

2. Start the development server:

```bash
pnpm dev
```

3. Open the app in your browser:

```text
http://localhost:3000
```

## Available scripts

```bash
pnpm dev     # run the app locally
pnpm build   # create a production build
pnpm start   # serve the production build
pnpm lint    # run ESLint checks
```

## Environment variables

The current app does not require any environment variables to run locally, but if you add database or authentication features later, create a `.env.local` file with values such as:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
DATABASE_URL=postgresql://user:password@host:5432/database
```

## Editing the page

The main page is generated from `app/page.tsx`. To build or adjust the screen:

- edit the component in `app/page.tsx`
- add reusable UI building blocks in `components/ui/`
- update global styling in `app/globals.css`

The app uses the App Router and will hot-reload as you change the source.

## Recommended workflow

For a typical page build:

1. design the section structure in `app/page.tsx`
2. reuse or extend UI components from `components/ui/`
3. apply spacing, colors, and typography via Tailwind utility classes
4. validate with `pnpm lint`
5. run `pnpm build` before production deployment

## Deployment

This app is ready to deploy on platforms such as:

- Vercel
- any Node.js-compatible hosting platform

For Vercel, the standard Next.js deployment flow is the easiest option.

## Notes

This project is currently a solid frontend foundation for a car recycler app. It includes the necessary tooling and component structure, and it is ready for you to turn into a complete inventory, buying, or recycling dashboard.
