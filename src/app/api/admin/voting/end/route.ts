import { NextRequest, NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabase'
import { verifyAdmin } from '@/lib/admin'

export async function POST(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = getServiceClient()

  // Get active round
  const { data: round } = await supabase
    .from('voting_rounds')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (!round) {
    return NextResponse.json({ error: 'No active voting round' }, { status: 400 })
  }

  // Get ideas in this round, sorted by votes
  const { data: ideas } = await supabase
    .from('ideas')
    .select('*')
    .eq('voting_round', round.round_number)
    .eq('status', 'voting')
    .order('votes', { ascending: false })

  if (!ideas?.length) {
    return NextResponse.json({ error: 'No ideas in this round' }, { status: 400 })
  }

  const winner = ideas[0]

  // Update round
  await supabase
    .from('voting_rounds')
    .update({ status: 'ended', winning_idea_id: winner.id })
    .eq('id', round.id)

  // Update winner to building
  await supabase
    .from('ideas')
    .update({ status: 'building' })
    .eq('id', winner.id)

  // Update losers back to submitted
  const loserIds = ideas.filter((i) => i.id !== winner.id).map((i) => i.id)
  if (loserIds.length > 0) {
    await supabase
      .from('ideas')
      .update({ status: 'submitted' })
      .in('id', loserIds)
  }

  return NextResponse.json({ success: true, winner })
}
