import { useEffect, useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FiShield, FiFileText, FiMapPin, FiAward, FiCheck, 
  FiPhone, FiMail, FiMessageSquare, FiArrowRight, 
  FiStar, FiCalendar, FiAlertCircle, FiMenu, FiX, 
  FiUser, FiUploadCloud, FiClock, FiCheckCircle
} from 'react-icons/fi'
import RoofingMap from './RoofingMap'
import './roofing.css'

const IMG = {
  hero: '/images/roofing/hero.jpg',
  craftsmanship: '/images/roofing/service-replacement.jpg',
  before: '/images/roofing/before.jpg',
  after: '/images/roofing/after.jpg',
  storm: '/images/roofing/storm.jpg',
  work1: '/images/roofing/work-1.jpg',
  work2: '/images/roofing/work-2.jpg',
  work3: '/images/roofing/work-3.jpg',
  work4: '/images/roofing/work-4.jpg',
  serviceReplacement: '/images/roofing/service-replacement.jpg',
  serviceRepair: '/images/roofing/service-repair.jpg',
  serviceStorm: '/images/roofing/service-storm.jpg',
  serviceInspection: '/images/roofing/service-inspection.jpg',
  serviceGutters: '/images/roofing/service-gutters.jpg',
}

const SERVICES = [
  { 
    title: 'Roof Replacement', 
    text: 'Complete, high-performance residential roofing systems designed for maximum wind resistance, thermal control, and classic curb appeal. Engineered for Central Ohio conditions.', 
    image: IMG.serviceReplacement,
    isFeatured: true,
    benefits: ['Architectural Shingle Systems', 'Complete Attic Ventilation', 'Lifetime Manufacturer Warranty', 'Flashing & Valley Leak Shields', 'Daily Property Clean Up']
  },
  { 
    title: 'Roof Repair', 
    text: 'Leak troubleshooting, wind and hail damage restoration, minor shingle fixes, and gutter flashing replacements.', 
    image: IMG.serviceRepair,
    isFeatured: false 
  },
  { 
    title: 'Storm Damage Assessment', 
    text: 'Comprehensive structural analysis after severe weather, detailing shingle lift, hail impact, and documentation support.', 
    image: IMG.serviceStorm,
    isFeatured: false 
  },
  { 
    title: 'Roof Inspections', 
    text: 'Professional, multi-point visual structural checkups to prevent small issues from expanding into costly roofing repairs.', 
    image: IMG.serviceInspection,
    isFeatured: false 
  },
  { 
    title: 'Gutters & Protection', 
    text: 'High-capacity seamless aluminum gutters, downspouts, and leaf guard screens that divert heavy rainwater away safely.', 
    image: IMG.serviceGutters,
    isFeatured: false 
  },
]

const FEATURED_PROJECTS = [
  { 
    title: 'Westfield Residence', 
    meta: 'Architectural Shingles • Roof Replacement', 
    location: 'Dublin, OH',
    image: IMG.work1,
    isLarge: true 
  },
  { 
    title: 'Northbrook Residence', 
    meta: 'Premium Shingle Upgrade • Storm Restoration', 
    location: 'Columbus, OH',
    image: IMG.work2,
    isLarge: false 
  },
  { 
    title: 'New Albany Residence', 
    meta: 'Full Roof Replacement & Gutter Setup', 
    location: 'New Albany, OH',
    image: IMG.work4,
    isLarge: false 
  },
]

const REVIEWS = [
  { 
    quote: 'From the inspection to the final cleanup, the entire process was professional. The crew was fast, respectful, and the finished roof looks absolutely fantastic. Communication was top-notch.', 
    author: 'Michael R.', 
    location: 'Columbus, OH' 
  },
  { 
    quote: 'Ridgeline made the entire storm-damage documentation simple, giving us clear summaries and inspection photos. They worked carefully and left the yard spotless.', 
    author: 'Sarah T.', 
    location: 'Dublin, OH' 
  },
  { 
    quote: 'The biggest difference was their daily communication. They answered every question quickly and were very honest about repairs versus replacements. Highly recommend.', 
    author: 'James W.', 
    location: 'Westerville, OH' 
  },
]

