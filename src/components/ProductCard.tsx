import Link from 'next/link'
import StatusBadge from './StatusBadge'
import type { Product } from '@/lib/types'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.id}`}>
      <div className="card-glow border border-border rounded-xl bg-bg-card p-6 transition-all hover:bg-bg-card-hover hover:scale-[1.01]">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-mono text-base font-bold tracking-wide uppercase truncate">
              {product.name}
            </h3>
            {product.token_ticker && (
              <span className="font-mono text-xs text-accent-yellow">
                ${product.token_ticker}
              </span>
            )}
          </div>
          <StatusBadge status={product.status} />
        </div>

        <p className="text-text-secondary text-sm line-clamp-2 mb-4">
          {product.description}
        </p>

        <div className="grid grid-cols-3 gap-3">
          <Stat label="Day" value={product.day_number ? `${product.day_number}/30` : '-'} />
          <Stat label="Volume" value={formatNumber(product.volume)} />
          <Stat label="Fees" value={formatNumber(product.fees_earned)} />
        </div>

        {(product.github_url || product.bags_url) && (
          <div className="mt-4 pt-3 border-t border-border flex items-center gap-3">
            {product.bags_url && (
              <span className="text-xs text-accent-yellow hover:underline">
                Trade on Bags
              </span>
            )}
            {product.github_url && (
              <span className="text-xs text-text-secondary hover:underline">
                GitHub
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <div className="font-mono text-sm font-bold">{value}</div>
      <div className="text-[10px] text-text-secondary uppercase tracking-wider mt-0.5">
        {label}
      </div>
    </div>
  )
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toFixed(0)
}
