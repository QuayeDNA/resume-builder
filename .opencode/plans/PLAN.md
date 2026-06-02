# ResumeForge — Complete Enhancement Plan

> Generated from full codebase audit on 2026-06-01
> Last updated: 2026-06-02

---

## Current State Assessment

The app is a functional single-page React/Vite resume builder with a warm tactile-themed design system (post-Phase 3 redesign), Zustand state management, localStorage persistence, multi-provider AI integration (Groq → Zephyr fallback), 28 templates, multi-page composition, ATS checker, job match AI, cover letter support, and full export suite (PDF canvas, PDF print, DOCX, TXT, HTML, JSON, batch ZIP). The app is TypeScript strict mode, has Supabase backend with auth (not fully wired), and 7 phases of enhancements complete.

### Key Stats
- **Status**: Feature-rich MVP with production-ready foundation
- **TypeScript**: 0 errors (strict mode) — pre-existing errors in Phase 5 files only
- **Backend**: Supabase project with 5 tables + RLS + triggers
- **Auth**: Login/signup pages exist, but not wired into protected routes
- **Routing**: react-router-dom (to be migrated to Next.js)
- **Templates**: 28 total (11 original + 17 new), all with distinct structural combos
- **AI**: Job match + ATS suggestions via Groq → HuggingFace fallback
- **Exports**: PDF (canvas + print), DOCX, TXT, HTML, JSON, batch ZIP
- **Build**: Vite 5 (to be migrated to Next.js 14)

---

## Phase 0 — Immediate Fixes & Housekeeping ✅

**Goal**: Clean up technical debt.

| Task | Status |
|------|--------|
| 0.1 Remove ghost dependencies | ✅ Done |
| 0.2 Remove empty skeleton dirs | ✅ Done |
| 0.3 Replace custom `cn()` with clsx + tailwind-merge | ⏳ Skipped — cn() works for current usage |
| 0.4 Revoke committed API keys | ⏳ Pending — .env.local keys need rotation |
| 0.5 Ensure `.env.local` is gitignored | ✅ Done |
| 0.6 Fix README inaccuracies | ✅ Done |

---

## Phase 1 — Foundation & Infrastructure ✅

**Goal**: Production-grade backend, auth, and type safety.

| Task | Status |
|------|--------|
| 1.1 TypeScript Migration | ✅ 0 errors, strict mode |
| 1.2 Database & Backend (Supabase) | ✅ 5 tables + RLS + triggers deployed |
| 1.3 Authentication | ✅ Login/signup pages + session management |
| 1.4 Routing | ✅ react-router-dom with auth routes |
| 1.5 Error Boundaries | ✅ App-level ErrorBoundary |

---

## Phase 2 — Editor UX & Customization ✅

| Task | Status |
|------|--------|
| 2.1 Drag-and-Drop Reordering | ✅ Entries, bullets, nav sections |
| 2.2 Undo/Redo System | ✅ Stack + keyboard shortcuts + UI |
| 2.3 Rich Text for Bullets | ✅ Bold/Italic markdown + toolbar |
| 2.4 Section Visibility Toggle | ✅ hiddenSections + eye toggle |
| 2.5 Custom Sections | ✅ Entry-based configurable fields |
| 2.6 Enhanced Auto-Save | ✅ Debounced localStorage |
| 2.7 Keyboard Shortcuts | ✅ Ctrl+Z / Ctrl+Shift+Z |
| 2.8 Comprehensive ATS Enhancement | ✅ Scoring + category breakdown + Fix links |

---

## Phase 3 — Complete Visual Redesign: "Playful & Tactile" ✅

| Task | Status |
|------|--------|
| 3.1 Design tokens + CSS | ✅ tokens.css, textures, Tailwind config |
| 3.2 Component redesign | ✅ Button, Card, Input, Select |
| 3.3 SideNav rewrite | ✅ Core-feature nav + user profile |
| 3.4 EditorPanel rewrite | ✅ Accordion view of all sections |
| 3.5 PreviewPanel redesign | ✅ Desk texture + zoom controls |
| 3.6 BottomSheetNav | ✅ Mobile nav replaces radial overlay |
| 3.7 App layout cleanup | ✅ Bottom sheet nav, layout update |
| 3.8 SplashScreen | ✅ Hand-drawn R logo animation |

---

## Phase 3.5 — Multi-Page Template System ✅

