# ResumeForge — Complete Enhancement Plan

> Generated from full codebase audit on 2026-06-01

---

## Current State Assessment

The app is a functional single-page React/Vite resume builder with a strong dark-themed design system, Zustand state management, localStorage persistence, multi-provider AI integration (Groq → Zephyr fallback), 11 templates, an ATS checker, and cover letter support. However, it remains a **client-side-only MVP** with critical gaps: no database, no auth, no TypeScript, no tests, unused ghost dependencies, and limited customization/export options.

---

## Phase 0 — Immediate Fixes & Housekeeping

**Goal**: Clean up technical debt before layering new features.

| Task | Detail |
|------|--------|
| 0.1 Remove ghost dependencies | `html2pdf.js`, `@headlessui/react`, `clsx`, `@dnd-kit/*` — either unused or duplicated. Install them only when actually implemented. |
| 0.2 Remove empty skeleton dirs | `src/features/resume/templates/` is a half-started refactor with empty subdirectories. Clean it up. |
| 0.3 Replace custom `cn()` with `clsx` + `tailwind-merge` | The custom utility works but is non-standard. Use established libraries for class merging. |
| 0.4 Revoke committed API keys | `.env.local` contains real API keys that were committed. Rotate them immediately. |
| 0.5 Ensure `.env.local` is gitignored | Verify it's in `.gitignore` and hasn't been tracked. |
| 0.6 Fix README inaccuracies | README says "html2pdf.js" for PDF (uses print-window instead), says "8 templates" (there are 11), says "keyboard-navigable" (no shortcut docs). |

---

## Phase 1 — Foundation & Infrastructure

**Goal**: Production-grade backend, auth, and type safety.

### 1.1 TypeScript Migration
- Rename `.js`/`.jsx` → `.ts`/`.tsx` incrementally (section by section)
- Convert JSDoc typedefs in `src/types/index.js` to proper TypeScript interfaces
- Enable strict mode in `tsconfig.json`
- Benefits: compile-time safety, better IDE support, fewer runtime bugs

### 1.2 Database & Backend (Supabase)
- Add `@supabase/supabase-js`
- Schema design:
  - `users` (id, email, name, avatar_url, created_at, subscription_tier)
  - `resumes` (id, user_id, data JSONB, template, metadata, created_at, updated_at)
  - `resume_slots` (id, resume_id, name, data JSONB, cl JSONB, created_at)
  - `cover_letters` (id, user_id, resume_id, data JSONB, created_at)
  - `subscriptions` (id, user_id, stripe_customer_id, stripe_subscription_id, tier, status, current_period_end)
- Row-Level Security (RLS) for multi-tenant isolation
- Serverless functions for CRUD (Vercel or Supabase Edge Functions)

### 1.3 Authentication (Supabase Auth)
- Email/password + Google OAuth sign-in
- Preserve anonymous mode (build without signing up, optionally create account later)
- Auth-UI with Supabase's built-in components
- Session persistence across devices

### 1.4 Routing (React Router)
- Add `react-router-dom` v6
- Routes: `/` (editor), `/templates` (browse gallery), `/saved` (slots dashboard), `/settings`, `/pricing`, `/login`
- Deep-linkable sections: `/editor?section=experience`
- Browser back/forward support

### 1.5 Error Boundaries & Monitoring
- React Error Boundary wrapper at app level
- Graceful fallback UI for crashes
- Optional: Sentry for production error tracking

---

## Phase 2 — Editor UX & Customization

**Goal**: Smooth, highly interactive editing experience.

### 2.1 Drag-and-Drop Reordering
- Implement `@dnd-kit` (already in `package.json`)
- Reorder experience entries, education entries, projects, certifications
- Reorder bullet points within experience entries
- Reorder entire sections on the resume
- Animated drop indicators

### 2.2 Undo/Redo System
- Command history pattern (Zustand middleware)
- `Ctrl+Z` / `Ctrl+Shift+Z` keyboard shortcuts
- Visual undo/redo buttons in toolbar
- Max 50 steps, configurable

### 2.3 Rich Text for Bullets
- Replace `<textarea>` with a lightweight rich text editor (TipTap or custom `contenteditable`)
- Bold, italic, bullet lists, links
- Preserve plain text fallback for ATS export

### 2.4 Section Visibility Toggle
- Each section gets an eye toggle (show/hide on preview)
- Create role-specific resume variants without deleting data
- Preview updates in real-time

### 2.5 Custom Sections
- Users can add custom section headings with free-form content
- Name, icon, position in the section order

### 2.6 Enhanced Auto-Save
- Keep 1.2s debounce from `useAutoSave`
- Add clear "Saving..." → "Saved @ HH:MM" indicator
- Named version snapshots (snapshot before AI rewrites)
- Version diff viewer

