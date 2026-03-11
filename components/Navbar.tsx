'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasBlur, setHasBlur] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setHasBlur(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/sermons', label: 'Sermons' },
    { href: '/events', label: 'Events' },
    { href: '/media', label: 'Media' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Get Involved' },
  ];

  return (
    <nav
      style={{
        backgroundColor: `var(--bg-primary)`,
        borderBottom: `1px solid var(--border-subtle)`,
        position: 'sticky',
        top: 0,
        zIndex: 50,
        transition: 'all 0.3s ease',
        backdropFilter: hasBlur ? 'blur(10px)' : 'none',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '72px',
          }}
        >
          {/* Logo + Name */}
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              textDecoration: 'none',
              color: `var(--text-primary)`,
            }}
          >
            <Image
              src="/logo.png"
              alt="Citychurch Logo"
              width={40}
              height={40}
              style={{ objectFit: 'contain' }}
            />
            <div>
              <span
                style={{
                  fontWeight: 700,
                  fontSize: '1.125rem',
                  letterSpacing: '-0.025em',
                  display: 'block',
                }}
              >
                Citychurch
              </span>
              <span
                style={{
                  display: 'block',
                  fontSize: '0.6875rem',
                  color: `var(--text-muted)`,
                  fontStyle: 'italic',
                  letterSpacing: '0.02em',
                }}
              >
                ...for the heart of the city.
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div
            style={{
              display: 'none',
              gap: '2rem',
              alignItems: 'center',
            }}
            id="desktop-nav"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="nav-link"
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  textDecoration: 'none',
                  color: `var(--text-primary)`,
                  position: 'relative',
                  paddingBottom: '0.25rem',
                }}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="#donate"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.375rem',
                padding: '0.5rem 1.25rem',
                backgroundColor: 'var(--accent)',
                color: 'white',
                fontWeight: 600,
                fontSize: '0.8125rem',
                borderRadius: '6px',
                textDecoration: 'none',
                letterSpacing: '-0.01em',
                transition: 'opacity 0.2s ease',
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              Donate
            </a>
            <ThemeToggle />
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={toggleMenu}
            aria-label="Menu"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '5px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.5rem',
            }}
            id="hamburger-btn"
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{
                  width: '22px',
                  height: '2px',
                  backgroundColor: `var(--text-primary)`,
                  transition: 'all 0.3s ease',
                  display: 'block',
                  transform:
                    isOpen && i === 0
                      ? 'rotate(45deg) translateY(10px)'
                      : isOpen && i === 2
                        ? 'rotate(-45deg) translateY(-10px)'
                        : i === 1 && isOpen
                          ? 'opacity(0)'
                          : 'none',
                }}
              />
            ))}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div
            style={{
              paddingBottom: '1rem',
              borderTop: `1px solid var(--border-subtle)`,
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem',
              }}
            >
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="nav-link"
                  onClick={closeMenu}
                  style={{
                    display: 'block',
                    padding: '0.75rem 0',
                    fontSize: '0.9375rem',
                    fontWeight: 500,
                    textDecoration: 'none',
                    color: `var(--text-primary)`,
                    borderBottom: `1px solid var(--border-subtle)`,
                  }}
                >
                  {link.label}
                </Link>
              ))}
              <a
                href="#donate"
                onClick={closeMenu}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.875rem 1.5rem',
                  margin: '0.5rem 0',
                  backgroundColor: 'var(--accent)',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.9375rem',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  justifyContent: 'center',
                  transition: 'opacity 0.2s ease',
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
                Donate
              </a>
              <div style={{ padding: '0.75rem 0' }}>
                <ThemeToggle />
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        #desktop-nav {
          @media (min-width: 768px) {
            display: flex !important;
          }
        }
        #hamburger-btn {
          @media (min-width: 768px) {
            display: none !important;
          }
        }
        .nav-link {
          position: relative;
          transition: color 0.2s ease;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background-color: var(--accent);
          transition: width 0.3s ease;
        }
        .nav-link:hover::after {
          width: 100%;
        }
      `}</style>
    </nav>
  );
}
