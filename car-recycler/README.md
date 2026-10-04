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

## Database and photo storage

The inventory and vehicle photo features require a PostgreSQL database and a Supabase project. Add these values to `.env.local`:

```env
DATABASE_URL=postgresql://user:password@host:5432/database
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
SUPABASE_SERVICE_ROLE_KEY=your-server-only-service-role-key
INITIAL_ADMIN_SETUP_TOKEN=generate-a-long-random-one-time-token
INITIAL_ADMIN_SETUP_ENABLED=true
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Apply the Drizzle schema with:

```bash
pnpm db:push
```

Create a private Supabase Storage bucket named `inventory-photos`. Uploaded image files are stored in this bucket; their storage paths are recorded in the `vehicle_photos` table. Configure Storage row-level security policies for authenticated employee upload and delete access. Do not enable unrestricted anonymous uploads or deletes in production.

## Employee access and administration

Enable email/password authentication in Supabase and add the local and production `/auth/callback` URLs to the Auth redirect allow list. Configure SMTP for invitation emails. Set the Auth Site URL to the app origin. In the Supabase **Invite user** email template, link directly to the callback with the invite token hash so the server can verify it:

```text
{{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=invite&next=%2Fsettings%3Fsetup%3Dpassword
```

Keep `SUPABASE_SERVICE_ROLE_KEY` server-only; it is used to invite and remove employee accounts.

To bootstrap the first administrator, generate a new token (for example, `openssl rand -hex 32`), set it as `INITIAL_ADMIN_SETUP_TOKEN`, set `INITIAL_ADMIN_SETUP_ENABLED=true`, apply the schema with `pnpm db:push`, and visit `/setup`. The setup page creates the Auth account and its `employees` row only while no active admin exists. Turn the enable flag off and remove the token immediately after setup. Admins can then create employee accounts by inviting them and can promote employees to admins from Settings. Invitees receive a link and are directed to Settings to set their password.

## Editing the page

The main page is generated from `app/page.tsx`. To build or adjust the screen:

- edit the component in `app/page.tsx`
- add reusable UI building blocks in `components/ui/`
- update global styling in `app/globals.css`

The app uses the App Router and will hot-reload as you change the source.
# Smart Parts / Car Recycler

CarRecycler is a vehicle and parts inventory app for recycling operations. Employees manage vehicles, photos, and inventory details; administrators manage team access and inventory defaults.

## Features

- Dashboard with vehicle inventory metrics
- Searchable vehicle inventory with create, view, edit, and delete workflows
- Vehicle photo uploads stored in Supabase Storage, with paths recorded in Postgres
- Email/password employee sign-in through Supabase Auth
- Admin invitations, employee roles, and account removal
- Settings for vehicle conditions, yard locations, and password updates
- Server-side employee/admin checks for protected pages and mutations

## Tech stack

- Next.js 16 App Router and React 19
- TypeScript and Tailwind CSS 4
- Drizzle ORM with PostgreSQL
- Supabase Auth, Storage, and `@supabase/ssr`
- Base UI, Lucide icons, and reusable local UI components

## Project structure

```text
src/
├── app/
│   ├── auth/             # Sign-in actions and invitation callback
│   ├── dashboard/
│   ├── settings/         # Admin and account settings
│   └── vehicles/         # Inventory, detail, create, and edit routes
├── db/
│   ├── queries/          # Drizzle data access
│   └── schema.ts         # PostgreSQL table definitions
├── lib/
│   ├── auth/             # Employee and role checks
│   └── supabase/         # Server/admin clients and photo URLs
└── proxy.ts              # Supabase session refresh and route gate
components/
├── auth/
├── dashboard/
├── layout/
├── settings/
├── ui/
└── vehicles/
```

## Getting started

Prerequisites: Node.js 20+ and pnpm 12.

Install dependencies:

```bash
pnpm install
```

Configure `.env.local`:

```env
DATABASE_URL=postgresql://user:password@host:5432/database
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
SUPABASE_SERVICE_ROLE_KEY=your-server-only-secret-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Keep `SUPABASE_SERVICE_ROLE_KEY` server-only. Never use a secret/service-role key in a `NEXT_PUBLIC_` variable.

Apply the Drizzle schema, then start the app:

```bash
pnpm db:push
pnpm dev
```

Open `http://localhost:3000`.

## Database and photo storage

The Drizzle schema in `src/db/schema.ts` defines `employees`, `inventory_settings`, `vehicles`, `parts`, `vehicle_photos`, and `part_photos`. Employee identities and passwords are managed by Supabase Auth; `employees` stores the app profile, active status, and role.

Create a private Supabase Storage bucket named `inventory-photos`. Uploaded photo binaries live in Storage, while `vehicle_photos.storage_path` records their location. Configure authenticated Storage policies for employee uploads and deletes; do not allow unrestricted anonymous access in production.

## Employee access and administration

Enable email/password authentication in Supabase, configure SMTP, set the Auth Site URL to the app origin, and add `/auth/callback` to the redirect allow list. In the Supabase **Invite user** email template, use:

```text
{{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=invite&next=%2Fsettings%3Fsetup%3Dpassword
```

Admins invite employees and assign roles from Settings. Invitees accept their email link and set their password in Settings.

### First administrator

For initial setup only, generate a strong token:

```bash
openssl rand -hex 32
```

Set it in `.env.local` as `INITIAL_ADMIN_SETUP_TOKEN`, temporarily set `INITIAL_ADMIN_SETUP_ENABLED=true`, apply the schema with `pnpm db:push`, and visit `/setup`. The setup route only creates an account if no active admin exists. After creating the first admin, set the enable flag to `false` and remove the token.

## Scripts

```bash
pnpm dev          # Run the development server
pnpm build        # Create a production build
pnpm start        # Serve the production build
pnpm lint         # Run ESLint
pnpm db:generate  # Generate a Drizzle migration
pnpm db:migrate   # Apply generated migrations
pnpm db:push      # Push the schema to PostgreSQL
pnpm db:studio    # Open Drizzle Studio
```

## Quick demo walkthrough

1. Sign in and show the Dashboard metrics.
2. Open Vehicles, search the inventory, and view a vehicle.
3. Upload a photo and show it appear in the gallery.
4. Open Settings as an admin to invite an employee and review role controls.
5. Show the inventory defaults and explain that they populate vehicle forms.

## Checks

```bash
pnpm lint
pnpm build
```