### 2.7 Keyboard Shortcuts
- `Ctrl+S` — save
- `Ctrl+Z` / `Ctrl+Shift+Z` — undo/redo
- `Ctrl+1-9` — jump to section
- `Ctrl+P` — export PDF
- `?` — show shortcuts overlay

---

## Phase 3 — Templates & Theming Overhaul

**Goal**: Highly customizable, visually stunning templates.

### 3.1 Real Template Thumbnails
- Replace current CSS-block approximations with actual rendered mini-previews
- Use `html-to-image` to capture screenshot previews of templates with sample data
- Hover zoom, grid/gallery view toggle

### 3.2 Template Customization Panel
- **Color picker**: Customize accent and secondary colors per template
- **Font selector**: 8-10 curated font pairings from Google Fonts
- **Spacing controls**: Margins (narrow/medium/wide), section spacing, line height
- **Layout toggles**: Show/hide/reorder sections on the final output
- **Font size scale**: Slight adjustments to heading/body sizes

### 3.3 New Template Categories
Expand from 11 → 25+ templates:

| Category | Count | Examples |
|----------|-------|---------|
| Single Column | 8 | Modern, Clean, Warm, Forest, Rose, Executive, Minimalist, Bold |
| Two Column | 4 | Sidebar, Compact, Contrast, Split |
| ATS | 4 | Classic ATS, Professional ATS, Minimal ATS, Hybrid ATS |
| Creative | 4 | Portfolio, Visual, Gradient, Magazine |
| Academic | 3 | Research, Teaching, Publication |
| Timeline | 2 | Chronological, Functional Timeline |
| Tech | 3 | Developer, DevOps, Data Science |

### 3.4 Theme System (Light/Dark)
- Full light mode with proper contrast hierarchy
- Toggle in header/settings, persisted to localStorage
- Preview panel: toggle between white background (traditional) and dark (screen viewing)

### 3.5 Preview Modes
- **Full page**: Current A4-sized preview
- **Scroll mode**: Continuous scroll for long resumes
- **Mobile preview**: Simulate phone view
- **Side-by-side**: Compare two templates with same data

---

## Phase 4 — AI Enhancement

**Goal**: Intelligent, streaming, context-aware AI that genuinely helps users.

### 4.1 Streaming AI Responses
- Replace all-or-nothing loading spinner with token-by-token streaming
- Use Vercel AI SDK or raw SSE from the API
- Display text appearing in real-time in the editor field
- Feels dramatically faster and more responsive

### 4.2 Job Description Matching
- Paste a job description URL or text
- AI identifies key requirements, skills, keywords
- "Match Resume" button compares resume against JD
- Match percentage + highlighted missing keywords
- AI suggests bullet rewrites tailored to the JD

### 4.3 Keyword Gap Analysis
- Extract keywords from the job description
- Compare against current resume
- Visual gap report: "Matched" (green) vs "Missing" (red)
- "Add Missing Skills" one-click button
- AI suggestions for where to incorporate missing keywords into experience bullets

### 4.4 AI Full Resume Rewrite
- "Rewrite Entire Resume" button
- AI rewrites every section for consistency and impact
- Target tone options: Professional, Confident, Warm, Executive
- Target industry/role
- Preserves all facts and dates — only rewrites language

### 4.5 Cover Letter Enhancements
- Consider job description in generation (not just resume data)
- Multiple paragraph style options after generation
- "Tone Shift" — re-generate in a different tone without starting over
- "Shorten" / "Elaborate" for the generated letter

### 4.6 AI Interview Question Generator
- Generate likely interview questions from resume
- Categories: "Experience at X", "Technical", "Behavioral"
- Practice mode with talking points

### 4.7 Prompt Management
- Move hardcoded prompts from `src/api/prompts.js` into a configurable system
- Allow power users to customize prompts (stored locally)
- Prompt versioning — updates don't break existing behavior

### 4.8 OpenAI / Multiple Model Support
- Add GPT-4o as an optional provider
- Let users choose preferred AI provider in settings
- Server-side key management (never expose to client)
- Show model quality indicator per provider

---

## Phase 5 — Import & Export Expansion

**Goal**: True portability — get data in and out however the user needs.

### 5.1 Professional PDF Export
- Replace print-window approach with a proper PDF library
- Options: `@react-pdf/renderer` (React-based), Puppeteer-based server render, or `jsPDF`
- Support A4 and US Letter formats
- Custom margins (narrow/medium/wide)
- Embed PDF metadata (title, author, subject)

### 5.2 DOCX Export (Word Format)
- Use `docx` npm library
- Preserve formatting, fonts, layout
- ATS-friendly output option (plain tables, minimal formatting)
- One-click download

