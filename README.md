# Encounter Ground website

Next.js 16 (App Router, Turbopack) + Tailwind CSS 4. Auth via Supabase; data from the Encounter Ground API.

```bash
pnpm install
cp .env.example .env.local
pnpm dev     # http://localhost:3000
```

## Structure

- `src/app/(site)` public pages: home, about, events, contact
- `src/app/(auth)`, `(portal)`, `(school)`, `(store)`, `admin` later milestones
- `src/content/ministry.ts` ministry copy (moves to the admin-editable API in week 2)
- `src/components/layout` header, footer, navigation
- `src/fonts` self-hosted Gloock and Hanken Grotesk (SIL OFL)
- `public/brand` logo lockup (light/dark) and mark, rendered from the ministry's Logo.pdf

## Brand tokens

Defined in `src/app/globals.css` under `@theme`, taken from the logo: slate `#485868`, stone `#888898`, flame `#F8B808`, amber `#B87808` (use `amber` `#8A5A06` for gold text on light backgrounds for contrast).
