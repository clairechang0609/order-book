<script setup lang="ts">
import toThousands from '@/utils/toThousands'
// import { useOrderBookSocket } from '@/composables/useOrderBookSocket'
import { useOrderBookStore } from '@/stores/orderBook'
import { useLastPriceStore } from '@/stores/lastPrice'
import { computed } from 'vue'
// const { data } = useOrderBookSocket()

const orderBookStore = useOrderBookStore()
const lastPriceStore = useLastPriceStore() // 自動初始化，無須呼叫 useLastPriceSocket()

const isNewPrice = (side: 'ask' | 'bid', price: string) => {
  const prev = side === 'ask' ? orderBookStore.prevAsks : orderBookStore.prevBids
  return !prev.some(([p]) => p === price)
}

const getSizeChangeClass = (side: 'ask' | 'bid', price: string, size: string) => {
  const prev = side === 'ask' ? orderBookStore.prevAsks : orderBookStore.prevBids
  const match = prev.find(([p]) => p === price)
  if (!match) return ''
  const prevSize = parseFloat(match[1])
  const currSize = parseFloat(size)
  if (currSize > prevSize) return 'flash-green'
  if (currSize < prevSize) return 'flash-red'
  return ''
}

const lastPriceClass = computed(() => {
  const current = lastPriceStore.currentLastPrice
  const previous = lastPriceStore.previousLastPrice

  if (current > previous) return 'last-price--up'
  if (current < previous) return 'last-price--down'
  return 'last-price--same'
})
</script>

<template>
  <main>
    <!-- <pre>data: {{ data }}</pre> -->
    <div class="orderbook">
      <div class="quote-row heading">
        <div>Price (USD)</div>
        <div class="size">Size</div>
        <div class="total">Total</div>
      </div>
      <!-- 賣單 -->
      <div
        class="quote-row sell"
        v-for="({ price, size, accum, percent }, idx) in orderBookStore.askLevelsWithTotal"
        :key="`ask-${idx}`"
        :class="{ 'row-highlight-red': isNewPrice('ask', price) }"
      >
        <div class="price">{{ toThousands(price) }}</div>
        <div class="size" :class="getSizeChangeClass('ask', price, size)">
          {{ toThousands(size) }}
        </div>
        <div class="total">
          <div class="total-bar" :style="{ width: percent }"></div>
          {{ toThousands(accum) }}
        </div>
      </div>

      <!-- 最新成交價 -->
      <div class="last-price" :class="lastPriceClass">
        {{ toThousands(lastPriceStore.currentLastPrice.toFixed(1)) }}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          role="presentation"
          fill="none"
          fill-rule="nonzero"
          stroke="currentColor"
          stroke-width="4"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="arrow-icon"
        >
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <polyline points="19 12 12 19 5 12"></polyline>
        </svg>
      </div>

      <!-- 買單 -->
      <div
        class="quote-row buy"
        v-for="({ price, size, accum, percent }, idx) in orderBookStore.bidLevelsWithTotal"
        :key="`bid-${idx}`"
        :class="{ 'row-highlight-green': isNewPrice('bid', price) }"
      >
        <div class="price">{{ toThousands(price) }}</div>
        <div class="size" :class="getSizeChangeClass('bid', price, size)">
          {{ toThousands(size) }}
        </div>
        <div class="total">
          <div class="total-bar" :style="{ width: percent }"></div>
          {{ toThousands(accum) }}
        </div>
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.orderbook {
  display: flex;
  flex-direction: column;
  height: calc(100vh - var(--height-header));
  justify-content: space-between;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.quote-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr) 1.5fr;
  padding: 0.25rem 1rem;
  font-size: 1.25rem;

  &:hover {
    background-color: var(--color-quote-hover-bg) !important;
  }

  .price,
  .size,
  .total {
    height: 100%;
  }

  .size,
  .total {
    text-align: right;
  }
}

.heading {
  color: var(--color-heading);
  font-weight: normal;
  font-size: 1rem;
}

.sell .price {
  color: var(--color-quote-sell);
}
.buy .price {
  color: var(--color-quote-buy);
}

.total {
  position: relative;
  margin-left: 1rem;
}

.total-bar {
  position: absolute;
  right: 0;
  height: 100%;
  z-index: 0;
}

.buy .total-bar {
  background-color: var(--color-quote-buy-bar);
}

.sell .total-bar {
  background-color: var(--color-quote-sell-bar);
}

.last-price {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  padding: 0.25rem;
  margin: 0.25rem;

  &--up {
    color: var(--color-lastprice-up);
    background-color: var(--color-lastprice-up-bg);
    .arrow-icon {
      transform: rotate(180deg);
    }
  }

  &--down {
    color: var(--color-lastprice-down);
    background-color: var(--color-lastprice-down-bg);
  }

  &--same {
    color: var(--color-lastprice-same);
    background-color: var(--color-lastprice-same-bg);
    .arrow-icon {
      display: none;
    }
  }
}

.arrow-icon {
  margin-left: 0.5rem;
}

.row-highlight-green,
.flash-green {
  animation: flash-green 0.3s ease-out;
}

.row-highlight-red,
.flash-red {
  animation: flash-red 0.3s ease-out;
}

@keyframes flash-green {
  from {
    background-color: var(--color-flash-green);
  }
  to {
    background-color: transparent;
  }
}

@keyframes flash-red {
  from {
    background-color: var(--color-flash-red);
  }
  to {
    background-color: transparent;
  }
}
</style>
