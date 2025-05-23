import { ref } from 'vue'
import { useWebSocket } from '@vueuse/core'
import type { OrderBookMessage } from '@/types/order'

const { VITE_WS_HOST, VITE_TEST_WS_HOST, VITE_ORDERBOOK_PATH } = import.meta.env

export function useOrderBookSocket() {
  const data = ref<OrderBookMessage>() // TODO: 型別

  const { status, send, open, close } = useWebSocket(
    `wss://${VITE_TEST_WS_HOST}${VITE_ORDERBOOK_PATH}`,
    {
      immediate: true, // 自動連線
      onConnected() {
        send(
          JSON.stringify({
            op: 'subscribe',
            args: ['update:BTCPFC_0'],
          }),
        )
      },
      onMessage(_, event) {
        const raw = JSON.parse(event.data)
        if (raw.topic === 'update:BTCPFC_0') {
          data.value = raw
        }
      },
      onError(_, event) {
        console.error('WebSocket Error', event)
      },
    },
  )

  console.log(data)

  return {
    status, // WebSocket 狀態
    data,
    open,
    close,
  }
}
