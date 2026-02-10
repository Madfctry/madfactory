import { NextRequest, NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabase'
import { verifyAdmin } from '@/lib/admin'
import { VOTING_DURATION_DAYS } from '@/lib/constants'

export async function POST(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const supabase = getServiceClient()

  // Handle status update
  if (body.updateStatus) {
    const { id, status } = body.updateStatus
    const { error } = await supabase.from('ideas').update({ status }).eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  }

  const { ideaIds } = body

  if (!ideaIds?.length || ideaIds.length > 3) {
    return NextResponse.json({ error: 'Select 1-3 ideas for voting' }, { status: 400 })
  }

  // Check no active round
  const { data: activeRound } = await supabase
    .from('voting_rounds')
    .select('id')
    .eq('status', 'active')
    .limit(1)
    .single()

  if (activeRound) {
    return NextResponse.json({ error: 'There is already an active voting round' }, { status: 400 })
  }

  // Get next round number
  const { data: lastRound } = await supabase
    .from('voting_rounds')
    .select('round_number')
    .order('round_number', { ascending: false })
    .limit(1)
    .single()

  const roundNumber = (lastRound?.round_number || 0) + 1
  const startsAt = new Date()
  const endsAt = new Date(startsAt.getTime() + VOTING_DURATION_DAYS * 24 * 60 * 60 * 1000)

  // Create voting round
  const { error: roundError } = await supabase.from('voting_rounds').insert({
    round_number: roundNumber,
    starts_at: startsAt.toISOString(),
    ends_at: endsAt.toISOString(),
  })

  if (roundError) {
    return NextResponse.json({ error: roundError.message }, { status: 500 })
  }

  // Update ideas to voting status
  const { error: ideasError } = await supabase
    .from('ideas')
    .update({ status: 'voting', voting_round: roundNumber, votes: 0 })
    .in('id', ideaIds)

  if (ideasError) {
    return NextResponse.json({ error: ideasError.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, roundNumber, endsAt })
}
