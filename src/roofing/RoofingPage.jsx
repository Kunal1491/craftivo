import { useEffect, useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
  { title: 'Roof Replacement', text: 'Complete roofing systems designed for long-term protection and curb appeal.', image: IMG.serviceReplacement },
  { title: 'Roof Repair', text: 'Reliable repairs for leaks, damaged shingles, flashing, and other roofing problems.', image: IMG.serviceRepair },
  { title: 'Storm Damage', text: 'Roof inspection and restoration following wind and hail damage.', image: IMG.serviceStorm },
  { title: 'Roof Inspections', text: 'Detailed inspections to identify problems before they become expensive repairs.', image: IMG.serviceInspection },
  { title: 'Gutters & Exterior Protection', text: 'Solutions that help protect the home from water damage.', image: IMG.serviceGutters },
]

const FEATURED = [
  { title: 'Westfield Residence', meta: 'Roof Replacement • Architectural Shingles', image: IMG.work1 },
  { title: 'Northbrook Residence', meta: 'Complete Roof Replacement • Premium Shingles', image: IMG.work2 },
  { title: 'Dublin Storm Restoration', meta: 'Storm Damage • Roof Restoration', image: IMG.work3 },
  { title: 'New Albany Residence', meta: 'Roof Replacement • Architectural Roofing System', image: IMG.work4 },
]

const REVIEWS = [
  { quote: 'From the inspection to the final cleanup, the entire process was professional. The finished roof looks fantastic.', author: 'Michael R.' },
  { quote: 'Ridgeline made the entire storm-damage process simple and kept us informed throughout.', author: 'Sarah T.' },
  { quote: 'The biggest difference was communication. Every question was answered and the finished work looks excellent.', author: 'James W.' },
]

const FAQ_ITEMS = [
  { q: 'How do I know if I need a new roof?', a: 'Common signs include missing or curling shingles, granule loss, visible sagging, interior water stains, and a roof age beyond 20–25 years. A professional inspection is the best way to know for sure.' },
  { q: 'How long does roof replacement take?', a: 'Most residential roof replacements take one to three days, depending on roof size, pitch, material, and weather. We provide a clear timeline before work begins.' },
  { q: 'What roofing materials do you install?', a: 'We install architectural shingles, premium asphalt systems, and other residential roofing products selected for durability, appearance, and Central Ohio conditions.' },
  { q: 'Do you provide inspections?', a: 'Yes. We offer detailed roof inspections for homeowners who want clarity on condition, maintenance needs, or storm-related concerns.' },
  { q: 'Do you handle storm damage?', a: 'Yes. We inspect storm-related damage, explain findings clearly, and help homeowners understand repair or replacement options.' },
  { q: 'Can you help with insurance documentation?', a: 'We can provide inspection findings and project documentation to support your insurance process. We do not make coverage guarantees — decisions remain with your insurer.' },
  { q: 'Do you offer financing?', a: 'Financing options may be available for qualifying projects. Ask during your estimate consultation for current program details.' },
  { q: 'How long does a typical roof last?', a: 'Quality architectural shingle systems often last 25–30 years or more with proper installation and maintenance, though lifespan varies by material and conditions.' },
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

const CONTACT_METHODS = ['Phone', 'Email', 'Text message']

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
          {link('our-work', 'Our Work')}
          {link('why', 'Why Ridgeline')}
          {link('about', 'About')}
          {link('reviews', 'Reviews')}
          {link('contact', 'Contact')}
        </nav>
        <div className="r-nav-actions">
          <a className="r-nav-phone" href="tel:5554820198">Call Now</a>
          <button type="button" className="r-btn r-btn-primary" onClick={onEstimate}>Get Free Estimate</button>
        </div>
        <a className="r-nav-phone r-nav-actions-mobile-phone" href="tel:5554820198" style={{ display: 'none' }}>Call</a>
        <button
          type="button"
          className="r-nav-toggle"
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          <span /><span /><span />
        </button>
      </div>
      {open && (
        <div className="r-nav-mobile">
          {link('services', 'Services')}
          {link('our-work', 'Our Work')}
          {link('why', 'Why Ridgeline')}
          {link('about', 'About')}
          {link('reviews', 'Reviews')}
          {link('contact', 'Contact')}
          <a href="tel:5554820198">(555) 482-0198</a>
          <button type="button" className="r-btn r-btn-primary" onClick={() => { setOpen(false); onEstimate() }}>
            Get Free Estimate
          </button>
        </div>
      )}
    </header>
  )
}

