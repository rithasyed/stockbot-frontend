import type { NextApiRequest, NextApiResponse } from 'next'

type Symbol = {
  symbol: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Symbol[]>
) {
  // This is a mock implementation. Replace with actual data fetching logic.
  const symbols: Symbol[] = [
    { symbol: 'AAPL' },
    { symbol: 'GOOGL' },
    { symbol: 'MSFT' },
    { symbol: 'AMZN' },
    { symbol: 'FB' },
  ]

  res.status(200).json(symbols)
}