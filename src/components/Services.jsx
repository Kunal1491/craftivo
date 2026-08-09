import { FiArrowUpRight, FiCpu, FiGlobe, FiLayout, FiSmartphone, FiStar } from 'react-icons/fi'

const services = [
  { number: '01', icon: FiLayout, title: 'Website development', text: 'Custom, responsive websites built to perform beautifully and turn visitors into customers.' },
  { number: '02', icon: FiGlobe, title: 'WordPress development', text: 'Flexible, SEO-friendly WordPress websites, landing pages, and tailored business experiences.' },
  { number: '03', icon: FiStar, title: 'Showit website design', text: 'Premium, conversion-focused Showit sites for businesses and personal brands ready to stand out.' },
  { number: '04', icon: FiSmartphone, title: 'Mobile app development', text: 'Modern cross-platform apps with intuitive experiences your customers enjoy using.' },
  { number: '05', icon: FiCpu, title: 'AI solutions', text: 'Practical AI integrations, tools, and automation that give your business more momentum.' },
]

function Services() {
  return (
    <section className="section services-section" id="services">
      <div className="container">
        <div className="section-heading split-heading"><div><p className="section-kicker">What we do</p><h2>Digital work with<br /><em>real momentum.</em></h2></div><p className="section-intro">From first sketch to final launch, we bring strategy, design, and technology into one focused team.</p></div>
        <div className="service-grid">
          {services.map(({ number, icon: Icon, title, text }) => (
            <article className="service-card" key={title}>
              <div className="card-top"><span className="service-number">{number}</span><span className="service-icon"><Icon /></span></div><h3>{title}</h3><p>{text}</p><a href="#contact" aria-label={`Learn more about ${title}`}><FiArrowUpRight /></a>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Services
