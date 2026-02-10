import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  const [productsRes, ideasRes, votesRes] = await Promise.all([
    supabase.from('products').select('id', { count: 'exact', head: true }),
    supabase.from('ideas').select('id', { count: 'exact', head: true }),
    supabase.from('votes').select('id', { count: 'exact', head: true }),
  ])

  // Calculate day number (days since first product or start)
  const { data: firstProduct } = await supabase
    .from('products')
    .select('created_at')
    .order('created_at', { ascending: true })
    .limit(1)
    .single()

  let dayNumber = 1
  if (firstProduct) {
    const start = new Date(firstProduct.created_at)
    const now = new Date()
    dayNumber = Math.max(1, Math.ceil((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)))
  }

  return NextResponse.json({
    totalProducts: productsRes.count || 0,
    totalIdeas: ideasRes.count || 0,
    totalVotes: votesRes.count || 0,
    dayNumber,
  })
}
