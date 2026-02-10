'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import AnimateOnScroll from '@/components/AnimateOnScroll'
import CountdownTimer from '@/components/CountdownTimer'
import VoteCard from '@/components/VoteCard'
import ProductCard from '@/components/ProductCard'
import StatsBar from '@/components/StatsBar'
import LeaderboardRow from '@/components/LeaderboardRow'
import type { Idea, Product, VotingRound } from '@/lib/types'

interface Stats {
  totalProducts: number
  totalIdeas: number
  totalVotes: number
  dayNumber: number
}

export default function HomePage() {
  const [currentRound, setCurrentRound] = useState<VotingRound | null>(null)
  const [votingIdeas, setVotingIdeas] = useState<Idea[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [stats, setStats] = useState<Stats>({ totalProducts: 0, totalIdeas: 0, totalVotes: 0, dayNumber: 1 })
  const [votedIds, setVotedIds] = useState<Set<string>>(new Set())
  const [leaderboard, setLeaderboard] = useState<{ wallet: string; ideasWon: number; totalFees: number }[]>([])

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const [votingRes, productsRes, statsRes] = await Promise.all([
        fetch('/api/voting/current'),
        fetch('/api/products'),
        fetch('/api/stats'),
      ])

      if (votingRes.ok) {
        const votingData = await votingRes.json()
        setCurrentRound(votingData.round)
        setVotingIdeas(votingData.ideas || [])
      }

      if (productsRes.ok) {
        const productsData = await productsRes.json()
        setProducts(productsData.products || [])
        // Build leaderboard from products
        const creatorMap = new Map<string, { ideasWon: number; totalFees: number }>()
        for (const p of productsData.products || []) {
          if (p.idea?.twitter_handle) {
            const existing = creatorMap.get(p.idea.twitter_handle) || { ideasWon: 0, totalFees: 0 }
            existing.ideasWon++
            existing.totalFees += p.fees_earned || 0
            creatorMap.set(p.idea.twitter_handle, existing)
          }
        }
        setLeaderboard(
          Array.from(creatorMap.entries())
            .map(([wallet, data]) => ({ wallet, ...data }))
            .sort((a, b) => b.totalFees - a.totalFees)
            .slice(0, 10)
        )
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats(statsData)
      }
    } catch {
      // API not connected yet — show empty state
    }
  }

  async function handleVote(ideaId: string) {
    const res = await fetch(`/api/ideas/${ideaId}/vote`, { method: 'POST' })
    if (!res.ok) {
      const data = await res.json()
      throw new Error(data.error || 'Vote failed')
    }
    setVotedIds((prev) => new Set(prev).add(ideaId))
  }

  const totalVotesInRound = votingIdeas.reduce((sum, idea) => sum + idea.votes, 0)

  return (
    <div className="dot-grid">
      {/* Hero Section */}
      <section className="relative py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <AnimateOnScroll>
            <div className="text-center">
              <h1 className="font-mono text-4xl sm:text-6xl lg:text-7xl font-bold tracking-wider uppercase">
                MadFactory
              </h1>
              <p className="mt-4 text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto">
                We don&apos;t launch memes. We build YOUR ideas.
              </p>
              <p className="mt-3 text-sm text-text-secondary max-w-xl mx-auto font-mono">
                Submit idea &rarr; Vote &rarr; We build &rarr; Launch on Bags &rarr; Earn 30% fees forever
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/submit"
                  className="px-8 py-3 bg-white text-black font-medium rounded-lg hover:bg-white/90 transition-all active:scale-[0.98]"
                >
                  Submit Your Idea
                </Link>
                <Link
                  href="/products"
                  className="px-8 py-3 border border-border text-text-primary font-medium rounded-lg hover:bg-white/5 transition-all"
                >
                  View Products
                </Link>
              </div>
            </div>
          </AnimateOnScroll>

          {/* Live counters */}
          <AnimateOnScroll className="mt-16">
            <StatsBar
              stats={[
                { label: 'Day', value: stats.dayNumber, suffix: '/30' },
                { label: 'Products Launched', value: stats.totalProducts },
                { label: 'Ideas Submitted', value: stats.totalIdeas },
                { label: 'Total Votes', value: stats.totalVotes },
              ]}
            />
          </AnimateOnScroll>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 border-t border-border">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <AnimateOnScroll>
            <h2 className="font-mono text-2xl sm:text-3xl font-bold tracking-wider uppercase text-center mb-16">
              How It Works
            </h2>
          </AnimateOnScroll>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '\uD83D\uDCA1', title: 'Submit', desc: 'Drop your product idea' },
              { icon: '\uD83D\uDDF3\uFE0F', title: 'Vote', desc: 'Community votes for 3 days' },
              { icon: '\uD83D\uDD28', title: 'Build', desc: 'We build the winning idea' },
              { icon: '\uD83D\uDE80', title: 'Launch', desc: 'Token auto-launches on Bags. You earn 30% fees forever' },
            ].map((step, i) => (
              <AnimateOnScroll key={step.title}>
                <div className="card-glow border border-border rounded-xl bg-bg-card p-6 text-center h-full">
                  <div className="text-4xl mb-4">{step.icon}</div>
                  <div className="font-mono text-xs text-text-secondary mb-2 uppercase tracking-wider">
                    Step {i + 1}
                  </div>
                  <h3 className="font-mono text-lg font-bold uppercase tracking-wide mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-text-secondary">{step.desc}</p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Current Vote */}
      <section className="py-20 border-t border-border">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <AnimateOnScroll>
            <div className="text-center mb-12">
              <h2 className="font-mono text-2xl sm:text-3xl font-bold tracking-wider uppercase mb-4">
                Current Vote
              </h2>
              {currentRound ? (
                <CountdownTimer targetDate={currentRound.ends_at} />
              ) : (
                <p className="text-text-secondary font-mono text-sm">
                  No active voting round. Stay tuned!
                </p>
              )}
            </div>
          </AnimateOnScroll>

          {votingIdeas.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {votingIdeas.map((idea) => (
                <AnimateOnScroll key={idea.id}>
                  <VoteCard
                    id={idea.id}
                    name={idea.name}
                    description={idea.description}
                    category={idea.category}
                    votes={idea.votes}
                    totalVotes={totalVotesInRound}
                    hasVoted={votedIds.has(idea.id)}
                    onVote={handleVote}
                  />
                </AnimateOnScroll>
              ))}
            </div>
          ) : (
            <AnimateOnScroll>
              <div className="text-center py-12 border border-border rounded-xl bg-bg-card">
                <p className="text-text-secondary">No ideas in the current voting round yet.</p>
                <Link
                  href="/submit"
                  className="mt-4 inline-block px-6 py-2 bg-white text-black font-medium rounded-lg hover:bg-white/90 transition-all text-sm"
                >
                  Submit Your Idea
                </Link>
              </div>
            </AnimateOnScroll>
          )}
        </div>
      </section>

      {/* Launched Products */}
      <section className="py-20 border-t border-border">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <AnimateOnScroll>
            <div className="flex items-center justify-between mb-12">
              <h2 className="font-mono text-2xl sm:text-3xl font-bold tracking-wider uppercase">
                Launched Products
              </h2>
              <Link
                href="/products"
                className="text-sm text-text-secondary hover:text-text-primary transition-colors font-mono"
              >
                View All &rarr;
              </Link>
            </div>
          </AnimateOnScroll>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.slice(0, 6).map((product) => (
                <AnimateOnScroll key={product.id}>
                  <ProductCard product={product} />
                </AnimateOnScroll>
              ))}
            </div>
          ) : (
            <AnimateOnScroll>
              <div className="text-center py-12 border border-border rounded-xl bg-bg-card">
                <p className="text-text-secondary">No products launched yet. Be the first!</p>
              </div>
            </AnimateOnScroll>
          )}
        </div>
      </section>

      {/* Leaderboard */}
      <section className="py-20 border-t border-border">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <AnimateOnScroll>
            <h2 className="font-mono text-2xl sm:text-3xl font-bold tracking-wider uppercase text-center mb-12">
              Leaderboard
            </h2>
          </AnimateOnScroll>

          {leaderboard.length > 0 ? (
            <AnimateOnScroll>
              <div className="max-w-2xl mx-auto">
                <div className="flex items-center gap-4 px-4 py-2 text-xs font-mono text-text-secondary uppercase tracking-wider mb-2">
                  <span className="w-8">Rank</span>
                  <span className="flex-1">Wallet</span>
                  <span className="w-20 text-center">Won</span>
                  <span className="w-24 text-right">Fees Earned</span>
                </div>
                {leaderboard.map((entry, i) => (
                  <LeaderboardRow
                    key={entry.wallet}
                    rank={i + 1}
                    wallet={entry.wallet}
                    ideasWon={entry.ideasWon}
                    totalFees={entry.totalFees}
                  />
                ))}
              </div>
            </AnimateOnScroll>
          ) : (
            <AnimateOnScroll>
              <div className="text-center py-12 border border-border rounded-xl bg-bg-card max-w-2xl mx-auto">
                <p className="text-text-secondary">Leaderboard will appear once products launch.</p>
                <p className="text-xs text-text-secondary mt-2">Submit ideas to get started!</p>
              </div>
            </AnimateOnScroll>
          )}
        </div>
      </section>
    </div>
  )
}
