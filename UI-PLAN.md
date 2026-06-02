# ResumeForge — UI Enhancement Plan

> Generated from full design & UX audit on 2026-06-02
> Audit baseline: baseline-ui, web-design-guidelines, fixing-accessibility, fixing-motion-performance, vercel-react-best-practices, next-best-practices

---

## Priority Matrix

| Priority | Category | Impact |
|----------|----------|--------|
| P0 | Accessibility — keyboard, focus, labels | Critical |
| P0 | Route-level boundaries (loading/error/not-found) | Critical |
| P1 | Responsiveness — tablet breakpoint | High |
| P1 | Empty states & form validation | High |
| P1 | Font payload optimization | Medium-High |
| P2 | Exit animations & reduced-motion | Medium |
| P2 | Re-render optimization | Medium |
| P3 | Polish — semantic regions, nav transitions, skeletons | Low |

---

## P0 — Must Fix

### [P0.1] Focus trap + ESC + focus restoration on BottomSheetNav

**Problem:** `src/components/Mobile/BottomSheetNav.tsx` — the bottom sheet does not trap keyboard focus. Tab can move behind the overlay. ESC does not close it. Focus is not restored to the trigger button on close.

**Fix:**
- Trap focus within the sheet while open (first/last element cycling)
- Add `onKeyDown` handler for Escape → `onClose()`
- Store the trigger element ref and call `.focus()` on close

**Files:** `src/components/Mobile/BottomSheetNav.tsx`

---

### [P0.2] Missing aria-labels on icon-only buttons

**Problem:** `src/components/Preview/PreviewPanel.tsx` — the preview mode toggle buttons (page/scroll/mobile) and the background toggle buttons (desk/paper/dark) are icon-only with no accessible labels.

**Fix:** Add `aria-label` to each icon-only button.

**Files:** `src/components/Preview/PreviewPanel.tsx`

---

### [P0.3] Keyboard focus on SideNav buttons

**Problem:** `src/components/Editor/SideNav.tsx` — the navigation buttons change visual active state but have no visible focus indicator for keyboard users.

**Fix:** Add `focus-visible:ring-2 focus-visible:ring-terracotta` to NavButton.

**Files:** `src/components/Editor/SideNav.tsx`

---

### [P0.4] Route-level boundaries (loading.tsx, error.tsx, not-found.tsx)

**Problem:** No route-level files exist — app has no loading states, no route error boundaries, no 404 page.

**Fix:** Create:
- `app/loading.tsx` — minimal splash skeleton
- `app/error.tsx` — friendly error with retry
- `app/not-found.tsx` — 404 page

**Files:** `app/loading.tsx`, `app/error.tsx`, `app/not-found.tsx`

---

### [P0.5] Scrollbar width for consistent layout

**Problem:** `<div>` with `scrollbarWidth: 'none'` in SideNav — inconsistent behavior across browsers.

**Fix:** Use CSS class instead of inline style.

**Files:** `src/components/Editor/SideNav.tsx`

---

## P1 — Should Fix

### [P1.1] Tablet (md) breakpoint layout

**Problem:** `src/App.tsx:120` — only `lg:` breakpoint for 3-column. Tablets (768-1024px) get the mobile layout with no side nav, wasting horizontal space.

**Fix:**
- Add `md:grid md:grid-cols-[max-content_1fr]` layout for tablets
- Show a compact version of SideNav on `md:flex`
- Stack Preview below Editor on tablets, or use a tab toggle

**Files:** `src/App.tsx`, `src/components/Editor/SideNav.tsx`

---

### [P1.2] Wire EmptyState component into sections

**Problem:** `src/design/components/EmptyState.tsx` exists but is imported/used nowhere in the app. Sections with zero entries show only an "Add" button.

**Fix:** Use `EmptyState` with icon, title, description, and CTA in:
- Experience (zero entries)
- Education (zero entries)
- Projects (zero entries)
- Certifications (zero entries)
- Languages (zero entries)
- Custom sections (zero entries)
- Saved slots (zero slots)

**Files:** Section components in `src/components/Editor/`

---

### [P1.3] Form validation wiring

**Problem:** `error` prop exists on `Field`, `Input`, `TextArea`, `Select` but is never populated. No inline validation anywhere.

**Fix:**
- Add validation on blur for required fields (name, email, title)
- Add `aria-invalid` and `aria-describedby` wiring in Field component
- Show inline error messages below fields

**Files:** `src/design/components/Field.tsx`, section editors

---

### [P1.4] Font payload optimization

**Problem:** `app/layout.tsx` loads 14 Google Font families in a single request — ~500KB+ of CSS and woff2 files that block rendering.

**Fix:** Load only the 3 fonts actually used in `tailwind.config.js`:
- `Bricolage Grotesque` (body)
- `Fraunces` (display)
- `IBM Plex Mono` (mono)

Defer the other 11 fonts or remove them if unused.

**Files:** `app/layout.tsx`

---

### [P1.5] Mobile BottomSheetNav keyboard-closeable

**Problem:** The bottom sheet overlay + panel cannot be closed with keyboard (ESC).

**Fix:** Add `onKeyDown={e => e.key === 'Escape' && onClose()}` on the overlay backdrop.

**Files:** `src/components/Mobile/BottomSheetNav.tsx`

---

## P2 — Nice to Have

### [P2.1] Exit animations for add/remove

**Problem:** Bullets, entries, and skill badges appear/disappear instantly with no exit animation.

