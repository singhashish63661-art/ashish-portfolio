## Ashish Portfolio

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables:

```bash
cp .env.example .env.local
```

Then update `.env.local` with:
- `GEMINI_API_KEY`
- `UPSTASH_REDIS_REST_URL` (optional, recommended for production)
- `UPSTASH_REDIS_REST_TOKEN` (optional, recommended for production)

3. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Scripts

- `npm run dev` - start local development server
- `npm run build` - create production build
- `npm run start` - run production server
- `npm run lint` - run ESLint checks
- `npm run test` - run tests in watch mode
- `npm run test:run` - run tests once (CI mode)

## CI

GitHub Actions workflow is configured at `.github/workflows/ci.yml` and runs on pushes to `main` and pull requests:

- `npm ci`
- `npm run lint`
- `npm run build`
- `npm run test:run`

## Notes

- The chatbot API route is at `app/api/chat/route.ts`.
- Chat rate limiting uses Upstash Redis when `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are set.
- If Upstash env vars are missing, it falls back to in-memory limiting (best-effort for single-instance runtime).

## Deploy

Deploy on [Vercel](https://vercel.com/new) or any platform that supports Next.js.
