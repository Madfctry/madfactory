'use client'

import { useEffect, useState } from 'react'

interface StatsBarProps {
  stats: {
    label: string
    value: number
    prefix?: string
    suffix?: string
  }[]
}

export default function StatsBar({ stats }: StatsBarProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="text-center p-4 rounded-xl border border-border bg-bg-card"
        >
          <AnimatedNumber value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
          <div className="text-xs text-text-secondary uppercase tracking-wider mt-1 font-mono">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  )
}

function AnimatedNumber({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    const duration = 1000
    const steps = 30
    const increment = value / steps
    let current = 0
    let step = 0

    const timer = setInterval(() => {
      step++
      current = Math.min(Math.round(increment * step), value)
      setDisplay(current)
      if (step >= steps) clearInterval(timer)
    }, duration / steps)

    return () => clearInterval(timer)
  }, [value])

  return (
    <div className="font-mono text-2xl font-bold animate-count">
      {prefix}{display.toLocaleString()}{suffix}
    </div>
  )
}
