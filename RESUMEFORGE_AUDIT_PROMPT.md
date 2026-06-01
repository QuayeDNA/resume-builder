# ResumeForge — Full-Stack Product Audit & Improvement Roadmap

You are a senior product engineer and design director with experience shipping consumer-grade SaaS products. You have been handed the complete source code for **ResumeForge** — a React + Tailwind + Zustand + Vite resume builder with AI features (Claude/Groq fallback), PDF export, localStorage persistence, 11 templates, ATS scoring, and a cover letter generator.

Your job is to conduct a **thorough, honest, multi-dimensional audit** of this product and produce a prioritized improvement roadmap that would bring it to the quality level of established tools like **Enhancv, Resume.io, Novoresume, Canva's resume builder, and Kickresume**.

---

## Context: Codebase You Are Auditing

Read these files before beginning your analysis:

```
src/App.jsx                         ← Root layout + mobile nav (RadialNavOverlay)
src/index.css                       ← Global styles + Tailwind base
tailwind.config.js                  ← Full design token system
src/design/tokens.js                ← Color + spacing constants
src/design/components/              ← Primitive UI system (Button, Card, Badge, Field…)
src/components/UI/                  ← App-level wrappers (AiButton, EntryCard, etc.)
src/components/Editor/              ← All editor sections (Personal, Experience, Skills…)
src/components/Preview/PreviewPanel.jsx ← Live preview with template switching
src/components/SplashScreen.jsx     ← App intro screen
src/Templates/                      ← SingleColumnTemplate, TwoColumnTemplate, ATSTemplate, CoverLetterTemplate
src/Templates/index.js              ← 11 template definitions
src/store/useResumeStore.js         ← Zustand global state
src/api/claude.js                   ← Claude/Groq AI client
src/api/ai.js                       ← Unified AI interface
src/api/freeAI.js                   ← Groq + HuggingFace fallback
src/api/prompts.js                  ← Structured prompt templates
src/hooks/useAi.js                  ← AI loading + toast wrapper
src/hooks/useAutoSave.js            ← Debounced localStorage
src/utils/ats.js                    ← ATS scoring algorithm
src/utils/pdf.js                    ← Print-window PDF export
src/utils/storage.js                ← localStorage + JSON import/export
src/utils/defaults.js               ← Sample resume data
src/types/index.js                  ← JSDoc typedefs
DESIGN.md                           ← Design system specification
README.md                           ← Feature list + tech stack
api/claude.js                       ← Vercel serverless proxy
```

---

## Audit Dimensions

Analyze every dimension below. For each one, provide:
1. **Current state** — what exists and how it works
2. **Specific problems** — bugs, gaps, UX failures, code quality issues
3. **Concrete fixes** — code-level or design-level changes with rationale
4. **Priority** — Critical / High / Medium / Low

---

### 1. Architecture & Code Quality

Audit:
- Component structure and separation of concerns
- State management patterns (Zustand store shape, action granularity)
- API layer design (provider fallback chain, error handling, prompt engineering)
- TypeScript migration readiness (JSDoc vs actual types)
- File/folder organization and naming consistency
- Dead code, redundant abstractions (e.g., UI wrapper → design component → base component chain)
- Performance: unnecessary re-renders, missing memoization, heavy computations in render
- Bundle size concerns: unused deps, unoptimized imports

Look specifically at:
- The three-layer component indirection (`src/components/UI/Input.jsx` → `src/design/components/Field.jsx`) — is this justified or over-engineered?
- The `callClaude` → `callFreeAI` fallback — is this duplicated logic?
- The `useAi` hook — is it missing error categorization?
- `useResumeStore.js` — does the flat state shape scale? What happens at 1000 items?

---

### 2. User Experience & Interaction Design

Audit every user flow:

**Onboarding flow:**
- The SplashScreen shows for 2.5s unconditionally (sessionStorage check is inverted — it shows UNLESS already shown). Is this the intended behavior? What does a first-time user see and feel?
- Is there a guided first-run experience, or does the user land on a filled sample resume and feel lost?

