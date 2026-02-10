'use client'

import { useEffect, useState } from 'react'

interface CountdownTimerProps {
  targetDate: string
  onComplete?: () => void
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function calculateTimeLeft(targetDate: string): TimeLeft | null {
  const diff = new Date(targetDate).getTime() - Date.now()
  if (diff <= 0) return null
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

function pad(n: number): string {
  return n.toString().padStart(2, '0')
}

export default function CountdownTimer({ targetDate, onComplete }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setTimeLeft(calculateTimeLeft(targetDate))

    const interval = setInterval(() => {
      const tl = calculateTimeLeft(targetDate)
      setTimeLeft(tl)
      if (!tl) {
        clearInterval(interval)
        onComplete?.()
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [targetDate, onComplete])

  if (!mounted) {
    return (
      <div className="flex items-center gap-2 font-mono text-2xl sm:text-3xl font-bold tracking-wider">
        <TimeBlock value="--" label="Days" />
        <span className="text-text-secondary">:</span>
        <TimeBlock value="--" label="Hrs" />
        <span className="text-text-secondary">:</span>
        <TimeBlock value="--" label="Min" />
        <span className="text-text-secondary">:</span>
        <TimeBlock value="--" label="Sec" />
      </div>
    )
  }

  if (!timeLeft) {
    return (
      <div className="font-mono text-2xl sm:text-3xl font-bold text-accent-green animate-pulse">
        LAUNCHING NOW
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 font-mono text-2xl sm:text-3xl font-bold tracking-wider">
      <TimeBlock value={pad(timeLeft.days)} label="Days" />
      <span className="text-text-secondary">:</span>
      <TimeBlock value={pad(timeLeft.hours)} label="Hrs" />
      <span className="text-text-secondary">:</span>
      <TimeBlock value={pad(timeLeft.minutes)} label="Min" />
      <span className="text-text-secondary">:</span>
      <TimeBlock value={pad(timeLeft.seconds)} label="Sec" />
    </div>
  )
}

function TimeBlock({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="countdown-digit bg-bg-card border border-border rounded-md px-3 py-2 min-w-[3rem] text-center">
        {value}
      </span>
      <span className="text-[10px] text-text-secondary mt-1 uppercase tracking-wider">
        {label}
      </span>
    </div>
  )
}
