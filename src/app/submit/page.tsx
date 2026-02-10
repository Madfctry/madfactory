'use client'

import { useState } from 'react'
import { CATEGORIES } from '@/lib/constants'
import ShareTwitterButton from '@/components/ShareTwitterButton'
import AnimateOnScroll from '@/components/AnimateOnScroll'

export default function SubmitPage() {
  const [form, setForm] = useState({
    name: '',
    description: '',
    category: '',
    email: '',
    twitter_handle: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  function validate() {
    const errs: Record<string, string> = {}
    if (!form.name.trim()) errs.name = 'Product name is required'
    if (!form.description.trim()) errs.description = 'Description is required'
    if (form.description.length > 140) errs.description = 'Max 140 characters'
    if (!form.category) errs.category = 'Select a category'
    if (!form.email.trim()) errs.email = 'Email is required'
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email'
    if (!form.twitter_handle.trim()) errs.twitter_handle = 'Twitter handle is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    try {
      const res = await fetch('/api/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!res.ok) {
        const data = await res.json()
        setErrors({ submit: data.error || 'Failed to submit idea' })
        return
      }

      setSubmitted(true)
    } catch {
      setErrors({ submit: 'Failed to submit. Please try again.' })
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <AnimateOnScroll>
          <div className="text-center max-w-md">
            <div className="text-6xl mb-6">&#x2705;</div>
            <h1 className="font-mono text-2xl sm:text-3xl font-bold tracking-wider uppercase mb-4">
              Idea Submitted!
            </h1>
            <p className="text-text-secondary mb-8">
              Your idea has been submitted. If it gets selected for voting and wins,
              you&apos;ll earn 30% of all trading fees forever!
            </p>
            <ShareTwitterButton
              text={`I just submitted my idea to @madfctry \uD83C\uDFED If it wins the vote, it gets built and I earn 30% fees forever! Submit yours: madfactory.xyz`}
            />
          </div>
        </AnimateOnScroll>
      </div>
    )
  }

  return (
    <div className="py-12 sm:py-20">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <AnimateOnScroll>
          <div className="text-center mb-12">
            <h1 className="font-mono text-3xl sm:text-4xl font-bold tracking-wider uppercase">
              Submit Your Idea
            </h1>
            <p className="mt-3 text-text-secondary">
              Got a product idea? Submit it and let the community vote.
            </p>
          </div>
        </AnimateOnScroll>

        {/* Rules */}
        <AnimateOnScroll>
          <div className="mb-10 p-6 rounded-xl border border-border bg-bg-card">
            <h3 className="font-mono text-sm font-bold tracking-wider uppercase mb-4 text-text-secondary">
              Rules
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-accent-green">&#x2705;</span>
                <span>Real products only — must solve a real problem</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-green">&#x2705;</span>
                <span>Must be buildable in 3 days</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-green">&#x2705;</span>
                <span>Open source (GitHub)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400">&#x274C;</span>
                <span>No memes, no shitcoins, no copies</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-yellow">&#x1F4B0;</span>
                <span className="font-medium">If your idea wins: you earn 30% of ALL trading fees forever</span>
              </li>
            </ul>
          </div>
        </AnimateOnScroll>

        {/* Form */}
        <AnimateOnScroll>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Product Idea Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g., Solana Gas Tracker Bot"
                className="w-full px-4 py-3 bg-bg-card border border-border rounded-lg text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-border-hover transition-colors"
              />
              {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2">
                One-Line Description <span className="text-red-400">*</span>
                <span className="ml-2 text-xs text-text-secondary">
                  {form.description.length}/140
                </span>
              </label>
              <input
                type="text"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                maxLength={140}
                placeholder="A Telegram bot that alerts you when gas fees drop below a threshold"
                className="w-full px-4 py-3 bg-bg-card border border-border rounded-lg text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-border-hover transition-colors"
              />
              {errors.description && <p className="mt-1 text-xs text-red-400">{errors.description}</p>}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Category <span className="text-red-400">*</span>
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-4 py-3 bg-bg-card border border-border rounded-lg text-text-primary focus:outline-none focus:border-border-hover transition-colors appearance-none"
              >
                <option value="" className="bg-bg-card">Select category...</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="bg-bg-card">
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && <p className="mt-1 text-xs text-red-400">{errors.category}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Email <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="your@email.com"
                className="w-full px-4 py-3 bg-bg-card border border-border rounded-lg text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-border-hover transition-colors"
              />
              {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
            </div>

            {/* Twitter */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Twitter Handle <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.twitter_handle}
                onChange={(e) => setForm({ ...form, twitter_handle: e.target.value })}
                placeholder="@yourhandle"
                className="w-full px-4 py-3 bg-bg-card border border-border rounded-lg text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-border-hover transition-colors"
              />
              {errors.twitter_handle && <p className="mt-1 text-xs text-red-400">{errors.twitter_handle}</p>}
            </div>

            {errors.submit && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {errors.submit}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-white text-black font-medium rounded-lg hover:bg-white/90 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' : 'Submit Idea'}
            </button>
          </form>
        </AnimateOnScroll>
      </div>
    </div>
  )
}