### 5.3 Import from LinkedIn
- Parse LinkedIn profile PDF export
- Extract: name, title, experience, education, skills, certifications
- Map to ResumeData structure
- Handle edge cases: date formats, missing sections

### 5.4 Import from Existing Resume (AI Parse)
- Upload existing PDF/DOCX resume
- AI extracts structured data
- Map to ResumeData
- Review/correct before applying

### 5.5 Google Docs / Drive Integration
- Export directly to Google Docs via API
- Import from Google Docs
- Auto-backup resumes to Drive folder
- Requires Google OAuth scope

### 5.6 Public Share Link
- Generate unique shareable URL for each resume
- Hosted HTML version on Vercel edge
- Optional password protection
- QR code generation for the share link

### 5.7 Batch Export
- Export all saved slots as ZIP archive
- Each slot: JSON + PDF + DOCX
- One-click download all

---

## Phase 6 — Monetization & Paid Features

**Goal**: Sustainable revenue without degrading the free experience.

### 6.1 Subscription Tiers

| Feature | Free | Pro ($9.99/mo) | Lifetime ($199) |
|---------|------|-----------------|-----------------|
| Resume editing | Unlimited | Unlimited | Unlimited |
| Saved slots | 5 | Unlimited | Unlimited |
| Templates | 11 basic | 25+ all templates | 25+ all templates |
| AI credits/month | 50 | 500 | 500 |
| Custom colors | — | ✓ | ✓ |
| Custom fonts | — | ✓ | ✓ |
| Custom spacing | — | ✓ | ✓ |
| PDF export | Watermarked | Clean | Clean |
| DOCX export | — | ✓ | ✓ |
| Job matching | — | ✓ | ✓ |
| Keyword analysis | — | ✓ | ✓ |
| Priority AI model | — | ✓ | ✓ |
| Share links | — | 5 active | Unlimited |

Enterprise (custom pricing): team management, org branding, centralized billing, SSO, dedicated support.

### 6.2 Payment Integration
- Stripe for subscription management
- Lemon Squeezy as fallback (EU VAT compliance)
- Pricing page at `/pricing`
- Subscription management portal (cancel, upgrade, downgrade)
- Stripe webhooks for lifecycle events

### 6.3 AI Credit System
- Track per-user AI usage
- Reset monthly for subscriptions
- Rollover up to cap for annual plans
- Display remaining credits in UI
- "Buy more credits" option for free tier
- Credit costs: simple actions = 1 credit, complex = 3-5 credits

### 6.4 Premium Templates
- Exclusive templates for Pro/Lifetime users
- Industry-specific: Healthcare, Tech, Finance, Education, Creative
- Designer-curated color palettes
- Premium font pairings (variable fonts)
- UI badges: "Free" vs "Pro"

### 6.5 Usage Dashboard
- Per-user analytics: resumes created, exports, AI actions, templates used
- Monthly email digest
- Helps users see value and decide to upgrade

---

## Phase 7 — Advanced Features & Integrations

**Goal**: Delight users with unexpected but valuable capabilities.

### 7.1 Collaboration
- Share resume for review with friend/mentor
- Comment system on sections/bullets
- Real-time collaboration via Supabase Realtime
- View-only vs edit access levels

### 7.2 GitHub Integration
- Import projects from GitHub via API
- Authenticate with GitHub OAuth
- Select repos, auto-generate descriptions
- Optional: keep projects synced

### 7.3 Notion Integration
- Import work history from Notion database
- Map Notion properties to resume fields
- Notion OAuth integration

### 7.4 Spell Check & Grammar
- Client-side spell checker (`nspell` with dictionary)
- Squiggly underline for misspellings
- Grammar suggestions via AI (1 credit) or LanguageTool API

### 7.5 Multi-Language Resume
- Translate resume via AI
- Maintain separate translations per resume
- Side-by-side editing: original + translation
- Export each language version separately

### 7.6 Resume Analytics
- Track views (for shared links)
- Track which sections recruiters spend time on (future)
- A/B test two versions of a resume

---

## Phase 8 — Polish, Performance & Quality

**Goal**: Production-ready quality across every surface.

### 8.1 Testing
- Unit tests: `ats.js`, `storage.js`, `defaults.js`
- Component tests: EditorPanel, PreviewPanel, each section component
- Integration tests: Zustand store actions
- E2E: create resume → AI improve → export PDF
- Stack: Vitest + React Testing Library + Playwright

### 8.2 Accessibility Audit
- axe-core / Lighthouse audit
- Proper heading hierarchy (h1-h6)
- ARIA labels on all interactive elements
- Keyboard focus management (tab order, focus traps)
- Color contrast: WCAG AA minimum (4.5:1)
- Screen reader testing: NVDA / VoiceOver
- Visible focus rings on all interactive elements

