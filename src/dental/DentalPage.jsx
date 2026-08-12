import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import DentalMap from './DentalMap'
import './dental.css'

const IMG = {
  hero: '/images/dental/hero.jpg',
  care: '/images/dental/care.jpg',
  technology: '/images/dental/technology.jpg',
  patient: '/images/dental/patient.jpg',
  doctor: '/images/dental/doctor.jpg',
  clinic: '/images/dental/clinic.jpg',
}

const SERVICES = [
  { num: '01', title: 'General Dentistry', text: 'Preventive care for lifelong oral health.', image: IMG.care },
  { num: '02', title: 'Cosmetic Dentistry', text: 'Natural-looking smile enhancement.', image: IMG.patient },
  { num: '03', title: 'Dental Implants', text: 'Modern tooth replacement solutions.', image: IMG.technology },
  { num: '04', title: 'Invisalign', text: 'Clear orthodontic treatment.', image: IMG.clinic },
  { num: '05', title: 'Emergency Dentistry', text: 'Prompt care when you need it.', image: IMG.hero },
  { num: '06', title: 'Teeth Whitening', text: 'Professional smile brightening.', image: IMG.care },
]

const VISIT_REASONS = [
  'New patient visit',
  'Cleaning',
  'Cosmetic consultation',
  'Invisalign',
  'Dental implants',
  'Emergency',
  'Something else',
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

function DentalNav({ onBook }) {
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
    <header className={`d-nav${scrolled ? ' is-scrolled' : ''}`} id="top">
      <div className="d-container d-nav-inner">
        <a className="d-brand" href="#top" onClick={(e) => { e.preventDefault(); scrollTo('top') }}>
          BrightSmile Dental
        </a>
        <nav className="d-nav-links" aria-label="Primary">
          {link('top', 'Home')}
          {link('care', 'Care')}
          {link('approach', 'Our Approach')}
          {link('about', 'About')}
          {link('contact', 'Contact')}
        </nav>
        <div className="d-nav-actions">
          <a className="d-nav-phone" href="tel:5551234567">(555) 123-4567</a>
          <button type="button" className="d-btn d-btn-primary" onClick={onBook}>Book a Visit</button>
        </div>
        <button
          type="button"
          className="d-nav-toggle"
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          <span /><span /><span />
        </button>
      </div>
      {open && (
        <div className="d-nav-mobile">
          {link('top', 'Home')}
          {link('care', 'Care')}
          {link('approach', 'Our Approach')}
          {link('about', 'About')}
          {link('contact', 'Contact')}
          <a href="tel:5551234567">(555) 123-4567</a>
          <button type="button" className="d-btn d-btn-primary" onClick={() => { setOpen(false); onBook() }}>
            Book a Visit
          </button>
        </div>
      )}
    </header>
  )
}

