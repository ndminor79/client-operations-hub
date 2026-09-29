# Client Operations Hub

Client Operations Hub is a calm, lightweight operations workspace for small service businesses. It combines the core ideas of a CRM, project-management tool, invoicing workspace, shared document area, and client portal in one product experience.

The project is designed to serve two purposes:

1. A portfolio-quality resume project that demonstrates product thinking, frontend interaction design, responsive UI implementation, and backend/security fundamentals.
2. A realistic foundation for a future multi-tenant SaaS product for freelancers, photographers, contractors, consultants, agencies, web developers, and cleaning or landscaping businesses.

The current version is a working React/Vite prototype with interactive demo state, a persistent browser-local workspace profile, and a small Express/MongoDB-ready API foundation. New workspaces intentionally start empty. The frontend does not yet persist business data to MongoDB; the README calls out those boundaries clearly so demo behavior is not confused with production behavior.

## Product concept

Small service businesses often stitch together a spreadsheet, calendar, email inbox, file-sharing service, invoicing tool, and project-management app. Client Operations Hub brings the most important workflows into one workspace:

- Keep a clean list of clients and active engagements.
- See project progress, deadlines, revenue, and outstanding balances at a glance.
- Track appointments and follow-ups.
- Organize invoices, files, and client communication around the project they belong to.
- Give clients a simple, branded portal for status updates, approvals, documents, and messages.

## Tech stack

| Layer | Technology | How it is used |
| --- | --- | --- |
| UI framework | React 18 | Renders the application shell, dashboard, navigation states, modal, project list, and client portal preview. |
| Build tool | Vite 6 | Provides fast local development, JSX transformation, module bundling, and the production build in `dist/`. |
| Language | JavaScript with JSX | Keeps the prototype compact while using component functions, hooks, and event handlers. |
| Styling | CSS | Implements the layout system, design tokens, responsive breakpoints, cards, progress bars, modal, portal state, and visual polish. |
| Icons | Lucide React | Supplies consistent inline SVG icons for navigation, metrics, actions, activity, files, and status states. |
| Runtime | Node.js | Runs the Vite development client, the API server, and the portable `dev.mjs` process runner. |
| API framework | Express 4 | Provides the `/api/health` and `/api/config` endpoints plus middleware and fallback error handling. |
| Database adapter | Mongoose 8 | Provides the MongoDB connection layer that the API can use when `MONGODB_URI` is configured. |
| Security headers | Helmet 8 | Adds common HTTP security headers to the Express responses. |
| Cross-origin policy | CORS | Restricts API requests to the configured `CLIENT_ORIGIN`. |
| Configuration | dotenv | Loads server-only values from a local `.env` file that is excluded from Git. |
| Package management | npm | Installs dependencies, runs scripts, creates `package-lock.json`, and supports audit checks. |

## Architecture

The intended architecture follows the requested MERN direction:

```text
React + Vite frontend
        |
        | HTTP / JSON API calls
        v
Express API running on Node.js
        |
        | Mongoose models and queries
        v
MongoDB
```

In the current prototype, the React layer uses synthetic in-memory data so the interface can be explored without credentials, a database, or customer information. The Express layer is ready for versioned resource routes and has a MongoDB connection attempt, but full CRUD routes and Mongoose models have intentionally not been added yet.

## Repository structure

```text
ClientOperationsHub/
├── src/
│   ├── App.jsx          # Main React application and demo state
│   ├── main.jsx         # React entry point
│   └── styles.css       # Complete visual system and responsive layout
├── server/
│   └── index.js         # Express server, security middleware, and API starter routes
├── .env.example         # Safe configuration template; contains no real secrets
├── .gitignore           # Excludes dependencies, builds, logs, and environment files
├── dev.mjs              # Cross-platform launcher for Vite and the API server
├── index.html           # Vite HTML entry document and metadata
├── package.json         # Scripts and dependency declarations
├── package-lock.json    # Reproducible npm dependency resolution
├── vite.config.js       # Vite and React plugin configuration
└── README.md            # Product, implementation, security, and setup documentation
```