**Fix:**
- Use `AnimatePresence` from `framer-motion` (or CSS-only with `animate-fade-out` class)
- Add a `useEffect`-based unmount animation pattern
- Bullet removal should scale + fade out (150ms)

**Files:** `src/components/Editor/sectionConfigs.tsx`, `src/components/UI/Badge.tsx`

---

### [P2.2] prefers-reduced-motion global override

**Problem:** Only the SplashScreen has a `prefers-reduced-motion` media query. All other animations (hover, transitions, entrance animations) do not respect user preference.

**Fix:** Add to `app/globals.css`:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

**Files:** `app/globals.css`

---

### [P2.3] Re-render optimization

**Problems:**
1. `EditorPanel.tsx:43` — `SectionRenderer` defined inline, re-created every render
2. `EditorPanel.tsx` — re-renders all sections on any data change
3. `PreviewPanel.tsx:33` — `useState(getStoredBg())` calls localStorage every render
4. `SideNav.tsx:42` — `NavButton` defined inside component
5. `AtsChecker.tsx` — `run` function re-created on every data change due to `useEffect` dependency

**Fixes:**
1. Extract `SectionRenderer` outside `EditorPanel`
2. Wrap section rendering in `React.memo`
3. Use `useState(() => getStoredBg())` (initializer function)
4. Hoist `NavButton` outside `SideNav`
5. Use `useCallback` for ATS run function or stabilize dependencies

**Files:** Multiple

---

### [P2.4] Loading skeletons for AI sections

**Problem:** `Skeleton.tsx` exists in design system but is not used for AI loading states (ATS checker, job match, skills suggestions).

**Fix:** Show `<Skeleton lines={3} />` while AI results are loading.

**Files:** `src/components/Editor/AtsChecker.tsx`, `src/components/Editor/JobMatchPanel.tsx`, `src/components/Editor/SkillsSection.tsx`

---

## P3 — Polish

### [P3.1] Semantic landmark regions

**Problem:** No `<main>`, `<nav>`, `<section>`, `<aside>` landmarks anywhere in the app. Screen readers cannot navigate by region.

**Fix:**
- Wrap main content in `<main>`
- SideNav → `<nav aria-label="Sections">`
- EditorPanel → `<section aria-label="Editor">`
- PreviewPanel → `<section aria-label="Preview">`

**Files:** `src/App.tsx`, SideNav, EditorPanel, PreviewPanel

---

### [P3.2] Semantic heading hierarchy

**Problem:** `EditorPanel.tsx` uses `h2` after root layout has no `h1`. The `h1` exists only in the SplashScreen.

**Fix:**
- Add `<h1 className="sr-only">ResumeForge Builder</h1>` at the top of main content
- Ensure heading levels don't skip (h1 → h2 → h3)

**Files:** `src/App.tsx`, `src/components/Editor/EditorPanel.tsx`

---

### [P3.3] Active nav indicator smoother transition

**Problem:** SideNav active state snaps immediately — no transition on the border/background change.

**Fix:** Already has `transition-all duration-200 ease-out-expo` — this is adequate but the border-color transition could be more visible.

**Files:** `src/components/Editor/SideNav.tsx`

---

### [P3.4] Drag handle keyboard support

**Problem:** Drag handles in `SortableList.tsx` are `<div>` elements with no keyboard interaction — screen reader users and keyboard users cannot reorder items.

**Fix:** Add `role="button"`, `tabindex="0"`, and keyboard handlers (Arrow Up/Down to reorder).

**Files:** `src/components/SortableList.tsx`, `src/components/Editor/EditorPanel.tsx`

---

### [P3.5] safe-area-inset support

**Problem:** Fixed elements (mobile header, bottom sheet) do not account for notched device safe areas.

**Fix:** Add `env(safe-area-inset-top)` and `env(safe-area-inset-bottom)` to fixed elements.

**Files:** `src/App.tsx` (MobileHeader), `src/components/Mobile/BottomSheetNav.tsx`

---

## Implementation Order

```
Pass 1 — P0 items (critical accessibility + route boundaries)
Pass 2 — P1 items (tablet, empty states, validation, fonts)
Pass 3 — P2 items (animations, performance, skeletons)
Pass 4 — P3 items (semantics, headings, polish)
```

---

## File Change Summary

| File | Items |
|------|-------|
| `app/globals.css` | P2.2 reduced-motion |
| `app/layout.tsx` | P1.4 fonts |
| `app/loading.tsx` | P0.4 new file |
| `app/error.tsx` | P0.4 new file |
| `app/not-found.tsx` | P0.4 new file |
| `src/App.tsx` | P1.1 tablet layout + P3.1/3.2 landmarks + P3.5 safe-area |
| `src/components/Mobile/BottomSheetNav.tsx` | P0.1 focus trap + P1.5 ESC |
| `src/components/Preview/PreviewPanel.tsx` | P0.2 aria-labels |
| `src/components/Editor/SideNav.tsx` | P0.3 focus-visible + P0.5 scrollbar + P2.3 hoist NavButton |
| `src/components/Editor/EditorPanel.tsx` | P2.3 memoize + P3.2 heading |
| `src/components/Editor/sectionConfigs.tsx` | P2.1 exit anim |
| `src/components/UI/Badge.tsx` | P2.1 exit anim |
| `src/components/SortableList.tsx` | P3.4 keyboard drag |
| `src/design/components/Field.tsx` | P1.3 validation wiring |
| Various section editors | P1.2 empty states |
