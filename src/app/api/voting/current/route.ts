import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  // Get active voting round
  const { data: round } = await supabase
    .from('voting_rounds')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (!round) {
    return NextResponse.json({ round: null, ideas: [] })
  }

  // Get ideas in this voting round
  const { data: ideas } = await supabase
    .from('ideas')
    .select('*')
    .eq('voting_round', round.round_number)
    .eq('status', 'voting')
    .order('votes', { ascending: false })

  return NextResponse.json({
    round,
    ideas: ideas || [],
  })
}
