import { FiAperture, FiArrowUpRight, FiClock, FiCode, FiHeart, FiLock, FiTrendingUp } from 'react-icons/fi'

const advantages = [
  { icon: FiClock, title: 'Fast delivery', text: 'Focused sprints, clear milestones, no mysterious timelines.' },
  { icon: FiHeart, title: 'Premium UI', text: 'The small details that make a big difference to your users.' },
  { icon: FiTrendingUp, title: 'SEO optimized', text: 'Beautiful experiences that are built to be discovered.' },
  { icon: FiAperture, title: 'AI powered', text: 'Smart systems that give your business room to grow.' },
  { icon: FiLock, title: 'Secure by default', text: 'Reliable foundations you can build your future on.' },
  { icon: FiCode, title: 'Long-term support', text: 'A partner who stays close long after launch day.' },
]

function WhyCraftivo() {
  return <section className="section why-section" id="why-craftivo"><div className="container why-layout"><div className="why-heading"><p className="section-kicker">The Craftivo difference</p><h2>More than a<br /><em>service provider.</em></h2><p>Good work is a given. The way we work is what makes the difference: clear thinking, high standards, and a genuine interest in where you&apos;re going.</p><a className="button button-dark" href="#contact">Meet your new digital team <FiArrowUpRight /></a></div><div className="advantage-grid">{advantages.map(({ icon: Icon, title, text }) => <div className="advantage" key={title}><span><Icon /></span><div><h3>{title}</h3><p>{text}</p></div></div>)}</div></div></section>
}

export default WhyCraftivo
