# Battron — Battery Job Card

A pixel-perfect, frontend-only re-implementation of the Battron Battery Job Card
mobile web app, built with **React + TypeScript + Vite + Tailwind CSS**.

There is **no backend** — all state lives in React state and is persisted to
`localStorage` (`btn_current` for the working draft, `btn_jobs` for saved jobs).

The original single-file reference implementation is preserved at
`Battron_Job_Card.html` and remains the source of truth for design and logic.

## Run

```bash
npm install
npm run dev
```

Then open the printed local URL.

## Other scripts

```bash
npm run build      # type-check (tsc -b) + production build
npm run typecheck  # type-check only (tsc --noEmit)
npm run preview    # preview the production build
```

## Project structure

```
src/
  main.tsx, App.tsx
  styles/globals.css          Tailwind directives, body base, @media print
  state/JobCardContext.tsx    all form state, chips, parts, cell grids, persistence
  lib/                        constants, pure calc, Battron Score, localStorage
  components/                 reusable UI primitives (one per file)
  sections/                   the 8 accordion sections
  hooks/useToast.ts           toast context
```

## Notes / deviations

- The logo is an inline SVG `BATTRON` wordmark placeholder
  (`src/components/Logo.tsx`) — swap it for a real asset later.
- `<select>` controls always carry the green outline + border, matching the
  original CSS rule `select,input:focus,textarea:focus{...}`.
- Text inputs intentionally have **no** hover state (the original defines none);
  buttons, chips, the segmented toggle, "Now" and dashed "add" buttons all have
  hover and focus states.
