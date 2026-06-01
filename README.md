# ResumeForge 🚀

> **Free, fully-featured AI resume builder.** No paywall. No account required. Everything your career needs — open source and self-hostable.

![ResumeForge Screenshot](https://via.placeholder.com/1200x630/070710/6c63ff?text=ResumeForge)

---

## ✨ Features Implemented

### Core Resume Builder
- **Live real-time preview** — WYSIWYG editing with instant feedback
- **11 professional templates** — 6 single-column, 2 two-column sidebar, 3 ATS-optimized layouts
- **All standard sections** — Personal Info, Work Experience, Education, Skills, Projects, Certifications, Languages
- **Unlimited entries** — Add as many experiences, bullets, projects, etc. as needed

### AI Features (Groq / HuggingFace)
- **AI Improve Summary** — Rewrites your professional summary to be more compelling and ATS-optimized
- **AI Improve Bullet** — Per-bullet AI enhancement with strong action verbs and quantified metrics
- **AI Suggest Bullets** — Generates 3 ready-to-use achievement bullets for any role
- **AI Suggest Skills** — Recommends relevant skills based on your job title
- **AI Generate Cover Letter** — Writes a full personalized cover letter in your chosen tone

### Cover Letter Builder
- Dedicated cover letter editor with recipient, company, role, and tone settings
- 4 tone options: Professional, Enthusiastic, Concise, Creative
- Live rendered preview alongside resume

### ATS Score Checker
- Real-time ATS scoring (0–100%) with color-coded rating
- Checks: contact info, action verbs, quantified achievements, skill count, LinkedIn presence
- Actionable feedback for every low-scoring area

### Data Management
- **Auto-save to localStorage** — data persists automatically across browser sessions
- **Resume Slots** — Save and load up to 10 separate resume versions
- **JSON Import/Export** — Full portability; back up or share your resume data
- **Reset to defaults** — One-click restore to sample data

### PDF Export
- Client-side PDF generation via print window API (no server required)
- A4-formatted output with full CSS fidelity

### Design & UX
- Fully responsive dark-mode editor
- Collapsible section cards in the editor panel
- Smooth section animations
- Toast notifications for all AI and save actions

---

## 🗂️ Project Structure

```
resume-builder/
├── api/
│   └── claude.js                   # Vercel serverless proxy (keeps API key secret)
│
├── public/
│   └── favicon.svg
│
├── src/
│   ├── App.jsx                     # Root component — composes layout
│   ├── main.jsx                    # React entry point
│   ├── index.css                   # Tailwind base + global styles
│   │
│   ├── api/
│   │   └── claude.js               # Frontend AI client + prompt helpers
│   │
│   ├── components/
│   │   ├── Editor/
│   │   │   ├── SideNav.jsx         # Icon sidebar navigation
│   │   │   ├── EditorPanel.jsx     # Section router + editor layout
│   │   │   ├── PersonalSection.jsx
│   │   │   ├── ExperienceSection.jsx
│   │   │   ├── EducationSection.jsx
│   │   │   ├── SkillsSection.jsx
│   │   │   ├── ProjectsSection.jsx
│   │   │   ├── CertificationsSection.jsx
│   │   │   ├── LanguagesSection.jsx
│   │   │   ├── CoverLetterSection.jsx
│   │   │   ├── DesignSection.jsx
│   │   │   ├── SavedSection.jsx
│   │   │   └── AtsChecker.jsx      # ATS score widget
│   │   │
│   │   ├── Preview/
│   │   │   └── PreviewPanel.jsx    # Live resume/cover letter preview
│   │   │
│   │   └── UI/                     # Reusable atomic UI components
│   │       ├── index.js            # Barrel exports
│   │       ├── Input.jsx
│   │       ├── TextArea.jsx
│   │       ├── Select.jsx
│   │       ├── Card.jsx            # Collapsible section card
│   │       ├── EntryCard.jsx       # Deletable entry wrapper
│   │       ├── AiButton.jsx        # AI action button with loading state
│   │       ├── IconButton.jsx
│   │       └── Badge.jsx           # Removable skill badge
│   │
│   ├── hooks/
│   │   ├── useAutoSave.js          # Debounced localStorage auto-save
│   │   └── useAi.js                # AI loading state + toast wrapper
│   │
│   ├── store/
│   │   └── useResumeStore.js       # Zustand global state (all resume data + UI state)
│   │
│   ├── Templates/
│   │   ├── index.js                # Template registry + getTemplate()
│   │   ├── SingleColumnTemplate.jsx
│   │   ├── TwoColumnTemplate.jsx
│   │   ├── ATSTemplate.jsx
│   │   └── CoverLetterTemplate.jsx
│   │
│   ├── types/
│   │   └── index.js                # JSDoc typedefs + enum constants
│   │
│   └── utils/
│       ├── defaults.js             # Default resume + cover letter data
│       ├── storage.js              # localStorage read/write helpers
│       ├── classNames.js           # Conditional class name merger
│       ├── ats.js                  # ATS scoring algorithm
│       └── pdf.js                  # Print-window PDF export utility
│
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vercel.json
└── vite.config.js
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- API keys (for AI features — supports Anthropic Claude, Groq, or HuggingFace)

### Local Development

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/resume-builder.git
cd resume-builder

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local and add your API keys (see .env.example for all options)

# 4. Start the dev server
npm run dev
```

> **Note:** In development, the API key is used client-side (safe for local use only). In production, it stays server-side via the Vercel API proxy.

### Build for Production

```bash
npm run build
npm run preview   # Preview the production build locally
```

---

## ☁️ Deploying to Vercel

### Step 1 — Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/resume-builder.git
git push -u origin main
```

### Step 2 — Import on Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your GitHub repository
3. Vercel auto-detects Vite — no config changes needed

### Step 3 — Add Environment Variable

In the Vercel project settings → **Environment Variables**, add:

| Key                   | Value                |
|-----------------------|----------------------|
| `ANTHROPIC_API_KEY`   | `sk-ant-your-key`   |
| `VITE_GROQ_API_KEY`   | `gsk-your-key`      |
| `VITE_HF_TOKEN`       | `hf_your-token`     |

### Step 4 — Deploy

Click **Deploy**. Your app will be live in ~60 seconds at a `.vercel.app` URL.

Every `git push` to `main` triggers an automatic redeploy.

---

## 🧰 Tech Stack

| Layer         | Technology |
|---------------|------------|
| Framework     | React 18   |
| Styling       | Tailwind CSS 3 |
| State         | Zustand    |
| AI            | Groq (Llama 3.1) → HuggingFace Zephyr (auto-fallback chain) |
| PDF Export    | Print Window API |
| Icons         | Lucide React |
| Toasts        | react-hot-toast |
| Build Tool    | Vite 5     |
| Hosting       | Vercel     |

---

## 🔮 Future Features Roadmap

### High Priority
- [ ] **Drag-to-reorder** — Reorder experience bullets and section entries
- [ ] **More templates** — Minimalist, Academic, Creative, Timeline layouts
- [ ] **Custom color picker** — Let users customize template accent colors
- [ ] **Section reordering** — Move entire sections up/down on the resume
- [ ] **LinkedIn import** — Parse LinkedIn profile PDF to auto-fill sections

### AI Enhancements
- [ ] **Job description matching** — Paste a JD and get tailored bullet suggestions
- [ ] **Keyword gap analysis** — Compare resume vs. job description keywords
- [ ] **AI rewrite entire resume** — One-click full resume optimization
- [ ] **Interview prep questions** — Generate likely interview questions from your resume

### Export & Sharing
- [ ] **Multiple PDF formats** — Letter, A4, custom margins
- [ ] **DOCX export** — Word-compatible output
- [ ] **Public share link** — Generate a shareable URL for your resume
- [ ] **QR code** — Embed a QR code linking to digital resume

### User Experience
- [ ] **User accounts** — Optional Supabase auth for cloud sync
- [ ] **Dark/light preview toggle** — See resume in light and dark environments
- [ ] **Mobile editor** — Responsive editing on phone/tablet
- [ ] **Spell check** — Integrated typo detection in bullet points
- [ ] **Version history** — Undo/redo with full change history
- [ ] **Collaboration** — Share-to-edit with a friend or mentor

### Integrations
- [ ] **Google Drive sync** — Auto-backup to Google Drive
- [ ] **Notion import** — Import work history from a Notion database
- [ ] **GitHub import** — Auto-generate projects section from GitHub repos
- [ ] **Job board apply** — One-click apply to LinkedIn, Indeed, Lever

---

## 🤝 Contributing

Pull requests are welcome! For major changes, open an issue first to discuss what you'd like to change.

```bash
# Create a feature branch
git checkout -b feature/my-new-feature

# Make your changes, then submit a PR
```

---

## 📄 License

MIT — use it however you like.

---

## 💜 Acknowledgements

Built with [Claude](https://anthropic.com) · [React](https://react.dev) · [Tailwind CSS](https://tailwindcss.com) · [Zustand](https://zustand-demo.pmnd.rs) · [Vercel](https://vercel.com)
