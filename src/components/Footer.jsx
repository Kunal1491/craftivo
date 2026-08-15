import { FiArrowUpRight, FiInstagram, FiLinkedin, FiTwitter } from 'react-icons/fi'

function Footer() {
  return <footer className="site-footer">
    <div className="container"><div className="footer-top"><a className="brand footer-brand" href="#top"><span className="brand-mark" aria-hidden="true"><span /></span><span>craftivo<span className="brand-dot">.</span></span></a><p>Better digital experiences<br />for ambitious businesses.</p><a className="footer-back" href="#top">Back to top <FiArrowUpRight /></a></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Craftivo</span><div className="footer-links"><a href="#services">Services</a><a href="#work">Work</a><a href="#contact">Contact</a></div>
    <div className="social-links">
      {/* <a href="https://www.linkedin.com" aria-label="LinkedIn" target="_blank" rel="noreferrer"> */}
      {/* <FiLinkedin /></a> */}
      {/* <a href="https://www.instagram.com" aria-label="Instagram" target="_blank" rel="noreferrer"> */}
      {/* <FiInstagram /></a> */}
      {/* <a href="https://twitter.com" aria-label="Twitter" target="_blank" rel="noreferrer"> */}
      {/* <FiTwitter /></a> */}
    </div></div>
    </div>
    </footer>
}

export default Footer
