export interface OrderBookMessage {
  topic: string
  data: OrderBookData
}

export type QuoteLevel = [string, string]

export interface OrderBookData {
  bids: QuoteLevel[]
  asks: QuoteLevel[]
  seqNum: number
  prevSeqNum: number
  type: 'snapshot' | 'delta'
  timestamp: number
  symbol: string
}
