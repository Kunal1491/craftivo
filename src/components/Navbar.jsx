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

  return (
    <header className="site-header">
      <nav className="nav-shell" aria-label="Main navigation">
        <a className="brand" href="#top" onClick={closeMenu} aria-label="Craftivo home">
          <span className="brand-mark" aria-hidden="true"><span /></span>
          <span>craftivo<span className="brand-dot">.</span></span>
        </a>

        <div className="desktop-nav-links">
          {links.map((link) => <a key={link.href} href={link.href}>{link.label}</a>)}
        </div>

        <a className="nav-cta" href="#contact">Start a project <FiArrowUpRight aria-hidden="true" /></a>
        <button className="menu-toggle" type="button" onClick={() => setIsOpen(!isOpen)} aria-label={isOpen ? 'Close menu' : 'Open menu'} aria-expanded={isOpen}>
          {isOpen ? <FiX /> : <FiMenu />}
        </button>

        {isOpen && (
          <div className="mobile-menu">
            {links.map((link) => <a key={link.href} href={link.href} onClick={closeMenu}>{link.label}</a>)}
            <a className="mobile-menu-cta" href="#contact" onClick={closeMenu}>Start a project <FiArrowUpRight /></a>
          </div>
        )}
      </nav>
    </header>
  )
}

export default Navbar