const FAQ_ITEMS = [
  { q: 'How do I know if I need a new roof?', a: 'Common indicators include missing or curling shingles, granule loss in gutters, indoor ceiling water stains, sagging spots, and an age of 20+ years. An inspection will confirm if you need a repair or replacement.' },
  { q: 'How long does a roof replacement take?', a: 'Most standard residential roof replacements are completed in 1 to 2 days, depending on size, pitch, and weather. We perform daily cleanups to keep your yard safe.' },
  { q: 'What roofing materials do you install?', a: 'We install premium architectural asphalt shingles and metal systems chosen for their lifespan, impact ratings, and beauty in Central Ohio weather.' },
  { q: 'Do you offer inspections?', a: 'Yes. We offer detailed, transparent inspections for homeowners who want to clarify their roof condition or storm-related damage.' },
  { q: 'Do you handle storm damage?', a: 'Yes. We evaluate wind and hail damage, provide a full visual inspection report with photos, and help coordinate repair timelines.' },
  { q: 'Can you help with insurance documentation?', a: 'We provide itemized estimates, structural condition reports, and high-resolution photo documentation. The final claim decisions rest with your insurer.' },
  { q: 'Do you offer financing?', a: 'Financing options are available for qualified roofing projects. Ask about current programs during your estimate consultation.' },
  { q: 'How long does a typical roof last?', a: 'Modern architectural roofing systems can last 25 to 30 years or more with high-quality installation and proper attic ventilation.' }
]

const SERVICE_AREAS = ['Columbus', 'Dublin', 'Westerville', 'Gahanna', 'Worthington', 'Hilliard', 'Grove City', 'New Albany']

const HELP_OPTIONS = [
  'Roof replacement',
  'Roof repair',
  'Storm damage inspection',
  'General roof inspection',
  'Gutters / exterior protection',
  'Not sure yet',
]

const CONTACT_METHODS = ['Phone call', 'Email', 'Text message']

function pushPath(path) {
  if (window.location.pathname !== path) {
    history.pushState(null, '', path)
    window.dispatchEvent(new Event('popstate'))
  }
}

function scrollTo(id) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function useScrolled(threshold = 24) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])
  return scrolled
}

