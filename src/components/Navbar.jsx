import { useState } from 'react'
import { FiArrowUpRight, FiMenu, FiX } from 'react-icons/fi'

const links = [
  { label: 'Services', href: '#services' },
  { label: 'Work', href: '#work' },
  { label: 'Why Craftivo', href: '#why-craftivo' },
]

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const closeMenu = () => setIsOpen(false)

  const handleNavClick = (e, href) => {
    // Ensure in-page navigation scrolls smoothly and doesn't open a new tab
    if (href && href.startsWith('#')) {
      e.preventDefault()
      const id = href.slice(1)
      const el = document.getElementById(id)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
        // update hash without jumping
        history.replaceState(null, '', href)
      }
      closeMenu()
    }
  }

  return (
    <header className="site-header">
      <nav className="nav-shell" aria-label="Main navigation">
        <a className="brand" href="#top" onClick={closeMenu} aria-label="Craftivo home">
          <span className="brand-mark" aria-hidden="true"><span /></span>
          <span>craftivo<span className="brand-dot">.</span></span>
        </a>

        <div className="desktop-nav-links">
          {links.map((link) => <a key={link.href} href={link.href} onClick={(e) => handleNavClick(e, link.href)}>{link.label}</a>)}
        </div>

        <a className="nav-cta" href="#contact" onClick={(e) => handleNavClick(e, '#contact')}>Start a project <FiArrowUpRight aria-hidden="true" /></a>
        <button className="menu-toggle" type="button" onClick={() => setIsOpen(!isOpen)} aria-label={isOpen ? 'Close menu' : 'Open menu'} aria-expanded={isOpen}>
          {isOpen ? <FiX /> : <FiMenu />}
        </button>

        {isOpen && (
          <div className="mobile-menu">
            {links.map((link) => <a key={link.href} href={link.href} onClick={(e) => handleNavClick(e, link.href)}>{link.label}</a>)}
            <a className="mobile-menu-cta" href="#contact" onClick={(e) => handleNavClick(e, '#contact')}>Start a project <FiArrowUpRight /></a>
          </div>
        )}
      </nav>
    </header>
  )
}

export default Navbar
