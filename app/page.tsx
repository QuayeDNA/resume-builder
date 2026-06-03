'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Check, Sparkles, FileText, Layout, Shield, Zap, Menu, X, ChevronLeft, ChevronRight } from 'lucide-react'
import LaptopFrame from '@/components/Landing/LaptopFrame'
import PhoneFrame from '@/components/Landing/PhoneFrame'

const features = [
  {
    icon: FileText,
    title: 'AI-Powered Writing',
    description: 'Let AI craft compelling bullet points, summaries, and achievements. Trained on what recruiters actually look for.',
    accent: 'terracotta',
  },
  {
    icon: Layout,
    title: 'Beautiful Templates',
    description: 'Designer-made layouts that pass ATS filters. From crisp minimal to editorial bold — your story, your format.',
    accent: 'sage',
  },
  {
    icon: Shield,
    title: 'Your Data, Private',
    description: 'End-to-end encrypted. No tracking, no training on your resume. You own everything you create.',
    accent: 'terracotta',
  },
  {
    icon: Zap,
    title: 'Real-Time Export',
    description: 'PDF, DOCX, JSON — export in one click. Every template prints perfectly, every time.',
    accent: 'sage',
  },
]

export default function LandingPage() {
  const [navOpen, setNavOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [stats, setStats] = useState<{ resumesBuilt: number; totalUsers: number; coverLetters: number } | null>(null)
  const [statsLoading, setStatsLoading] = useState(true)
  const [testimonials, setTestimonials] = useState<{ id: string; quote: string; name: string; role: string; rating: number }[]>([])
  const [testimonialsLoading, setTestimonialsLoading] = useState(true)
  const [testimonialIndex, setTestimonialIndex] = useState(0)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const carouselTimer = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    fetch('/api/stats')
      .then((r) => r.json())
      .then(setStats)
      .catch(() => setStats({ resumesBuilt: 0, totalUsers: 0, coverLetters: 0 }))
      .finally(() => setStatsLoading(false))
  }, [])

  useEffect(() => {
    fetch('/api/testimonials')
      .then((r) => r.json())
      .then(setTestimonials)
      .catch(() => setTestimonials([]))
      .finally(() => setTestimonialsLoading(false))
  }, [])

  const startCarousel = useCallback(() => {
    if (carouselTimer.current) clearInterval(carouselTimer.current)
    carouselTimer.current = setInterval(() => {
      setTestimonialIndex((i) => (i + 1) % testimonials.length)
    }, 6000)
  }, [testimonials.length])

  const stopCarousel = useCallback(() => {
    if (carouselTimer.current) {
      clearInterval(carouselTimer.current)
      carouselTimer.current = null
    }
  }, [])

  useEffect(() => {
    if (testimonials.length > 1) startCarousel()
    return () => stopCarousel()
  }, [testimonials.length, startCarousel, stopCarousel])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed')
            observerRef.current?.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 },
    )

    document.querySelectorAll('.reveal-on-scroll').forEach((el) => {
      observerRef.current?.observe(el)
    })

    return () => observerRef.current?.disconnect()
  }, [])

  const formatCount = (n: number) => n >= 1000 ? `${Math.floor(n / 1000)}K+` : String(n)

  const displayStats = useMemo(() => {
    if (!stats) return []
    return [
      { value: formatCount(stats.resumesBuilt), label: 'Resumes built' },
      { value: formatCount(stats.totalUsers), label: 'Job seekers' },
      { value: formatCount(stats.coverLetters), label: 'Cover letters' },
    ]
  }, [stats])

  const { scrollYProgress } = useScroll()
  const laptopParallax = useTransform(scrollYProgress, [0, 0.25], [0, -40])
  const phoneParallax = useTransform(scrollYProgress, [0, 0.25], [0, -60])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0.6])
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.97])

  return (
    <div className="bg-paper font-body text-ink">
      <style>{`
        .grain-fixed::after {
          content: '';
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 9999;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-repeat: repeat;
          background-size: 200px 200px;
          opacity: 0.035;
          mix-blend-mode: overlay;
        }
        .reveal-on-scroll {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.7s cubic-bezier(0.19, 1, 0.22, 1), transform 0.7s cubic-bezier(0.19, 1, 0.22, 1);
        }
        .reveal-on-scroll.revealed {
          opacity: 1;
          transform: translateY(0);
        }
        .reveal-on-scroll:nth-child(2) { transition-delay: 0.1s; }
        .reveal-on-scroll:nth-child(3) { transition-delay: 0.2s; }
        .reveal-on-scroll:nth-child(4) { transition-delay: 0.3s; }
        .hero-char {
          display: inline-block;
          opacity: 0;
          transform: translateY(40px) rotate(2deg);
          animation: charReveal 0.6s cubic-bezier(0.19, 1, 0.22, 1) forwards;
        }
        @keyframes charReveal {
          to { opacity: 1; transform: translateY(0) rotate(0deg); }
        }
        .hero-char:nth-child(1) { animation-delay: 0.0s; }
        .hero-char:nth-child(2) { animation-delay: 0.03s; }
        .hero-char:nth-child(3) { animation-delay: 0.06s; }
        .hero-char:nth-child(4) { animation-delay: 0.09s; }
        .hero-char:nth-child(5) { animation-delay: 0.12s; }
        .hero-char:nth-child(6) { animation-delay: 0.15s; }
        .hero-char:nth-child(7) { animation-delay: 0.18s; }
        .hero-char:nth-child(8) { animation-delay: 0.21s; }
        .hero-char:nth-child(9) { animation-delay: 0.24s; }
        .hero-char:nth-child(10) { animation-delay: 0.27s; }
        .hero-char:nth-child(11) { animation-delay: 0.30s; }
        .hero-char:nth-child(12) { animation-delay: 0.33s; }
        .hero-char:nth-child(13) { animation-delay: 0.36s; }
        .hero-char:nth-child(14) { animation-delay: 0.39s; }
        .hero-char:nth-child(15) { animation-delay: 0.42s; }
        .hero-char:nth-child(16) { animation-delay: 0.45s; }
        .hero-char:nth-child(17) { animation-delay: 0.48s; }
        .hero-fade {
          opacity: 0;
          animation: fadeUp 0.8s cubic-bezier(0.19, 1, 0.22, 1) 0.6s forwards;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: none; }
        }
        .stat-card {
          transition: transform 0.3s cubic-bezier(0.19, 1, 0.22, 1), box-shadow 0.3s ease;
        }
        .stat-card:hover {
          transform: translateY(-2px);
        }
        .feature-cell {
          transition: transform 0.4s cubic-bezier(0.19, 1, 0.22, 1), box-shadow 0.4s ease;
        }
        .feature-cell:hover {
          transform: translateY(-4px);
        }
        .nav-blur {
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-char { opacity: 1; transform: none; animation: none; }
          .hero-fade { opacity: 1; animation: none; }
          .reveal-on-scroll { opacity: 1; transform: none; transition: none; }
        }
      `}</style>

      <div className="grain-fixed" />

      {/* ─── Navigation ─── */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-3 md:px-6 md:pt-4">
        <div className={`mx-auto max-w-7xl transition-all duration-300 ${scrolled ? 'bg-paper/90 nav-blur border border-warm-border rounded-[var(--radius-card)] shadow-soft' : 'bg-transparent'}`}>
          <div className="flex h-16 items-center justify-between px-6">
            <span className="font-display text-xl font-bold tracking-tight text-terracotta">ResumeForge</span>

            <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
              <a href="#features" className="text-caption font-medium text-ink-muted hover:text-ink transition-colors">Features</a>
              <a href="#testimonials" className="text-caption font-medium text-ink-muted hover:text-ink transition-colors">Testimonials</a>
              <Link href="/login" className="text-caption font-medium text-ink-muted hover:text-ink transition-colors">Sign in</Link>
              <Link
                href="/signup"
                className="inline-flex items-center gap-1.5 rounded-full bg-terracotta px-4 py-2 text-caption font-medium text-white transition-all hover:bg-terracotta/90 active:scale-[0.97]"
              >
                Get started <ArrowRight size={12} />
              </Link>
            </nav>

            <button
              onClick={() => setNavOpen(!navOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-warm-border bg-paper-deep/60 text-ink-muted md:hidden"
              aria-label={navOpen ? 'Close navigation' : 'Open navigation'}
            >
              {navOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>

          {navOpen && (
            <nav className="border-t border-warm-border bg-paper px-6 py-4 md:hidden" aria-label="Mobile navigation">
              <div className="flex flex-col gap-3">
                <a href="#features" onClick={() => setNavOpen(false)} className="py-1.5 text-body text-ink-muted hover:text-ink">Features</a>
                <a href="#testimonials" onClick={() => setNavOpen(false)} className="py-1.5 text-body text-ink-muted hover:text-ink">Testimonials</a>
                <Link href="/login" onClick={() => setNavOpen(false)} className="py-1.5 text-body text-ink-muted hover:text-ink">Sign in</Link>
                <Link
                  href="/signup"
                  onClick={() => setNavOpen(false)}
                  className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-full bg-terracotta px-4 py-2.5 text-body font-medium text-white"
                >
                  Get started <ArrowRight size={14} />
                </Link>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden px-6 pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-3 text-center md:text-left">
            <span className="inline-block rounded-full border border-sage/30 bg-sage-dim px-3 py-1 text-caption md:text-label font-medium tracking-wider text-sage uppercase hero-fade">
              Now in public beta
            </span>
          </div>

          <div className="space-y-12 md:grid md:grid-cols-12 md:gap-6 md:space-y-0 lg:gap-8 xl:gap-12">
            <div className="md:col-span-7 lg:col-span-6">
              <h1 className="font-display font-semibold text-ink text-4xl leading-[0.92] tracking-[-0.02em] md:text-5xl md:leading-[0.9] md:tracking-[-0.03em] lg:text-6xl lg:leading-[0.88] lg:tracking-[-0.04em] xl:text-7xl">
                {'Build a resume'.split('').map((c, i) => (
                  <span key={i} className="hero-char" aria-hidden="true">{c === ' ' ? '\u00A0' : c}</span>
                ))}
                <br />
                {'that opens doors'.split('').map((c, i) => (
                  <span key={i} className="hero-char" aria-hidden="true">{c === ' ' ? '\u00A0' : c}</span>
                ))}
              </h1>
              <p className="sr-only">Build a resume that opens doors</p>

              <p className="mt-6 max-w-lg text-base leading-relaxed text-ink-soft hero-fade md:text-lg lg:text-xl">
                Not another template farm. ResumeForge combines AI-assisted writing with
                designer-quality templates to create a resume that actually gets you noticed.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row hero-fade">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-terracotta px-6 py-2.5 text-body md:px-7 md:py-3 font-medium text-white transition-all hover:bg-terracotta/90 active:scale-[0.97]"
                >
                  Start building free <ArrowRight size={14} />
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-warm-border-strong bg-paper-deep/60 px-6 py-2.5 text-body md:px-7 md:py-3 font-medium text-ink transition-all hover:bg-paper-deep active:scale-[0.97]"
                >
                  <Sparkles size={14} className="text-sage" />
                  Try AI assistant
                </Link>
              </div>
            </div>

            <div className="md:col-span-5 lg:col-span-6">
              <motion.div
                style={{ y: laptopParallax, opacity: heroOpacity, scale: heroScale }}
              >
                <div className="relative">
                  {/* Ambient glow behind laptop */}
                  <div className="absolute -inset-8 rounded-[40px] bg-gradient-to-br from-terracotta/8 to-sage/8 blur-3xl" />
                  <div className="absolute -inset-4 rounded-[32px] bg-gradient-to-br from-terracotta/5 to-sage/5 blur-2xl" />

                  {/* Laptop — main showcase */}
                  <LaptopFrame />

                  {/* Phone — overlapping from bottom-right */}
                  <motion.div
                    className="absolute -bottom-4 -right-3 z-10 w-[45%] min-w-[140px] max-w-[220px]"
                    style={{ y: phoneParallax }}
                  >
                    <PhoneFrame />
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* ─── Stats ─── */}
          <div className="mt-16 grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-warm-border bg-warm-border hero-fade">
            {statsLoading ? (
              <>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-paper px-5 py-5 text-center md:px-6 md:py-6">
                    <div className="mx-auto mb-2 h-8 w-20 animate-pulse rounded bg-warm-border-strong/50 md:h-9" />
                    <div className="mx-auto h-4 w-16 animate-pulse rounded bg-warm-border-strong/30" />
                  </div>
                ))}
              </>
            ) : (
              displayStats.map((stat) => (
                <div key={stat.label} className="stat-card bg-paper px-5 py-5 text-center md:px-6 md:py-6">
                  <div className="font-display text-2xl font-semibold text-terracotta md:text-3xl">{stat.value}</div>
                  <div className="mt-0.5 text-caption text-ink-muted">{stat.label}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ─── Features ─── */}
      <section id="features" className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center reveal-on-scroll">
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold tracking-[-0.03em] text-ink">
              Everything you need to land the role
            </h2>
            <p className="mx-auto mt-3 max-w-md text-body md:text-base lg:text-lg text-ink-soft">
              From AI-powered suggestions to pixel-perfect PDFs — every tool a modern job seeker needs.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-6 md:grid-rows-2">
            {features.map((feature, i) => {
              const isLarge = i === 0
              return (
                <div
                  key={feature.title}
                  className={`feature-cell reveal-on-scroll group relative overflow-hidden rounded-2xl border border-warm-border-strong bg-paper p-6 shadow-soft md:p-8 ${
                    isLarge ? 'md:col-span-3 md:row-span-1' : 'md:col-span-3 md:row-span-1'
                  }`}
                >
                  <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${
                    feature.accent === 'terracotta' ? 'bg-terracotta-dim text-terracotta' : 'bg-sage-dim text-sage'
                  }`}>
                    <feature.icon size={18} />
                  </div>
                  <h3 className="font-display text-lg md:text-xl font-semibold tracking-tight text-ink">{feature.title}</h3>
                  <p className="mt-2 text-body md:text-base leading-relaxed text-ink-soft">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─── Testimonials ─── */}
      {!testimonialsLoading && testimonials.length === 0 ? null : (
        <section id="testimonials" className="px-6 py-20 md:py-28 bg-paper-warm/60">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 text-center reveal-on-scroll">
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold tracking-[-0.03em] text-ink">
                Trusted by job seekers
              </h2>
              <p className="mx-auto mt-3 max-w-md text-body md:text-base lg:text-lg text-ink-soft">
                Real stories from people who built their resumes and got results.
              </p>
            </div>

            {testimonialsLoading ? (
              <div className="flex justify-center gap-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="reveal-on-scroll w-full max-w-sm rounded-2xl border border-warm-border-strong bg-paper p-6 shadow-soft"
                  >
                    <div className="mb-4 flex gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <div key={s} className="h-3.5 w-3.5 animate-pulse rounded bg-warm-border-strong/40" />
                      ))}
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 w-full animate-pulse rounded bg-warm-border-strong/30" />
                      <div className="h-3 w-5/6 animate-pulse rounded bg-warm-border-strong/30" />
                      <div className="h-3 w-4/6 animate-pulse rounded bg-warm-border-strong/30" />
                    </div>
                    <div className="mt-4 border-t border-warm-border pt-3">
                      <div className="h-3 w-24 animate-pulse rounded bg-warm-border-strong/40" />
                      <div className="mt-1 h-2.5 w-20 animate-pulse rounded bg-warm-border-strong/20" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                className="relative mx-auto max-w-lg"
                onMouseEnter={stopCarousel}
                onMouseLeave={startCarousel}
              >
                {/* Carousel track */}
                <div className="overflow-hidden rounded-2xl">
                  <div
                    className="flex transition-transform duration-500 ease-out-expo"
                    style={{ transform: `translateX(-${testimonialIndex * 100}%)` }}
                  >
                    {testimonials.map((t) => (
                      <div key={t.id} className="min-w-0 w-full shrink-0">
                        <div className="rounded-2xl border border-warm-border-strong bg-paper p-6 shadow-soft mx-1">
                          <div className="mb-4 flex gap-1">
                            {Array.from({ length: 5 }, (_, s) => (
                              <svg
                                key={s}
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill={s < t.rating ? '#c76b4a' : '#e5dbd0'}
                                aria-hidden="true"
                              >
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                              </svg>
                            ))}
                          </div>
                          <blockquote className="text-body leading-relaxed text-ink">&ldquo;{t.quote}&rdquo;</blockquote>
                          <div className="mt-4 border-t border-warm-border pt-3">
                            <div className="text-label font-medium text-ink">{t.name}</div>
                            <div className="text-caption text-ink-muted">{t.role}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Prev / Next arrows */}
                {testimonials.length > 1 && (
                  <>
                    <button
                      onClick={() => setTestimonialIndex((i) => (i === 0 ? testimonials.length - 1 : i - 1))}
                      className="absolute -left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full border border-warm-border bg-paper shadow-soft text-ink-muted hover:text-ink hover:bg-paper-deep transition-all md:-left-4"
                      aria-label="Previous testimonial"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      onClick={() => setTestimonialIndex((i) => (i + 1) % testimonials.length)}
                      className="absolute -right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full border border-warm-border bg-paper shadow-soft text-ink-muted hover:text-ink hover:bg-paper-deep transition-all md:-right-4"
                      aria-label="Next testimonial"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </>
                )}

                {/* Dots */}
                {testimonials.length > 1 && (
                  <div className="mt-6 flex items-center justify-center gap-2">
                    {testimonials.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setTestimonialIndex(i)}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          i === testimonialIndex ? 'w-6 bg-terracotta' : 'w-2 bg-warm-border-strong hover:bg-ink-muted'
                        }`}
                        aria-label={`Go to testimonial ${i + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ─── CTA ─── */}
      <section className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-3xl text-center reveal-on-scroll">
          <div className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-terracotta-dim border border-terracotta/30">
              <FileText size={28} className="text-terracotta" />
            </div>
          </div>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold tracking-[-0.03em] text-ink">
            Your next opportunity starts here
          </h2>
          <p className="mx-auto mt-3 max-w-sm text-body md:text-base lg:text-lg text-ink-soft">
            Join thousands of professionals who&apos;ve built resumes that open doors.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-full bg-terracotta px-7 py-3 text-body md:px-8 md:py-3.5 font-medium text-white transition-all hover:bg-terracotta/90 active:scale-[0.97]"
            >
              Create your resume <ArrowRight size={14} />
            </Link>
            <div className="flex items-center gap-2 text-caption text-ink-muted">
              <Check size={12} className="text-sage" />
              No credit card required
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-warm-border px-6 py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 md:flex-row">
          <span className="font-display text-base font-bold tracking-tight text-terracotta">ResumeForge</span>
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-caption text-ink-muted hover:text-ink transition-colors">Sign in</Link>
            <Link href="/signup" className="text-caption text-ink-muted hover:text-ink transition-colors">Sign up</Link>
          </div>
          <p className="text-caption text-ink-muted">&copy; {new Date().getFullYear()} ResumeForge. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
