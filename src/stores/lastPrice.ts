import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useWebSocket } from '@vueuse/core'

const { VITE_WS_HOST, VITE_TRADE_PATH } = import.meta.env

export const useLastPriceStore = defineStore('last-price', () => {
  const previousLastPrice = ref<number>(0)
  const currentLastPrice = ref<number>(0)

  // 初始化 WebSocket
  const { status, send } = useWebSocket(`wss://${VITE_WS_HOST}${VITE_TRADE_PATH}`, {
    immediate: true,
    onConnected() {
      send(JSON.stringify({ op: 'subscribe', args: ['tradeHistoryApi:BTCPFC'] }))
    },
    onMessage(_, event) {
      const raw = JSON.parse(event.data)
      if (raw.topic === 'tradeHistoryApi' && Array.isArray(raw.data)) {
        const firstTrade = raw.data[0]
        if (firstTrade?.price) {
          updateLastPrice(Number(firstTrade.price))
        }
      }
    },
  })

  const updateLastPrice = (newPrice: number) => {
    previousLastPrice.value = currentLastPrice.value
    currentLastPrice.value = newPrice
  }

  return {
    status,
    previousLastPrice,
    currentLastPrice,
    updateLastPrice,
  }
})
