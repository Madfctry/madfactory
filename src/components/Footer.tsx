import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-border bg-bg-primary">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div>
            <h3 className="font-mono text-sm font-bold tracking-wider uppercase mb-4">
              MadFactory
            </h3>
            <p className="text-text-secondary text-sm leading-relaxed">
              We don&apos;t launch memes. We build YOUR ideas.
            </p>
          </div>

          <div>
            <h4 className="font-mono text-xs font-bold tracking-wider uppercase text-text-secondary mb-4">
              Links
            </h4>
            <div className="flex flex-col gap-2">
              <Link href="/" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                Home
              </Link>
              <Link href="/products" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                Products
              </Link>
              <Link href="/submit" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                Submit Idea
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-mono text-xs font-bold tracking-wider uppercase text-text-secondary mb-4">
              Social
            </h4>
            <div className="flex flex-col gap-2">
              <a
                href="https://twitter.com/madfctry"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-text-secondary hover:text-text-primary transition-colors"
              >
                Twitter @madfctry
              </a>
              <a
                href="https://github.com/madfctry"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-text-secondary hover:text-text-primary transition-colors"
              >
                GitHub
              </a>
              <a
                href="https://bags.fm"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-text-secondary hover:text-text-primary transition-colors"
              >
                Bags.fm
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-secondary">
            Built with Bags API
          </p>
          <p className="text-xs text-text-secondary">
            &copy; {new Date().getFullYear()} MadFactory. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
