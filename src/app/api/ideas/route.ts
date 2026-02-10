import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')

  let query = supabase.from('ideas').select('*').order('created_at', { ascending: false })

  if (status) {
    query = query.eq('status', status)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ideas: data })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { name, description, category, email, twitter_handle } = body

  if (!name?.trim() || !description?.trim() || !category || !email?.trim() || !twitter_handle?.trim()) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  if (description.length > 140) {
    return NextResponse.json({ error: 'Description must be 140 characters or less' }, { status: 400 })
  }

  const { data, error } = await supabase.from('ideas').insert({
    name: name.trim(),
    description: description.trim(),
    category,
    email: email.trim(),
    twitter_handle: twitter_handle.trim(),
  }).select().single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ idea: data }, { status: 201 })
}
