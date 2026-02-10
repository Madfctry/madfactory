const BAGS_BASE_URL = 'https://public-api-v2.bags.fm/api/v1'

function getHeaders() {
  return {
    'Content-Type': 'application/json',
    'x-api-key': process.env.BAGS_API_KEY!,
  }
}

export async function createTokenInfo(data: {
  name: string
  ticker: string
  description: string
  image: string
}) {
  const res = await fetch(`${BAGS_BASE_URL}/token/create-info`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  })
  return res.json()
}

export async function createLaunchTransaction(data: {
  tokenInfoId: string
  creatorPublicKey: string
}) {
  const res = await fetch(`${BAGS_BASE_URL}/token/create-launch-transaction`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  })
  return res.json()
}

export async function sendTransaction(data: {
  signedTransaction: string
}) {
  const res = await fetch(`${BAGS_BASE_URL}/solana/send-transaction`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  })
  return res.json()
}

export async function createFeeShareConfig(data: {
  mint: string
  shares: { wallet: string; percentage: number }[]
}) {
  const res = await fetch(`${BAGS_BASE_URL}/fee-share/create-config`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  })
  return res.json()
}

export async function getTokenLifetimeFees(mint: string) {
  const res = await fetch(
    `${BAGS_BASE_URL}/analytics/token-lifetime-fees?mint=${mint}`,
    { headers: getHeaders() }
  )
  return res.json()
}

export async function getTokenClaimStats(mint: string) {
  const res = await fetch(
    `${BAGS_BASE_URL}/analytics/token-claim-stats?mint=${mint}`,
    { headers: getHeaders() }
  )
  return res.json()
}
