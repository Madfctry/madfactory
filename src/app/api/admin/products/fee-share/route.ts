import { NextRequest, NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabase'
import { verifyAdmin } from '@/lib/admin'
import { createFeeShareConfig } from '@/lib/bags'
import { FEE_SHARE_BUILDER, FEE_SHARE_CREATOR } from '@/lib/constants'

export async function POST(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { productId, creatorWallet } = body

  if (!productId) {
    return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
  }

  if (!creatorWallet) {
    return NextResponse.json({ error: 'Creator wallet address is required' }, { status: 400 })
  }

  const supabase = getServiceClient()

  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId)
    .single()

  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  }

  if (!product.token_mint) {
    return NextResponse.json({ error: 'Product has no token mint address' }, { status: 400 })
  }

  try {
    const result = await createFeeShareConfig({
      mint: product.token_mint,
      shares: [
        { wallet: process.env.BUILDER_WALLET_PUBLIC_KEY!, percentage: FEE_SHARE_BUILDER },
        { wallet: creatorWallet, percentage: FEE_SHARE_CREATOR },
      ],
    })

    return NextResponse.json({ success: true, result })
  } catch (err) {
    return NextResponse.json({
      error: 'Failed to configure fee share',
      details: err instanceof Error ? err.message : 'Unknown error',
    }, { status: 500 })
  }
}