| Task | Status |
|------|--------|
| PageContainer | ✅ A4 box with page numbers |
| PageComposer | ✅ Section-aware page packing |
| PreviewPanel integration | ✅ Page/Scroll/Mobile modes |
| Page break indicators | ✅ Dashed lines + page labels |
| PDF export update | ✅ Captures all [data-page-container] |
| Edge cases | ✅ 1-page, 3-page, section > page |
| Polish | ✅ Zoom transitions |

---

## Phase 4 — Templates & Theming Overhaul ✅

| Task | Status |
|------|--------|
| 4.1 Real Template Thumbnails | ✅ Scaled TemplateRenderer with sample data |
| 4.2 Template Customization Panel | ✅ Colors, fonts, margins, font size |
| 4.3 New Template Categories | ✅ 28 templates (7 categories) |
| 4.4 Background Toggle | ✅ Desk / Paper / Dark |
| 4.5 Preview Modes | ✅ Page / Scroll / Mobile |

---

## Phase 5 — AI Enhancement ✅

| Task | Status |
|------|--------|
| 5.1 Streaming AI Responses | 🔄 (deferred — needs Next.js streaming) |
| 5.2 Job Description Matching | ✅ JobMatchPanel + aiAnalyzeJobMatch |
| 5.3 Keyword Gap Analysis | ✅ Matched/Missing grid + Add buttons |
| 5.4 AI Full Resume Rewrite | 🔄 (deferred) |
| 5.5 Cover Letter Enhancements | 🔄 (deferred) |
| 5.6 AI Interview Questions | 🔄 (deferred) |
| 5.7 Prompt Management | ✅ Prompts in src/api/prompts.ts |
| 5.8 Multiple Model Support | ✅ Groq / HuggingFace / Claude |

---

## Phase 6 — Import & Export Expansion ✅

| Task | Status |
|------|--------|
| 6.1 Professional PDF Export | ✅ html2canvas + jspdf canvas render |
| 6.2 DOCX Export | ✅ docx library — Word format |
| 6.3 Import from LinkedIn | 🔄 (deferred) |
| 6.4 Import from Existing Resume | 🔄 (deferred) |
| 6.5 Google Docs Integration | 🔄 (deferred) |
| 6.6 Public Share Links | 🔄 (deferred) |
| 6.7 Batch Export | ✅ ZIP archive of all slots |
| Unified Export Dialog | ✅ 6 format options + batch in modal |

---

## Phase A — Next.js Migration (IN PROGRESS)

**Goal**: Replace Vite with Next.js 14 (App Router) for auth middleware, server API routes, SEO-friendly marketing pages, and unified build.

### Strategy: Incremental — keep all existing components, swap build tooling

| Task | Status |
|------|--------|
| A.1 | Init Next.js 14 + remove Vite deps | ⏳ |
| A.2 | Create `next.config.mjs` + update `tsconfig.json` | ⏳ |
| A.3 | Create `app/layout.tsx` — root layout with fonts, ErrorBoundary, Toaster | ⏳ |
| A.4 | Create `app/page.tsx` — main builder | ⏳ |
| A.5 | Create `app/login/page.tsx` + `app/signup/page.tsx` | ⏳ |
| A.6 | Create `middleware.ts` — Supabase cookie check | ⏳ |
| A.7 | Migrate `api/` → `app/api/` route handlers | ⏳ |
| A.8 | Fix `import.meta.env` → `process.env` (2 files) | ⏳ |
| A.9 | Fix `react-router-dom` → `next/navigation` (3 files) | ⏳ |
| A.10 | Remove Vite files (index.html, vite.config.ts, main.tsx) | ⏳ |
| A.11 | Verify `next build` + all routes work | ⏳ |

### Route Map

```
/                  → Resume builder (full-width, Editor + Preview)
/login             → Login page (public)
/signup            → Signup page (public)
/pricing           → Pricing page (when implemented)
/app/settings      → Account + subscription (when implemented)
/api/ai            → AI proxy route handler
/api/paystack/*    → Paystack routes (when implemented)
```

---

## Phase B — Auth & Protected Routes (PENDING)

**Goal**: Properly wire Supabase auth so user identity flows into the app and protected routes work.

| Task | Status |
|------|--------|
| B.1 | Create `useAuthStore` — `{ user, session, loading, subscriptionTier }` | ⏳ |
| B.2 | Update `useAuth()` to write to store; fix SideNav profile display | ⏳ |
| B.3 | `<ProtectedRoute>` wrapper with loading/redirect | ⏳ |
| B.4 | `middleware.ts` session check for protected routes | ⏳ |
| B.5 | Improve `useSupabaseSync` — sync slots, cover letters, theme overrides | ⏳ |
| B.6 | "Sign In" CTA in SideNav when logged out; user dropdown when logged in | ⏳ |
| B.7 | "Upgrade" badge for free-tier users | ⏳ |

