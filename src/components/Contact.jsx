import { useState } from 'react'
import { FiArrowUpRight, FiCheck, FiLinkedin, FiMail, FiMapPin } from 'react-icons/fi'

function Contact() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()
    setSubmitted(true)
  }

  return <section className="contact-section" id="contact"><div className="container contact-layout"><div className="contact-copy"><p className="section-kicker">Start a conversation</p><h2>Have a good<br /><em>feeling about this?</em></h2><p>Tell us a little about what you&apos;re building. We&apos;ll get back to you within two business days.</p><div className="contact-details"><a href="mailto:hello@craftivo.co"><FiMail /><span><small>Email us</small>hello@craftivo.co</span></a><a href="https://www.linkedin.com" target="_blank" rel="noreferrer"><FiLinkedin /><span><small>Connect on LinkedIn</small>Craftivo Studio</span></a><div><FiMapPin /><span><small>Based in</small>Remote-first agency, serving clients across the US & worldwide</span></div></div></div><form className="contact-form" onSubmit={handleSubmit}><div className="form-row"><label>Name<input name="name" type="text" placeholder="Your name" required /></label><label>Email<input name="email" type="email" placeholder="you@company.com" required /></label></div><label>Company<input name="company" type="text" placeholder="Your company" /></label><label>Project details<textarea name="details" rows="5" placeholder="Tell us about your goals, timeline, and anything else on your mind..." required /></label><button className="button button-primary form-submit" type="submit">{submitted ? <>Message sent <FiCheck /></> : <>Send inquiry <FiArrowUpRight /></>}</button>{submitted && <p className="form-success" role="status">Thanks for reaching out. We&apos;ll be in touch soon.</p>}</form></div></section>
}

export default Contact
