# ResumeForge — Complete Enhancement Plan

> Generated from full codebase audit on 2026-06-01
> Last updated: 2026-06-01

---

## Current State Assessment

The app is a functional single-page React/Vite resume builder with a warm tactile-themed design system (post-Phase 3 redesign), Zustand state management, localStorage persistence, multi-provider AI integration (Groq → Zephyr fallback), 11 templates, an ATS checker, and cover letter support. The app is TypeScript, has Supabase backend with auth, routing, error boundaries, drag-and-drop reordering, and custom sections.

### Key Stats
- **Status**: MVP → production-ready foundation
- **TypeScript**: 0 errors, strict mode
- **Backend**: Supabase project with 5 tables + RLS
- **Auth**: Login/signup pages, session management
- **Routing**: react-router-dom with auth routes
- **Bundlesize**: ~556KB JS (Supabase + dnd-kit bulk)

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

**Goal**: Smooth, highly interactive editing experience.

| Task | Status |
|------|--------|
| 2.1 Drag-and-Drop Reordering | ✅ Entries, bullets, nav sections |
| 2.2 Undo/Redo System | ⏳ Pending |
| 2.3 Rich Text for Bullets | ⏳ Pending |
| 2.4 Section Visibility Toggle | ⏳ Pending |
| 2.5 Custom Sections | ✅ CustomSectionEntry + dynamic sidebar |
| 2.6 Enhanced Auto-Save | ⏳ Pending |
| 2.7 Keyboard Shortcuts | ⏳ Pending |

---

## Phase 3 — Complete Visual Redesign: "Playful & Tactile" ✅

**Goal**: Transform the app from a generic dark-theme developer tool into a warm, approachable, tactile product that feels like a beautifully crafted notebook.

### Creative Direction

**Tone**: Warm, friendly, approachable, crafted — like a high-end stationery set.
**Target audience**: Resume builders are often stressed job seekers — the tool should feel calming and supportive, not cold and technical.
**Differentiation**: No dark purple sci-fi theme. No generic Tailwind patterns. A warm off-white paper-and-ink aesthetic with grain texture, soft shadows, and organic details.

### Design System

| Token | Before | After |
|-------|--------|-------|
| Page background | `#06060b` void | `#f8f4f0` warm paper |
| Card background | `#0f0f18` surface | `#f0ebe4` warm paper |
| Primary text | `#e8e6f0` | `#2a2520` ink |
| Secondary text | `#9a98b0` | `#6b6258` soft ink |
| Accent | `#7c6fff` purple | `#c76b4a` terracotta |
| Secondary accent | — | `#8ca98c` sage |
| Body font | DM Sans | Bricolage Grotesque |
| Display font | Playfair Display | Fraunces (variable) |
| Mono font | DM Mono | IBM Plex Mono |
| Border treatment | Sharp hairline | Soft shadow + grain |
| Motion | 100ms snap | 350ms ease-out-expo |
| Button shape | Rounded-lg | Pill (rounded-full) |

### New Layout Architecture

The sidebar is no longer a dump of 10+ section nav items. It becomes a proper app-level navigation:

```
[SIDEBAR]              [EDITOR VIEW - accordion]         [PREVIEW]
┌────────────┐         ┌─────────────────────────┐       ┌──────────┐
│ ✏️ Editor  │         │ 🔽 Personal Info    ⠿   │       │          │
│ 🎨 Templates│        │ ┌─────────────────────┐│       │  Resume  │
│ 📄 Cover    │         │ │ Name, Title, Email ││       │  Preview │
│ 💾 Saved    │         │ └─────────────────────┘│       │          │
│ ⚙️ Settings │         │ 🔽 Experience     ⠿   │       │          │
│ 📤 Export   │         │ ┌─────────────────────┐│       │          │
├────────────┤         │ │ Company, Role...   ││       │          │
│ 👤 Profile  │         │ └─────────────────────┘│       │          │
└────────────┘         │ 🔽 Education...         │       └──────────┘
                        │ 🔽 Skills...            │
                        │ + Add Custom Section    │
                        └─────────────────────────┘
```

#### Sidebar (nav.tsx)
- **Editor** — Opens the accordion editor view with all resume sections
- **Templates** — Opens template gallery (replaces old Design section)
- **Cover Letter** — Opens cover letter editor
- **Saved** — Opens saved slots manager
- **Settings** — New: account, preferences, AI provider config
- **Export** — Downloads PDF or opens export dialog
- **Bottom**: User avatar + name (auth) or "Sign in" link