**Editor flow:**
- The RadialNavOverlay on mobile — does it actually work well? Is a radial menu the right pattern for 10 nav items on mobile?
- How does the tab-based mobile layout (Edit / Preview) compare to what users expect from mobile apps like Canva or LinkedIn?
- Are empty states present for all sections? What happens when a section has 0 entries?
- Is adding content intuitive? Are there inline hints, placeholders, and example text?

**AI features:**
- How is the AI positioned? Is it discoverable or buried?
- What happens when AI fails? Are errors specific and actionable?
- Are AI interactions fast enough to feel magical or slow enough to feel broken?
- What feedback does the user get during AI loading (toast? inline spinner? nothing)?

**Preview panel:**
- Does the live preview actually update in real time without lag?
- Is the A4 preview at 794px correctly proportional on all screen sizes?
- Can the user see their resume while editing, or must they switch tabs on mobile?

**PDF export:**
- The print-window strategy — does it produce pixel-perfect output across Chrome, Firefox, Safari?
- Are fonts loaded before `window.print()` fires?
- Does the exported PDF look exactly like the preview?

**Saved resumes / slots:**
- The 10-slot system — is it clear? Do users understand what "slots" are?
- Is auto-save behavior communicated? When does the user know their work is safe?

---

### 3. Visual Design & UI Quality

Compare against Enhancv, Novoresume, Resume.io, and Kickresume. Be honest about gaps.

**App shell:**
- Does the dark theme feel premium or like a template? Identify specific elements that look generic.
- The brand color `#7c6fff` — is it differentiated or does it blend into the "AI startup purple" sea?
- Header bar on mobile: is it polished or utilitarian?
- SideNav on desktop: is the icon-only nav with 10 items scannable?

**Typography:**
- The app uses DM Sans + Playfair Display + DM Mono — is this combination distinctive?
- Are type sizes, weights, and spacings truly intentional or inherited from Tailwind defaults?
- Does the scale (display/heading/body/label/caption) cover every UI case?

**Component quality:**
- Card component: the collapsible section card — does it feel snappy or clunky?
- Input fields: focus states, validation states, error states — are all designed?
- The AI button (purple sparkles) — does it feel integrated or bolted on?
- EntryCard delete button (tiny X at -top-2 -right-2) — is this discoverable and accessible?
- The ATS score widget — does it feel like a product feature or a debug panel?

**Resume templates:**
- Audit each of the 11 templates for visual quality compared to competitors
- Are the templates truly differentiated or are they color palette swaps?
- Do the ATS templates look professional enough for real job applications?
- Cover letter template: does it look like a real professional letter?

**Empty/loading states:**
- Are skeleton loaders used or just spinners?
- Is the loading state for AI operations clearly communicated?
- What does the app look like with zero data?

---

### 4. Functionality Completeness

Compare against competitor feature sets:

**Missing features (critical gaps):**
- No drag-to-reorder for sections, experience entries, or bullets (dnd-kit is already installed but unused)
- No undo/redo
- No real-time character counts for fields with practical limits (summary, bullets)
- No spell check integration
- No section visibility toggles (hide/show sections on the resume)
- No custom section order control
- No color customization per template
- No font size adjustment
- No margin/spacing controls
- No photo upload field
- No custom section type (e.g., "Volunteer Work", "Publications")

**AI features:**
- No job description paste → tailored suggestions
- No "rewrite entire resume" for a target role
- No keyword gap analysis (resume vs. JD)
- AI only works on individual bullets — no batch improvement

**Export:**
- Only PDF and JSON — no DOCX, no shareable link, no public URL
- No multi-page awareness in the print template

**Data:**
- Auto-save debounce is 1200ms — is that fast enough? What if the user closes the tab?
- No cloud sync — everything is localStorage-only

Identify which of these missing features are table stakes (users will leave without them) vs. nice-to-haves.

---

### 5. Performance & Technical Health

