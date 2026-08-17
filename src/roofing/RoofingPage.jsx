import { useEffect, useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FiShield, FiFileText, FiMapPin, FiAward, FiCheck, 
  FiPhone, FiMail, FiArrowRight, FiStar, FiAlertCircle, 
  FiMenu, FiX, FiUploadCloud, FiCheckCircle
} from 'react-icons/fi'
import RoofingMap from './RoofingMap'
import './roofing.css'

const IMG = {
  hero: '/images/roofing/hero.jpg',
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
}

const SERVICES = [
  { 
    title: 'Roof Replacement', 
    text: 'Complete roofing replacement designed for long-term protection, durability, and enhanced curb appeal.', 
    image: IMG.serviceReplacement,
    benefits: ['Architectural Shingle Systems', 'Attic Ventilation Audit', 'Lifetime Manufacturer Warranty', 'Post-Job Cleanup Guarantee']
  },
  { 
    title: 'Roof Repair', 
    text: 'Targeted leak repairs, shingle restoration, and flashing fixes to extend the lifespan of your roof.', 
    image: IMG.serviceRepair,
    benefits: ['Leak Troubleshooting', 'Shingle Restoration', 'Flashing & Valley Fixes', 'Emergency Tarping Services']
  },
  { 
    title: 'Storm Damage', 
    text: 'Comprehensive post-storm inspections and restoration services to repair wind and hail impact.', 
    image: IMG.serviceStorm,
    benefits: ['Hail & Wind Inspection', 'Photo Evidence Reports', 'Structural Evaluation', 'Restoration Work']
  },
  { 
    title: 'Roof Inspection', 
    text: 'Detailed structural assessments of your roof\'s condition to identify hazards before they cause leaks.', 
    image: IMG.serviceInspection,
    benefits: ['Multi-Point Checkup', 'Attic & Ventilation Review', 'Certified Roof Condition Report', 'Preventative Care Plan']
  },
  { 
    title: 'Shingle Roofing', 
    text: 'Modern architectural shingle installations offering versatile styles, top wind-ratings, and excellent value.', 
    image: IMG.work1,
    benefits: ['Premium Algae-Resistance', 'Dozens of Color Profiles', 'Class 4 Impact Resistance', 'Architectural Shingle Designs']
  },
  { 
    title: 'Metal Roofing', 
    text: 'Premium standing-seam and metal roof installations designed for ultra-durability and modern design.', 
    image: IMG.work3,
    benefits: ['Standing-Seam Panels', '50+ Year Expected Lifespan', 'Maximum Weather Protection', 'Energy-Efficient Cool Roof']
  },
]

const FEATURED_PROJECTS = [
  { 
    title: 'Westfield Residence', 
    meta: 'Architectural Shingles • Roof Replacement', 
    location: 'Dublin, OH',
    scope: 'Full tear-off, decking reinforcement, and premium architectural shingle installation with high wind rating.',
    image: IMG.work1,
  },
  { 
    title: 'Northbrook Residence', 
    meta: 'Premium Shingle Upgrade • Storm Restoration', 
    location: 'Columbus, OH',
    scope: 'Restored wind and hail damage with class-4 impact shingles, matching color profile perfectly.',
    image: IMG.work2,
  },
  { 
    title: 'New Albany Residence', 
    meta: 'Standing-Seam Metal • Roof Replacement', 
    location: 'New Albany, OH',
    scope: 'Engineered a modern standing-seam metal roofing panel system with custom snow guards and ridge ventilation.',
    image: IMG.work4,
  },
]

const REVIEWS = [
  { 
    quote: 'From the initial inspection to the final sweep for nails, Ridgeline was professional. The new roof looks incredible, and the crew cleaned up completely every day. Communication was outstanding.', 
    author: 'Robert D.', 
    location: 'Dublin, OH' 
  },
  { 
    quote: 'After the hail storm, we didn\'t know where to start. Ridgeline provided a detailed damage assessment with clear photos. They made the process stress-free and did a fantastic job on the install.', 
    author: 'Amanda M.', 
    location: 'Columbus, OH' 
  },
  { 
    quote: 'Their crew replaced our old shingle roof with high-quality architectural shingles in just two days. The estimate was transparent, and there were no hidden fees. Highly recommend Ridgeline.', 
    author: 'Thomas S.', 
    location: 'Westerville, OH' 
  },
]

