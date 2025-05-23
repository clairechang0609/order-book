import { ref } from 'vue'
import { useWebSocket } from '@vueuse/core'
import { useLastPriceStore } from '@/stores/lastPrice'

const { VITE_WS_HOST, VITE_TEST_WS_HOST, VITE_TRADE_PATH } = import.meta.env

export function useLastPriceSocket() {
  const lastPriceStore = useLastPriceStore()
  const currentLastPrice = ref<number>(0)

  const { status, send, open, close } = useWebSocket(
    `wss://${VITE_TEST_WS_HOST}${VITE_TRADE_PATH}`,
    {
      immediate: true,
      onConnected() {
        send(
          JSON.stringify({
            op: 'subscribe',
            args: ['tradeHistoryApi:BTCPFC'],
          }),
        )
      },
      onMessage(_, event) {
        const raw = JSON.parse(event.data)
        if (raw.topic === 'tradeHistoryApi' && Array.isArray(raw.data)) {
          const firstTrade = raw.data[0]
          if (firstTrade?.price) {
            currentLastPrice.value = Number(firstTrade.price)
            lastPriceStore.updateLastPrice(currentLastPrice.value)
          }
        }
      },
      onError(_, event) {
        console.error('LastPrice WebSocket Error', event)
      },
    },
  )

  return {
    status,
    open,
    close,
  }
}
