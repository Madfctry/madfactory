export type IdeaStatus = 'submitted' | 'voting' | 'building' | 'live' | 'rejected'
export type ProductStatus = 'building' | 'live' | 'completed'
export type RoundStatus = 'active' | 'ended'

export interface Idea {
  id: string
  name: string
  description: string
  category: string
  email: string
  twitter_handle: string
  votes: number
  status: IdeaStatus
  voting_round: number | null
  created_at: string
}

export interface Product {
  id: string
  idea_id: string
  name: string
  description: string
  token_ticker: string | null
  token_mint: string | null
  bags_url: string | null
  github_url: string | null
  demo_url: string | null
  day_number: number | null
  fees_earned: number
  volume: number
  status: ProductStatus
  launched_at: string | null
  created_at: string
  idea?: Idea
}

export interface Vote {
  id: string
  idea_id: string
  voter_identifier: string
  created_at: string
}

export interface VotingRound {
  id: string
  round_number: number
  starts_at: string
  ends_at: string
  status: RoundStatus
  winning_idea_id: string | null
  created_at: string
}