#### Editor View (editor panel)
- One scrollable view containing all resume sections as collapsible accordion cards
- Each section (Personal, Experience, Education, Skills, Projects, Certifications, Languages, Custom) is a `Card.tsx` accordion, default-expanded
- Drag handles on accordion headers to reorder sections
- "Add Custom Section" button at bottom
- ATS checker appears inline at bottom or as collapsible section

#### Mobile Navigation
- Replace radial dial overlay with a bottom sheet (slide-up panel with section list)
- Keep mobile header with Edit/Preview tabs

### Typography

- **Body**: Bricolage Grotesque (warm humanist sans, Google Fonts)
- **Display**: Fraunces (variable soft-serif with optical sizes, Google Fonts)
- **UI/Mono**: IBM Plex Mono (Google Fonts)
- **Scale**: caption 12px → body 14px → heading 18px → display 36px → hero 64px
- **Weight contrast**: 300 (light body) + 700 (bold headings), never 400 vs 600

### Color Tokens (CSS Custom Properties)

```css
--color-paper:       #f8f4f0
--color-paper-warm:  #f0ebe4
--color-paper-deep:  #e8e0d6
--color-ink:         #2a2520
--color-ink-soft:    #6b6258
--color-ink-muted:   #9c9287
--color-terracotta:  #c76b4a
--color-terracotta-dim: rgba(199,107,74,0.12)
--color-sage:        #8ca98c
--color-sage-dim:    rgba(140,169,140,0.12)
--color-warm-border: rgba(42,37,32,0.08)
```

### Texture & Atmosphere

- **Grain overlay**: Fixed-position SVG `feTurbulence` noise filter at 4% opacity
- **Soft shadows**: Multi-layer `box-shadow` using ink at low opacity
- **Preview desk**: Warm wooden/desk surface texture (CSS gradient pattern)
- **Card depth**: Subtle `box-shadow` + slight rotation on drag

### Motion System

- All UI transitions: `350ms cubic-bezier(0.19, 1, 0.22, 1)` (ease-out-expo)
- Color shifts: `200ms ease`
- Section enters: stagger children at `80ms` intervals via `--i` counter
- Button press: `active:scale-[0.97]` with immediate timing
- Drag feedback: `scale(1.02)` on hover, drop ghost opacity
- `prefers-reduced-motion` respected globally

### Signature Moment

Splash screen: hand-drawn-style "R" logo that draws itself in (SVG path animation), then app content fades in around it with staggered paper-like reveals. Sets the tactile, crafted tone from the first impression.

### Files to Create

| File | Purpose |
|------|---------|
| `docs/DESIGN_PHILOSOPHY.md` | 1-page creative manifesto |
| `src/design/tokens.css` | CSS custom properties |
| `src/design/textures/grain.css` | SVG noise filter |
| `src/design/textures/desk.css` | Warm desk pattern for preview |
| `src/components/Mobile/BottomSheetNav.tsx` | Replaces RadialNavOverlay |
| `src/components/Preview/ZoomControls.tsx` | Fit/100%/150% zoom |

### Files to Rewrite

| File | Change |
|------|--------|
| `tailwind.config.js` | All colors, fonts, shadows, radius, animations |
| `src/index.css` | Ground color, grain overlay, base typography |
| `src/design/components/Button.tsx` | Pill shape, tactile press, new variants |
| `src/design/components/Card.tsx` | Warm surface, soft shadow, accordion refinements |
| `src/components/UI/Input.tsx` | Recessed paper field, inset focus shadow |
| `src/components/UI/Select.tsx` | Custom chevron, paper dropdown |
| `src/components/Editor/SideNav.tsx` | Core-feature nav + user profile |
| `src/components/Editor/EditorPanel.tsx` | Accordion view of all sections |
| `src/components/Preview/PreviewPanel.tsx` | Warm desk texture, zoom controls |
| `src/components/SplashScreen.tsx` | Hand-drawn R logo animation |
| `src/App.tsx` | Bottom sheet nav, layout update |
| `src/components/SortableList.tsx` | Bigger handle, drop ghost, soft animation |

### Implementation Order

1. Design philosophy + CSS tokens
2. Tailwind config + index.css + textures
3. Typography imports (Google Fonts)
4. Button / Card / Input / Select redesign
5. SideNav rewrite (core features only)
6. EditorPanel rewrite (accordion view)
7. PreviewPanel redesign (desk texture + zoom)
8. BottomSheetNav (replace radial overlay)
9. App.tsx layout + routing cleanup
10. SplashScreen signature moment
11. Polish — micro-interactions, focus states, reduced-motion