`node_modules/` and `dist/` may exist locally after setup, but both are ignored and should not be uploaded to GitHub.

## Features included

### 1. Public homepage and access-aware navigation

New visitors land on a general product homepage rather than an example dashboard. It explains the product, shows the major feature areas, and gives the user two clear paths:

- Create your free workspace.
- View the Detailed Overview Example.

Before an account is created, the sidebar intentionally exposes only:

- Home.
- Detailed Overview Example.
- Help center.

All operational menus are hidden from visitors. Once a workspace profile exists, the authenticated workspace navigation becomes available, including Overview, Projects, Clients, Calendar, Invoices, Documents, Portal, and Inbox. Tasks are intentionally scoped to individual projects instead of living as a separate global menu.

Implementation details:

- `account` is the gate for authenticated versus visitor UI.
- `publicNavItems` defines the visitor navigation.
- `memberNavItems` defines the signed-in workspace navigation.
- `activeView` starts at `Home` for a new visitor and `Overview` for a remembered account.
- The user’s business name and initials replace the previous example account label after onboarding.

### 2. Workspace shell and navigation

The application opens into a desktop-style workspace with:

- A branded `clientops` identity and spark icon.
- A workspace selector showing the signed-in user’s business name.
- Primary navigation for Overview, Projects, Clients, Calendar, Invoices, Documents, and Portal.
- Management navigation for Inbox, with a zero-count badge for a new workspace. Tasks live on each Project Overview page.
- Help Center and Settings actions with demo feedback toasts.
- A signed-in owner row using the profile created during onboarding.
- A responsive mobile menu. At smaller widths the sidebar becomes an off-canvas panel controlled by the menu button.

Implementation details:

- `activeView` in `src/App.jsx` controls the selected navigation state.
- `publicNavItems` and `memberNavItems` are data-driven arrays, so visitor and member navigation can evolve independently.
- The same button styles are reused for the sidebar and other action controls.
- The CSS breakpoints at 800px and 520px adapt the sidebar, header, grids, project rows, and portal layout.

### 3. Detailed Overview Example and empty workspace overview

The former example dashboard is now explicitly labeled `Detailed Overview Example`. It is available to visitors and authenticated users as a reference view and continues to use synthetic project, activity, appointment, and metric data.

The authenticated Overview view is separate and starts empty. It includes the same visual structure but shows zero or ready-state values:

- `$0` revenue.
- `0` active projects.
- `$0` outstanding.
- No client satisfaction value until work exists.
- Empty project, agenda, and activity states.
- A portal card ready for the user’s first client.

The example dashboard includes:

- A contextual greeting and date.
- A `New project` call-to-action.
- Four KPI cards:
  - Total revenue: `$28,450`
  - Active projects: `4`
  - Outstanding: `$6,240`
  - Client satisfaction: `96%`
- Month-over-month or period-over-period change labels.
- Small CSS bar visualizations that make the metrics feel like a real SaaS dashboard without adding a charting dependency.
- An Active Projects panel.
- A Today’s Agenda panel with three appointments.
- A Recent Activity panel.
- A Client Portal promotional card that opens the live portal preview.

Implementation details:

- The metrics are rendered by the reusable `Metric` component.
- The project panel is rendered by `ProjectRow` components from the supplied project array; the example uses `exampleProjects`.
- The agenda uses reusable `AgendaItem` components and the example uses `exampleAgenda`.
- Recent activity entries are rendered from the supplied activity array by `ActivityItem`; the example uses `exampleActivities`.
- Example content is isolated in `exampleProjects`, `exampleActivities`, and `exampleAgenda`; new accounts use empty arrays instead.
- The dashboard is laid out with CSS Grid and collapses from two columns to one on smaller screens.

### 4. Account creation and remembered workspace

The public homepage provides a `Create your free workspace` action. The account modal asks for:

