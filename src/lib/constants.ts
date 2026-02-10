export const CATEGORIES = [
  'AI Tool',
  'Bot',
  'Dashboard',
  'Extension',
  'Script',
  'API Wrapper',
  'Discord Bot',
  'Telegram Bot',
  'Browser Extension',
  'Other',
] as const

export type Category = (typeof CATEGORIES)[number]

export const STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  live: { bg: 'bg-accent-green/10', text: 'text-accent-green', dot: 'bg-accent-green' },
  voting: { bg: 'bg-accent-yellow/10', text: 'text-accent-yellow', dot: 'bg-accent-yellow' },
  building: { bg: 'bg-accent-blue/10', text: 'text-accent-blue', dot: 'bg-accent-blue' },
  submitted: { bg: 'bg-white/5', text: 'text-text-secondary', dot: 'bg-white' },
  rejected: { bg: 'bg-red-500/10', text: 'text-red-400', dot: 'bg-red-400' },
  completed: { bg: 'bg-accent-green/10', text: 'text-accent-green', dot: 'bg-accent-green' },
}

export const VOTING_DURATION_DAYS = 3
export const MAX_IDEAS_PER_ROUND = 3
export const FEE_SHARE_BUILDER = 70
export const FEE_SHARE_CREATOR = 30

export const TWITTER_HANDLE = '@madfctry'
export const SITE_URL = 'https://madfactory.xyz'
export const SITE_NAME = 'MadFactory'
export const SITE_DESCRIPTION = "We don't launch memes. We build YOUR ideas."
