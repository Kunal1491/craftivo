import { FiAperture, FiArrowUpRight, FiClock, FiCode, FiHeadphones, FiHeart, FiLock, FiMessageSquare, FiMonitor, FiRefreshCw, FiTrendingUp } from 'react-icons/fi'

const trustPoints = [
  { icon: FiMessageSquare, title: 'Direct Communication', text: 'Work directly with the people building your website — no unnecessary layers.' },
  { icon: FiMonitor, title: 'Modern, Conversion-Focused Design', text: 'Websites designed to look professional, work smoothly, and turn visitors into customers.' },
  { icon: FiRefreshCw, title: 'Transparent Process', text: 'Clear communication, straightforward scope, and no confusing surprises.' },
  { icon: FiHeadphones, title: 'Post-Launch Support', text: 'We stay available after launch for updates, improvements, and ongoing website support.' },
]

const advantages = [
  { icon: FiClock, title: 'Fast delivery', text: 'Focused sprints, clear milestones, no mysterious timelines.' },
  { icon: FiHeart, title: 'Premium UI', text: 'The small details that make a big difference to your users.' },
  { icon: FiTrendingUp, title: 'SEO optimized', text: 'Beautiful experiences that are built to be discovered.' },
  { icon: FiAperture, title: 'AI powered', text: 'Smart systems that give your business room to grow.' },
  { icon: FiLock, title: 'Secure by default', text: 'Reliable foundations you can build your future on.' },
  { icon: FiCode, title: 'Long-term support', text: 'A partner who stays close long after launch day.' },
]

function WhyCraftivo() {
  return <section className="section why-section" id="why-craftivo"><div className="container why-layout"><div className="why-heading"><p className="section-kicker">The Craftivo difference</p><h2>More than a<br /><em>service provider.</em></h2><p>Good work is a given. The way we work is what makes the difference: clear thinking, high standards, and a genuine interest in where you&apos;re going.</p><a className="button button-dark" href="#contact">Meet your new digital team <FiArrowUpRight /></a></div><div className="why-right"><div className="trust-block"><p className="section-kicker">Why Businesses Choose Craftivo</p><div className="trust-grid">{trustPoints.map(({ icon: Icon, title, text }) => <div className="trust-card" key={title}><span className="trust-icon" aria-hidden="true"><Icon /></span><div><h3>{title}</h3><p>{text}</p></div></div>)}</div></div><div className="feature-block"><div className="feature-divider" /><p className="section-kicker">What you can expect</p><div className="feature-grid">{advantages.map(({ icon: Icon, title, text }) => <div className="feature-item" key={title}><span><Icon /></span><div><h3>{title}</h3><p>{text}</p></div></div>)}</div></div></div></div></section>
}

export default WhyCraftivo