- Full name.
- Business name.
- Work email.

After submission:

1. The profile is normalized and stored in browser `localStorage` under `client-operations-hub-profile`.
2. The user is signed into the empty Overview workspace.
3. The member-only menus become visible.
4. The workspace header, business switcher, avatar, and greeting use the new profile values.
5. The user can create projects without modifying the example dashboard.

On a later launch, the stored profile is read synchronously when the app starts, so the user returns to their workspace instead of seeing the visitor homepage. The signed-out action removes the stored profile and returns the browser to visitor mode.

Important security boundary: this is browser-local onboarding for a prototype, not production authentication. The form does not store a password, and the profile is not server-backed. A production version must use real authentication, secure sessions, server-side identity checks, and tenant authorization.

### 5. Project management preview

The project experience shows how a service business can track several engagements at once:

- Project name and client.
- Project type, such as Brand strategy, Web development, Photography, or Marketing retainer.
- Status, such as In progress, Needs review, Scheduled, or Planning.
- Completion percentage.
- Due date.
- Client initials with a color-coded avatar.
- Progress bars that change color by row for visual scanning.

The Projects navigation state displays the project list in a larger view. Clicking a project row opens that project’s dedicated Project Overview page.

### 6. Project Overview and project-scoped tasks

Every project row now opens a dedicated Project Overview page. The page includes:

- Back navigation to the originating Overview or Projects view.
- Project name, client, project type, status, due date, and project value.
- A calculated progress percentage.
- A project-level Tasks panel.
- Completed versus total task count.
- Task status rows with owner and due-date context.
- Checkboxes to mark tasks complete or incomplete.
- An inline form to add new tasks to the current project.
- Project progress visualization.
- Project notes placeholder.
- Project sharing placeholder.

Tasks are stored in `tasksByProject`, keyed by project ID, so each project has its own task collection. New projects begin with no tasks. Example projects load their synthetic task lists only inside the Detailed Overview Example flow. Completing a task recalculates the project progress display immediately.

### 7. Add-project interaction

For signed-in users, the `New project` action is fully interactive in the prototype:

1. The user opens a modal.
2. The user enters a project name and client name.
3. Native required-field validation prevents empty submissions.
4. The submitted values are trimmed and added to the top of the in-memory project list.
5. Initials are generated from the client name.
6. The modal closes and a success toast confirms the action.

Implementation details:

- `showModal` controls modal visibility.
- `addProject` handles `FormData` extraction and state updates.
- The modal closes when the user presses Cancel, the close icon, or clicks the backdrop outside the form.
- The current version does not send this data to the API or persist projects after refresh.

Visitors are routed to account creation when they select `Create your workspace` from the example view rather than being allowed to modify the example data.

### 8. Global search

The topbar includes a search field labeled `Search anything...`:

- Search matches against project name, client name, and project type.
- Filtering is case-insensitive.
- Search results update as the user types.
- If there are no matches, the project panel shows an empty state instead of failing silently.
- A visual `⌘ K` hint communicates a future command-palette shortcut.

Implementation details:

- `query` stores the current input.
- `filteredProjects` is derived with `useMemo` to avoid recomputing unnecessarily on unrelated renders.
- The same filtered results are available in the Projects view.

### 9. Agenda and appointments

The dashboard includes a lightweight appointment agenda:

- Date header and appointment count.
- Time and AM/PM label.
- Appointment title.
- Client or company name.
- Color-coded vertical marker.
- Overflow affordance for future appointment actions.

The Calendar navigation state currently acts as a product placeholder and provides a demo action toast. A future implementation would add calendar data, recurring appointments, time zones, conflict detection, and calendar-provider integrations.

### 10. Invoices and revenue visibility

Invoice-oriented content appears in several places:

- Total revenue metric.
- Outstanding balance metric.
- Recent activity entry for a received payment.
- Invoices navigation state.
- Client portal quote amount and approval state.

