---
name: campus-helpdesk
description: Guidelines, coding standards, and operational workflows for developing, extending, and maintaining the Campus Helpdesk React application.
---

# Campus Helpdesk Development & Maintenance Skill

This skill outlines architecture standards, component conventions, UI guidelines, form validation logic, status lifecycle workflows, analytics accuracy rules, and verification procedures for the **Campus Helpdesk** web application.

---

## 1. Project Architecture & State Conventions

- **Framework**: React 19 + Vite.
- **State Model**: Top-level state coordinator in `App.jsx` passing props and action callbacks to view components (`IssueForm`, `IssueTracker`, `AdminDashboard`, `IssueDetailModal`).
- **Data Persistence**: LocalStorage via `src/utils/storage.js` with key `campus_helpdesk_tickets_v1`. Always fall back gracefully to `INITIAL_SAMPLE_TICKETS` if localStorage is empty or unavailable.
- **Theme**: Attribute-based theme switching via `data-theme="dark"` or `"light"` on the document root with stored preferences in localStorage.

---

## 2. Writing Clean, Reusable React Components

When adding or modifying components:

1. **Single Responsibility**:
   - Keep presentational components (badges, buttons, icons, cards) decoupled from global side effects.
   - Separate data logic into `src/utils/` and domain constants into `src/constants/`.
2. **Predictable Props & Defaults**:
   - Provide default values for arrays (e.g., `tickets = []`) and optional callbacks (`onFilterByStatus`, `onSelectTicket`).
   - Prevent runtime crashes caused by `undefined` or `null` objects by utilizing optional chaining (`t?.status`) and defensive guards.
3. **Lightweight SVG Icons**:
   - Place all icons in `src/components/Icons.jsx` as pure functional SVG components accepting `size` and `className`.
   - Avoid installing bulky third-party icon libraries that increase bundle footprint or introduce version conflicts.
4. **Maintain Pure Render Cycles**:
   - Do not mutate arrays or objects in place. Use immutable updates (`[...prev]`, `.map()`, `.filter()`).x
   - Clean up asynchronous timers (e.g., Toast auto-dismissal timeouts) to prevent memory leaks.

---

## 3. Creating Responsive and Accessible UI

The Campus Helpdesk must remain fully functional across diverse device viewports:

1. **Responsive Breakpoints**:
   - Mobile: `< 480px` (single-column cards, scrollable status tabs, simplified padding).
   - Tablet: `481px - 768px` (2-column grids, mobile navigation drawer).
   - Laptop / Desktop: `> 769px` (full data table, side-by-side analytics cards, multi-column forms).
2. **Semantic HTML Elements**:
   - Use `<header>`, `<nav>`, `<main>`, `<footer>`, `<section>`, `<article>`, and native `<button>` tags.
   - Never use `<div>` with click handlers where a `<button>` or `<a>` is semantically appropriate.
3. **Accessibility (a11y)**:
   - Provide `aria-label` on icon-only buttons (e.g., modal close buttons, theme toggles, search clears).
   - Ensure clear keyboard focus states with visible focus rings (`:focus` and `:focus-visible`).
   - Use `aria-live="polite"` on notification and toast containers.
4. **Theme Contrast**:
   - Use CSS custom properties defined in `src/index.css` (`--bg-main`, `--bg-card`, `--text-main`, `--text-muted`, `--border-color`).
   - Verify that text meets WCAG AA contrast ratio standards in both light and dark modes.

---

## 4. Validating Student Issue Forms

When extending or maintaining the `IssueForm` component:

1. **Required Fields & Validation Rules**:
   - **Student / Staff Name**: Non-empty trimmed string (`>= 2` characters).
   - **Student / Employee ID**: Non-empty string formatted like `STU-YYYY-XXXX` or valid campus ID.
   - **University Email**: Valid email format (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`), preferably ending in `.edu` or campus domain.
   - **Subject / Title**: Non-empty trimmed string (`>= 5` characters).
   - **Description**: Detailed problem summary (`>= 15` characters) to provide adequate context for technicians.
   - **Category & Location**: Valid selections from `CATEGORIES` and `LOCATIONS` constants.
2. **User Experience During Submission**:
   - Display clear inline error messages beneath failing inputs with distinct red borders (`.input-error`).
   - Clear field errors dynamically as the user types into that input.
   - Provide a confirmation banner showing the generated Ticket ID (`TKT-YYYY-XXXX`), assigned department, and quick action to track it.
3. **Simulated Attachments**:
   - Validate file type (`image/*, .pdf, .txt, .log`) and display file size metadata before submission.

---

## 5. Managing Status Workflows (`Pending`, `In Progress`, `Resolved`)

The status pipeline is critical to the helpdesk operations:

1. **Allowed Statuses**:
   - `Pending`: Initial status for newly registered tickets awaiting review.
   - `In Progress`: Assigned technician or department is actively working on the resolution.
   - `Resolved`: Fix verified and completed with recorded administrative notes.
2. **Transition Rules**:
   - Tickets can be moved between statuses via:
     - Admin table status dropdown.
     - Detail modal quick-action buttons.
     - Bulk action toolbar in the admin dashboard.
   - Every status change must update `updatedAt: new Date().toISOString()`.
   - Maintain the visual 3-step progress stepper in `IssueDetailModal` in sync with the current status.
3. **Persistence Guarantee**:
   - Immediately persist status changes to `localStorage`.
   - Keep open modals synchronized with table state when updates occur.

---

## 6. Keeping Dashboard Statistics & Analytics Accurate

All metrics displayed to campus administrators must be accurate:

1. **Core Metric Computations**:
   - **Total Tickets**: `tickets.length`.
   - **Pending Count**: `tickets.filter(t => t.status === 'Pending').length`.
   - **In Progress Count**: `tickets.filter(t => t.status === 'In Progress').length`.
   - **Resolved Count**: `tickets.filter(t => t.status === 'Resolved').length`.
   - **Resolution Rate %**:
     ```javascript
     const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;
     ```
   - **Urgent / High Alerts**: Count of non-resolved tickets with priority `'Urgent'` or `'High'`.
2. **Visual Analytics Synchrony**:
   - Ensure percentage bar segments (`seg-pending`, `seg-progress`, `seg-resolved`) sum to 100% or scale proportionally.
   - Guard against divide-by-zero errors when no tickets exist in the system.
   - Category and priority distribution charts must re-calculate immediately upon any ticket addition, edit, or deletion.

---

## 7. Testing Changes & Running Production Builds

Before submitting any code changes or completing tasks:

1. **Run Linter**:
   ```bash
   npm run lint
   ```
   - Verify that ESLint passes with **0 errors and 0 warnings**.
   - Check for unused imports, missing hook dependencies, or unused variables.
2. **Run Production Build**:
   ```bash
   npm run build
   ```
   - Verify that Vite compiles the production bundle in `dist/` cleanly.
   - Ensure no broken imports, missing assets, or syntax issues exist.
3. **Run Preview (Optional Verification)**:
   ```bash
   npm run preview
   ```
   - Test production asset paths, styles, and script execution in a realistic browser environment.

---

## 8. Reporting Errors Honestly

Integrity in debugging and testing is mandatory:

1. **Never Conceal Failures**:
   - If a build, lint, or runtime script fails, report the exact error message and exit code honestly.
   - Do not claim a step was verified without executing the corresponding command.
2. **Clear Diagnosis & Rectification**:
   - Quote the error line numbers and file paths accurately.
   - Explain the root cause clearly (e.g., unused import, syntax error, missing variable).
   - Apply the fix and re-run the verification command to confirm resolution.

