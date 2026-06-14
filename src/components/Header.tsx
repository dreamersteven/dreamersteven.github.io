import { useEffect, useState } from 'react';

const navItems = [
  ['About', '#about'],
  ['Expertise', '#expertise'],
  ['Experience', '#experience'],
  ['Projects', '#projects'],
  ['Education', '#education'],
  ['Contact', '#contact'],
] as const;

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const updateNav = () => {
      setIsScrolled(window.scrollY > 16);

      let current = '';
      document.querySelectorAll<HTMLElement>('section[id], div[id]').forEach((section) => {
        if (window.scrollY >= section.offsetTop - 100) {
          current = section.id;
        }
      });
      setActiveSection(current);
    };

    window.addEventListener('scroll', updateNav, { passive: true });
    updateNav();

    return () => window.removeEventListener('scroll', updateNav);
  }, []);

  const closeMenu = () => setIsOpen(false);

  return (
    <header role="banner">
      <nav id="navbar" className={isScrolled ? 'scrolled' : undefined} aria-label="Main navigation">
        <div className="nav-inner">
          <a href="#hero" className="nav-logo" aria-label="Home" onClick={closeMenu}>
            HL
          </a>
          <ul className="nav-links" role="list">
            {navItems.map(([label, href]) => (
              <li key={href}>
                <a className={activeSection === href.slice(1) ? 'active' : undefined} href={href}>
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <button
            className="nav-toggle"
            type="button"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
            onClick={() => setIsOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
        <div className={`nav-mobile${isOpen ? ' open' : ''}`}>
          <ul role="list">
            {navItems.map(([label, href]) => (
              <li key={href}>
                <a href={href} onClick={closeMenu}>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}