function Hero({ onBook }) {
  return (
    <section className="d-hero">
      <div className="d-container">
        <motion.p
          className="d-label d-label-meta"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          CRAFTIVO / CONCEPT PROJECT 01
        </motion.p>
        <motion.p
          className="d-label"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
        >
          MODERN DENTISTRY · AUSTIN, TEXAS
        </motion.p>
        <div className="d-hero-layout">
          <div className="d-hero-copy">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              A better dental experience starts with feeling heard.
            </motion.h1>
            <motion.p
              className="d-lead"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.18 }}
            >
              Personalized dental care, modern technology and a calmer approach — designed around you.
            </motion.p>
            <motion.div
              className="d-hero-actions"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.26 }}
            >
              <button type="button" className="d-btn d-btn-primary d-btn-arrow" onClick={onBook}>
                Book a Visit <span aria-hidden="true">↗</span>
              </button>
              <a
                href="#care"
                className="d-text-link"
                onClick={(e) => { e.preventDefault(); scrollTo('care') }}
              >
                Explore Care
              </a>
            </motion.div>
            <motion.div
              className="d-trust-line"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.34 }}
            >
              <span className="d-stars" aria-label="5 out of 5 stars">★★★★★</span>
              <strong>4.9/5 patient experience</strong>
              <span className="d-trust-note">Sample metric · Concept Project</span>
              <span className="d-trust-divider" aria-hidden="true">·</span>
              <span>10+ years · 5,000+ visits</span>
            </motion.div>
          </div>
          <motion.div
            className="d-hero-visual"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15 }}
          >
            <div className="d-hero-image-main">
              <img src={IMG.hero} alt="Dentist consulting with a patient in a calm, modern clinic" loading="eager" />
            </div>
            <div className="d-hero-image-accent" aria-hidden="true">
              <img src={IMG.patient} alt="" loading="eager" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function ApproachSection() {
  const principles = [
    { num: '01', title: 'Listen first', text: 'Every visit begins with understanding your concerns, not rushing to treatment.' },
    { num: '02', title: 'Explain clearly', text: 'We walk you through options in plain language so you can decide with confidence.' },
    { num: '03', title: 'Treat thoughtfully', text: 'Care plans are tailored to your goals, comfort and long-term oral health.' },
  ]

  return (
    <section id="approach" className="d-approach">
      <div className="d-container d-approach-inner">
        <p className="d-label">OUR APPROACH</p>
        <h2>Modern dentistry.<br />A more human experience.</h2>
        <p className="d-body-narrow">
          We combine thoughtful care, modern technology and clear communication to make every visit feel simpler and more comfortable.
        </p>
        <div className="d-principles">
          {principles.map((p) => (
            <div key={p.num} className="d-principle">
              <span className="d-principle-num">{p.num}</span>
              <div>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ServicesSection() {
  const [active, setActive] = useState(null)
  const [expanded, setExpanded] = useState(null)

  return (
    <section id="care" className="d-services">
      <div className="d-container">
        <h2>Care for every stage of your smile.</h2>
        <div className="d-service-list">
          {SERVICES.map((s) => (
            <div
              key={s.num}
              className={`d-service-row${expanded === s.num ? ' is-open' : ''}`}
              onMouseEnter={() => setActive(s.num)}
              onMouseLeave={() => setActive(null)}
            >
              <button
                type="button"
                className="d-service-row-head"
                aria-expanded={expanded === s.num}
                onClick={() => setExpanded(expanded === s.num ? null : s.num)}
              >
                <span className="d-service-num">{s.num}</span>
                <span className="d-service-title">{s.title}</span>
                <span className="d-service-desc">{s.text}</span>
                <span className="d-service-arrow" aria-hidden="true">→</span>
              </button>
              <div className="d-service-mobile-detail">
                <p>{s.text}</p>
              </div>
              <div className={`d-service-preview${active === s.num ? ' is-visible' : ''}`} aria-hidden="true">
                <img src={s.image} alt="" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FeaturedCare() {
  return (
    <section className="d-featured">
      <div className="d-container d-featured-grid">
        <div className="d-featured-media">
          <img src={IMG.care} alt="Dentist and patient during a preventive care visit" loading="lazy" />
        </div>
        <div className="d-featured-copy">
          <p className="d-label">GENERAL DENTISTRY</p>
          <h2>Healthy smiles are built over time.</h2>
          <p className="d-body-narrow">
            Preventive care, digital diagnostics and personalized guidance — so small steps today protect your smile for years to come.
          </p>
          <ul className="d-benefit-list">
            <li>Digital diagnostics</li>
            <li>Preventive care</li>
            <li>Personalized treatment</li>
          </ul>
          <a href="#care" className="d-text-link d-text-link-arrow" onClick={(e) => { e.preventDefault(); scrollTo('care') }}>
            Explore General Dentistry <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </section>
  )
}

function TechnologySection() {
  return (
    <section className="d-technology">
      <div className="d-container d-technology-grid">
        <div className="d-technology-copy">
          <h2>Precision when it matters. Comfort throughout.</h2>
          <div className="d-tech-labels">
            <span>DIGITAL IMAGING</span>
            <span>ADVANCED DIAGNOSTICS</span>
            <span>PERSONALIZED PLANNING</span>
          </div>
        </div>
        <div className="d-technology-media">
          <img src={IMG.technology} alt="Modern dental imaging and diagnostic technology" loading="lazy" />
        </div>
      </div>
    </section>
  )
}

function PatientExperience() {
  const steps = [
    { num: '01', title: 'Listen', text: 'Share your concerns and goals in a conversation that never feels rushed.' },
    { num: '02', title: 'Plan', text: 'Review a clear treatment plan with visuals and honest recommendations.' },
    { num: '03', title: 'Care', text: 'Receive personalized treatment in a calm, comfortable environment.' },
  ]

  return (
    <section className="d-visit">
      <div className="d-container d-visit-grid">
        <div className="d-visit-copy">
          <h2>Your visit, reimagined.</h2>
          <div className="d-timeline">
            {steps.map((s) => (
              <div key={s.num} className="d-timeline-step">
                <span className="d-timeline-num">{s.num}</span>
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="d-visit-media">
          <img src={IMG.clinic} alt="Bright, welcoming dental clinic interior" loading="lazy" />
        </div>
      </div>
    </section>
  )
}

function ComfortSection() {
  return (
    <section className="d-comfort">
      <div className="d-container d-comfort-grid">
        <div className="d-comfort-copy">
          <h2>Dentistry can feel different.</h2>
          <p className="d-body-narrow">
            From your first conversation to your treatment plan, every step is designed to help you feel informed, comfortable and confident.
          </p>
        </div>
        <div className="d-comfort-media">
          <img src={IMG.patient} alt="Patient and dentist in a warm, reassuring consultation" loading="lazy" />
        </div>
      </div>
    </section>
  )
}

function DoctorSection() {
  return (
    <section id="about" className="d-doctor">
      <div className="d-container d-doctor-grid">
        <div className="d-doctor-photo">
          <img src={IMG.doctor} alt="Portrait of Dr. Sarah Mitchell, DDS" loading="lazy" />
        </div>
        <div className="d-doctor-copy">
          <p className="d-label">YOUR CARE TEAM</p>
          <h2>Meet Dr. Sarah Mitchell.</h2>
          <p className="d-doctor-credential">DDS · General &amp; Cosmetic Dentistry</p>
          <p className="d-body-narrow">
            Dr. Mitchell brings a patient-first approach to modern dentistry — combining careful listening, clear communication and contemporary techniques to create visits that feel genuinely different.
          </p>
          <ul className="d-doctor-traits">
            <li>Patient-first</li>
            <li>Modern techniques</li>
            <li>Personalized care</li>
          </ul>
          <p className="d-concept-note">Concept profile · Craftivo</p>
        </div>
      </div>
    </section>
  )
}

function TestimonialSection() {
  return (
    <section className="d-testimonial">
      <div className="d-container d-testimonial-inner">
        <blockquote>
          <p>&ldquo;It was the first dental visit where I felt like someone actually slowed down and listened.&rdquo;</p>
          <footer>
            <cite>Emily R.</cite>
            <span>General Dentistry</span>
            <span className="d-stars" aria-label="5 out of 5 stars">★★★★★</span>
          </footer>
        </blockquote>
        <p className="d-concept-note">Sample testimonial · Concept Project</p>
      </div>
    </section>
  )
}

function LocationSection() {
  return (
    <section id="contact" className="d-location">
      <div className="d-container d-location-grid">
        <div className="d-location-copy">
          <h2>Find your dental home in Austin.</h2>
          <address>
            123 Main Street<br />
            Austin, TX 78701
          </address>
          <p><a href="tel:5551234567">(555) 123-4567</a></p>
          <div className="d-hours">
            <span>Mon–Fri</span>
            <span>8:00 AM–5:00 PM</span>
          </div>
          <p className="d-concept-note">Fictional location · Concept Project</p>
        </div>
        <DentalMap />
      </div>
    </section>
  )
}

function AppointmentSection() {
  const [step, setStep] = useState(1)
  const [done, setDone] = useState(false)
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    reason: '',
    email: '',
    phone: '',
    date: '',
    time: '',
  })

  const update = useCallback((key, value) => {
    setForm((f) => ({ ...f, [key]: value }))
  }, [])

  const canContinue1 = form.firstName.trim() && form.lastName.trim()
  const canContinue2 = Boolean(form.reason)
  const canSubmit = form.email.trim() && form.phone.trim()

  function handleSubmit(e) {
    e.preventDefault()
    setDone(true)
  }

  function reset() {
    setDone(false)
    setStep(1)
    setForm({ firstName: '', lastName: '', reason: '', email: '', phone: '', date: '', time: '' })
  }

  const stepVariants = {
    enter: { opacity: 0, x: 24 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -24 },
  }

  return (
    <section id="appointment" className="d-appointment">
      <div className="d-container d-appointment-grid">
        <div className="d-appointment-message">
          <p className="d-label">APPOINTMENTS</p>
          <h2>Schedule a visit that fits your life.</h2>
          <p className="d-body-narrow">
            A calm, guided booking experience — designed the way your patients should feel when they walk through the door.
          </p>
          <div className="d-appointment-aside">
            <p><a href="tel:5551234567">(555) 123-4567</a></p>
            <p>Mon–Fri · 8:00 AM–5:00 PM</p>
          </div>
        </div>

        <div className="d-booking-panel">
          <AnimatePresence mode="wait">
            {done ? (
              <motion.div
                key="success"
                className="d-booking-success"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <div className="d-success-icon" aria-hidden="true">✓</div>
                <h3>You&apos;re all set.</h3>
                <p>Thanks for reaching out.</p>
                <p className="d-body-small">
                  This is a demonstration of the appointment experience Craftivo can create for a dental practice.
                </p>
                <p className="d-body-small"><strong>No patient data was submitted.</strong></p>
                <button type="button" className="d-btn d-btn-primary" onClick={reset}>Back to Website</button>
              </motion.div>
            ) : (
              <motion.form
                key={step}
                className="d-booking-form"
                onSubmit={step === 3 ? handleSubmit : (e) => e.preventDefault()}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="d-step-indicator">{String(step).padStart(2, '0')} / 03</p>

                {step === 1 && (
                  <>
                    <h3>Let&apos;s start with you.</h3>
                    <div className="d-field">
                      <label htmlFor="firstName">First name</label>
                      <input
                        id="firstName"
                        value={form.firstName}
                        onChange={(e) => update('firstName', e.target.value)}
                        autoComplete="given-name"
                        required
                      />
                    </div>
                    <div className="d-field">
                      <label htmlFor="lastName">Last name</label>
                      <input
                        id="lastName"
                        value={form.lastName}
                        onChange={(e) => update('lastName', e.target.value)}
                        autoComplete="family-name"
                        required
                      />
                    </div>
                    <button
                      type="button"
                      className="d-btn d-btn-primary d-btn-arrow"
                      disabled={!canContinue1}
                      onClick={() => setStep(2)}
                    >
                      Continue <span aria-hidden="true">→</span>
                    </button>
                  </>
                )}

                {step === 2 && (
                  <>
                    <h3>What can we help with?</h3>
                    <div className="d-reason-grid" role="group" aria-label="Visit reason">
                      {VISIT_REASONS.map((r) => (
                        <button
                          key={r}
                          type="button"
                          className={`d-reason-option${form.reason === r ? ' is-selected' : ''}`}
                          aria-pressed={form.reason === r}
                          onClick={() => update('reason', r)}
                        >
                          {form.reason === r && <span className="d-reason-check" aria-hidden="true">✓</span>}
                          {r}
                        </button>
                      ))}
                    </div>
                    <div className="d-booking-nav">
                      <button type="button" className="d-text-link" onClick={() => setStep(1)}>← Back</button>
                      <button
                        type="button"
                        className="d-btn d-btn-primary d-btn-arrow"
                        disabled={!canContinue2}
                        onClick={() => setStep(3)}
                      >
                        Continue <span aria-hidden="true">→</span>
                      </button>
                    </div>
                  </>
                )}

                {step === 3 && (
                  <>
                    <h3>How can we reach you?</h3>
                    <div className="d-field">
                      <label htmlFor="email">Email</label>
                      <input
                        id="email"
                        type="email"
                        value={form.email}
                        onChange={(e) => update('email', e.target.value)}
                        autoComplete="email"
                        required
                      />
                    </div>
                    <div className="d-field">
                      <label htmlFor="phone">Phone</label>
                      <input
                        id="phone"
                        type="tel"
                        value={form.phone}
                        onChange={(e) => update('phone', e.target.value)}
                        autoComplete="tel"
                        required
                      />
                    </div>
                    <div className="d-field-row">
                      <div className="d-field">
                        <label htmlFor="date">Preferred date</label>
                        <input
                          id="date"
                          type="date"
                          value={form.date}
                          onChange={(e) => update('date', e.target.value)}
                        />
                      </div>
                      <div className="d-field">
                        <label htmlFor="time">Preferred time</label>
                        <input
                          id="time"
                          type="time"
                          value={form.time}
                          onChange={(e) => update('time', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="d-booking-nav">
                      <button type="button" className="d-text-link" onClick={() => setStep(2)}>← Back</button>
                      <button
                        type="submit"
                        className="d-btn d-btn-primary d-btn-arrow"
                        disabled={!canSubmit}
                      >
                        Request Appointment <span aria-hidden="true">→</span>
                      </button>
                    </div>
                    <p className="d-demo-note">Demo interaction · No patient information is submitted.</p>
                  </>
                )}
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

function DentalFooter() {
  return (
    <footer className="d-footer">
      <div className="d-container d-footer-inner">
        <div>
          <strong>BrightSmile Dental</strong>
          <p>Modern dental care for healthier, more confident smiles.</p>
        </div>
        <div className="d-footer-links">
          <a href="/" onClick={(e) => { e.preventDefault(); pushPath('/') }}>← Back to Craftivo</a>
          <span className="d-concept-note">Concept Project · Craftivo</span>
        </div>
      </div>
    </footer>
  )
}

export default function DentalPage() {
  const book = useCallback(() => scrollTo('appointment'), [])

  useEffect(() => {
    document.title = 'BrightSmile Dental | Modern Dental Care in Austin, TX'
    const desc = document.querySelector('meta[name="description"]')
    if (desc) {
      desc.setAttribute(
        'content',
        'A premium dental practice concept offering personalized preventive, cosmetic and restorative care in Austin, Texas.',
      )
    }
    if (window.location.hash === '#appointment') {
      setTimeout(() => scrollTo('appointment'), 300)
    }
  }, [])

  return (
    <div className="d-page">
      <DentalNav onBook={book} />
      <main>
        <Hero onBook={book} />
        <ApproachSection />
        <ServicesSection />
        <FeaturedCare />
        <TechnologySection />
        <PatientExperience />
        <ComfortSection />
        <DoctorSection />
        <TestimonialSection />
        <LocationSection />
        <AppointmentSection />
      </main>
      <DentalFooter />
      <div className="d-mobile-cta">
        <button type="button" className="d-btn d-btn-primary d-btn-block" onClick={book}>
          Book a Visit
        </button>
      </div>
    </div>
  )
}