---

## Phase 3.5 — Multi-Page Template System

**Goal**: Content that exceeds a single A4 page flows naturally into subsequent pages with proper page breaks, headers/footers, and zero content clipping.

### Current State

Every template renders into a single A4-sized container (794×1123px). Overflow content is hidden. The PDF export captures the single container only — anything outside it is lost. There is no awareness of page boundaries.

### Architecture: Page Content Manager + Page-Aware Templates

Replace the current monolithic template rendering with a **page composition system**:

```
[Layout Engine]
  ├─ Measures each section's rendered height
  ├─ Fits sections into 1056px-tall "pages"
  ├─ Inserts page breaks at section boundaries (never mid-section)
  └─ Renders n pages, each with headers/footers
```

### Key Components

| Component | Responsibility |
|-----------|---------------|
| `PageContainer` | Measures a single A4 page (794×1056px), clips overflow, renders header/footer bar (name, page number, total pages) |
| `PageComposer` | Takes section VNodes, renders them one-by-one into hidden measurement containers, calculates which sections fit on each page, then renders the actual pages |
| `PageBreakRenderer` | Displays a visual page break indicator between pages in preview mode (dashed line with "Page 1" / "Page 2" labels) |

### Measurement Strategy (Hidden Iframe / Off-DOM)

1. Clone the section content into a **hidden measurement container** with A4 dimensions and `overflow: visible; max-height: none`
2. Measure `scrollHeight` of each section independently
3. Start packing sections into pages:
   - If a section fits on remaining page space → place it
   - If it doesn't fit → move to next page (page break before section)
   - If a single section is taller than one page → allow it to overflow (rare edge case for very long experience entries)
4. For each page, render `PageContainer` with the assigned sections + page number

### Visual Page Break

In preview mode, display a **subtle dashed page break indicator** between pages:

```
┌─────────────────────────┐
│     Page 1 content      │
│                         │
└─────────────────────────┘
- - - - - - - - - - - - - -
  Page 1 | Page 2
- - - - - - - - - - - - - -
┌─────────────────────────┐
│     Page 2 content      │
│                         │
└─────────────────────────┘
```

### PDF Export

For PDF export, concatenate all pages vertically, add `page-break-after: always` between them, and capture the full height. The browser's `@page` rules handle actual print pagination.

### Template Compatibility

All 3 template renderers (SingleColumn, TwoColumn, ATS) must be **page-aware**:
- Accept a `pageBreak` prop or context
- Render section headings with `break-inside: avoid` CSS
- Support wrapper div per page rather than one monolithic container

### Implementation Order

1. ✅ Create `PageContainer` component — A4 box, header/footer, overflow hidden
2. ✅ Create `PageComposer` — off-DOM measurement, page stacking via translateY clipping
3. ✅ Integrate into `PreviewPanel` — PageComposer wraps templates, zoom applies to page stack
4. ⬜ Add visual page break indicators (dashed lines + page labels) — page numbers + 24px gap serve this purpose for now
5. ✅ Update `exportToPdf` — captures all `[data-page-container]` elements, serializes each page
6. ⬜ Test edge cases: 1-page resume, 3-page resume, section larger than one page
7. ⬜ Polish: transition animations between pages on zoom change

### Why Not CSS `@page`?

CSS `@page` only works in print/PDF output and cannot be used for on-screen multi-page preview. Content needs to be actively measured and split in JavaScript for the interactive preview to show proper multi-page layout.

### Why Not `html2canvas`?

Rendering to canvas loses text selection, accessibility, and increases bundle size. The DOM-splitting approach preserves native text rendering and is much lighter.

---

## Phase 4 — Templates & Theming Overhaul

**Goal**: Highly customizable, visually stunning templates.

### 4.1 Real Template Thumbnails
- Replace current CSS-block approximations with actual rendered mini-previews
- Use `html-to-image` to capture screenshot previews of templates with sample data
- Hover zoom, grid/gallery view toggle

### 4.2 Template Customization Panel
- **Color picker**: Customize accent and secondary colors per template
- **Font selector**: 8-10 curated font pairings from Google Fonts
- **Spacing controls**: Margins (narrow/medium/wide), section spacing, line height
- **Layout toggles**: Show/hide/reorder sections on the final output
- **Font size scale**: Slight adjustments to heading/body sizes

### 4.3 New Template Categories
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