const FAQ_ITEMS = [
  { q: 'How do I know if I need a new roof?', a: 'Common indicators include missing or curling shingles, granule loss in gutters, indoor ceiling water stains, sagging spots, and an age of 20+ years. An inspection will confirm if you need a repair or replacement.' },
  { q: 'How long does a roof replacement take?', a: 'Most standard residential roof replacements are completed in 1 to 2 days, depending on size, pitch, and weather. We perform daily cleanups to keep your yard safe.' },
  { q: 'What roofing materials do you install?', a: 'We install premium architectural asphalt shingles and metal systems chosen for their lifespan, impact ratings, and beauty in Central Ohio weather.' },
  { q: 'Do you offer inspections?', a: 'Yes. We offer detailed, transparent inspections for homeowners who want to clarify their roof condition or storm-related damage.' },
  { q: 'Do you handle storm damage?', a: 'Yes. We evaluate wind and hail damage, provide a full visual inspection report with photos, and help coordinate repair timelines.' }
]

const SERVICE_AREAS = ['Columbus', 'Dublin', 'Westerville', 'Gahanna', 'Worthington', 'Hilliard', 'Grove City', 'New Albany']

const HELP_OPTIONS = [
  'Roof Replacement',
  'Roof Repair',
  'Storm Damage',
  'Inspection',
  'Other',
]

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
          <strong>RIDGELINE ROOFING</strong>
          <span>Roofing Co.</span>
        </a>
        <nav className="r-nav-links" aria-label="Primary">
          {link('top', 'Home')}
          {link('services', 'Services')}
          {link('our-work', 'Our Work')}
          {link('why', 'Why Ridgeline')}
          {link('reviews', 'Reviews')}
          {link('contact', 'Contact')}
        </nav>
        <div className="r-nav-actions">
          <a className="r-nav-phone" href="tel:5554820198">
            <FiPhone /> (555) 482-0198
          </a>
          <button type="button" className="r-btn r-btn-primary" onClick={onEstimate}>Free Estimate</button>
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
            {link('top', 'Home')}
            {link('services', 'Services')}
            {link('our-work', 'Our Work')}
            {link('why', 'Why Ridgeline')}
            {link('reviews', 'Reviews')}
            {link('contact', 'Contact')}
            <a href="tel:5554820198" style={{ fontWeight: '700', color: 'var(--r-copper)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FiPhone /> (555) 482-0198
            </a>
            <button type="button" className="r-btn r-btn-primary" onClick={() => { setOpen(false); onEstimate() }}>
              Free Estimate
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
              <span className="r-hero-dot">•</span> Local Roofing Experts
            </p>
            <h1 id="hero-heading">Roofing Built to Protect What Matters.</h1>
            <p className="r-lead">
              Quality workmanship, reliable service, and transparent communication. We protect Central Ohio families with premium materials and certified installations.
            </p>
            <div className="r-hero-actions">
              <button type="button" className="r-btn r-btn-primary r-btn-arrow" onClick={onEstimate}>
                Get a Free Roof Estimate <FiArrowRight aria-hidden="true" />
              </button>
              <a
                href="#our-work"
                className="r-text-link-light"
                onClick={(e) => { e.preventDefault(); scrollTo('our-work') }}
              >
                View Our Work <FiArrowRight aria-hidden="true" />
              </a>
            </div>
            
            <div className="r-hero-trust-badges">
              <div className="r-badge-item">
                <span className="r-badge-stars">★★★★★</span>
                <span className="r-badge-text">5.0 Customer Rating</span>
              </div>
              <div className="r-badge-divider"></div>
              <div className="r-badge-item">
                <span className="r-badge-bold">Licensed &amp; Insured</span>
                <span className="r-badge-text">100% Code Compliant</span>
              </div>
              <div className="r-badge-divider"></div>
              <div className="r-badge-item">
                <span className="r-badge-bold">Free Estimates</span>
                <span className="r-badge-text">Visual Assessments</span>
              </div>
            </div>
            
            <p className="r-hero-phone-cta">
              Prefer calling? Connect with us directly at: <a href="tel:5554820198" className="r-hero-phone-number">(555) 482-0198</a>
            </p>
            
            <p className="r-concept-note-hero">Fictional business concept website by Craftivo</p>
          </div>
          <div className="r-hero-image-pane">
            <div className="r-hero-frame">
              <img src={IMG.hero} alt="A modern American home showcasing premium shingle roof installation" loading="eager" />
              <div className="r-hero-overlay" aria-hidden="true" />
              <div className="r-hero-floating-card">
                <strong>Certified Installers</strong>
                <span>Columbus &amp; Central Ohio Region</span>
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
            <FiFileText /> Free Estimates
          </div>
          <div className="r-trust-strip-item">
            <FiAward /> Quality Workmanship
          </div>
          <div className="r-trust-strip-item">
            <FiMapPin /> Local Roofing Experts
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
          <p className="r-label">Our Services</p>
          <h2>Professional Roofing Solutions Crafted for Your Home</h2>
          <p className="r-body-narrow" style={{ margin: '1rem auto 0', textAlign: 'center' }}>
            We provide full-service residential roofing, storm damage repair, and professional diagnostic checks built to protect your property value.
          </p>
        </div>
        <div className="r-service-grid-editorial">
          {SERVICES.map((s) => (
            <article key={s.title} className="r-service-editorial-card">
              <div className="r-service-editorial-img">
                <img src={s.image} alt={s.title} loading="lazy" />
              </div>
              <div className="r-service-editorial-content">
                <h3>{s.title}</h3>
                <p>{s.text}</p>
                <ul className="r-service-editorial-benefits">
                  {s.benefits.slice(0, 3).map((b) => (
                    <li key={b}><FiCheck /> {b}</li>
                  ))}
                </ul>
                <a href="#contact" className="r-service-editorial-link" onClick={(e) => { e.preventDefault(); scrollTo('contact') }}>
                  Explore Service <FiArrowRight />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function WhySection() {
  const pillars = [
    { num: '01', title: 'Quality Craftsmanship', text: 'Certified crew using top-tier shingles, advanced vapor barriers, and reinforced valley flashings.' },
    { num: '02', title: 'Transparent Estimates', text: 'Itemized upfront bids specifying exact materials, labor, warranties, and clean-up costs.' },
    { num: '03', title: 'Reliable Communication', text: 'Proactive photo reports and plain-English summaries so you stay informed at every step.' },
    { num: '04', title: 'Built to Last', text: 'System-engineered weather barriers, leak shields, and ridge ventilation constructed for Ohio storms.' },
    { num: '05', title: 'Local Expertise', text: 'Locally based team with deep understanding of Columbus climate cycles and municipal building codes.' },
  ]

  return (
    <section id="why" className="r-why">
      <div className="r-container">
        <div className="r-why-grid-modern">
          <div className="r-why-editorial-intro">
            <p className="r-label">Why Ridgeline</p>
            <h2>A Better Roofing Experience from Start to Finish</h2>
            <p className="r-body-narrow" style={{ marginTop: '1.25rem' }}>
              Your roof is the first line of defense against the elements. We structure our entire installation workflow to remove typical contractor headaches and provide lasting security.
            </p>
            <div className="r-why-hero-frame">
              <img src={IMG.work2} alt="High quality shingle detail view of Ridgeline installation" loading="lazy" />
              <div className="r-why-frame-tag">
                <strong>Premium Materials Only</strong>
              </div>
            </div>
          </div>
          <div className="r-why-pillars-list">
            {pillars.map((p) => (
              <div key={p.num} className="r-why-pillar-item">
                <span className="r-why-pillar-number">{p.num}</span>
                <div className="r-why-pillar-text">
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

function FeaturedWorkSection() {
  return (
    <section id="our-work" className="r-work">
      <div className="r-container">
        <div className="r-work-header">
          <div className="r-work-header-text">
            <p className="r-label">Our Work</p>
            <h2>Proven Durability. Modern Curb Appeal.</h2>
          </div>
          <p className="r-concept-note-tag">Concept contractor portfolio representation</p>
        </div>
        <div className="r-work-grid-modern">
          {FEATURED_PROJECTS.map((p) => (
            <article key={p.title} className="r-work-card-modern">
              <div className="r-work-card-image">
                <img src={p.image} alt={`Completed roof installation for ${p.title} in ${p.location}`} loading="lazy" />
              </div>
              <div className="r-work-card-details">
                <span className="r-work-tag">{p.meta}</span>
                <h3>{p.title}</h3>
                <div className="r-work-meta-row">
                  <span><strong>Location:</strong> {p.location}</span>
                </div>
                <p className="r-work-scope"><strong>Scope:</strong> {p.scope}</p>
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
          <p className="r-label" style={{ textAlign: 'center', display: 'block' }}>Before &amp; After</p>
          <h2 id="compare-heading" style={{ textAlign: 'center' }}>See the Quality Difference</h2>
          <p className="r-body-narrow" style={{ margin: '1rem auto 0', textAlign: 'center' }}>
            Drag the handle to compare worn, failing shingles with a completed premium architectural shingle replacement.
          </p>
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
          <span className="r-compare-label r-compare-label-after">After (New Architectural Roof)</span>
          <div className="r-compare-before">
            <img src={IMG.before} alt="Old roof with curling shingles and leakage risks" loading="lazy" />
          </div>
          <div className="r-compare-after" style={{ clipPath: `inset(0 0 0 ${position}%)` }}>
            <img src={IMG.after} alt="Modern architectural roof installation by Ridgeline" loading="lazy" />
          </div>
          <div className="r-compare-handle" style={{ left: `${position}%` }} aria-hidden="true">
            <div className="r-compare-handle-circle">
              <span>↔</span>
            </div>
          </div>
        </div>
        <div className="r-compare-meta-modern">
          <span><strong>System Type:</strong> Roof Replacement</span>
          <span><strong>Material:</strong> Premium Architectural Shingles</span>
          <span><strong>Location:</strong> Columbus, OH</span>
        </div>
      </div>
    </section>
  )
}

function ProcessSection() {
  const steps = [
    { num: '01', title: 'Request an Estimate', text: 'Fill out our short online form or call us directly to request your free visual inspection.' },
    { num: '02', title: 'Roof Inspection', text: 'We audit your shingles, structural valleys, flashings, gutters, and attic ventilation systems.' },
    { num: '03', title: 'Detailed Proposal', text: 'Receive an itemized bid detailing exact materials, guarantees, pricing, and project timelines.' },
    { num: '04', title: 'Professional Installation', text: 'Our certified crews complete the tear-off and installation with daily safety checks and cleanup.' },
  ]

  return (
    <section id="timeline" className="r-process" aria-labelledby="process-heading">
      <div className="r-container">
        <p className="r-label" style={{ color: 'var(--r-copper)', textAlign: 'center', display: 'block' }}>Our Process</p>
        <h2 id="process-heading">From First Call to Final Cleanup</h2>
        <div className="r-process-grid-modern">
          {steps.map((s) => (
            <div key={s.num} className="r-process-step-modern">
              <span className="r-process-step-number">{s.num}</span>
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
  return (
    <section className="r-storm" aria-labelledby="storm-heading">
      <div className="r-storm-bg">
        <img src={IMG.storm} alt="Dark storm clouds passing over a residential area" loading="lazy" aria-hidden="true" />
        <div className="r-storm-overlay" aria-hidden="true" />
      </div>
      <div className="r-container">
        <div className="r-storm-grid-modern">
          <div className="r-storm-content">
            <p className="r-label" style={{ color: 'var(--r-copper)' }}>Storm Support</p>
            <h2 id="storm-heading">Active Weather Storm Damage?</h2>
            <p className="r-lead" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
              Severe storms can cause underlying damage that triggers major water leaks months down the line. Our certified inspectors help verify roof safety quickly.
            </p>
            <div className="r-storm-bullets-modern">
              <div className="r-storm-bullet-item"><FiShield /> Wind Shingle Tears</div>
              <div className="r-storm-bullet-item"><FiShield /> Hail Damage Audits</div>
              <div className="r-storm-bullet-item"><FiShield /> Emergency Tarping</div>
              <div className="r-storm-bullet-item"><FiShield /> Photo Documentation</div>
            </div>
          </div>
          <div className="r-storm-action-panel">
            <h3>Request Urgent Damage Assessment</h3>
            <p>We supply visual diagnostic reports and photo arrays to clarify structural safety.</p>
            <div className="r-storm-cta-row">
              <button type="button" className="r-btn r-btn-primary" onClick={onEstimate}>
                Book Inspection
              </button>
              <a href="tel:5554820198" className="r-btn r-btn-outline">
                <FiPhone /> Call Now
              </a>
            </div>
          </div>
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
          <p className="r-label">Testimonials</p>
          <h2>Real Feedback from Homeowners We Served</h2>
          <p className="r-concept-note-reviews">Sample Client Review — Concept Project</p>
        </div>
        <div className="r-reviews-grid-modern">
          {REVIEWS.map((r, index) => (
            <article key={index} className="r-review-card-modern">
              <div className="r-review-header-row">
                <div className="r-review-stars-modern">
                  <FiStar /><FiStar /><FiStar /><FiStar /><FiStar />
                </div>
                <span className="r-review-verified">★★★★★ Verified</span>
              </div>
              <blockquote>
                <p>“{r.quote}”</p>
              </blockquote>
              <div className="r-review-meta-author">
                <strong>{r.author}</strong>
                <span>{r.location}</span>
              </div>
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
      <div className="r-container">
        <div className="r-area-grid-modern">
          <div className="r-area-text-pane">
            <p className="r-label">Our Service Area</p>
            <h2 id="area-heading">Roofing Services Across Your Community</h2>
            <p className="r-body-narrow">
              Based in <strong>Columbus, Ohio</strong>, Ridgeline Roofing Co. serves families throughout Central Ohio with quality materials and certified installers.
            </p>
            <div className="r-area-locations-list">
              {SERVICE_AREAS.map((area) => (
                <div key={area} className="r-area-tag-item">
                  <FiMapPin /> {area}, OH
                </div>
              ))}
            </div>
            <p className="r-concept-note-small">Fictional service area details for demo portfolio</p>
          </div>
          <div className="r-area-map-pane">
            <RoofingMap />
          </div>
        </div>
      </div>
    </section>
  )
}

function EstimateSection() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    zipCode: '',
    serviceNeeded: '',
    message: '',
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
    if (!form.firstName.trim()) next.firstName = 'First name is required.'
    if (!form.lastName.trim()) next.lastName = 'Last name is required.'
    if (!form.phone.trim()) next.phone = 'Phone number is required.'
    if (!form.email.trim()) next.email = 'Email address is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Enter a valid email address.'
    if (!form.zipCode.trim()) next.zipCode = 'ZIP code is required.'
    else if (!/^\d{5}$/.test(form.zipCode)) next.zipCode = 'ZIP code must be 5 digits.'
    if (!form.serviceNeeded) next.serviceNeeded = 'Please select a service.'
    
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
    setForm({ firstName: '', lastName: '', phone: '', email: '', zipCode: '', serviceNeeded: '', message: '' })
    setErrors({})
  }

  return (
    <section id="contact" className="r-estimate">
      <div className="r-container">
        <div className="r-estimate-grid-modern">
          <div className="r-estimate-content-pane">
            <p className="r-label" style={{ color: 'var(--r-copper)' }}>Request Consultation</p>
            <h2>Your Roof Deserves Better Protection.</h2>
            <p className="r-lead" style={{ color: 'var(--r-slate)' }}>
              Tell us a little about your project and we\'ll help you take the next step. Our certified structural specialists review all requests within 24 hours.
            </p>
            
            <div className="r-estimate-phone-card">
              <div className="r-estimate-phone-card-icon">
                <FiPhone />
              </div>
              <div className="r-estimate-phone-card-text">
                <span>Call Directly for Emergency Tarps:</span>
                <a href="tel:5554820198">(555) 482-0198</a>
              </div>
            </div>
            
            <p className="r-concept-note-small" style={{ marginTop: '2rem' }}>
              Concept estimate request dashboard. Data is processed locally in browser.
            </p>
          </div>

          <div className="r-form-card-modern">
            <div className="r-form-card-header">
              <h3>Request a Free Estimate</h3>
              <p>No obligation. Your information is kept private.</p>
            </div>
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  className="r-form-success-modern"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="r-success-checkmark">
                    <FiCheckCircle />
                  </div>
                  <h3>Thanks — your request has been received.</h3>
                  <p>
                    A Ridgeline Roofing specialist will review your details and reach out within one business day.
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
                    <div className="r-form-error-banner-modern" role="alert">
                      Please correct the validation errors in the fields below.
                    </div>
                  )}
                  
                  <div className="r-field-row-modern">
                    <div className="r-field-modern">
                      <label htmlFor="r-firstName">First Name</label>
                      <input
                        id="r-firstName"
                        value={form.firstName}
                        onChange={(e) => update('firstName', e.target.value)}
                        className={errors.firstName ? 'is-error' : ''}
                        placeholder="John"
                        autoComplete="given-name"
                      />
                      {errors.firstName && <p className="r-field-error">{errors.firstName}</p>}
                    </div>
                    <div className="r-field-modern">
                      <label htmlFor="r-lastName">Last Name</label>
                      <input
                        id="r-lastName"
                        value={form.lastName}
                        onChange={(e) => update('lastName', e.target.value)}
                        className={errors.lastName ? 'is-error' : ''}
                        placeholder="Doe"
                        autoComplete="family-name"
                      />
                      {errors.lastName && <p className="r-field-error">{errors.lastName}</p>}
                    </div>
                  </div>

                  <div className="r-field-row-modern">
                    <div className="r-field-modern">
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
                    <div className="r-field-modern">
                      <label htmlFor="r-email">Email Address</label>
                      <input
                        id="r-email"
                        type="email"
                        value={form.email}
                        onChange={(e) => update('email', e.target.value)}
                        className={errors.email ? 'is-error' : ''}
                        placeholder="john@example.com"
                        autoComplete="email"
                      />
                      {errors.email && <p className="r-field-error">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="r-field-row-modern">
                    <div className="r-field-modern">
                      <label htmlFor="r-zipCode">ZIP Code</label>
                      <input
                        id="r-zipCode"
                        value={form.zipCode}
                        onChange={(e) => update('zipCode', e.target.value)}
                        className={errors.zipCode ? 'is-error' : ''}
                        placeholder="43215"
                        autoComplete="postal-code"
                      />
                      {errors.zipCode && <p className="r-field-error">{errors.zipCode}</p>}
                    </div>
                    <div className="r-field-modern">
                      <label htmlFor="r-serviceNeeded">Service Needed</label>
                      <select
                        id="r-serviceNeeded"
                        value={form.serviceNeeded}
                        onChange={(e) => update('serviceNeeded', e.target.value)}
                        className={errors.serviceNeeded ? 'is-error' : ''}
                      >
                        <option value="">Select option</option>
                        {HELP_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                      </select>
                      {errors.serviceNeeded && <p className="r-field-error">{errors.serviceNeeded}</p>}
                    </div>
                  </div>

                  <div className="r-field-modern">
                    <label htmlFor="r-message">Message (Optional)</label>
                    <textarea
                      id="r-message"
                      rows={3}
                      value={form.message}
                      onChange={(e) => update('message', e.target.value)}
                      placeholder="Describe your roof age, leak concerns, or project timeline..."
                    />
                  </div>

                  <button type="submit" className="r-btn r-btn-primary r-btn-arrow r-btn-block">
                    Request My Free Estimate <FiArrowRight aria-hidden="true" />
                  </button>
                  <p className="r-form-disclaimer">
                    No obligation. Your information is kept private. We reply within 24 hours.
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
        <div className="r-footer-grid-modern">
          <div className="r-footer-brand-column">
            <strong>RIDGELINE ROOFING</strong>
            <p className="r-footer-tagline">Roofing Built to Protect What Matters.</p>
            <p className="r-footer-description">
              Premium residential roofing, inspections, storm damage diagnostics, and seamless gutters for Central Ohio. Licensed, insured, and locally operated.
            </p>
            <p className="r-concept-note-footer">Fictional contractor concept representation</p>
          </div>
          <div className="r-footer-links-column">
            <h4>Quick Links</h4>
            <nav className="r-footer-nav" aria-label="Footer Quick Links">
              {link('top', 'Home')}
              {link('services', 'Services')}
              {link('our-work', 'Our Work')}
              {link('why', 'Why Ridgeline')}
              {link('reviews', 'Reviews')}
              {link('contact', 'Contact')}
            </nav>
          </div>
          <div className="r-footer-links-column">
            <h4>Our Services</h4>
            <nav className="r-footer-nav" aria-label="Footer Services Links">
              <a href="#services" onClick={(e) => { e.preventDefault(); scrollTo('services') }}>Roof Replacement</a>
              <a href="#services" onClick={(e) => { e.preventDefault(); scrollTo('services') }}>Roof Repair</a>
              <a href="#services" onClick={(e) => { e.preventDefault(); scrollTo('services') }}>Storm Damage Restoration</a>
              <a href="#services" onClick={(e) => { e.preventDefault(); scrollTo('services') }}>Roof Inspections</a>
              <a href="#services" onClick={(e) => { e.preventDefault(); scrollTo('services') }}>Shingle &amp; Metal Systems</a>
            </nav>
          </div>
          <div className="r-footer-links-column">
            <h4>Contact Details</h4>
            <div className="r-footer-contact-info">
              <p><strong>Phone:</strong> <a href="tel:5554820198">(555) 482-0198</a></p>
              <p><strong>Email:</strong> <a href="mailto:hello@ridgelineroofing.example">hello@ridgelineroofing.example</a></p>
              <p><strong>Office Hours:</strong> Mon - Sat: 7AM - 6PM</p>
              <p>Columbus, OH</p>
            </div>
          </div>
        </div>
        <div className="r-footer-bottom-modern">
          <span>Concept Website by Craftivo</span>
          <a href="/" onClick={(e) => { e.preventDefault(); pushPath('/') }}>← Back to Craftivo Portfolio</a>
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
          slogan: 'Roofing Built to Protect What Matters.',
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
        <ServicesSection />
        <FeaturedWorkSection />
        <BeforeAfterSection />
        <WhySection />
        <ProcessSection />
        <StormSection onEstimate={estimate} />
        <ReviewsSection />
        <ServiceAreaSection />
        <EstimateSection />
      </main>
      <RoofingFooter />
      <div className="r-mobile-cta-sticky">
        <a href="tel:5554820198" className="r-mobile-btn-navy">Call Now</a>
        <button type="button" className="r-mobile-btn-primary" onClick={estimate}>Free Estimate</button>
      </div>
    </div>
  )
}