The Invoices view currently provides a product placeholder rather than a full invoice editor or payment integration. A production implementation should calculate totals on the server, use a payment provider, verify webhook signatures, and avoid trusting client-submitted amounts.

### 11. Documents and file sharing

The app demonstrates document-sharing concepts in the client portal:

- File type badge.
- Filename.
- File size and modified date.
- Shared-file rows.
- Upload-document affordance.

The upload button currently opens a feedback toast. No file is transferred or stored by the prototype. In production, uploaded files should go to private object storage using signed, expiring URLs. They should be validated for size and type, scanned for malware, associated with an authorized tenant/project, and never be committed to the repository or served from a public static directory.

### 12. Client portal preview

The Client Portal is the main differentiating feature. It can be opened from the sidebar or the Overview card and includes:

- Client-facing greeting: `Welcome, Jamie`.
- Project identity and last-updated context.
- Project status badge.
- Project status card with 68% completion.
- Milestone timeline for Kickoff, Strategy, Design review, and Launch.
- “Needs your approval” quote card.
- Quote total of `$8,400 USD`.
- Approve quote action.
- Shared files card.
- Upload a document action.
- Project-lead messaging card.
- Share portal action.

Approval behavior:

- Clicking `Approve quote` changes the UI to an approved state.
- The UI displays `Approved on Oct 15`.
- A toast indicates that the team was notified.
- This is local demo state only; the future API should create an auditable approval record and enforce that the approving client has permission for that quote.

Implementation details:

- `PortalView` is a dedicated React view in `src/App.jsx`.
- `approved` is local component state.
- Portal cards reuse the existing panel, button, avatar, and status styles.
- The portal uses a responsive two-column layout that collapses to one column on mobile.

### 13. Activity history

Recent activity communicates the kind of audit trail the product will eventually provide:

- Quote approved.
- New document uploaded.
- Message sent.
- Payment received.
- Relative time labels.
- Color-coded activity icons.

The entries are currently static synthetic demo data. A production version should write activity events server-side, include actor and tenant identifiers, and prevent users from editing or spoofing historical events from the browser.

### 14. Notifications and feedback toasts

The notification bell opens a small notification popover showing unread updates and a `Mark all as read` action. Most placeholder actions use a shared toast pattern to communicate that an action was received:

- `notify(message)` updates the toast state.
- A timeout clears the toast after a short period.
- The same pattern is used for project creation, quote approval, help/settings placeholders, portal actions, and navigation affordances.

This keeps the prototype feeling responsive while the real server workflows are still being built.

## Frontend implementation

### `src/main.jsx`

`main.jsx` is the browser entry point. It:

- Imports React Strict Mode.
- Imports `createRoot` from `react-dom/client`.
- Mounts `<App />` into the `#root` element from `index.html`.
- Imports the global stylesheet.

### `src/App.jsx`

`App.jsx` contains the current product prototype in one focused module:

- Synthetic data arrays for projects, activity, and navigation.
- App-level state for active view, project list, search, modal, notifications, mobile navigation, and toast state.
- The workspace shell and topbar.
- The Overview view.
- The Portal view.
- Placeholder states for future resource areas.
- Reusable presentational components for metrics, panels, projects, agenda entries, activity entries, and empty states.

This single-file approach is intentional for a small portfolio prototype. As the product grows, it should be split into feature modules such as `features/projects`, `features/portal`, `features/invoices`, shared UI components, API clients, and route-level pages.

### `src/styles.css`

The stylesheet defines the complete visual language:

- Neutral background and white surface colors.
- Lavender primary accent.
- Green, blue, orange, peach, and mint status colors.
- Rounded cards and buttons.
- Manrope for headings and DM Sans for interface copy through the Google Fonts import.
- Responsive sidebar and content grids.
- Modal backdrop and card.
- Portal-specific status, milestone, file, and approval styling.
- Mobile rules at 800px and 520px.

No external charting or component-library dependency is needed for the current UI. The small metric sparkline visuals are built from CSS spans.

## Backend implementation