### 4.4 Theme System (Light/Dark)
- Full light mode with proper contrast hierarchy
- Toggle in header/settings, persisted to localStorage
- Preview panel: toggle between white background (traditional) and dark (screen viewing)

### 4.5 Preview Modes
- **Full page**: Current A4-sized preview
- **Scroll mode**: Continuous scroll for long resumes
- **Mobile preview**: Simulate phone view
- **Side-by-side**: Compare two templates with same data

---

## Phase 5 — AI Enhancement

**Goal**: Intelligent, streaming, context-aware AI that genuinely helps users.

### 5.1 Streaming AI Responses
- Replace all-or-nothing loading spinner with token-by-token streaming
- Use Vercel AI SDK or raw SSE from the API
- Display text appearing in real-time in the editor field

### 5.2 Job Description Matching
- Paste a job description URL or text
- AI identifies key requirements, skills, keywords
- "Match Resume" button compares resume against JD
- Match percentage + highlighted missing keywords

### 5.3 Keyword Gap Analysis
- Extract keywords from the job description
- Compare against current resume
- Visual gap report: "Matched" (green) vs "Missing" (red)
- "Add Missing Skills" one-click button

### 5.4 AI Full Resume Rewrite
- "Rewrite Entire Resume" button
- AI rewrites every section for consistency and impact
- Target tone options: Professional, Confident, Warm, Executive
- Preserves all facts and dates — only rewrites language

### 5.5 Cover Letter Enhancements
- Consider job description in generation (not just resume data)
- Multiple paragraph style options after generation
- "Tone Shift" — re-generate in a different tone without starting over

### 5.6 AI Interview Question Generator
- Generate likely interview questions from resume
- Categories: "Experience at X", "Technical", "Behavioral"
- Practice mode with talking points

### 5.7 Prompt Management
- Move hardcoded prompts from `src/api/prompts.js` into a configurable system
- Allow power users to customize prompts (stored locally)
- Prompt versioning — updates don't break existing behavior

### 5.8 OpenAI / Multiple Model Support
- Add GPT-4o as an optional provider
- Let users choose preferred AI provider in settings
- Server-side key management (never expose to client)

---

## Phase 6 — Import & Export Expansion

**Goal**: True portability — get data in and out however the user needs.

### 6.1 Professional PDF Export
- Replace print-window approach with a proper PDF library
- Support A4 and US Letter formats
- Custom margins (narrow/medium/wide)
- Embed PDF metadata (title, author, subject)

### 6.2 DOCX Export (Word Format)
- Use `docx` npm library
- Preserve formatting, fonts, layout
- ATS-friendly output option (plain tables, minimal formatting)

### 6.3 Import from LinkedIn
- Parse LinkedIn profile PDF export
- Extract: name, title, experience, education, skills, certifications
- Map to ResumeData structure

### 6.4 Import from Existing Resume (AI Parse)
- Upload existing PDF/DOCX resume
- AI extracts structured data
- Map to ResumeData
- Review/correct before applying

### 6.5 Google Docs / Drive Integration
- Export directly to Google Docs via API
- Import from Google Docs
- Auto-backup resumes to Drive folder

### 6.6 Public Share Link
- Generate unique shareable URL for each resume
- Hosted HTML version on Vercel edge
- Optional password protection
- QR code generation for the share link

### 6.7 Batch Export
- Export all saved slots as ZIP archive
- Each slot: JSON + PDF + DOCX
- One-click download all

---

## Phase 7 — Monetization & Paid Features

**Goal**: Sustainable revenue without degrading the free experience.

### 7.1 Subscription Tiers

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

### 7.2 Payment Integration
- Stripe for subscription management
- Lemon Squeezy as fallback (EU VAT compliance)
- Pricing page at `/pricing`
- Subscription management portal (cancel, upgrade, downgrade)
- Stripe webhooks for lifecycle events

### 7.3 AI Credit System
- Track per-user AI usage
- Reset monthly for subscriptions
- Display remaining credits in UI
- "Buy more credits" option for free tier

### 7.4 Premium Templates
- Exclusive templates for Pro/Lifetime users
- Industry-specific: Healthcare, Tech, Finance, Education, Creative
- UI badges: "Free" vs "Pro"

### 7.5 Usage Dashboard
- Per-user analytics: resumes created, exports, AI actions, templates used
- Helps users see value and decide to upgrade

---

## Phase 8 — Advanced Features & Integrations

**Goal**: Delight users with unexpected but valuable capabilities.

