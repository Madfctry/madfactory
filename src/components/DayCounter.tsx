interface DayCounterProps {
  current: number
  total: number
}

export default function DayCounter({ current, total }: DayCounterProps) {
  const percentage = Math.min((current / total) * 100, 100)

  return (
    <div className="flex items-center gap-3">
      <span className="font-mono text-sm font-bold">
        Day {current}/{total}
      </span>
      <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden max-w-[120px]">
        <div
          className="h-full bg-accent-green rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
