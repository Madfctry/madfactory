import { NextRequest, NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabase'
import { verifyAdmin } from '@/lib/admin'
import { createTokenInfo, createLaunchTransaction, sendTransaction } from '@/lib/bags'

export async function POST(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { productId, tokenName, tokenTicker, tokenDescription, tokenImage } = body

  if (!productId || !tokenName || !tokenTicker) {
    return NextResponse.json({ error: 'Product ID, token name, and ticker are required' }, { status: 400 })
  }

  const supabase = getServiceClient()

  // Get product
  const { data: product } = await supabase
    .from('products')
    .select('*, idea:idea_id(*)')
    .eq('id', productId)
    .single()

  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  }

  try {
    // Step 1: Create token info
    const tokenInfo = await createTokenInfo({
      name: tokenName,
      ticker: tokenTicker,
      description: tokenDescription || product.description,
      image: tokenImage || '',
    })

    if (!tokenInfo?.id) {
      return NextResponse.json({ error: 'Failed to create token info', details: tokenInfo }, { status: 500 })
    }

    // Step 2: Create launch transaction
    const launchTx = await createLaunchTransaction({
      tokenInfoId: tokenInfo.id,
      creatorPublicKey: process.env.BUILDER_WALLET_PUBLIC_KEY!,
    })

    if (!launchTx?.transaction) {
      return NextResponse.json({ error: 'Failed to create launch transaction', details: launchTx }, { status: 500 })
    }

    // Step 3: Send transaction
    // Note: In production, you'd sign the transaction with the builder wallet private key before sending
    const result = await sendTransaction({
      signedTransaction: launchTx.transaction,
    })

    // Step 4: Update product with token info
    const updateData: Record<string, unknown> = {
      token_ticker: tokenTicker,
      status: 'live',
      launched_at: new Date().toISOString(),
    }

    if (result?.mint) {
      updateData.token_mint = result.mint
      updateData.bags_url = `https://bags.fm/token/${result.mint}`
    }

    await supabase.from('products').update(updateData).eq('id', productId)

    // Update idea status
    if (product.idea_id) {
      await supabase.from('ideas').update({ status: 'live' }).eq('id', product.idea_id)
    }

    return NextResponse.json({
      success: true,
      tokenInfo,
      launchResult: result,
    })
  } catch (err) {
    return NextResponse.json({
      error: 'Token launch failed',
      details: err instanceof Error ? err.message : 'Unknown error',
    }, { status: 500 })
  }
}