### `server/index.js`

The Express server is a security-conscious starter API:

1. `dotenv/config` loads server configuration without exposing it to the client bundle.
2. Express is initialized.
3. `app.disable('x-powered-by')` removes a common Express fingerprinting header.
4. Helmet adds security-related HTTP headers.
5. CORS is restricted to `CLIENT_ORIGIN` and credentials are explicitly configured.
6. JSON request bodies are limited to 100 KB.
7. `/api/health` reports API health and whether Mongoose is connected.
8. `/api/config` reports non-secret application metadata.
9. Unknown routes return a generic 404 JSON response.
10. The error middleware logs server-side details while returning a generic 500 message to clients.
11. If `MONGODB_URI` exists, Mongoose attempts a connection with a short server-selection timeout.
12. If MongoDB is unavailable, the server remains available in API demo mode.

Current API routes:

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/api/health` | Returns `{ ok, database }` for local/deployment health checks. |
| `GET` | `/api/config` | Returns safe application metadata; no secrets are exposed. |
| Any | Unknown route | Returns `{ error: "Route not found" }` with HTTP 404. |

There are not yet authentication, tenant CRUD, project CRUD, invoice, appointment, document, or messaging routes. Those should be added behind authentication and authorization rather than exposed as unauthenticated demo endpoints.

## Configuration and secrets

`.env.example` is safe to commit and documents the expected server configuration:

```env
PORT=4000
MONGODB_URI=mongodb://127.0.0.1:27017/client-operations-hub
CLIENT_ORIGIN=http://localhost:5173
SESSION_SECRET=replace-with-a-long-random-secret
```

Security rules for this repository:

- Never commit `.env` or `.env.*` files containing real values.
- Keep `!.env.example` in `.gitignore` so the safe template remains shareable.
- Never put MongoDB credentials, API keys, session secrets, customer exports, production logs, or private documents in source files.
- Treat Vite environment variables as public if they use the `VITE_` prefix; never put server secrets in them.
- Use the deployment platform’s secret manager in production.
- Rotate any credential immediately if it is ever committed or pasted into an issue.

## Running locally

### Prerequisites

- Node.js 18 or newer.
- npm.
- MongoDB is optional for the current demo. Without it, the API reports `database: "offline"` and still serves its health/config routes.

### Install

```bash
npm install
copy .env.example .env
```

On macOS or Linux, copy the file with:

```bash
cp .env.example .env
```

### Start the client and API together

```bash
npm run dev
```

The custom `dev.mjs` runner starts Vite and the Express API using Node child processes. This avoids depending on shell-specific process-spawning behavior.

- Frontend: `http://127.0.0.1:5173`
- API: `http://localhost:4000`
- Health check: `http://localhost:4000/api/health`

### Run them independently

```bash
npm run client
npm run server
```

### Create a production frontend build

```bash
npm run build
```

The bundled frontend is written to `dist/`, which is ignored by Git.

### Serve the production build locally

```bash
npm run preview
```

## npm scripts

| Script | Command | Purpose |
| --- | --- | --- |
| `dev` | `node dev.mjs` | Starts the Vite client and Express API together. |
| `client` | `vite` | Starts only the Vite development server. |
| `server` | `node server/index.js` | Starts only the Express API. |
| `build` | `vite build` | Creates the optimized production frontend bundle. |
| `preview` | `vite preview` | Serves the built frontend locally for a production-like check. |

## Security posture

The project includes baseline protections appropriate for a public portfolio repository:

- Environment files are ignored.
- Demo data is synthetic.
- New accounts never receive the example projects, example account name, example activities, or example appointments.
- Visitor navigation is restricted to the public homepage, Detailed Overview Example, and Help center.
- Account profile persistence stores only the display name, business name, email, and creation timestamp in browser storage; it does not store a password.
- No authentication tokens or production credentials are present.
- Express fingerprinting is disabled.
- Helmet is enabled.
- CORS has an explicit configured origin.
- JSON payloads are size-limited.
- Unknown routes and server failures return generic responses.
- Private document-storage guidance is included.
- The dependency tree was audited during development.

