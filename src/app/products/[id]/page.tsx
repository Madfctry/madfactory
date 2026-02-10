'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import StatusBadge from '@/components/StatusBadge'
import DayCounter from '@/components/DayCounter'
import ShareTwitterButton from '@/components/ShareTwitterButton'
import AnimateOnScroll from '@/components/AnimateOnScroll'
import type { Product, Idea } from '@/lib/types'

interface ProductDetail extends Product {
  idea?: Idea
}

export default function ProductDetailPage() {
  const params = useParams()
  const [product, setProduct] = useState<ProductDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) fetchProduct()
  }, [params.id])

  async function fetchProduct() {
    try {
      const res = await fetch(`/api/products/${params.id}`)
      if (res.ok) {
        const data = await res.json()
        setProduct(data.product)
      }
    } catch {
      // Error
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-bg-card rounded w-1/2" />
            <div className="h-4 bg-bg-card rounded w-3/4" />
            <div className="h-48 bg-bg-card rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="py-20 text-center">
        <h1 className="font-mono text-2xl font-bold uppercase tracking-wider">Product Not Found</h1>
        <Link href="/products" className="mt-4 inline-block text-text-secondary hover:text-text-primary transition-colors">
          &larr; Back to Products
        </Link>
      </div>
    )
  }

  return (
    <div className="py-12 sm:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <AnimateOnScroll>
          <Link
            href="/products"
            className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary transition-colors mb-8"
          >
            &larr; Back to Products
          </Link>
        </AnimateOnScroll>

        <AnimateOnScroll>
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-8">
            <div>
              <h1 className="font-mono text-2xl sm:text-4xl font-bold tracking-wider uppercase">
                {product.name}
              </h1>
              {product.token_ticker && (
                <span className="font-mono text-lg text-accent-yellow mt-1 block">
                  ${product.token_ticker}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={product.status} />
              {product.day_number && <DayCounter current={product.day_number} total={30} />}
            </div>
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll>
          <p className="text-text-secondary text-lg mb-8">{product.description}</p>
        </AnimateOnScroll>

        {/* Idea Creator */}
        {product.idea && (
          <AnimateOnScroll>
            <div className="p-4 rounded-xl border border-border bg-bg-card mb-8">
              <h3 className="font-mono text-xs font-bold tracking-wider uppercase text-text-secondary mb-2">
                Idea Creator
              </h3>
              <div className="flex items-center gap-4">
                <a
                  href={`https://twitter.com/${product.idea.twitter_handle.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-accent-blue hover:underline font-mono"
                >
                  {product.idea.twitter_handle}
                </a>
              </div>
            </div>
          </AnimateOnScroll>
        )}

        {/* Token Info */}
        {product.token_mint && (
          <AnimateOnScroll>
            <div className="p-4 rounded-xl border border-border bg-bg-card mb-8">
              <h3 className="font-mono text-xs font-bold tracking-wider uppercase text-text-secondary mb-3">
                Token Info
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-text-secondary">Ticker:</span>
                  <span className="ml-2 font-mono font-bold">${product.token_ticker}</span>
                </div>
                <div>
                  <span className="text-text-secondary">Contract:</span>
                  <span className="ml-2 font-mono text-xs break-all">{product.token_mint}</span>
                </div>
              </div>
            </div>
          </AnimateOnScroll>
        )}

        {/* Stats */}
        <AnimateOnScroll>
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="p-4 rounded-xl border border-border bg-bg-card text-center">
              <div className="font-mono text-2xl font-bold">{formatNumber(product.volume)}</div>
              <div className="text-xs text-text-secondary uppercase tracking-wider mt-1">Volume</div>
            </div>
            <div className="p-4 rounded-xl border border-border bg-bg-card text-center">
              <div className="font-mono text-2xl font-bold text-accent-green">{formatNumber(product.fees_earned)}</div>
              <div className="text-xs text-text-secondary uppercase tracking-wider mt-1">Total Fees</div>
            </div>
            <div className="p-4 rounded-xl border border-border bg-bg-card text-center">
              <div className="font-mono text-2xl font-bold">{product.day_number || '-'}</div>
              <div className="text-xs text-text-secondary uppercase tracking-wider mt-1">Day</div>
            </div>
          </div>
        </AnimateOnScroll>

        {/* Fee Split Visualization */}
        <AnimateOnScroll>
          <div className="p-6 rounded-xl border border-border bg-bg-card mb-8">
            <h3 className="font-mono text-xs font-bold tracking-wider uppercase text-text-secondary mb-4">
              Fee Split
            </h3>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-4 rounded-full bg-accent-blue flex-[7] transition-all duration-1000" />
              <div className="h-4 rounded-full bg-accent-green flex-[3] transition-all duration-1000" />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-accent-blue">70% Builder</span>
              <span className="text-accent-green">30% Idea Creator</span>
            </div>
          </div>
        </AnimateOnScroll>

        {/* Links */}
        <AnimateOnScroll>
          <div className="flex flex-wrap gap-3 mb-8">
            {product.bags_url && (
              <a
                href={product.bags_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-accent-yellow text-black font-medium rounded-lg hover:bg-accent-yellow/90 transition-all text-sm"
              >
                Trade on Bags
              </a>
            )}
            {product.github_url && (
              <a
                href={product.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 border border-border rounded-lg hover:bg-white/5 transition-all text-sm"
              >
                GitHub Repo
              </a>
            )}
            {product.demo_url && (
              <a
                href={product.demo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 border border-border rounded-lg hover:bg-white/5 transition-all text-sm"
              >
                Live Demo
              </a>
            )}
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll>
          <ShareTwitterButton
            text={`Check out ${product.name} — built by @madfctry \uD83C\uDFED${product.token_ticker ? ` $${product.token_ticker}` : ''} on Bags!\n\nmadfactory.xyz/products/${product.id}`}
          />
        </AnimateOnScroll>
      </div>
    </div>
  )
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`
  return `$${n.toFixed(0)}`
}
