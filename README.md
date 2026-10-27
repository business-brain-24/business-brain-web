# Business Brain

Marketing site and interactive demo for **Business Brain**, an AI-centric ERP for growing businesses in Bangladesh. It covers HR, payroll, finance, purchasing, inventory, sales and manufacturing, with conversational AI on top.

Built with Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 4, Framer Motion and Lucide icons.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

## What's in the site

**Marketing pages** (`src/app/`)
- `/`: home page
- `/products`, `/products/[slug]`: the ERP modules
- `/industries`, `/industries/[slug]`: industry solutions
- `/pricing`: custom quote request (see below)
- `/customers`, `/about`, `/partners`, `/resources`, `/careers`, `/contact`, `/demo`

**Ask Brain AI** (`/ask`): a full-screen chat demo that answers questions about the business with charts and tables. Other pages can open it with a question: `/ask?q=…`.

### Pricing

Business Brain is a dedicated ERP, so there are no fixed packages. `/pricing` is a quote request form: contact details, industry, users, branches, deployment (cloud or on-premise), the modules needed, and any number of custom requirement rows.

> The form shows a confirmation but does not send submissions anywhere yet. Connect it to email or a backend before going live.

## Demo workspace

A sample logged-in ERP that lets prospects try the product.

**Demo login:** go to `/login` and sign in with username `jubair`, password `1234`.

After login the site nav shows **My apps** and an avatar menu. The workspace runs full-screen, like the chat, with its own app bar.

- **`/dashboard`**: app launcher: a greeting, an Ask Brain AI box, today's key numbers, category tabs, search, and pinned apps.
- **`/dashboard/[app]`**: 36 apps in four groups (General, HRMS, Operational, Other). Each opens on its own **Overview** dashboard. A second tab holds the app's working view:

| Working view | Apps |
| --- | --- |
| Records (filters, search, detail drawer) | Payroll, Attendances, Expenses, Movement, Inventory, Procurement, Purchase, Invoicing, Gate Pass, Timesheets |
| Board | To-do, CRM, Project, Recruitment, Purchase Requisition, Onboarding/Offboarding |
| Week calendar | Calendar, Shift, Leave |
| Chat | Discuss |
| Feed | Announcements |
| People directory | Contacts, Users, Employees |
| Card library | eLearning, Surveys, Events, Campaigns, Apps |
| Settings | Settings |
| Overview only | Sales, Demand, Website, Dashboards, HR Dashboard, HR Reporting |

> **This is a demo, not real authentication.** The demo user lives in client code (`src/lib/session.ts`), the session is kept in `sessionStorage`, and all workspace data is sample data written into the code. Buttons such as *Approve* or *Run payroll* don't save anything.

### Where things live

| Path | Purpose |
| --- | --- |
| `src/lib/session.ts` | Demo users and the `useUser()` hook |
| `src/lib/workspace.ts` | The app catalogue: names, icons, categories, headline figures |
| `src/lib/overviews.ts` | Each app's Overview dashboard, built from widgets |
| `src/lib/app-seeds.ts` | Each app's working view and its sample records |
| `src/components/workspace/widgets.tsx` | Chart widgets: KPIs, line, bars, stacked, donut, funnel, gauge, heatmap, progress, leaderboard, timeline, list, table, AI insight |
| `src/components/workspace/layouts/` | Working-view layouts: records, kanban, calendar, chat, feed, directory, cards, settings |
| `src/app/dashboard/layout.tsx` | Full-screen workspace shell |

### Adding an app or demo user

1. Add the app to `apps` in `src/lib/workspace.ts`.
2. Add its dashboard to `overviews` in `src/lib/overviews.ts`.
3. Optionally, add a working view in `src/lib/app-seeds.ts`. Without one, the app shows its overview only.

To add a demo user, add an entry to `DEMO_USERS` in `src/lib/session.ts`.

## Notes

- Entrance animations use CSS keyframes (`bb-fade-up`, `bb-rise`, `bb-grow` in `globals.css`), so content always ends visible even if JavaScript is slow.
- Brand colours are defined as theme tokens in `src/app/globals.css`, with orange `#FF6B2C` and ink `#0B0D12`.