Audit:
- First Contentful Paint and Time to Interactive on a cold load
- Re-render frequency: does every keystroke in any field re-render the preview?
- `useMemo` usage in PreviewPanel — is it correctly implemented?
- Template rendering: all templates use inline styles — what's the performance cost?
- The `cn()` utility vs clsx vs tailwind-merge — is the custom implementation correct?
- localStorage read/write frequency
- The Vercel serverless function: does it have timeout handling? What happens on cold start?
- The 3-chain AI fallback: what's the total timeout budget? Can a user wait 30 seconds?

---

### 6. Accessibility

Audit against WCAG 2.1 AA:
- Color contrast ratios across the dark theme — specifically `text-text-muted` (#6a6880) on `bg-surface` (#0f0f18)
- The RadialNavOverlay — keyboard navigable? Trap focus? ESC to close?
- The SideNav icon-only buttons — do all have accessible labels?
- EntryCard delete button — aria-label present?
- Form inputs — all labels correctly associated? All fields in fieldsets?
- ATS score widget — screen reader readable?
- The tab system in PreviewPanel — are tab roles and aria-selected correct?
- The collapsible Card — aria-expanded implemented (yes, it's there — but is it correct)?
- Touch targets: minimum 44×44px audit across mobile
- Does `prefers-reduced-motion` disable the RadialNavOverlay animation and slide-up effects?

---

### 7. Mobile Experience

This app claims to be "mobile-first" in DESIGN.md. Audit that claim:
- The 3-column desktop layout on a 375px screen
- The RadialNavOverlay on small screens — does 10 items fit? Are tap targets large enough?
- The editor panel — are all inputs comfortable to fill on mobile?
- The preview on mobile — is 794px A4 preview usable at 375px wide?
- The PDF export on mobile — does the print-window strategy work on iOS/Android?
- Portrait vs landscape behavior

---

### 8. Error Handling & Edge Cases

What happens when:
- localStorage is full or disabled (private browsing)?
- The user imports a malformed JSON file?
- All AI providers are down?
- The user has 10 slots saved and tries to save an 11th?
- A bullet point has 2000 characters?
- The user has 20 experience entries?
- The network is offline?
- The Vercel serverless function returns a 500?
- `window.open()` is blocked by the browser during PDF export?

---

### 9. Security & Privacy

- The `VITE_ANTHROPIC_API_KEY` in dev mode is exposed client-side. How big is this risk?
- The Vercel proxy (`api/claude.js`) — is it rate-limited? Can anyone hit it without auth?
- localStorage stores full resume data including PII (email, phone, LinkedIn) — is this documented?
- The JSON export — is there any sanitization?
- The `importFromJSON` → `loadFromJSON` — is imported data validated before writing to store?

---

## Output Format

Produce your audit as a structured document with these sections:

```
## Executive Summary
- Overall quality score (1–10) with honest justification
- Top 3 things working well
- Top 3 critical problems to fix immediately

## Critical Issues (fix this week)
[List with: Problem → Root Cause → Specific Fix → Files to Change]

## High Priority (fix this sprint)
[Same format]

## Medium Priority (next sprint)
[Same format]

## Low Priority / Future (backlog)
[Brief list]

## Quick Wins (< 1 hour each, high impact)
[List of small changes that make a big difference]

## Recommended Refactors
[Architectural changes that will unblock future work]

## Competitor Gap Analysis
[Table: Feature | Us | Enhancv | Resume.io | Priority]

## Implementation Roadmap
[Week-by-week plan for the next 4 weeks to reach competitive quality]
```

---

## Tone & Standards

- Be **brutally honest**. This app needs to know what's broken before it can be fixed.
- Cite **specific file paths and line ranges** for every issue you identify.
- When suggesting UI improvements, describe them in terms of **code changes** (CSS, component structure, Tailwind classes), not abstract design advice.
- Benchmark every claim against a specific competitor (e.g., "Novoresume shows character count on the summary field — we don't").
- Do not pad the output with compliments. Prioritize signal.
- If something is genuinely good, say so briefly and move on.

---

## Starting Instruction

Begin by reading all source files listed above. Then produce the full audit. Do not ask for clarification — use your judgment based on the code you read. The goal is a document the engineering team can act on immediately.