function RoofingNav({ onEstimate }) {
  const scrolled = useScrolled()
  const [open, setOpen] = useState(false)

  const link = (id, label) => (
    <a
      href={`#${id}`}
      onClick={(e) => {
        e.preventDefault()
        setOpen(false)
        scrollTo(id)
      }}
    >
      {label}
    </a>
  )

  return (
    <header className={`r-nav${scrolled ? ' is-scrolled' : ''}`} id="top">
      <div className="r-container r-nav-inner">
        <a className="r-brand" href="#top" onClick={(e) => { e.preventDefault(); scrollTo('top') }}>
          <strong>RIDGELINE</strong>
          <span>Roofing Co.</span>
        </a>
        <nav className="r-nav-links" aria-label="Primary">
          {link('services', 'Services')}
          {link('our-work', 'Projects')}
          {link('why', 'Why Us')}
          {link('timeline', 'Process')}
          {link('reviews', 'Reviews')}
          {link('contact', 'Contact')}
        </nav>
        <div className="r-nav-actions">
          <a className="r-nav-phone" href="tel:5554820198">(555) 482-0198</a>
          <button type="button" className="r-btn r-btn-primary" onClick={onEstimate}>Get Free Estimate</button>
        </div>
        <button
          type="button"
          className="r-nav-toggle"
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div 
            className="r-nav-mobile"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            {link('services', 'Services')}
            {link('our-work', 'Projects')}
            {link('why', 'Why Us')}
            {link('timeline', 'Process')}
            {link('reviews', 'Reviews')}
            {link('contact', 'Contact')}
            <a href="tel:5554820198" style={{ fontWeight: '700', color: 'var(--r-copper)' }}>(555) 482-0198</a>
            <button type="button" className="r-btn r-btn-primary" onClick={() => { setOpen(false); onEstimate() }}>
              Get Free Estimate
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

function Hero({ onEstimate }) {
  return (
    <section className="r-hero" aria-labelledby="hero-heading">
      <div className="r-container">
        <div className="r-hero-split">
          <div className="r-hero-content">
            <p className="r-label">
              <span className="r-hero-dot">•</span> Roofing • Repair • Replacement
            </p>
            <h1 id="hero-heading">Built to Protect What Matters Most.</h1>
            <p className="r-lead">
              Premium roof replacement, repairs, and storm damage restoration. Serving Central Ohio homeowners with certified craftsmanship and clean, professional communication.
            </p>
            <div className="r-hero-actions">
              <button type="button" className="r-btn r-btn-primary r-btn-arrow" onClick={onEstimate}>
                Get a Free Estimate <FiArrowRight aria-hidden="true" />
              </button>
              <a
                href="#services"
                className="r-text-link-light"
                onClick={(e) => { e.preventDefault(); scrollTo('services') }}
              >
                Explore Services <FiArrowRight aria-hidden="true" />
              </a>
            </div>
            <div className="r-hero-trust">
              <span>Licensed &amp; Insured</span>
              <span className="r-hero-dot">•</span>
              <span>10-Yr Installation Warranty</span>
              <span className="r-hero-dot">•</span>
              <span>Central Ohio Locals</span>
              <br />
              <span className="r-hero-note">Fictional business concept project by Craftivo</span>
            </div>
          </div>
          <div className="r-hero-image-pane">
            <div className="r-hero-frame">
              <img src={IMG.hero} alt="A modern American home showcasing premium shingle roof installation" loading="eager" />
              <div className="r-hero-overlay" aria-hidden="true" />
              <div className="r-hero-badge">
                <strong>Serving Central Ohio</strong>
                <span>Columbus &amp; Surrounding Cities • Rated 5.0 ★</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function TrustStrip() {
  return (
    <section className="r-trust-strip" aria-label="Quick Trust Summary">
      <div className="r-container">
        <div className="r-trust-strip-inner">
          <div className="r-trust-strip-item">
            <FiShield /> Licensed &amp; Insured
          </div>
          <div className="r-trust-strip-item">
            <FiFileText /> Free Visual Estimates
          </div>
          <div className="r-trust-strip-item">
            <FiMapPin /> Central Ohio Experts
          </div>
          <div className="r-trust-strip-item">
            <FiAward /> Quality Guarantee
          </div>
        </div>
      </div>
    </section>
  )
}

function TrustSection() {
  const stats = [
    { value: '15+', label: 'Years Experience' },
    { value: '1,200+', label: 'Roofs Completed' },
    { value: '5.0 ★', label: 'Client Rating' },
    { value: '10-Year', label: 'Installation Warranty' },
  ]

  return (
    <section className="r-trust" aria-label="Credentials and Stats">
      <div className="r-container">
        <div className="r-trust-inner">
          <div>
            <p className="r-label" style={{ color: 'var(--r-copper)' }}>Proven Local Record</p>
            <h2>Trusted Roofing for Central Ohio Families</h2>
            <p className="r-concept-note" style={{ color: 'rgba(255,255,255,0.4)' }}>Fictional performance metrics for demo portfolio</p>
          </div>
          <div className="r-stats">
            {stats.map((s) => (
              <div key={s.label} className="r-stat">
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function ServicesSection() {
  return (
    <section id="services" className="r-services">
      <div className="r-container">
        <div className="r-services-header">
          <p className="r-label">What We Do</p>
          <h2>Professional Solutions for Every Shingle</h2>
        </div>
        <div className="r-service-grid">
          {SERVICES.map((s) => {
            if (s.isFeatured) {
              return (
                <article key={s.title} className="r-service-featured">
                  <div className="r-service-featured-content">
                    <p className="r-label">Our Primary Specialty</p>
                    <h3>{s.title}</h3>
                    <p>{s.text}</p>
                    <ul className="r-service-benefits">
                      {s.benefits.map((b) => (
                        <li key={b}><FiCheck /> {b}</li>
                      ))}
                    </ul>
                    <div>
                      <a href="#contact" className="r-text-link" onClick={(e) => { e.preventDefault(); scrollTo('contact') }}>
                        Request Free Shingle Estimate <FiArrowRight />
                      </a>
                    </div>
                  </div>
                  <div className="r-service-thumb">
                    <img src={s.image} alt="High quality roof replacement installation work" loading="lazy" />
                  </div>
                </article>
              )
            } else {
              return (
                <article key={s.title} className="r-service-standard">
                  <div>
                    <h3>{s.title}</h3>
                    <p>{s.text}</p>
                  </div>
                  <div className="r-service-standard-bottom">
                    <a href="#contact" className="r-text-link" onClick={(e) => { e.preventDefault(); scrollTo('contact') }}>
                      Learn More <FiArrowRight />
                    </a>
                    <div className="r-service-icon-box">
                      <FiShield />
                    </div>
                  </div>
                </article>
              )
            }
          })}
        </div>
      </div>
    </section>
  )
}

function WhySection() {
  const principles = [
    { num: '01', title: 'Honest Recommendations', text: 'We only recommend replacements when repairs won’t solve the problem, saving you unnecessary expenses.' },
    { num: '02', title: 'Quality Materials', text: 'We source architectural shingles with high wind-resistance ratings that look gorgeous for decades.' },
    { num: '03', title: 'Clean Professional Work', text: 'Our crews treat your lawn like their own, cleaning nails, shingles, and debris daily.' },
    { num: '04', title: 'Clear Communication', text: 'You’ll receive photo updates and plain-English progress summaries at every step.' },
  ]

  return (
    <section id="why" className="r-why">
      <div className="r-container">
        <div className="r-why-grid">
          <div className="r-why-editorial">
            <p className="r-label">The Ridgeline Standard</p>
            <h2>We Treat Your Home Like It’s Our Own.</h2>
            <p>
              A new roof is a significant investment. That’s why we aim to make the process as straightforward, clean, and worry-free as possible.
            </p>
            <div className="r-why-editorial-badge">
              <p>Certified Installation • Premium Architectural Shingles • Clear Contracts</p>
            </div>
          </div>
          <div className="r-why-list">
            {principles.map((p) => (
              <div key={p.num} className="r-why-item">
                <span className="r-why-num">{p.num}</span>
                <div className="r-why-item-content">
                  <h3>{p.title}</h3>
                  <p>{p.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function AboutSection() {
  return (
    <section id="about" className="r-about">
      <div className="r-container">
        <div className="r-about-inner">
          <p className="r-label">About Ridgeline</p>
          <h2>Residential Roofing Built for Central Ohio</h2>
          <p>
            Ridgeline Roofing Co. is a premium local contractor concept created for Craftivo portfolio demonstration. It represents the structural styling, conversion-optimized copy, and visual quality standard built for modern contractors across the United States.
          </p>
          <p className="r-concept-note">Demo Concept • Built by Craftivo</p>
        </div>
      </div>
    </section>
  )
}

function ProcessSection() {
  const steps = [
    { num: '01', title: 'Schedule Estimate', text: 'Request an inspection online or call us directly to book a consultation.' },
    { num: '02', title: 'Roof Inspection', text: 'We check attic ventilation, flashing, shingles, and valley integrity.' },
    { num: '03', title: 'Recommendation', text: 'You get a plain-English explanation of conditions and a transparent estimate.' },
    { num: '04', title: 'Installation', text: 'Our crews complete the work efficiently with continuous safety supervision.' },
    { num: '05', title: 'Final Walkthrough', text: 'We inspect the roof system, clean up nails/debris, and confirm satisfaction.' },
  ]

  return (
    <section id="timeline" className="r-process" aria-labelledby="process-heading">
      <div className="r-container">
        <p className="r-label" style={{ color: 'var(--r-copper)', textAlign: 'center', display: 'block' }}>Our Process</p>
        <h2 id="process-heading">From First Call to Final Cleanup</h2>
        <div className="r-process-grid">
          {steps.map((s) => (
            <div key={s.num} className="r-process-step">
              <span className="r-process-num">{s.num}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FeaturedWorkSection() {
  return (
    <section id="our-work" className="r-work">
      <div className="r-container">
        <div className="r-work-header">
          <div className="r-work-header-text">
            <p className="r-label">Recent Projects</p>
            <h2>Proven Durability. Modern Curb Appeal.</h2>
          </div>
          <p className="r-concept-note">Fictional contractor portfolio projects for representation</p>
        </div>
        <div className="r-work-grid">
          {FEATURED_PROJECTS.map((p) => (
            <article key={p.title} className={`r-work-card ${p.isLarge ? 'r-work-card-large' : 'r-work-card-small'}`}>
              <div className="r-work-card-media">
                <img src={p.image} alt={`Completed roof installation for ${p.title} in ${p.location}`} loading="lazy" />
              </div>
              <div className="r-work-card-info">
                <span className="r-work-card-tag">{p.meta}</span>
                <h3>{p.title}</h3>
                <p>{p.location}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function BeforeAfterSection() {
  const wrapRef = useRef(null)
  const [position, setPosition] = useState(50)
  const dragging = useRef(false)

  const updatePosition = useCallback((clientX) => {
    const rect = wrapRef.current?.getBoundingClientRect()
    if (!rect) return
    const pct = ((clientX - rect.left) / rect.width) * 100
    setPosition(Math.min(98, Math.max(2, pct)))
  }, [])

  useEffect(() => {
    const onMove = (e) => {
      if (!dragging.current) return
      updatePosition(e.clientX)
    }
    const onTouchMove = (e) => {
      if (!dragging.current) return
      updatePosition(e.touches[0].clientX)
    }
    const onUp = () => { dragging.current = false }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('touchend', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onUp)
    }
  }, [updatePosition])

  return (
    <section className="r-compare" aria-labelledby="compare-heading">
      <div className="r-container">
        <div className="r-compare-header">
          <p className="r-label">Visual Comparison</p>
          <h2 id="compare-heading">See the Quality Difference</h2>
        </div>
        <div
          className="r-compare-wrap"
          ref={wrapRef}
          onMouseDown={(e) => { dragging.current = true; updatePosition(e.clientX) }}
          onTouchStart={(e) => { dragging.current = true; updatePosition(e.touches[0].clientX) }}
          role="img"
          aria-label="Interactive before/after slider showing worn shingles vs new architectural shingles"
        >
          <span className="r-compare-label r-compare-label-before">Before (Worn Shingles)</span>
          <span className="r-compare-label r-compare-label-after">After (New Architectural Shingles)</span>
          <div className="r-compare-before">
            <img src={IMG.before} alt="Old roof with curling shingles and leakage risks" loading="lazy" />
          </div>
          <div className="r-compare-after" style={{ clipPath: `inset(0 0 0 ${position}%)` }}>
            <img src={IMG.after} alt="Modern architectural roof installation by Ridgeline" loading="lazy" />
          </div>
          <div className="r-compare-handle" style={{ left: `${position}%` }} aria-hidden="true" />
        </div>
        <div className="r-compare-meta">
          <span><strong>Specialty:</strong> Roof Replacement</span>
          <span><strong>Material:</strong> Premium Architectural Shingles</span>
          <span><strong>Location:</strong> Columbus, OH</span>
          <span className="r-concept-note">Concept comparison mockup</span>
        </div>
      </div>
    </section>
  )
}

function ReviewsSection() {
  const activeReview = REVIEWS[0]

  return (
    <section id="reviews" className="r-reviews">
      <div className="r-container">
        <div className="r-reviews-header">
          <p className="r-label">Social Proof</p>
          <h2>What Central Ohio Homeowners Say</h2>
        </div>
        <div className="r-review-hero">
          <div className="r-review-stars" aria-label="5 Star Review">
            <FiStar /><FiStar /><FiStar /><FiStar /><FiStar />
          </div>
          <blockquote>
            <p>“{activeReview.quote}”</p>
          </blockquote>
          <div className="r-review-author">
            <strong>{activeReview.author}</strong>
            <span>{activeReview.location}</span>
          </div>
        </div>
        <div className="r-review-bullets">
          <div className="r-review-bullet-item">
            <strong>5.0 out of 5.0 Rating</strong>
            Based on recent local feedback
          </div>
          <div className="r-review-bullet-item">
            <strong>Prompt Response</strong>
            Inspections within 24-48 hours
          </div>
          <div className="r-review-bullet-item">
            <strong>Certified Crews</strong>
            Professionals on every property
          </div>
        </div>
      </div>
    </section>
  )
}

function StormSection({ onEstimate }) {
  const items = [
    { title: 'Wind Shingle Damage', desc: 'Missing or creased shingles after high winds.' },
    { title: 'Hail Shingle Impacts', desc: 'Granule loss causing future leakage threats.' },
    { title: 'Emergency Tarp Work', desc: 'Temporary protection preventing immediate structural damage.' },
    { title: 'Inspection Documentation', desc: 'Detailed lists, photo arrays, and visual estimates.' }
  ]

  return (
    <section className="r-storm" aria-labelledby="storm-heading">
      <div className="r-storm-bg">
        <img src={IMG.storm} alt="Dark storm clouds passing over a residential area" loading="lazy" aria-hidden="true" />
        <div className="r-storm-overlay" aria-hidden="true" />
      </div>
      <div className="r-container">
        <div className="r-storm-grid">
          <div>
            <p className="r-label" style={{ color: 'var(--r-copper)' }}>Active Weather Support</p>
            <h2 id="storm-heading">Storm Damage? We’ll Help You Take the Next Step</h2>
            <p className="r-lead">
              Severe storms can cause invisible damage that leads to major water leaks months down the line. Our certified inspectors help verify roof safety.
            </p>
          </div>
          <div className="r-storm-right">
            <ul className="r-storm-list">
              {items.map((item) => (
                <li key={item.title}>
                  <FiAlertCircle />
                  <div>
                    <strong>{item.title}</strong>
                    <span style={{ display: 'block', fontSize: '0.82rem', opacity: 0.8, fontWeight: 500 }}>{item.desc}</span>
                  </div>
                </li>
              ))}
            </ul>
            <div className="r-storm-actions">
              <div className="r-storm-actions-row">
                <button type="button" className="r-btn r-btn-primary" onClick={onEstimate}>
                  Book Damage Inspection
                </button>
                <a href="tel:5554820198" className="r-btn r-btn-outline" style={{ display: 'inline-flex', gap: '0.5rem' }}>
                  <FiPhone /> Call Now
                </a>
              </div>
              <p className="r-concept-note" style={{ color: 'rgba(255,255,255,0.4)', margin: '0' }}>
                Inspectors supply visual diagnostics — coverage decisions rest with insurance adjusters.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ServiceAreaSection() {
  return (
    <section className="r-area" aria-labelledby="area-heading">
      <div className="r-container">
        <div className="r-area-grid">
          <div>
            <p className="r-label">Where We Work</p>
            <h2 id="area-heading">Serving Homeowners Across Central Ohio</h2>
            <p className="r-body-narrow">
              Based in <strong>Columbus, Ohio</strong>, Ridgeline Roofing Co. serves families throughout Central Ohio with quality materials and experienced installers.
            </p>
            <div className="r-area-list">
              {SERVICE_AREAS.map((area) => (
                <div key={area} className="r-area-tag">
                  <FiMapPin /> {area}, OH
                </div>
              ))}
            </div>
            <p className="r-concept-note">Fictional local service area details</p>
          </div>
          <RoofingMap />
        </div>
      </div>
    </section>
  )
}

function EstimateSection() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    help: '',
    contactMethod: '',
    message: '',
    photo: null,
  })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState(false)

  const update = useCallback((key, value) => {
    setForm((f) => ({ ...f, [key]: value }))
    setErrors((e) => ({ ...e, [key]: '' }))
    setSubmitError(false)
  }, [])

  function validate() {
    const next = {}
    if (!form.name.trim()) next.name = 'Please enter your full name.'
    if (!form.phone.trim()) next.phone = 'Please enter your phone number.'
    if (!form.email.trim()) next.email = 'Please enter your email.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Please enter a valid email address.'
    if (!form.address.trim()) next.address = 'Please enter your property address.'
    if (!form.help) next.help = 'Please select what you need help with.'
    if (!form.contactMethod) next.contactMethod = 'Please select a contact method.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) {
      setSubmitError(true)
      return
    }
    setSubmitted(true)
    setSubmitError(false)
  }

  function reset() {
    setSubmitted(false)
    setForm({ name: '', phone: '', email: '', address: '', help: '', contactMethod: '', message: '', photo: null })
    setErrors({})
  }

  return (
    <section id="contact" className="r-estimate">
      <div className="r-container">
        <div className="r-estimate-grid">
          <div className="r-estimate-info">
            <p className="r-label">Free Assessment</p>
            <h2>Ready to Talk About Your Roof?</h2>
            <p className="r-body-narrow">
              Fill out the form and a specialist will review your details to outline a transparent visual inspection and project recommendation.
            </p>
            <div className="r-estimate-phone-block">
              <div className="r-estimate-phone-icon">
                <FiPhone />
              </div>
              <div className="r-estimate-phone-details">
                <span>Prefer direct calls?</span>
                <a href="tel:5554820198">(555) 482-0198</a>
              </div>
            </div>
            <p className="r-concept-note">Demo estimate request dashboard. Data is processed locally inside browser environment.</p>
          </div>

          <div className="r-form-panel">
            <div className="r-form-panel-header">
              <h3>Request Estimate</h3>
              <p>No obligation. We reply quickly during business hours.</p>
            </div>
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  className="r-form-success"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="r-success-icon" aria-hidden="true">
                    <FiCheckCircle />
                  </div>
                  <h3>Request Received Successfully</h3>
                  <p className="r-body-small" style={{ marginBottom: '1.5rem' }}>
                    This is a demo client request representation. No structural or contact data was sent.
                  </p>
                  <button type="button" className="r-btn r-btn-primary" onClick={reset}>
                    Submit Another Request
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  noValidate
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {submitError && Object.keys(errors).length > 0 && (
                    <div className="r-form-error-banner" role="alert">
                      Please correct the validation errors in the fields below.
                    </div>
                  )}
                  
                  <div className="r-field">
                    <label htmlFor="r-name">Full Name</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        id="r-name"
                        value={form.name}
                        onChange={(e) => update('name', e.target.value)}
                        className={errors.name ? 'is-error' : ''}
                        placeholder="John Doe"
                        autoComplete="name"
                      />
                    </div>
                    {errors.name && <p className="r-field-error">{errors.name}</p>}
                  </div>

                  <div className="r-field-row">
                    <div className="r-field">
                      <label htmlFor="r-phone">Phone Number</label>
                      <input
                        id="r-phone"
                        type="tel"
                        value={form.phone}
                        onChange={(e) => update('phone', e.target.value)}
                        className={errors.phone ? 'is-error' : ''}
                        placeholder="(555) 000-0000"
                        autoComplete="tel"
                      />
                      {errors.phone && <p className="r-field-error">{errors.phone}</p>}
                    </div>
                    <div className="r-field">
                      <label htmlFor="r-email">Email Address</label>
                      <input
                        id="r-email"
                        type="email"
                        value={form.email}
                        onChange={(e) => update('email', e.target.value)}
                        className={errors.email ? 'is-error' : ''}
                        placeholder="email@example.com"
                        autoComplete="email"
                      />
                      {errors.email && <p className="r-field-error">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="r-field">
                    <label htmlFor="r-address">Property Address</label>
                    <input
                      id="r-address"
                      value={form.address}
                      onChange={(e) => update('address', e.target.value)}
                      className={errors.address ? 'is-error' : ''}
                      placeholder="123 Main St, Columbus, OH"
                      autoComplete="street-address"
                    />
                    {errors.address && <p className="r-field-error">{errors.address}</p>}
                  </div>

                  <div className="r-field-row">
                    <div className="r-field">
                      <label htmlFor="r-help">Service Needed</label>
                      <select
                        id="r-help"
                        value={form.help}
                        onChange={(e) => update('help', e.target.value)}
                        className={errors.help ? 'is-error' : ''}
                      >
                        <option value="">Select option</option>
                        {HELP_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                      </select>
                      {errors.help && <p className="r-field-error">{errors.help}</p>}
                    </div>
                    <div className="r-field">
                      <label htmlFor="r-contact">Contact Preference</label>
                      <select
                        id="r-contact"
                        value={form.contactMethod}
                        onChange={(e) => update('contactMethod', e.target.value)}
                        className={errors.contactMethod ? 'is-error' : ''}
                      >
                        <option value="">Select method</option>
                        {CONTACT_METHODS.map((o) => <option key={o} value={o}>{o}</option>)}
                      </select>
                      {errors.contactMethod && <p className="r-field-error">{errors.contactMethod}</p>}
                    </div>
                  </div>

                  <div className="r-field">
                    <label htmlFor="r-message">Project Details (Optional)</label>
                    <textarea
                      id="r-message"
                      rows={3}
                      value={form.message}
                      onChange={(e) => update('message', e.target.value)}
                      placeholder="Tell us about the roof age, leaking concerns, or key timeline goals..."
                    />
                  </div>

                  <div className="r-field">
                    <label>Optional Photo Upload</label>
                    <div className="r-file-upload">
                      <FiUploadCloud className="r-file-upload-icon" />
                      <div className="r-file-upload-text">
                        {form.photo ? 'Change Selected File' : 'Click to Upload Roof Photo'}
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => update('photo', e.target.files?.[0] ?? null)}
                      />
                      {form.photo && (
                        <div className="r-file-upload-name">
                          Selected: {form.photo.name}
                        </div>
                      )}
                    </div>
                  </div>

                  <button type="submit" className="r-btn r-btn-primary r-btn-arrow r-btn-block">
                    Submit Estimate Request <FiArrowRight aria-hidden="true" />
                  </button>
                  <p className="r-body-small" style={{ textAlign: 'center', marginTop: '1rem', color: 'var(--r-slate)', fontWeight: '500' }}>
                    We review submissions and contact you within 24 hours.
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}

function EmergencySection() {
  return (
    <section className="r-emergency" aria-labelledby="emergency-heading">
      <div className="r-container">
        <div className="r-emergency-inner">
          <div>
            <h2 id="emergency-heading">Have an Active Roof Leak?</h2>
            <p>Call our dispatch line for quick diagnostics and tarp scheduling.</p>
          </div>
          <div className="r-emergency-actions">
            <a href="tel:5554820198" className="r-btn r-btn-navy">Call Emergency Tarp Line</a>
            <a href="tel:5554820198" className="r-emergency-phone">(555) 482-0198</a>
          </div>
        </div>
      </div>
    </section>
  )
}

function FAQSection() {
  const [open, setOpen] = useState(null)

  return (
    <section className="r-faq" aria-labelledby="faq-heading">
      <div className="r-container">
        <p className="r-label" style={{ textAlign: 'center', display: 'block' }}>Got Questions?</p>
        <h2 id="faq-heading" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>Common Inquiries</h2>
        <div className="r-faq-list">
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = open === i
            return (
              <div key={item.q} className={`r-faq-item${isOpen ? ' is-open' : ''}`}>
                <button
                  type="button"
                  className="r-faq-trigger"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  {item.q}
                  <span className="r-faq-icon" aria-hidden="true">+</span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      className="r-faq-answer"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                    >
                      <p>{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function RoofingFooter() {
  const link = (id, label) => (
    <a
      href={`#${id}`}
      onClick={(e) => { e.preventDefault(); scrollTo(id) }}
    >
      {label}
    </a>
  )

  return (
    <footer className="r-footer">
      <div className="r-container">
        <div className="r-footer-grid">
          <div className="r-footer-brand">
            <strong>RIDGELINE ROOFING CO.</strong>
            <p className="r-footer-tagline">Built to Protect What Matters.</p>
            <p>Premium residential roofing for Central Ohio homeowners. Licensed, insured, and locally operated. Fictional contractor representation.</p>
          </div>
          <div className="r-footer-col">
            <h4 className="r-footer-heading">Quick Links</h4>
            <nav className="r-footer-nav" aria-label="Footer Navigation">
              {link('services', 'Services')}
              {link('our-work', 'Projects')}
              {link('why', 'Why Us')}
              {link('timeline', 'Process')}
              {link('reviews', 'Reviews')}
              {link('contact', 'Contact')}
            </nav>
          </div>
          <div className="r-footer-col">
            <h4 className="r-footer-heading">Our Services</h4>
            <nav className="r-footer-nav" aria-label="Services Navigation">
              <a href="#services" onClick={(e) => { e.preventDefault(); scrollTo('services') }}>Roof Replacement</a>
              <a href="#services" onClick={(e) => { e.preventDefault(); scrollTo('services') }}>Roof Repair</a>
              <a href="#services" onClick={(e) => { e.preventDefault(); scrollTo('services') }}>Storm Assessment</a>
              <a href="#services" onClick={(e) => { e.preventDefault(); scrollTo('services') }}>Inspections</a>
              <a href="#services" onClick={(e) => { e.preventDefault(); scrollTo('services') }}>Gutters &amp; Guards</a>
            </nav>
          </div>
          <div className="r-footer-col">
            <h4 className="r-footer-heading">Contact Details</h4>
            <div className="r-footer-contact">
              <p>Columbus, Ohio</p>
              <p><a href="tel:5554820198">(555) 482-0198</a></p>
              <p><a href="mailto:hello@ridgelineroofing.example">hello@ridgelineroofing.example</a></p>
            </div>
          </div>
        </div>
        <div className="r-footer-bottom">
          <span>Concept Project — Designed &amp; Developed by Craftivo</span>
          <a href="/" onClick={(e) => { e.preventDefault(); pushPath('/') }}>← Back to Craftivo Main Portfolio</a>
        </div>
      </div>
    </footer>
  )
}

function setMeta(name, content, attr = 'name') {
  let el = document.querySelector(`meta[${attr}="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

export default function RoofingPage() {
  const estimate = useCallback(() => scrollTo('contact'), [])

  useEffect(() => {
    document.title = 'Ridgeline Roofing Co. | Premium Roof Replacement & Repairs | Columbus, OH'
    setMeta('description', 'Ridgeline Roofing provides premium residential roof replacements, honest repair assessments, and storm damage inspections in Columbus, Dublin, and Central Ohio.')
    setMeta('og:title', 'Ridgeline Roofing Co. | Premium Roof Replacement & Repairs | Columbus, OH', 'property')
    setMeta('og:description', 'Premium residential roof replacement, gutter installations, and storm restoration in Central Ohio. Certified local contractor craftsmanship.', 'property')
    setMeta('og:type', 'website', 'property')
    setMeta('og:image', `${window.location.origin}/images/roofing/hero.jpg`, 'property')

    const schema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'RoofingContractor',
          '@id': `${window.location.origin}/work/ridgeline-roofing#business`,
          name: 'Ridgeline Roofing Co.',
          description: 'Premium residential roofing replacement, repair, inspections, and storm restoration in Columbus, Ohio.',
          url: `${window.location.origin}/work/ridgeline-roofing`,
          telephone: '+1-555-482-0198',
          email: 'hello@ridgelineroofing.example',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Columbus',
            addressRegion: 'OH',
            addressCountry: 'US',
          },
          areaServed: SERVICE_AREAS.map((a) => ({ '@type': 'City', name: `${a}, Ohio` })),
          slogan: 'Built to Protect What Matters.',
          image: `${window.location.origin}/images/roofing/hero.jpg`,
        },
        {
          '@type': 'LocalBusiness',
          '@id': `${window.location.origin}/work/ridgeline-roofing#local`,
          name: 'Ridgeline Roofing Co.',
          image: `${window.location.origin}/images/roofing/hero.jpg`,
          parentOrganization: { '@type': 'Organization', name: 'Craftivo Concept Project' },
        },
      ],
    }

    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.id = 'ridgeline-schema'
    script.textContent = JSON.stringify(schema)
    document.head.appendChild(script)

    if (window.location.hash === '#contact') {
      setTimeout(() => scrollTo('contact'), 300)
    }

    return () => {
      document.getElementById('ridgeline-schema')?.remove()
    }
  }, [])

  return (
    <div className="r-page">
      <RoofingNav onEstimate={estimate} />
      <main>
        <Hero onEstimate={estimate} />
        <TrustStrip />
        <TrustSection />
        <ServicesSection />
        <FeaturedWorkSection />
        <BeforeAfterSection />
        <WhySection />
        <AboutSection />
        <ProcessSection />
        <StormSection onEstimate={estimate} />
        <ReviewsSection />
        <ServiceAreaSection />
        <EstimateSection />
        <EmergencySection />
        <FAQSection />
      </main>
      <RoofingFooter />
      <div className="r-mobile-cta">
        <a href="tel:5554820198" className="r-btn r-btn-navy">Call Now</a>
        <button type="button" className="r-btn r-btn-primary" onClick={estimate}>Get Free Estimate</button>
      </div>
    </div>
  )
}