This is not a claim that the application is production-secure yet. Before handling real customers or payments, add:

- Passwordless or password-based authentication with secure, short-lived sessions.
- Tenant isolation and authorization checks on every database query.
- Server-side input validation and normalization.
- Rate limiting and abuse monitoring.
- CSRF protection when using cookie-based authentication.
- Secure cookie flags and session rotation.
- Password hashing with a modern password-hashing algorithm if passwords are supported.
- Audit logging for approvals, payments, permissions, file access, and messages.
- Private object storage with expiring signed URLs.
- Upload allowlists, size limits, malware scanning, and content-disposition controls.
- Payment-provider webhook signature verification.
- Database indexes, backups, restore testing, and encryption at rest.
- Centralized secret management and production HTTPS.
- Security headers and a Content Security Policy tuned for the final deployment.
- Automated dependency updates and CI security checks.

## Suggested production data model

The eventual MongoDB schema should be tenant-aware. A first pass could include:

```text
Tenant
├── User
├── Client
│   ├── Contact details
│   └── Portal access
├── Project
│   ├── Task
│   ├── Appointment
│   ├── Quote / Invoice
│   ├── Document
│   ├── Message
│   └── Activity event
└── Billing / subscription metadata
```

Every tenant-owned document should carry a tenant identifier, and every read/write should scope by both the authenticated principal and tenant. Client-portal links should use revocable, expiring access tokens or authenticated portal accounts rather than predictable IDs.

## Production roadmap

### Phase 1: persistence and API

- Add Mongoose schemas and indexes.
- Add `/api/v1` route versioning.
- Connect the React app to a typed API client.
- Replace in-memory state with server-fetched data.
- Add loading, error, optimistic-update, and empty states.

### Phase 2: identity and tenant security

- Add user registration/invitation and authentication.
- Add tenant membership and roles.
- Add authorization middleware and resource-level ownership checks.
- Add request validation and rate limiting.

### Phase 3: business workflows

- Persist the current Project Overview pages and project-scoped task management.
- Add calendar persistence and reminders.
- Add quote/invoice generation and payment provider integration.
- Add activity event creation on the server.

### Phase 4: client portal

- Generate secure portal invitations.
- Add portal authentication or magic links.
- Persist approvals and messages.
- Add private file storage, scanning, and signed downloads.
- Add client notification preferences.

### Phase 5: SaaS operations

- Add subscription billing and plan limits.
- Add onboarding, usage metrics, backups, monitoring, and support tooling.
- Add automated tests, CI/CD, staging environments, and deployment documentation.

## Resume-ready project summary

> Built a responsive React/Vite operations platform for small service businesses, combining CRM, project tracking, appointments, invoices, documents, activity history, and a client portal. Implemented reusable dashboard components, live project search, modal-driven project creation, client quote approval, responsive mobile navigation, and a Node/Express/Mongoose API foundation with Helmet, explicit CORS, payload limits, environment-based configuration, and repository-safe secret handling.

## Current limitations

The following are intentionally represented as UI foundations or placeholder flows rather than finished production features:

- No production authentication or authorization yet; onboarding is a browser-local prototype flow.
- The remembered profile is stored in `localStorage`, which is not an appropriate production session store.
- No MongoDB schemas or persisted CRUD resources yet.
- Project creation only updates local React state.
- Calendar, clients, invoices, documents, and inbox views are placeholder views. Task management is implemented inside Project Overview pages.
- Upload, messaging, share-link, and “mark as read” actions are demo feedback interactions.
- The client portal is a single synthetic preview rather than a tenant-specific route.
- No email provider or notification queue is connected.
- No payment provider is connected.
- No automated test suite has been added yet.

Documenting these limits is part of keeping the project trustworthy: the prototype demonstrates the intended experience while making the work required for a production SaaS explicit.
