'use client'

import { useEffect, useState } from 'react'
import ProductCard from '@/components/ProductCard'
import AnimateOnScroll from '@/components/AnimateOnScroll'
import type { Product } from '@/lib/types'

const TABS = ['All', 'Voting', 'Building', 'Live'] as const

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [activeTab, setActiveTab] = useState<string>('All')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    try {
      const res = await fetch('/api/products')
      if (res.ok) {
        const data = await res.json()
        setProducts(data.products || [])
      }
    } catch {
      // API error
    } finally {
      setLoading(false)
    }
  }

  const filtered =
    activeTab === 'All'
      ? products
      : products.filter((p) => p.status === activeTab.toLowerCase())

  return (
    <div className="py-12 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <AnimateOnScroll>
          <div className="text-center mb-12">
            <h1 className="font-mono text-3xl sm:text-4xl font-bold tracking-wider uppercase">
              Products
            </h1>
            <p className="mt-3 text-text-secondary">
              All ideas built and launched by MadFactory.
            </p>
          </div>
        </AnimateOnScroll>

        {/* Filter Tabs */}
        <AnimateOnScroll>
          <div className="flex items-center justify-center gap-2 mb-10">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'bg-white text-black'
                    : 'bg-white/5 text-text-secondary hover:text-text-primary hover:bg-white/10'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </AnimateOnScroll>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="border border-border rounded-xl bg-bg-card p-6 animate-pulse h-48"
              />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((product) => (
              <AnimateOnScroll key={product.id}>
                <ProductCard product={product} />
              </AnimateOnScroll>
            ))}
          </div>
        ) : (
          <AnimateOnScroll>
            <div className="text-center py-16 border border-border rounded-xl bg-bg-card">
              <p className="text-text-secondary">
                {activeTab === 'All'
                  ? 'No products yet. Be the first to submit an idea!'
                  : `No ${activeTab.toLowerCase()} products right now.`}
              </p>
            </div>
          </AnimateOnScroll>
        )}
      </div>
    </div>
  )
}
