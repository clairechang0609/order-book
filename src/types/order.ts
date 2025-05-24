export type QuoteLevel = [string, string]

interface OrderBookData {
  bids: QuoteLevel[]
  asks: QuoteLevel[]
  seqNum: number
  prevSeqNum: number
  type: 'snapshot' | 'delta'
  timestamp: number
  symbol: string
}

export interface OrderBookMessage {
  topic: string
  data: OrderBookData
}
