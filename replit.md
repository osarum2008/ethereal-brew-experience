# Ethereal Brew Experience

A premium tea/coffee experience web app built with TanStack Start (SSR React), Tailwind CSS v4, and shadcn/ui components.

## Run & Operate

- `bun run dev` — start the dev server (port 8081 → external port 80)
- `bun run build` — production build
- `bun run preview` — preview the production build
- `bun run lint` — lint with ESLint
- `bun run format` — format with Prettier

## Stack

- **Runtime**: Bun 1.3
- **Framework**: TanStack Start (SSR) + TanStack Router
- **UI**: React 19, Tailwind CSS v4, shadcn/ui, Radix UI
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts
- **Build**: Vite 8 via `@lovable.dev/vite-tanstack-config`

## Where things live

- `src/routes/` — TanStack Router file-based routes
- `src/components/ui/` — shadcn/ui component library
- `src/components/site/` — app-specific components (Cart, Cursor, etc.)
- `src/assets/` — images and uploaded assets
- `src/styles.css` — global styles
- `vite.config.ts` — Vite + TanStack Start configuration

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- **IPv6 not supported in Replit**: `@lovable.dev/vite-tanstack-config` forces `host: "::"` — overridden to `"0.0.0.0"` in `vite.config.ts`
- **Port 8081 = external port 80**: Replit maps internal port 8081 → external port 80 (root). The dev server must bind port 8081.
- **Bun install cache**: exclude `**/.cache/**` from Vite's file watcher to prevent EMFILE (too many open files) errors.
- **Package manager**: use `bun` — the project uses `bun.lock` and is incompatible with pnpm/npm.
