import { FiArrowRight, FiPlay } from 'react-icons/fi'

function Hero() {
  return (
    <section className="hero-section" id="top">
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-glow hero-glow-one" aria-hidden="true" />
      <div className="hero-glow hero-glow-two" aria-hidden="true" />
      <div className="container hero-layout">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-pulse" /> Digital products, thoughtfully made</div>
          <h1>Build what your <span>business</span> deserves.</h1>
          <p className="hero-description">Craftivo partners with ambitious teams to turn bold ideas into high-performing websites, apps, and AI-powered experiences.</p>
          <div className="hero-actions">
            <a className="button button-primary" href="#contact">Let&apos;s work together <FiArrowRight aria-hidden="true" /></a>
            <a className="button button-quiet" href="#work"><span className="play-icon"><FiPlay aria-hidden="true" /></span> See our work</a>
          </div>
          <div className="hero-trust"><div className="avatar-stack" aria-hidden="true"><span>J</span><span>M</span><span>A</span><span>+</span></div><span>Trusted by founders &amp; growing teams</span></div>
        </div>

        <div className="hero-art" aria-label="Abstract preview of a Craftivo digital product" role="img">
          <div className="art-orbit art-orbit-one" />
          <div className="art-orbit art-orbit-two" />
          <div className="product-window">
            <div className="window-bar"><span /><span /><span /><small>craftivo / studio</small></div>
            <div className="window-content"><div className="mini-sidebar"><i /><i /><i /><i /></div><div className="mini-main"><div className="mini-heading"><span /><b /></div><div className="mini-chart"><div className="chart-line" /><div className="chart-dot dot-one" /><div className="chart-dot dot-two" /><div className="chart-dot dot-three" /></div><div className="mini-stats"><div /><div /><div /></div></div></div>
          </div>
          <div className="floating-note note-top"><span className="note-icon">✦</span><div><b>Thoughtfully</b><small>designed</small></div></div>
          <div className="floating-note note-bottom"><span className="note-check">✓</span><div><b>Launch ready</b><small>always on time</small></div></div>
        </div>
      </div>
      <div className="hero-bottom-line"><span>Scroll to explore</span><i /></div>
    </section>
  )
}

export default Hero
