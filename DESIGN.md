# Resume Builder — Design System

> Mobile-first. Intentional. Not another AI-generated look.

---

## 1. Philosophy

This design system is built around three principles:

- **Mobile-first by default** — Every component starts small and scales up. Breakpoints are: `sm` (640px), `md` (768px), `lg` (1024px), `xl` (1280px).
- **Intentional texture** — Surfaces use layered opacity, subtle grain, and controlled contrast to create depth without relying on shadows or gradients as crutches.
- **UX messaging that guides** — Every interactive element communicates state, intent, and consequence. Empty states speak. Errors teach. Success confirms.

---

## 2. Color System

### 2.1 Base Palette

The dark theme uses a warm-cold split: cool backgrounds with warm accents to avoid the sterile "SaaS purple" look.

| Token | Value | Tailwind Class | Usage |
|-------|-------|---------------|-------|
| `void` | `#06060b` | `bg-void` | Deepest background (mobile root) |
| `obsidian` | `#0a0a12` | `bg-obsidian` | App background, panels |
| `slate-900` | `#0f0f18` | `bg-surface` | Card surfaces |
| `slate-800` | `#161622` | `bg-elevated` | Elevated surfaces (entries, modals) |
| `slate-700` | `#1e1e2e` | `bg-elevated-2` | Input backgrounds, hover states |
| `slate-600` | `#2a2a3e` | `bg-muted` | Disabled backgrounds |

### 2.2 Border Palette

Borders are the primary separator — not background color shifts. This creates a cleaner, more architectural feel.

| Token | Value | Tailwind Class | Usage |
|-------|-------|---------------|-------|
| `hairline` | `rgba(255,255,255,0.06)` | `border-hairline` | Subtle dividers, inactive states |
| `subtle` | `rgba(255,255,255,0.10)` | `border-subtle` | Card borders, default inputs |
| `active` | `rgba(255,255,255,0.18)` | `border-active` | Hovered elements, focus rings |
| `brand` | `#7c6fff` | `border-brand` | Brand-bordered elements |

### 2.3 Text Palette

| Token | Value | Tailwind Class | Usage |
|-------|-------|---------------|-------|
| `primary` | `#e8e6f0` | `text-primary` | Headings, labels, active text |
| `secondary` | `#9a98b0` | `text-secondary` | Body text, descriptions |
| `muted` | `#6a6880` | `text-muted` | Placeholders, hints, timestamps |
| `disabled` | `#3a3850` | `text-disabled` | Disabled text |

### 2.4 Brand & Accent

| Token | Value | Tailwind Class | Usage |
|-------|-------|---------------|-------|
| `brand` | `#7c6fff` | `text-brand` `bg-brand` `border-brand` | Primary actions, active states |
| `brand-hover` | `#9488ff` | `text-brand-hover` | Hover state for brand elements |
| `brand-subtle` | `rgba(124,111,255,0.12)` | `bg-brand-subtle` | Brand-tinted backgrounds |
| `brand-glow` | `rgba(124,111,255,0.25)` | `shadow-brand-glow` | Focus rings, active glows |

### 2.5 Semantic Colors

| State | Background | Text | Border | Usage |
|-------|-----------|------|--------|-------|
| Success | `rgba(34,197,94,0.10)` | `#4ade80` | `rgba(34,197,94,0.25)` | Confirmations, load actions |
| Warning | `rgba(250,204,21,0.08)` | `#fbbf24` | `rgba(250,204,21,0.20)` | Warnings, pending states |
| Error | `rgba(239,68,68,0.10)` | `#f87171` | `rgba(239,68,68,0.25)` | Destructive actions, validation errors |
| Info | `rgba(96,165,250,0.08)` | `#60a5fa` | `rgba(96,165,250,0.20)` | Informational hints, ATS tips |
| AI | `rgba(168,85,247,0.08)` | `#c084fc` | `rgba(168,85,247,0.20)` | AI-powered features |

---

## 3. Typography

### 3.1 Type Scale

A restrained scale that avoids the typical AI-generated "every size is different" problem. 6 sizes cover all needs.

| Name | Size | Line Height | Weight | Letter Spacing | Usage |
|------|------|-------------|--------|----------------|-------|
| `display` | `28px` | `1.1` | `700` | `-0.02em` | App title, hero text |
| `heading` | `16px` | `1.3` | `600` | `0` | Section headers, card titles |
| `body` | `13px` | `1.5` | `400` | `0` | Default text, descriptions |
| `label` | `11px` | `1.4` | `500` | `0.05em` uppercase | Input labels, badges |
| `caption` | `10px` | `1.4` | `400` | `0.02em` | Hints, timestamps, helper text |
| `mono` | `10px` | `1.4` | `400` | `0.04em` | Technical info, shortcuts |

