interface TradeData {
  symbol: string
  side: 'BUY' | 'SELL'
  price: number
  size: number
  tradeId: number
  timestamp: number
}

export interface TradeMessage {
  topic: string
  data: TradeData[]
}
