import { useState, useRef } from 'react'
import { FiArrowUpRight, FiCheck, FiLinkedin, FiMail, FiMapPin } from 'react-icons/fi'
import { supabase } from "../lib/supabase";

function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const formRef = useRef(null)
  // const handleSubmit = (event) => {
  //   event.preventDefault()
  //   setSubmitted(true)
  // }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setSubmitted(false)
    setErrorMessage("")

    const form = e.currentTarget
    const formData = new FormData(form)

    const { error } = await supabase
      .from("inquiries")
      .insert([
        {
          name: formData.get("name"),
          email: formData.get("email"),
          company: formData.get("company"),
          project_details: formData.get("details"),
        },
      ])

    if (error) {
      console.error("Supabase error:", error)
      setErrorMessage("Something went wrong. Please try again.")
      return
    }

    // Clear all form fields
    form.reset()

    // Show success message
    setSubmitted(true)
  }

  return <section className="contact-section" id="contact">
    <div className="container contact-layout">
      <div className="contact-copy">
        <p className="section-kicker">Start a conversation</p>
        <h2>
          Is Your Digital Presence
          <br />
          <em>Holding Your Business Back?</em>
        </h2>        <p>Get a free website review and discover the most important improvements your business website could make.</p>
        <div className="contact-cta"><a className="button button-quiet" href="mailto:hello@craftivolabs.com">Let&apos;s Talk</a></div><div className="contact-details">
          <a href="mailto:hello@craftivolabs.com"><FiMail />
            <span><small>Email us</small>hello@craftivolabs.com</span></a>
          <a href="https://www.linkedin.com" target="_blank" rel="noreferrer"><FiLinkedin />
            <span><small>Connect on LinkedIn</small>Craftivo </span></a>
          <div><FiMapPin /><span><small>Based in</small>Remote-first agency, serving clients across the US & worldwide</span></div></div></div><form className="contact-form" onSubmit={handleSubmit}><div className="form-row"><label>Name<input name="name" type="text" placeholder="Your name" required /></label><label>Email<input name="email" type="email" placeholder="you@company.com" required /></label></div><label>Company<input name="company" type="text" placeholder="Your company" /></label><label>Project details<textarea name="details" rows="5" placeholder="Tell us about your goals, timeline, and anything else on your mind..." required /></label><button className="button button-primary form-submit" type="submit">{submitted ? <>Message sent <FiCheck /></> : <>Get a Free Website Review <FiArrowUpRight /></>}</button>{submitted && <p className="form-success" role="status">Thanks for reaching out. We&apos;ll be in touch soon.</p>}</form></div></section>
}

export default Contact