### 3.2 Font Families

| Role | Font | Weights |
|------|------|---------|
| UI (default) | `DM Sans` | 400, 500, 600 |
| Display | `Playfair Display` | 700 |
| Mono | `DM Mono` | 400 |

---

## 4. Spacing

Built on a 4px base grid. All spacing values are multiples of 4.

| Token | Value | Tailwind | Usage |
|-------|-------|----------|-------|
| `1` | `4px` | `p-1` | Tight spacing (icon + text gap) |
| `2` | `8px` | `p-2` | Small gaps, input padding |
| `3` | `12px` | `p-3` | Card content padding |
| `4` | `16px` | `p-4` | Section padding |
| `5` | `20px` | `p-5` | Panel padding |
| `6` | `24px` | `p-6` | Large containers |

### 4.1 Component Spacing Conventions

- **Input → Input**: `gap-2` (8px)
- **Section → Section**: `gap-4` (16px)
- **Card internal**: `p-3` (12px)
- **Field group → Field group**: `space-y-2` (8px)
- **Button group**: `gap-2` (8px)

---

## 5. Layout Architecture

### 5.1 Mobile-First Layout

On mobile (`<768px`), the app uses a single-column stack with a tab bar:

```
┌─────────────────────────┐
│       Header Bar        │
│  [≡] Resume Builder  [⬇]│
├─────────────────────────┤
│                         │
│    Tab Navigation       │
│  [Edit]  [Preview]      │
│                         │
├─────────────────────────┤
│                         │
│    Active Tab Content   │
│    (Editor OR Preview)  │
│                         │
│                         │
│                         │
└─────────────────────────┘
```

On tablet (`768px–1023px`), side nav appears with collapsible editor:

```
┌────┬────────────────────┐
│ S  │                    │
│ i  │   Editor / Preview │
│ d  │   (toggleable)     │
│ e  │                    │
│ N  │                    │
│ a  │                    │
│ v  │                    │
└────┴────────────────────┘
```

On desktop (`≥1024px`), the full 3-column layout:

```
┌────┬──────────┬──────────────────────┐
│ S  │ Editor   │   Preview Panel      │
│ i  │ (320px)  │   (fills remaining)  │
│ d  │          │                      │
│ e  │          │   [A4 Resume Card]   │
│ N  │          │                      │
│ a  │          │                      │
│ v  │          │                      │
└────┴──────────┴──────────────────────┘
```

### 5.2 Responsive Breakpoints

| Breakpoint | Width | Layout |
|------------|-------|--------|
| `xs` | `<640px` | Mobile single-column with tabs |
| `sm` | `640px+` | Mobile with wider cards |
| `md` | `768px+` | Tablet with side nav + content toggle |
| `lg` | `1024px+` | Desktop 3-column layout |
| `xl` | `1280px+` | Desktop with wider editor (380px) |

---

## 6. Component Guidelines

### 6.1 Cards

- Border-first design: `border border-subtle rounded-xl`
- Header: `text-heading text-primary` with optional chevron for collapsible
- Content: `p-3` padding, `space-y-2` for internal spacing
- No shadows — borders and opacity create depth

### 6.2 Inputs

- Label: `text-label text-muted`
- Field: `bg-slate-700 border-subtle rounded-lg text-body text-primary placeholder:text-disabled`
- Focus: `border-brand ring-1 ring-brand-subtle`
- Error: `border-error ring-1 ring-error-subtle`
- Helper text: `text-caption text-muted mt-1`

### 6.3 Buttons

| Variant | Background | Border | Text | Hover |
|---------|-----------|--------|------|-------|
| Primary | `bg-brand` | `border-brand-hover` | `text-white` | `bg-brand-hover` |
| Ghost | `bg-transparent` | `border-subtle` | `text-secondary` | `bg-slate-700` |
| Danger | `bg-transparent` | `border-error` | `text-error` | `bg-error/10` |
| Success | `bg-transparent` | `border-success` | `text-success` | `bg-success/10` |
| AI | `bg-ai-subtle` | `border-ai` | `text-ai` | `bg-ai-hover` |

### 6.4 Empty States

Every empty state follows this pattern:
```
┌─────────────────────────────┐
│         [icon]              │
│                             │
│      Nothing here yet       │
│                             │
│   Description of what       │
│   will appear here          │
│                             │
│     [Call to action]        │
└─────────────────────────────┘
```

