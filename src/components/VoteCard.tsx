'use client'

import { useState } from 'react'
import StatusBadge from './StatusBadge'

interface VoteCardProps {
  id: string
  name: string
  description: string
  category: string
  votes: number
  totalVotes: number
  hasVoted?: boolean
  onVote?: (id: string) => Promise<void>
}

export default function VoteCard({
  id,
  name,
  description,
  category,
  votes,
  totalVotes,
  hasVoted = false,
  onVote,
}: VoteCardProps) {
  const [voted, setVoted] = useState(hasVoted)
  const [voteCount, setVoteCount] = useState(votes)
  const [loading, setLoading] = useState(false)

  const percentage = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0

  async function handleVote() {
    if (voted || loading) return
    setLoading(true)
    try {
      await onVote?.(id)
      setVoted(true)
      setVoteCount((v) => v + 1)
    } catch {
      // Vote failed
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card-glow border border-border rounded-xl bg-bg-card p-6 transition-all hover:bg-bg-card-hover">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-mono text-base font-bold tracking-wide uppercase truncate">
            {name}
          </h3>
          <p className="text-text-secondary text-sm mt-1 line-clamp-2">
            {description}
          </p>
        </div>
        <span className="shrink-0 text-xs font-medium px-2 py-1 rounded-md bg-white/5 text-text-secondary">
          {category}
        </span>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-sm text-text-secondary">
            {voteCount} vote{voteCount !== 1 ? 's' : ''}
          </span>
          <span className="font-mono text-sm text-text-secondary">
            {percentage}%
          </span>
        </div>
        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
          <div
            className="vote-bar h-full bg-accent-yellow rounded-full"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      <button
        onClick={handleVote}
        disabled={voted || loading}
        className={`mt-4 w-full py-2.5 rounded-lg font-medium text-sm transition-all ${
          voted
            ? 'bg-accent-green/10 text-accent-green cursor-default'
            : loading
              ? 'bg-white/5 text-text-secondary cursor-wait'
              : 'bg-white text-black hover:bg-white/90 active:scale-[0.98]'
        }`}
      >
        {voted ? 'Voted \u2713' : loading ? 'Voting...' : 'Vote'}
      </button>
    </div>
  )
}
