'use client'

import { useState, useEffect } from 'react'
import StatusBadge from '@/components/StatusBadge'
import type { Idea, VotingRound } from '@/lib/types'

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [adminSecret, setAdminSecret] = useState('')

  if (!authenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <h1 className="font-mono text-2xl font-bold tracking-wider uppercase text-center mb-8">
            Admin Login
          </h1>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              setAdminSecret(password)
              setAuthenticated(true)
            }}
            className="space-y-4"
          >
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin password"
              className="w-full px-4 py-3 bg-bg-card border border-border rounded-lg text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-border-hover transition-colors"
            />
            <button
              type="submit"
              className="w-full py-3 bg-white text-black font-medium rounded-lg hover:bg-white/90 transition-all"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    )
  }

  return <AdminDashboard secret={adminSecret} />
}

function AdminDashboard({ secret }: { secret: string }) {
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [currentRound, setCurrentRound] = useState<VotingRound | null>(null)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  // Product creation form
  const [productForm, setProductForm] = useState({
    ideaId: '',
    githubUrl: '',
    demoUrl: '',
    description: '',
  })

  // Token launch form
  const [launchForm, setLaunchForm] = useState({
    productId: '',
    tokenName: '',
    tokenTicker: '',
    tokenDescription: '',
    tokenImage: '',
  })

  useEffect(() => {
    fetchData()
  }, [])

  const headers = {
    'Content-Type': 'application/json',
    'x-admin-secret': secret,
  }

  async function fetchData() {
    try {
      const [ideasRes, votingRes] = await Promise.all([
        fetch('/api/ideas'),
        fetch('/api/voting/current'),
      ])
      if (ideasRes.ok) {
        const data = await ideasRes.json()
        setIdeas(data.ideas || [])
      }
      if (votingRes.ok) {
        const data = await votingRes.json()
        setCurrentRound(data.round)
      }
    } catch {
      setMessage('Failed to fetch data')
    }
  }

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else if (next.size < 3) next.add(id)
      return next
    })
  }

  async function startVoting() {
    if (selectedIds.size === 0) return
    setLoading(true)
    try {
      const res = await fetch('/api/admin/voting/start', {
        method: 'POST',
        headers,
        body: JSON.stringify({ ideaIds: Array.from(selectedIds) }),
      })
      const data = await res.json()
      setMessage(res.ok ? 'Voting round started!' : data.error)
      if (res.ok) fetchData()
    } catch {
      setMessage('Failed to start voting')
    } finally {
      setLoading(false)
    }
  }

  async function endVoting() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/voting/end', {
        method: 'POST',
        headers,
      })
      const data = await res.json()
      setMessage(res.ok ? `Voting ended! Winner: ${data.winner?.name}` : data.error)
      if (res.ok) fetchData()
    } catch {
      setMessage('Failed to end voting')
    } finally {
      setLoading(false)
    }
  }

  async function createProduct() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/products/create', {
        method: 'POST',
        headers,
        body: JSON.stringify(productForm),
      })
      const data = await res.json()
      setMessage(res.ok ? 'Product created!' : data.error)
    } catch {
      setMessage('Failed to create product')
    } finally {
      setLoading(false)
    }
  }

  async function launchToken() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/products/launch', {
        method: 'POST',
        headers,
        body: JSON.stringify(launchForm),
      })
      const data = await res.json()
      setMessage(res.ok ? 'Token launched!' : data.error)
    } catch {
      setMessage('Failed to launch token')
    } finally {
      setLoading(false)
    }
  }

  async function updateIdeaStatus(id: string, status: string) {
    try {
      const res = await fetch('/api/admin/voting/start', {
        method: 'POST',
        headers,
        body: JSON.stringify({ updateStatus: { id, status } }),
      })
      if (res.ok) fetchData()
    } catch {
      setMessage('Failed to update status')
    }
  }

  const submittedIdeas = ideas.filter((i) => i.status === 'submitted')
  const votingIdeas = ideas.filter((i) => i.status === 'voting')
  const buildingIdeas = ideas.filter((i) => i.status === 'building')

  return (
    <div className="py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h1 className="font-mono text-2xl sm:text-3xl font-bold tracking-wider uppercase mb-8">
          Admin Dashboard
        </h1>

        {message && (
          <div className="mb-6 p-4 rounded-lg border border-border bg-bg-card text-sm">
            {message}
            <button onClick={() => setMessage('')} className="ml-4 text-text-secondary hover:text-text-primary">
              &times;
            </button>
          </div>
        )}

        {/* Current Round Status */}
        <section className="mb-10 p-6 rounded-xl border border-border bg-bg-card">
          <h2 className="font-mono text-sm font-bold tracking-wider uppercase text-text-secondary mb-4">
            Current Voting Round
          </h2>
          {currentRound ? (
            <div className="space-y-2 text-sm">
              <p>Round #{currentRound.round_number} — Status: {currentRound.status}</p>
              <p>Ends: {new Date(currentRound.ends_at).toLocaleString()}</p>
              <button
                onClick={endVoting}
                disabled={loading}
                className="mt-3 px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors text-sm disabled:opacity-50"
              >
                End Voting Round
              </button>
            </div>
          ) : (
            <p className="text-text-secondary text-sm">No active voting round</p>
          )}
        </section>

        {/* Submitted Ideas */}
        <section className="mb-10">
          <h2 className="font-mono text-sm font-bold tracking-wider uppercase text-text-secondary mb-4">
            Submitted Ideas ({submittedIdeas.length})
          </h2>
          <div className="space-y-2">
            {submittedIdeas.map((idea) => (
              <div
                key={idea.id}
                className={`flex items-center gap-4 p-4 rounded-lg border transition-colors cursor-pointer ${
                  selectedIds.has(idea.id) ? 'border-accent-yellow bg-accent-yellow/5' : 'border-border bg-bg-card hover:bg-bg-card-hover'
                }`}
                onClick={() => toggleSelect(idea.id)}
              >
                <input
                  type="checkbox"
                  checked={selectedIds.has(idea.id)}
                  onChange={() => toggleSelect(idea.id)}
                  className="accent-accent-yellow"
                />
                <div className="flex-1 min-w-0">
                  <span className="font-mono text-sm font-bold">{idea.name}</span>
                  <span className="ml-2 text-xs text-text-secondary">{idea.category}</span>
                  <p className="text-xs text-text-secondary truncate">{idea.description}</p>
                </div>
                <span className="text-xs text-text-secondary font-mono">{idea.twitter_handle}</span>
                <StatusBadge status={idea.status} />
              </div>
            ))}
            {submittedIdeas.length === 0 && (
              <p className="text-text-secondary text-sm py-4">No submitted ideas</p>
            )}
          </div>

          {selectedIds.size > 0 && !currentRound && (
            <button
              onClick={startVoting}
              disabled={loading}
              className="mt-4 px-6 py-2.5 bg-accent-yellow text-black font-medium rounded-lg hover:bg-accent-yellow/90 transition-all text-sm disabled:opacity-50"
            >
              Start Voting Round ({selectedIds.size} ideas)
            </button>
          )}
        </section>

        {/* Voting Ideas */}
        {votingIdeas.length > 0 && (
          <section className="mb-10">
            <h2 className="font-mono text-sm font-bold tracking-wider uppercase text-text-secondary mb-4">
              Currently Voting ({votingIdeas.length})
            </h2>
            <div className="space-y-2">
              {votingIdeas.map((idea) => (
                <div key={idea.id} className="flex items-center gap-4 p-4 rounded-lg border border-border bg-bg-card">
                  <div className="flex-1 min-w-0">
                    <span className="font-mono text-sm font-bold">{idea.name}</span>
                    <span className="ml-3 font-mono text-sm text-accent-yellow">{idea.votes} votes</span>
                  </div>
                  <StatusBadge status={idea.status} />
                  <button
                    onClick={() => updateIdeaStatus(idea.id, 'building')}
                    className="px-3 py-1 text-xs bg-accent-blue/10 text-accent-blue rounded-md hover:bg-accent-blue/20 transition-colors"
                  >
                    Mark Building
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Create Product */}
        <section className="mb-10 p-6 rounded-xl border border-border bg-bg-card">
          <h2 className="font-mono text-sm font-bold tracking-wider uppercase text-text-secondary mb-4">
            Create Product
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <select
              value={productForm.ideaId}
              onChange={(e) => setProductForm({ ...productForm, ideaId: e.target.value })}
              className="px-4 py-2.5 bg-bg-primary border border-border rounded-lg text-sm focus:outline-none focus:border-border-hover"
            >
              <option value="">Select winning idea...</option>
              {ideas.filter((i) => i.status === 'building' || i.status === 'voting').map((idea) => (
                <option key={idea.id} value={idea.id}>
                  {idea.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={productForm.githubUrl}
              onChange={(e) => setProductForm({ ...productForm, githubUrl: e.target.value })}
              placeholder="GitHub URL"
              className="px-4 py-2.5 bg-bg-primary border border-border rounded-lg text-sm focus:outline-none focus:border-border-hover"
            />
            <input
              type="text"
              value={productForm.demoUrl}
              onChange={(e) => setProductForm({ ...productForm, demoUrl: e.target.value })}
              placeholder="Demo URL"
              className="px-4 py-2.5 bg-bg-primary border border-border rounded-lg text-sm focus:outline-none focus:border-border-hover"
            />
            <input
              type="text"
              value={productForm.description}
              onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
              placeholder="Full description"
              className="px-4 py-2.5 bg-bg-primary border border-border rounded-lg text-sm focus:outline-none focus:border-border-hover"
            />
          </div>
          <button
            onClick={createProduct}
            disabled={loading || !productForm.ideaId}
            className="mt-4 px-6 py-2.5 bg-accent-blue text-white font-medium rounded-lg hover:bg-accent-blue/90 transition-all text-sm disabled:opacity-50"
          >
            Create Product
          </button>
        </section>

        {/* Launch Token */}
        <section className="mb-10 p-6 rounded-xl border border-border bg-bg-card">
          <h2 className="font-mono text-sm font-bold tracking-wider uppercase text-text-secondary mb-4">
            Launch Token on Bags
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              value={launchForm.productId}
              onChange={(e) => setLaunchForm({ ...launchForm, productId: e.target.value })}
              placeholder="Product ID"
              className="px-4 py-2.5 bg-bg-primary border border-border rounded-lg text-sm focus:outline-none focus:border-border-hover"
            />
            <input
              type="text"
              value={launchForm.tokenName}
              onChange={(e) => setLaunchForm({ ...launchForm, tokenName: e.target.value })}
              placeholder="Token Name"
              className="px-4 py-2.5 bg-bg-primary border border-border rounded-lg text-sm focus:outline-none focus:border-border-hover"
            />
            <input
              type="text"
              value={launchForm.tokenTicker}
              onChange={(e) => setLaunchForm({ ...launchForm, tokenTicker: e.target.value })}
              placeholder="Token Ticker"
              className="px-4 py-2.5 bg-bg-primary border border-border rounded-lg text-sm focus:outline-none focus:border-border-hover"
            />
            <input
              type="text"
              value={launchForm.tokenDescription}
              onChange={(e) => setLaunchForm({ ...launchForm, tokenDescription: e.target.value })}
              placeholder="Token Description"
              className="px-4 py-2.5 bg-bg-primary border border-border rounded-lg text-sm focus:outline-none focus:border-border-hover"
            />
            <input
              type="text"
              value={launchForm.tokenImage}
              onChange={(e) => setLaunchForm({ ...launchForm, tokenImage: e.target.value })}
              placeholder="Token Image URL"
              className="px-4 py-2.5 bg-bg-primary border border-border rounded-lg text-sm focus:outline-none focus:border-border-hover sm:col-span-2"
            />
          </div>
          <button
            onClick={launchToken}
            disabled={loading || !launchForm.productId}
            className="mt-4 px-6 py-2.5 bg-accent-green text-black font-medium rounded-lg hover:bg-accent-green/90 transition-all text-sm disabled:opacity-50"
          >
            Launch Token
          </button>
        </section>
      </div>
    </div>
  )
}