- Icon: 32px, muted color
- Title: `text-body text-secondary`
- Description: `text-caption text-muted`
- CTA: Primary or ghost button

### 6.5 Loading States

- Inline: Spinner icon with `text-muted`
- Full overlay: Skeleton with `animate-pulse bg-slate-700`
- AI-specific: Sparkles icon with slow rotation + "AI is thinking..." caption

### 6.6 Toast Notifications

- Success: Green icon + "Done" + provider name
- Error: Red icon + specific error message
- Info: Blue icon + context
- AI: Purple sparkles icon + provider name

---

## 7. UX Messaging Guidelines

### 7.1 Tone

- **Direct** — No fluff. "Save successful" not "Your resume has been successfully saved to your slots."
- **Helpful** — Explain why, not what. "Add bullets that start with action verbs" not "Add bullet points."
- **Human** — Occasional personality. "Looking good" for high ATS scores, not "Score: 95%."

### 7.2 State Communication

| State | Message Pattern | Example |
|-------|----------------|---------|
| Empty | Action + benefit | "Add your first role — it's what employers look at first." |
| Loading | Process indicator | "Polishing your bullet..." |
| Success | Confirmation + next step | "Summary improved. Check the preview." |
| Error | Problem + solution | "AI is busy. Try again or write it yourself — you've got this." |
| Warning | Context + recommendation | "ATS scores below 60 may not pass automated filters." |

### 7.3 Microcopy Standards

- Button labels: Verb-first, max 3 words ("Add role", "Generate", "Export PDF")
- Tooltips: Describe action, not element ("Improve this bullet with AI")
- Helper text: Actionable guidance ("Start each bullet with a strong verb like 'Led' or 'Built'")
- Error messages: Specific and fixable ("Add at least one role to see suggestions")

---

## 8. Animation & Motion

### 8.1 Principles

- **Fast in, fast out** — Appearances are quick (150ms), disappearances instant (100ms)
- **Subtle only** — No bouncing, no spinning (except loaders). Fades and slides only.
- **Purposeful** — Animation communicates state change, not decoration.

### 8.2 Standard Durations

| Duration | Easing | Usage |
|----------|--------|-------|
| `100ms` | `ease-out` | Hover states, color transitions |
| `150ms` | `ease-out` | Appearances, panel slides |
| `200ms` | `ease-in-out` | Collapsible sections, modals |
| `300ms` | `ease-out` | Tab transitions, route changes |

### 8.3 Tailwind Animation Classes

```
transition-all duration-150 ease-out
animate-fade-in (custom: opacity 0→1, 150ms)
animate-slide-up (custom: translateY 8px→0 + opacity 0→1, 200ms)
animate-pulse (for skeleton loading)
animate-spin (for loaders only)
```

---

## 9. Accessibility

- **Contrast ratios**: Minimum 4.5:1 for body text, 3:1 for large text
- **Focus indicators**: Always visible `ring-2 ring-brand ring-offset-2 ring-offset-obsidian`
- **Touch targets**: Minimum 44x44px for all interactive elements
- **Screen readers**: All icons have `aria-label`, form fields have associated labels
- **Reduced motion**: Respect `prefers-reduced-motion` — disable all animations except spinners

---

## 10. File Structure

```
src/
├── design/
│   ├── tokens.js          ← Color, spacing, typography constants
│   └── components/        ← Design system primitives
│       ├── Surface.jsx    ← Card/container with variant support
│       ├── Field.jsx      ← Input/TextArea/Select with label + helper
│       ├── Button.jsx     ← All button variants in one component
│       ├── Badge.jsx      ← Tags with color states
│       ├── EmptyState.jsx ← Empty state with icon + CTA
│       ├── Hint.jsx       ← Helper/caption text component
│       ├── Skeleton.jsx   ← Loading placeholder
│       └── Divider.jsx    ← Hairline separator
├── components/
│   ├── UI/                ← App-level shared components (wraps design system)
│   ├── Editor/            ← Editor section components
│   └── Preview/           ← Preview panel
└── ...
```

---

## 11. Anti-Patterns (What We Avoid)

- ❌ Purple-everything gradients as the only visual identity
- ❌ "Here's your AI-generated resume builder" hero text
- ❌ Generic Lucide icons with no custom touches
- ❌ Shadows as depth — use borders and opacity instead
- ❌ 15 different font sizes that feel random
- ❌ Loading spinners everywhere — use skeletons and inline states
- ❌ Toast messages for everything — use inline feedback when possible
- ❌ Dark mode that's just inverted white — warm-cold split instead