function Hero({ onEstimate }) {
  return (
    <section className="r-hero" aria-labelledby="hero-heading">
      <div className="r-hero-bg">
        <img src={IMG.hero} alt="Premium American home with architectural roofing in Columbus, Ohio" loading="eager" />
        <div className="r-hero-overlay" aria-hidden="true" />
      </div>
      <div className="r-container">
        <motion.p
          className="r-label"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Roofing Built for the Long Haul
        </motion.p>
        <motion.h1
          id="hero-heading"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08 }}
        >
          A Better Roof Starts With Better Work.
        </motion.h1>
        <motion.p
          className="r-lead"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.16 }}
        >
          Premium roof replacement, repair, and storm restoration for homeowners who want lasting protection and exceptional workmanship.
        </motion.p>
        <motion.div
          className="r-hero-actions"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.24 }}
        >
          <button type="button" className="r-btn r-btn-primary r-btn-arrow" onClick={onEstimate}>
            Get a Free Estimate <span aria-hidden="true">→</span>
          </button>
          <a
            href="#our-work"
            className="r-text-link-light"
            onClick={(e) => { e.preventDefault(); scrollTo('our-work') }}
          >
            Explore Our Work
          </a>
        </motion.div>
        <motion.div
          className="r-trust-line"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.32 }}
        >
          <a href="tel:5554820198"><strong>(555) 482-0198</strong></a>
          <span className="r-trust-divider" aria-hidden="true">·</span>
          <span>Licensed &amp; Insured</span>
          <span className="r-trust-divider" aria-hidden="true">·</span>
          <span>5-Star Service</span>
          <span className="r-trust-divider" aria-hidden="true">·</span>
          <span>Workmanship Warranty</span>
          <span className="r-trust-note">Fictional portfolio claims · Concept Project</span>
        </motion.div>
      </div>
    </section>
  )
}

function TrustSection() {
  const stats = [
    { value: '15+', label: 'Years Experience' },
    { value: '1,200+', label: 'Roofs Completed' },
    { value: '5.0', label: 'Homeowner Rating' },
    { value: '10-Year', label: 'Workmanship Warranty' },
  ]

  return (
    <section className="r-trust" aria-label="Company credentials">
      <div className="r-container r-trust-inner">
        <div>
          <p className="r-label" style={{ color: 'var(--r-copper)' }}>Built on Craftsmanship. Backed by Care.</p>
          <h2>Trusted roofing for Central Ohio homeowners.</h2>
          <p className="r-concept-note" style={{ color: 'rgba(255,255,255,0.45)' }}>Sample metrics · Concept Project</p>
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
    </section>
  )
}

