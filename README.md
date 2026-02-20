# Expro-Frontend

This is a [Next.js](https://nextjs.org) project.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `app/(public)`: Public facing pages (Landing, About, Contact, Blog, Login)
- `app/(auth)`: Authenticated pages (Dashboard, Admin)
- `components`: Reusable components
- `lib`: Utilities and helper functions
- `proxy.ts`: Authentication middleware
