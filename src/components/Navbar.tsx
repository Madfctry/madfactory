'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/submit', label: 'Submit Idea' },
]

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-bg-primary/80 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-mono text-lg font-bold tracking-wider uppercase">
              MadFactory
            </span>
          </Link>

          <div className="hidden sm:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  pathname === link.href
                    ? 'text-text-primary bg-white/5'
                    : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://twitter.com/madfctry"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-secondary hover:text-text-primary transition-colors"
              aria-label="Twitter"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <Link
              href="/submit"
              className="sm:hidden px-3 py-1.5 text-sm font-medium bg-white text-black rounded-md hover:bg-white/90 transition-colors"
            >
              Submit
            </Link>
          </div>

          {/* Mobile menu */}
          <div className="sm:hidden flex items-center">
            <MobileMenu pathname={pathname} />
          </div>
        </div>
      </div>
    </nav>
  )
}

function MobileMenu({ pathname }: { pathname: string }) {
  return (
    <div className="flex items-center gap-1">
      {NAV_LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
            pathname === link.href
              ? 'text-text-primary bg-white/10'
              : 'text-text-secondary'
          }`}
        >
          {link.label}
        </Link>
      ))}
    </div>
  )
}