function ServicesSection() {
  return (
    <section id="services" className="r-services">
      <div className="r-container">
        <div className="r-services-header">
          <p className="r-label">Our Services</p>
          <h2>Roofing Solutions That Protect Your Home</h2>
        </div>
        <div className="r-service-grid">
          {SERVICES.map((s) => (
            <article key={s.title} className="r-service-item">
              <div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
              <div className="r-service-thumb">
                <img src={s.image} alt="" loading="lazy" aria-hidden="true" />
              </div>
            </article>
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
          <div>
            <p className="r-label">Featured Projects</p>
            <h2>Work You Can See. Craftsmanship You Can Trust.</h2>
          </div>
          <p className="r-concept-note">Fictional portfolio projects · Concept demo</p>
        </div>
        <div className="r-work-grid">
          {FEATURED.map((p) => (
            <article key={p.title} className="r-work-card">
              <img src={p.image} alt={`${p.title} — ${p.meta}`} loading="lazy" />
              <div className="r-work-card-overlay">
                <h3>{p.title}</h3>
                <p>{p.meta}</p>
                <a
                  href="#contact"
                  className="r-work-link"
                  onClick={(e) => { e.preventDefault(); scrollTo('contact') }}
                >
                  View Project →
                </a>
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
          <p className="r-label">Before &amp; After</p>
          <h2 id="compare-heading">See the Difference Quality Makes.</h2>
        </div>
        <div
          className="r-compare-wrap"
          ref={wrapRef}
          onMouseDown={(e) => { dragging.current = true; updatePosition(e.clientX) }}
          onTouchStart={(e) => { dragging.current = true; updatePosition(e.touches[0].clientX) }}
          role="img"
          aria-label="Before and after roof replacement comparison slider"
        >
          <span className="r-compare-label r-compare-label-before">Before</span>
          <span className="r-compare-label r-compare-label-after">After</span>
          <div className="r-compare-before">
            <img src={IMG.before} alt="Roof before replacement showing worn shingles" loading="lazy" />
          </div>
          <div className="r-compare-after" style={{ clipPath: `inset(0 0 0 ${position}%)` }}>
            <img src={IMG.after} alt="Roof after replacement with new architectural shingles" loading="lazy" />
          </div>
          <div className="r-compare-handle" style={{ left: `${position}%` }} aria-hidden="true" />
        </div>
        <div className="r-compare-meta">
          <span><strong>Roof Replacement</strong></span>
          <span><strong>Architectural Shingles</strong></span>
          <span><strong>Columbus, OH</strong></span>
          <span className="r-concept-note">Concept project · Fictional location</span>
        </div>
      </div>
    </section>
  )
}

function WhySection() {
  const principles = [
    { title: 'Quality Materials', text: 'Systems selected for durability and appearance.' },
    { title: 'Skilled Installation', text: 'Experienced crews focused on precision.' },
    { title: 'Clear Communication', text: 'Honest guidance at every step.' },
    { title: 'Built to Last', text: 'Work designed for long-term protection.' },
  ]

  return (
    <section id="why" className="r-why">
      <div className="r-container r-why-grid">
        <div className="r-why-media">
          <img src={IMG.craftsmanship} alt="Roofing craftsman installing shingles with care" loading="lazy" />
        </div>
        <div>
          <p className="r-label">Why Ridgeline</p>
          <h2>We Treat Your Home Like It&apos;s Our Own.</h2>
          <p className="r-body-narrow">
            Roofing is more than shingles and nails. It&apos;s about protecting the place your family comes home to. That&apos;s why we focus on clear communication, quality materials, careful installation, and leaving every property cleaner than we found it.
          </p>
          <div className="r-principles">
            {principles.map((p) => (
              <div key={p.title} className="r-principle">
                <strong>{p.title}</strong>
                <span>{p.text}</span>
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
    <section id="about" className="r-why" style={{ background: 'var(--r-warm)' }}>
      <div className="r-container">
        <p className="r-label">About Ridgeline</p>
        <h2>Premium residential roofing in Columbus, Ohio.</h2>
        <p className="r-body-narrow">
          Ridgeline Roofing Co. is a fictional portfolio concept representing a modern U.S. roofing company focused on roof replacement, repair, inspections, and storm restoration for homeowners across Central Ohio.
        </p>
        <p className="r-concept-note">Fictional company · Concept Project by Craftivo</p>
      </div>
    </section>
  )
}

function ProcessSection() {
  const steps = [
    { num: '01', title: 'Inspect', text: 'We evaluate your roof and explain what we find.' },
    { num: '02', title: 'Plan', text: 'You receive a clear recommendation and estimate.' },
    { num: '03', title: 'Build', text: 'Our crew completes the work with attention to detail.' },
    { num: '04', title: 'Protect', text: 'We perform a final inspection and clean the property.' },
  ]

  return (
    <section className="r-process" aria-labelledby="process-heading">
      <div className="r-container">
        <p className="r-label" style={{ color: 'var(--r-copper)' }}>Our Process</p>
        <h2 id="process-heading">From First Call to Final Inspection.</h2>
        <div className="r-process-grid">
          {steps.map((s) => (
            <div key={s.num} className="r-process-step">
              <span className="r-process-num">{s.num} — {s.title}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function StormSection({ onEstimate }) {
  const items = ['Wind Damage', 'Hail Damage', 'Emergency Repairs', 'Insurance Documentation Assistance']

  return (
    <section className="r-storm" aria-labelledby="storm-heading">
      <div className="r-storm-bg">
        <img src={IMG.storm} alt="" loading="lazy" aria-hidden="true" />
        <div className="r-storm-overlay" aria-hidden="true" />
      </div>
      <div className="r-container r-storm-grid">
        <div>
          <p className="r-label">Storm Response</p>
          <h2 id="storm-heading">When the Storm Hits, We&apos;re Ready.</h2>
          <p className="r-lead">
            Wind and hail can damage your roof before the problem becomes visible. Our team helps homeowners understand the damage and the next step.
          </p>
        </div>
        <div>
          <ul className="r-storm-list">
            {items.map((item) => <li key={item}>{item}</li>)}
          </ul>
          <button type="button" className="r-btn r-btn-primary r-btn-arrow" onClick={onEstimate}>
            Request a Roof Inspection <span aria-hidden="true">→</span>
          </button>
          <p className="r-concept-note" style={{ color: 'rgba(255,255,255,0.5)', marginTop: '1rem' }}>
            We assist with documentation — coverage decisions remain with your insurer.
          </p>
        </div>
      </div>
    </section>
  )
}

function ReviewsSection() {
  return (
    <section id="reviews" className="r-reviews">
      <div className="r-container">
        <div className="r-reviews-header">
          <p className="r-label">Reviews</p>
          <h2>Homeowners Recommend the Work We Stand Behind.</h2>
          <p className="r-concept-note">Fictional demo testimonials · Concept Project</p>
        </div>
        <div className="r-review-grid">
          {REVIEWS.map((r) => (
            <article key={r.author} className="r-review">
              <blockquote>
                <p>&ldquo;{r.quote}&rdquo;</p>
                <cite>— {r.author}</cite>
              </blockquote>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function ServiceAreaSection() {
  return (
    <section className="r-area" aria-labelledby="area-heading">
      <div className="r-container r-area-grid">
        <div>
          <p className="r-label">Service Area</p>
          <h2 id="area-heading">Proudly Serving Homeowners Across Central Ohio.</h2>
          <p className="r-body-narrow">
            Based in <strong>Columbus, Ohio</strong>, Ridgeline serves homeowners throughout the surrounding communities with premium roofing services.
          </p>
          <div className="r-area-list">
            {SERVICE_AREAS.map((area) => (
              <span key={area} className="r-area-tag">{area}</span>
            ))}
          </div>
          <p className="r-concept-note">Fictional service area · Concept Project</p>
        </div>
        <RoofingMap />
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
      <div className="r-container r-estimate-grid">
        <div>
          <p className="r-label">Free Estimate</p>
          <h2>Let&apos;s Take a Look at Your Roof.</h2>
          <p className="r-body-narrow">
            Tell us a little about your project and we&apos;ll help you figure out the right next step.
          </p>
          <p style={{ marginTop: '1.5rem' }}>
            <a href="tel:5554820198" className="r-text-link"><strong>(555) 482-0198</strong></a>
          </p>
          <p className="r-concept-note">Demo form · No data is submitted</p>
        </div>

        <div className="r-form-panel">
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                className="r-form-success"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <div className="r-success-icon" aria-hidden="true">✓</div>
                <h3>Request Received</h3>
                <p>Thank you for reaching out about your roof.</p>
                <p className="r-body-small">
                  This is a demonstration of the estimate experience Craftivo can create for a roofing company.
                </p>
                <p className="r-body-small"><strong>No information was submitted.</strong></p>
                <button type="button" className="r-btn r-btn-primary" onClick={reset} style={{ marginTop: '1rem' }}>
                  Back to Form
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
                    Please correct the highlighted fields below.
                  </div>
                )}
                <div className="r-field">
                  <label htmlFor="r-name">Full Name</label>
                  <input
                    id="r-name"
                    value={form.name}
                    onChange={(e) => update('name', e.target.value)}
                    className={errors.name ? 'is-error' : ''}
                    autoComplete="name"
                  />
                  {errors.name && <p className="r-field-error">{errors.name}</p>}
                </div>
                <div className="r-field-row">
                  <div className="r-field">
                    <label htmlFor="r-phone">Phone</label>
                    <input
                      id="r-phone"
                      type="tel"
                      value={form.phone}
                      onChange={(e) => update('phone', e.target.value)}
                      className={errors.phone ? 'is-error' : ''}
                      autoComplete="tel"
                    />
                    {errors.phone && <p className="r-field-error">{errors.phone}</p>}
                  </div>
                  <div className="r-field">
                    <label htmlFor="r-email">Email</label>
                    <input
                      id="r-email"
                      type="email"
                      value={form.email}
                      onChange={(e) => update('email', e.target.value)}
                      className={errors.email ? 'is-error' : ''}
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
                    autoComplete="street-address"
                  />
                  {errors.address && <p className="r-field-error">{errors.address}</p>}
                </div>
                <div className="r-field-row">
                  <div className="r-field">
                    <label htmlFor="r-help">What do you need help with?</label>
                    <select
                      id="r-help"
                      value={form.help}
                      onChange={(e) => update('help', e.target.value)}
                      className={errors.help ? 'is-error' : ''}
                    >
                      <option value="">Select an option</option>
                      {HELP_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                    {errors.help && <p className="r-field-error">{errors.help}</p>}
                  </div>
                  <div className="r-field">
                    <label htmlFor="r-contact">Preferred Contact Method</label>
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
                  <label htmlFor="r-message">Message</label>
                  <textarea
                    id="r-message"
                    rows={4}
                    value={form.message}
                    onChange={(e) => update('message', e.target.value)}
                    placeholder="Tell us about your roof, timeline, or concerns..."
                  />
                </div>
                <div className="r-field">
                  <label htmlFor="r-photo">Optional roof photo upload</label>
                  <input
                    id="r-photo"
                    type="file"
                    accept="image/*"
                    className="r-file-input"
                    onChange={(e) => update('photo', e.target.files?.[0] ?? null)}
                  />
                </div>
                <button type="submit" className="r-btn r-btn-primary r-btn-arrow r-btn-block">
                  Request My Free Estimate <span aria-hidden="true">→</span>
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

function EmergencySection() {
  return (
    <section className="r-emergency" aria-labelledby="emergency-heading">
      <div className="r-container r-emergency-inner">
        <div>
          <h2 id="emergency-heading">Have an Active Roof Leak?</h2>
          <p><strong>Don&apos;t wait for the damage to spread.</strong></p>
        </div>
        <div className="r-emergency-actions">
          <a href="tel:5554820198" className="r-btn r-btn-navy">Call for Roofing Help</a>
          <a href="tel:5554820198" className="r-emergency-phone">(555) 482-0198</a>
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
        <p className="r-label">FAQ</p>
        <h2 id="faq-heading">Common Questions</h2>
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
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
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
            <p>Premium residential roofing for Central Ohio homeowners. Fictional concept business.</p>
          </div>
          <nav className="r-footer-nav" aria-label="Footer">
            {link('services', 'Services')}
            {link('our-work', 'Our Work')}
            {link('why', 'Why Ridgeline')}
            {link('about', 'About')}
            {link('reviews', 'Reviews')}
            {link('contact', 'Contact')}
          </nav>
          <div className="r-footer-contact">
            <p>Columbus, Ohio</p>
            <p><a href="tel:5554820198">(555) 482-0198</a></p>
            <p><a href="mailto:hello@ridgelineroofing.example">hello@ridgelineroofing.example</a></p>
          </div>
        </div>
        <div className="r-footer-bottom">
          <span>Concept Project — Designed &amp; Developed by Craftivo</span>
          <a href="/" onClick={(e) => { e.preventDefault(); pushPath('/') }}>← Back to Craftivo</a>
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
    document.title = 'Ridgeline Roofing Co. | Roofing & Roof Replacement in Columbus, OH'
    setMeta('description', 'Premium roof replacement, repair, inspections, and storm restoration for homeowners in Columbus, Ohio. A Craftivo concept project.')
    setMeta('og:title', 'Ridgeline Roofing Co. | Roofing & Roof Replacement in Columbus, OH', 'property')
    setMeta('og:description', 'Premium residential roofing concept — replacement, repair, and storm restoration in Central Ohio.', 'property')
    setMeta('og:type', 'website', 'property')
    setMeta('og:image', `${window.location.origin}/images/roofing/hero.jpg`, 'property')

    const schema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'RoofingContractor',
          '@id': `${window.location.origin}/work/ridgeline-roofing#business`,
          name: 'Ridgeline Roofing Co.',
          description: 'Fictional premium residential roofing concept for Columbus, Ohio.',
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