### 8.1 Collaboration
- Share resume for review with friend/mentor
- Comment system on sections/bullets
- Real-time collaboration via Supabase Realtime

### 8.2 GitHub Integration
- Import projects from GitHub via API
- Authenticate with GitHub OAuth
- Select repos, auto-generate descriptions

### 8.3 Notion Integration
- Import work history from Notion database
- Map Notion properties to resume fields

### 8.4 Spell Check & Grammar
- Client-side spell checker (`nspell` with dictionary)
- Squiggly underline for misspellings
- Grammar suggestions via AI or LanguageTool API

### 8.5 Multi-Language Resume
- Translate resume via AI
- Maintain separate translations per resume
- Side-by-side editing: original + translation

### 8.6 Resume Analytics
- Track views (for shared links)
- A/B test two versions of a resume

---

## Phase 9 — Polish, Performance & Quality

**Goal**: Production-ready quality across every surface.

### 9.1 Testing
- Unit tests: `ats.js`, `storage.js`, `defaults.js`
- Component tests: EditorPanel, PreviewPanel, each section component
- Integration tests: Zustand store actions
- E2E: create resume → AI improve → export PDF
- Stack: Vitest + React Testing Library + Playwright

### 9.2 Accessibility Audit
- axe-core / Lighthouse audit
- Proper heading hierarchy (h1-h6)
- ARIA labels on all interactive elements
- Keyboard focus management (tab order, focus traps)
- Color contrast: WCAG AA minimum (4.5:1)
- Screen reader testing: NVDA / VoiceOver
- Visible focus rings on all interactive elements

### 9.3 Performance Optimization
- Lazy-load section components (`React.lazy` + `Suspense`)
- Memoize expensive computations
- Bundle analysis with `vite-bundle-visualizer`
- Reduce layout shifts in editor

### 9.4 Mobile Experience
- Bottom sheet for section nav (replaces radial overlay on small screens)
- Touch-friendly tap targets (min 44px)
- PWA: service worker + manifest for installability
- Offline support via service worker caching

### 9.5 CI/CD
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
| Visual redesign | Very High | High | 3 | |
| Drag-and-drop reorder | High | Medium | 2 | ⚡ |
| Custom sections | High | Medium | 2 | ⚡ |
| Undo/redo | High | Medium | 2 | ⚡ |
| Rich text editor | Medium | High | 2 | |
| Section visibility toggles | Medium | Low | 2 | ⚡ |
| Real template thumbnails | High | Low | 4 | ⚡ |
| Custom colors/fonts/spacing | High | Medium | 4 | |
| Light mode | Medium | Low | 4 | ⚡ |
| Preview toggle (light/dark) | Medium | Low | 4 | ⚡ |
| AI streaming | High | Medium | 5 | |
| Job description matching | Very High | Medium | 5 | |
| Keyword gap analysis | Very High | Medium | 5 | |
| PDF export (proper) | Critical | Medium | 6 | |
| DOCX export | High | Low | 6 | ⚡ |
| LinkedIn import | High | Medium | 6 | |
| Subscription system | Critical | High | 7 | |
| AI credit system | High | Medium | 7 | |
| Premium templates | Medium | Low | 7 | |
| Full testing suite | High | High | 9 | |
| Accessibility audit | High | Medium | 9 | |
| Mobile improvements | High | Medium | 9 | |

---

## Quick Wins (Can Be Done Immediately)

1. **Real template thumbnails** — Replace CSS blocks with actual rendered previews
2. **Section visibility toggles** — Show/hide per resume version
3. **Save indicator** — "Saving..." / "Saved @ HH:MM" in the sidebar
4. **Light/dark preview toggle** — Toggle preview background
5. **DOCX export** — Add `docx` library + export button
6. **Keyboard shortcut overlay** — `?` key opens shortcut reference
7. **Undo/redo** — Zustand middleware for history (1-2 days)
8. **Mobile bottom sheet nav** — Replace radial overlay

---

## Notes on Current Code That Should Be Preserved

- **AI provider chain (`src/api/freeAI.js`)**: Smart fallback pattern (Groq → Zephyr). Extend with more providers.
- **ATS checker (`src/utils/ats.js`)**: Good scoring algorithm. Improve weighting and add more checks.
- **Auto-save debounce (`src/hooks/useAutoSave.js`)**: Works well. Just add better feedback.
- **Zustand store structure**: Clean and readable. Just split when it grows too large.
- **Template rendering logic**: The section rendering in templates works well — just need custom section support.
