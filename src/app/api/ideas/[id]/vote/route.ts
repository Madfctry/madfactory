import { NextRequest, NextResponse } from 'next/server'
import { supabase, getServiceClient } from '@/lib/supabase'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  // Get voter identifier from IP
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown'
  const voterIdentifier = ip

  // Check if already voted
  const { data: existingVote } = await supabase
    .from('votes')
    .select('id')
    .eq('idea_id', id)
    .eq('voter_identifier', voterIdentifier)
    .single()

  if (existingVote) {
    return NextResponse.json({ error: 'You have already voted for this idea' }, { status: 409 })
  }

  // Check idea exists and is in voting status
  const { data: idea } = await supabase
    .from('ideas')
    .select('id, status, voting_round')
    .eq('id', id)
    .single()

  if (!idea) {
    return NextResponse.json({ error: 'Idea not found' }, { status: 404 })
  }

  if (idea.status !== 'voting') {
    return NextResponse.json({ error: 'This idea is not currently in a voting round' }, { status: 400 })
  }

  // Check voter hasn't voted in this round already
  if (idea.voting_round) {
    const { data: roundIdeas } = await supabase
      .from('ideas')
      .select('id')
      .eq('voting_round', idea.voting_round)

    if (roundIdeas) {
      const roundIdeaIds = roundIdeas.map((i) => i.id)
      const { data: existingRoundVote } = await supabase
        .from('votes')
        .select('id')
        .in('idea_id', roundIdeaIds)
        .eq('voter_identifier', voterIdentifier)
        .limit(1)
        .single()

      if (existingRoundVote) {
        return NextResponse.json({ error: 'You have already voted in this round' }, { status: 409 })
      }
    }
  }

  // Insert vote
  const serviceClient = getServiceClient()

  const { error: voteError } = await serviceClient
    .from('votes')
    .insert({
      idea_id: id,
      voter_identifier: voterIdentifier,
    })

  if (voteError) {
    return NextResponse.json({ error: 'Failed to vote' }, { status: 500 })
  }

  // Increment vote count using RPC
  try {
    await serviceClient.rpc('increment_votes', { idea_id: id })
  } catch {
    // Fallback: direct update
    const { data: current } = await serviceClient
      .from('ideas')
      .select('votes')
      .eq('id', id)
      .single()
    if (current) {
      await serviceClient
        .from('ideas')
        .update({ votes: (current.votes || 0) + 1 })
        .eq('id', id)
    }
  }

  return NextResponse.json({ success: true })
}