---

## Phase C — Paystack Payment Integration (IDEATING)

**Status**: Structure planned. Pricing and feature breakdown being finalized.

**Decided**:
- Provider: Paystack (GHS, cards, Mobile Money)
- Target market: Ghana (₵ pricing, localization)
- Free tier: 5 templates (1 two-col + 4 single-col), ATS templates paid
- Pro price: ~$5.99/mo (GHS equivalent)

**Being finalized**:
- Pro/Lifetime feature breakdown
- Slot limits, AI credits, export features per tier
- Lifetime option and pricing
- Mobile Money support (MTN, Vodafone Cash, AirtelTigo)

**Infrastructure ready to build when finalized**:
- Paystack plans created in dashboard
- `/api/paystack/initialize`, `/verify`, `/webhook` route handlers
- PaystackPop checkout in `/pricing` page
- Webhook handler updates `subscriptions` table
- Frontend polls for tier changes

---

## Phase D — Feature Gating (IDEATING — depends on C)

### Gating Points Mapped (boundaries TBD)

| Gate | Free | Pro |
|------|------|-----|
| Templates | 5 basic (no ATS) | All 28 |
| ATS checker | ✗ | ✓ |
| Custom colors/fonts | ✗ | ✓ |
| PDF export | Basic (watermarked) | Clean |
| DOCX export | ✗ | ✓ |
| Job matching | ✗ | ✓ |
| Saved slots | 3 | Unlimited |
| AI credits | 50/mo | 500/mo |

### Implementation Pattern
- `src/utils/tiers.ts` — tier definitions with feature flags
- Template picker filters by tier with upgrade CTA overlay on locked templates
- Export pipeline checks tier before generating (watermark on free)
- Customization panel hidden on free
- SideNav hides job match on free
- Slot creation checks count vs limit

---

## Phase 8 — Advanced Features & Integrations (DEFERRED)

| Task | Status |
|------|--------|
| 8.1 Collaboration | 🔄 (deferred) |
| 8.2 GitHub Integration | 🔄 (deferred) |
| 8.3 Notion Integration | 🔄 (deferred) |
| 8.4 Spell Check & Grammar | 🔄 (deferred) |
| 8.5 Multi-Language Resume | 🔄 (deferred) |
| 8.6 Resume Analytics | 🔄 (deferred) |

---

## Phase 9 — Polish, Performance & Quality (DEFERRED)

| Task | Status |
|------|--------|
| 9.1 Testing | 🔄 (deferred) |
| 9.2 Accessibility Audit | 🔄 (deferred) |
| 9.3 Performance Optimization | 🔄 (deferred) |
| 9.4 Mobile Experience | 🔄 (deferred) |
| 9.5 CI/CD | 🔄 (deferred) |

---

## Architecture Direction

### Current Decision: Migrate to Next.js 14

**Why Next.js over Vite**:
- Server-side API routes (no separate `/api` directory)
- Auth middleware for route protection
- File-based routing (cleaner route structure)
- Marketing page SEO (landing, pricing)
- Image optimization for template thumbnails
- Unified build (one `next build` instead of Vite + Vercel functions)

**Why Next.js 14 over 15**:
- Compatible with React 18 (current stack)
- Stable and well-documented
- No breaking changes from current dependency tree
- Upgrade to 15 possible later when React 19 deps are ready

### Store Architecture

Post-migration, split the monolithic Zustand store into slices:
- `useResumeStore` — resume data, mutations
- `useAuthStore` — user, session, subscription tier
- `useUIStore` — active section, view mode, mobile nav state
- `useAISettingsStore` — provider preference, credit balance

---

## Implementation Order

```
Phase A (Next.js Migration) → Phase B (Auth) → Phase C (Paystack) → Phase D (Gating)
```

### Estimated Effort

| Phase | Tasks | Rough Timeline |
|-------|-------|---------------|
| A — Next.js migration | 11 steps | 3-5 days |
| B — Auth & routes | 7 steps | 2-3 days |
| C — Paystack integration | 6 steps + webhooks | 3-4 days |
| D — Feature gating | ~15 gating points | 2-3 days |
| **Total** | | **~2 weeks** |
