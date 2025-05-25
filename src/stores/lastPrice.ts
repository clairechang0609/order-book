import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useWebSocket } from '@vueuse/core'
import type { TradeMessage } from '@/types/lastPrice'

const { VITE_WS_HOST, VITE_TRADE_PATH } = import.meta.env

export const useLastPriceStore = defineStore('lastPrice', () => {
  const previousLastPrice = ref<number>(0)
  const currentLastPrice = ref<number>(0)

  const { send } = useWebSocket(`wss://${VITE_WS_HOST}${VITE_TRADE_PATH}`, {
    immediate: true,
    onConnected() {
      send(JSON.stringify({ op: 'subscribe', args: ['tradeHistoryApi:BTCPFC'] }))
    },
    onMessage(_, event) {
      const raw: TradeMessage = JSON.parse(event.data)
      if (raw.topic === 'tradeHistoryApi') {
        updateLastPrice(raw.data[0]?.price || 0)
      }
    },
  })

  const updateLastPrice = (newPrice: number) => {
    previousLastPrice.value = currentLastPrice.value
    currentLastPrice.value = newPrice
  }

  return {
    previousLastPrice,
    currentLastPrice,
  }
})
