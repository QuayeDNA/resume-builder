# ResumeForge — Design Philosophy

> *A warm, tactile, crafted approach to a tool that job seekers already dread using.*

## Core Principle

Most resume builders feel like spreadsheets with a coat of paint. They're cold, transactional, and treat the user like an HR database entry. Our philosophy is the opposite: **the tool should feel like a beautifully crafted notebook, not a dashboard.**

## Emotional Target

Resume building is stressful. Users are anxious, uncertain, and often starting from a place of professional insecurity. Our design should:

- **Calm** — warm colors, soft shadows, gentle textures
- **Support** — clear guidance, smart defaults, AI assistance that feels like a collaborator
- **Delight** — tactile interactions, micro-animations, a sense of care in every pixel

## Visual Language

| Element | Expression |
|---------|-----------|
| Palette | Paper-off-white base, warm terracotta accent, calming sage secondary. Ink-black text with soft brown undertones. |
| Typography | Bricolage Grotesque for body (approachable humanist sans), Fraunces for display (variable soft-serif with optical size nuance), IBM Plex Mono for data. |
| Texture | Subtle grain overlay at 4% opacity — a nod to cotton paper. Desk surface warmth for the preview area. |
| Motion | Leisurely 350ms ease-out-expo transitions. Never snappy. Never sluggish. Like a well-oiled mechanical pencil. |
| Depth | Soft multi-layer shadows using ink at low opacity. Cards feel like they're resting on the paper, not floating in space. |

## Layout Philosophy

- **Sidebar as app navigation** (not section dump) — the user navigates by intent (Editor, Templates, Cover, Saved, Settings), not by resume section
- **Editor as accordion stack** — all resume sections visible in one scrollable view, no page flipping, no modal dialogs for section editing
- **Preview as desk** — the resume rests on a textured wooden surface with adjustable zoom, simulating the real-world experience of reviewing a printed document

## Signature Details

1. **The "R" logo draws itself** — on first visit, a hand-drawn R strokes into existence, setting the crafted tone immediately
2. **Grain overlay** — a persistent texture that humanizes every screen without interfering with readability
3. **Tactile buttons** — pill-shaped, scale down 3% on press, like pressing a real key
4. **Staggered reveals** — sections appear one after another with a gentle delay, like flipping through notebook pages

## What We Don't Do

- No dark sci-fi themes
- No harsh borders or sharp corners
- No loading spinners that leave the user guessing
- No generic Tailwind defaults

## Accessibility

- Respects `prefers-reduced-motion` — all animations degrade gracefully
- High contrast mode compatible — paper/ink palette naturally exceeds WCAG AA
- Focus rings visible on all interactive elements (terracotta ring)
- Keyboard navigable — tab through all controls in logical order

*Last updated: June 2026*
