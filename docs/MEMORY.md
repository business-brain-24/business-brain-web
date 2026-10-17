# Business Brain (BB-24) — Persistent Codebase Memory

> **Last Updated**: 2026-10-17
> **Status**: Active & Evergreen

## 1. Project Identity & Philosophy
- **Identity**: Next.js 15 enterprise SaaS web application for Business Brain (BB-24), an AI-driven operational intelligence & ERP system.
- **Promise**: Unifying accounting, procurement, budget, inventory, HR, sales, and manufacturing with conversational AI queries ("Ask Business Brain") and real-time operational insights.
- **Architecture**: Next.js App Router (15.5.28), React 19, TypeScript, Lucide Icons, and modern design system.

## 2. Process Topology & Runtime Ports
- **Frontend / Dev Server**: Port 3000 (`npm run dev`)
- **Production Build**: Next.js static and dynamic App Router routes (`npm run build`)

## 3. Core Subsystems & Architecture
- **Marketing & Product Pages** (`src/app/`):
  - Landing (`/`): Hero, modular product grids, live metrics, interactive previews, client testimonials.
  - Products (`/products`, `/products/[slug]`): Dynamic showcase for 14 enterprise modules (Accounting, Procurement, Budget, etc.).
  - Industries (`/industries`, `/industries/[slug]`): Industry-tailored solutions (Garments, Manufacturing, Retail, etc.).
  - AI Assistant (`/ask`): Interactive conversational AI querying interface.
  - Solutions & Corporate (`/about`, `/pricing`, `/customers`, `/partners`, `/resources`, `/careers`, `/demo`, `/contact`).
- **Design System & Components** (`src/components/`, `src/app/globals.css`):
  - Navigation & Footer: Global header with dropdowns, responsive mobile drawer, and comprehensive footer.
  - UI Blocks: Stats counters, feature cards, quote carousels, CTA banners.
- **Data & Libs** (`src/lib/`):
  - Catalog definitions, modules metadata, customer success case studies.

## 4. Security & Safety Invariants
- Client components explicitly declared with `'use client'`.
- Zero credentials or environment secrets in client bundle.
- Validated route slugs via `generateStaticParams`.
- Next.js updated to 15.5.28 (patched for CVE-2025-66478).

## 5. Verification & Test Suite
- **TypeScript**: `npx tsc --noEmit` (Clean)
- **Lint**: `npm run lint` (Clean)
- **Production Build**: `npm run build` (38/38 pages generated statically on Next 15.5.28)

## 6. Evolution & Decision Log
- **2026-10-17**: Complete initial architecture & implementation of Business Brain web application with full product suite, interactive demo/ask modules, customer case studies, and responsive UI components. Initialized remote tracking to `https://github.com/nibir404/Business-Brain.git`.
- **2026-10-17**: Upgraded Next.js and `eslint-config-next` to `15.5.28` resolving security vulnerability warnings and verified full production build integrity across all routes.
