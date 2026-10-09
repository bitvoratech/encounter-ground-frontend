# Encounter Ground website

Next.js 16 (App Router, Turbopack) + Tailwind CSS 4. Auth via Supabase; data from the Encounter Ground API.

```bash
pnpm install
cp .env.example .env.local
pnpm dev     # http://localhost:3000
```

## Structure

- `src/app/(site)` public pages: home, about, events, media, self-tests, blog, give, contact
- `src/app/(store)/books` bookstore (links to Amazon until checkout ships)
- `src/app/(auth)` sign in, register, forgot/reset password; `src/app/auth/*` email-link and sign-out handlers
- `src/app/(portal)/dashboard` member account page
- `src/proxy.ts` refreshes the Supabase session and guards account pages
- `src/content/posts.ts` the two blog posts carried over from the old site (move to the API with the blog)
- `public/images` photos and backgrounds carried over from the old site
- `src/components/self-test` the one-statement-at-a-time self-test and its results
- `src/lib/api.ts` fetch helper for the Encounter Ground API
- `src/app/(school)`, `admin` later milestones
- `src/content/ministry.ts` ministry copy (moves to the admin-editable API in week 2)
- `src/components/layout` header, footer, navigation
- `src/fonts` self-hosted Gloock and Hanken Grotesk (SIL OFL)
- `public/brand` logo lockup (light/dark) and mark, rendered from the ministry's Logo.pdf

## Brand tokens

Defined in `src/app/globals.css` under `@theme`, taken from the logo: slate `#485868`, stone `#888898`, flame `#F8B808`, amber `#B87808` (use `amber` `#8A5A06` for gold text on light backgrounds for contrast).