### 8.3 Performance Optimization
- Lazy-load section components (`React.lazy` + `Suspense`)
- Memoize expensive computations (already done in PreviewPanel)
- Bundle analysis with `vite-bundle-visualizer`
- Reduce layout shifts in editor
- Image optimization for template thumbnails

### 8.4 Mobile Experience
- Full-screen editing mode on mobile
- Bottom sheet for section nav (replace full-screen radial overlay on small screens)
- Touch-friendly tap targets (min 44px)
- Swipe gestures for navigation
- PWA: service worker + manifest for installability
- Offline support via service worker caching

### 8.5 CI/CD
- GitHub Actions: lint + typecheck + test + build on every PR
- Vercel preview deployments per branch
- Automated accessibility checks in CI (axe-playwright)
- Bundle size regression checks

---

## Architecture Direction

### Keep Vite or Migrate to Next.js?

**Short-term**: Keep Vite. The app works well as an SPA. Add Vercel serverless functions alongside the existing `api/` directory for backend operations (auth, DB CRUD, AI proxy, payments).

**Long-term**: Migrate to Next.js (App Router) for:
- Server-side API routes (no separate `/api` directory)
- Server Components for marketing pages (SEO-friendly)
- Streaming for AI responses (built-in `ai` SDK support)
- Image optimization for template thumbnails
- Middleware for auth-protected routes
- Layout system for shared navigation
- Edge runtime for AI proxy (lower latency)

### Store Architecture
Split the monolithic Zustand store into slices:
- `useResumeStore` — resume data, mutations
- `useUIStore` — active section, view mode, mobile nav state
- `useAISettingsStore` — provider preference, credit balance
- `useAuthStore` — user, session, subscription tier

---

## Implementation Priority Matrix

| Feature | Impact | Effort | Phase | Quick Win? |
|---------|--------|--------|-------|-----------|
| TypeScript migration | Medium | High | 1 | |
| Supabase + Auth | Critical | High | 1 | |
| Drag-and-drop reorder | High | Medium | 2 | ⚡ |
| Undo/redo | High | Medium | 2 | ⚡ |
| Rich text editor | Medium | High | 2 | |
| Section visibility toggles | Medium | Low | 2 | ⚡ |
| Real template thumbnails | High | Low | 3 | ⚡ |
| Custom colors/fonts/spacing | High | Medium | 3 | |
| Light mode | Medium | Low | 3 | ⚡ |
| Preview toggle (light/dark) | Medium | Low | 3 | ⚡ |
| AI streaming | High | Medium | 4 | |
| Job description matching | Very High | Medium | 4 | |
| Keyword gap analysis | Very High | Medium | 4 | |
| PDF export (proper) | Critical | Medium | 5 | |
| DOCX export | High | Low | 5 | ⚡ |
| LinkedIn import | High | Medium | 5 | |
| Subscription system | Critical | High | 6 | |
| AI credit system | High | Medium | 6 | |
| Premium templates | Medium | Low | 6 | |
| Full testing suite | High | High | 8 | |
| Accessibility audit | High | Medium | 8 | |
| Mobile improvements | High | Medium | 8 | |

---

## Quick Wins (Can Be Done Immediately)

These are high-impact, low-effort items that don't require backend changes:

1. **Real template thumbnails** — Replace CSS blocks with actual rendered previews
2. **Section visibility toggles** — Show/hide per resume version
3. **Save indicator** — "Saving..." / "Saved @ HH:MM" in the sidebar
4. **Light/dark preview toggle** — Toggle preview background
5. **DOCX export** — Add `docx` library + export button (few hours)
6. **Keyboard shortcut overlay** — `?` key opens shortcut reference
7. **Error boundary** — Catch rendering errors gracefully
8. **Drag-to-reorder** — Wire up the already-installed `@dnd-kit`
9. **Undo/redo** — Zustand middleware for history (1-2 days)
10. **Mobile full-screen editing** — Better mobile layout without full rebuild

---

## Notes on Current Code That Should Be Preserved

- **Design system (`src/design/tokens.js`)**: Excellent color palette and token system. Keep and extend.
- **Design components (`src/design/components/`)**: Well-abstracted UI primitives. Keep as the foundation.
- **AI provider chain (`src/api/freeAI.js`)**: Smart fallback pattern (Groq → Zephyr). Extend with more providers.
- **ATS checker (`src/utils/ats.js`)**: Good scoring algorithm. Improve weighting and add more checks.
- **Auto-save debounce (`src/hooks/useAutoSave.js`)**: Works well. Just add better feedback.
- **Zustand store structure**: Clean and readable. Just split when it grows too large.
- **Mobile radial nav**: Beautiful UX pattern. Keep for desktop-tablet; replace with bottom sheet on phones.
