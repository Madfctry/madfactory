'use client'

import { useState } from 'react'

interface LeaderboardRowProps {
  rank: number
  wallet: string
  ideasWon: number
  totalFees: number
}

function shortenWallet(wallet: string): string {
  if (wallet.length <= 12) return wallet
  return `${wallet.slice(0, 4)}...${wallet.slice(-4)}`
}

export default function LeaderboardRow({ rank, wallet, ideasWon, totalFees }: LeaderboardRowProps) {
  const [copied, setCopied] = useState(false)

  function copyWallet() {
    navigator.clipboard.writeText(wallet)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const isTop3 = rank <= 3
  const rankColors: Record<number, string> = {
    1: 'text-accent-yellow',
    2: 'text-text-secondary',
    3: 'text-orange-400',
  }

  return (
    <div className={`flex items-center gap-4 px-4 py-3 rounded-lg ${rank % 2 === 0 ? 'bg-white/[0.02]' : ''} ${isTop3 ? 'border border-border' : ''}`}>
      <span className={`font-mono text-sm font-bold w-8 ${rankColors[rank] || 'text-text-secondary'}`}>
        #{rank}
      </span>

      <div className="flex-1 flex items-center gap-2">
        <span className="font-mono text-sm">{shortenWallet(wallet)}</span>
        <button
          onClick={copyWallet}
          className="text-text-secondary hover:text-text-primary transition-colors"
          title="Copy wallet address"
        >
          {copied ? (
            <svg className="w-3.5 h-3.5 text-accent-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          )}
        </button>
      </div>

      <span className="font-mono text-sm text-text-secondary w-20 text-center">
        {ideasWon} won
      </span>

      <span className="font-mono text-sm font-bold text-accent-green w-24 text-right">
        ${totalFees.toLocaleString()}
      </span>
    </div>
  )
}
