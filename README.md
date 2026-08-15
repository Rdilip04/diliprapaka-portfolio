# Dilip Rapaka — Portfolio

Personal portfolio for a junior UX / Product Designer working in the UK. Light, editorial and typographic, built so the site itself serves as the work sample.

Built with Next.js 16 (App Router), React 19, Tailwind CSS v4 and Motion v12.

## Getting started

```bash
npm install
```

```bash
PORT=3311 npm run dev
```

Then open <http://localhost:3311>. Port 3311 rather than the default, because 3000 is used by another project in this environment.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run test` | Unit tests (Vitest) |
| `npm run test:e2e` | End-to-end and accessibility tests (Playwright) |
| `npm run test:all` | Both suites |

Type-check and lint with the local binaries, since a bare `npx tsc` resolves to an unrelated global package:

```bash
./node_modules/.bin/tsc --noEmit && ./node_modules/.bin/eslint .
```

## Documentation

- **[PROGRESS.md](PROGRESS.md)** — the design and engineering handbook: design system, accessibility budget, settled decisions and known traps. **Read this before making changes.**
- **[IMAGES.md](IMAGES.md)** — Figma export guide for case-study imagery.
- **[AGENTS.md](AGENTS.md)** — notes for AI coding agents working in this repository.
