import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useWebSocket } from '@vueuse/core'
import type { QuoteLevel, OrderBookMessage } from '@/types/order'

const { VITE_WS_HOST, VITE_ORDERBOOK_PATH } = import.meta.env

export const useOrderBookStore = defineStore('orderBook', () => {
  const bids = ref<QuoteLevel[]>([])
  const asks = ref<QuoteLevel[]>([])
  const prevBids = ref<QuoteLevel[]>([])
  const prevAsks = ref<QuoteLevel[]>([])
  const lastSeqNum = ref<number | null>(null)

  const { send } = useWebSocket(`wss://${VITE_WS_HOST}${VITE_ORDERBOOK_PATH}`, {
    immediate: true,
    onConnected() {
      send(JSON.stringify({ op: 'subscribe', args: ['update:BTCPFC_0'] }))
    },
    onMessage(_, event) {
      const raw: OrderBookMessage = JSON.parse(event.data)
      if (raw.topic !== 'update:BTCPFC_0') return

      const { type, bids: newBids, asks: newAsks, seqNum, prevSeqNum } = raw.data

      if (type === 'snapshot') {
        prevBids.value = []
        prevAsks.value = []
        bids.value = newBids
        asks.value = newAsks
        lastSeqNum.value = seqNum
        return
      }

      // detect sequence mismatch
      if (lastSeqNum.value !== prevSeqNum) {
        send(JSON.stringify({ op: 'unsubscribe', args: ['update:BTCPFC_0'] }))
        send(JSON.stringify({ op: 'subscribe', args: ['update:BTCPFC_0'] }))
        return
      }

      prevBids.value = bids.value
      prevAsks.value = asks.value

      const mapBids = new Map(bids.value)
      const mapAsks = new Map(asks.value)

      for (const [price, size] of newBids) {
        if (size === '0') {
          mapBids.delete(price)
        } else {
          mapBids.set(price, size)
        }
      }

      for (const [price, size] of newAsks) {
        if (size === '0') {
          mapAsks.delete(price)
        } else {
          mapAsks.set(price, size)
        }
      }

      bids.value = Array.from(mapBids.entries()).sort(
        (a, b) => parseFloat(b[0]) - parseFloat(a[0]),
      ) as QuoteLevel[]

      asks.value = Array.from(mapAsks.entries()).sort(
        (a, b) => parseFloat(b[0]) - parseFloat(a[0]),
      ) as QuoteLevel[]

      // check if order book is crossed (bid >= ask)
      const bestBid = parseFloat(bids.value[0]?.[0])
      const bestAsk = parseFloat(asks.value[0]?.[0])
      if (bestBid >= bestAsk) {
        send(JSON.stringify({ op: 'unsubscribe', args: ['update:BTCPFC_0'] }))
        send(JSON.stringify({ op: 'subscribe', args: ['update:BTCPFC_0'] }))
        return
      }

      lastSeqNum.value = seqNum
    },
  })

  // visible rows
  const visibleBids = computed(() => bids.value.slice(0, 8))
  const visibleAsks = computed(() => asks.value.slice(-8))

  const totalBidSize = computed(() => {
    return bids.value.reduce((sum, [, size]) => sum + parseFloat(size), 0)
  })

  const totalAskSize = computed(() =>
    asks.value.reduce((sum, [, size]) => sum + parseFloat(size), 0),
  )

  const bidLevelsWithTotal = computed(() => {
    let accum = 0

    return visibleBids.value.map(([price, size]) => {
      const numericSize = parseFloat(size)
      accum += numericSize
      return {
        price,
        size,
        accum: String(accum),
        percent: `${((accum / totalBidSize.value) * 100).toFixed(2)}%`,
      }
    })
  })

  const askLevelsWithTotal = computed(() => {
    let accum = 0
    const reversed = [...visibleAsks.value].reverse()
    const result = reversed.map(([price, size]) => {
      const numericSize = parseFloat(size)
      accum += numericSize
      return {
        price,
        size,
        accum: String(accum),
        percent: `${((accum / totalAskSize.value) * 100).toFixed(2)}%`,
      }
    })
    return result.reverse()
  })

  return {
    bids,
    asks,
    prevBids,
    prevAsks,
    bidLevelsWithTotal,
    askLevelsWithTotal,
  }
})
