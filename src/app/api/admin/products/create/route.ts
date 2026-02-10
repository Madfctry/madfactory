import { NextRequest, NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabase'
import { verifyAdmin } from '@/lib/admin'

export async function POST(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { ideaId, githubUrl, demoUrl, description } = body

  if (!ideaId) {
    return NextResponse.json({ error: 'Idea ID is required' }, { status: 400 })
  }

  const supabase = getServiceClient()

  // Get the idea
  const { data: idea } = await supabase
    .from('ideas')
    .select('*')
    .eq('id', ideaId)
    .single()

  if (!idea) {
    return NextResponse.json({ error: 'Idea not found' }, { status: 404 })
  }

  // Count existing products for day number
  const { count } = await supabase
    .from('products')
    .select('id', { count: 'exact', head: true })

  const dayNumber = (count || 0) + 1

  // Create product
  const { data: product, error } = await supabase
    .from('products')
    .insert({
      idea_id: ideaId,
      name: idea.name,
      description: description || idea.description,
      github_url: githubUrl || null,
      demo_url: demoUrl || null,
      day_number: dayNumber,
      status: 'building',
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Update idea status
  await supabase.from('ideas').update({ status: 'building' }).eq('id', ideaId)

  return NextResponse.json({ product }, { status: 201 })
}
