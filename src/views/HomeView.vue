<script setup lang="ts">
import toThousands from '@/utils/toThousands'
import { useOrderBookSocket } from '@/composables/useOrderBookSocket'
import { useLastPriceStore } from '@/stores/lastPrice'
import { computed } from 'vue'
const { data } = useOrderBookSocket()

const lastPriceStore = useLastPriceStore() // 自動初始化，無須呼叫 useLastPriceSocket()

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
        <div>Price</div>
        <div class="size">Size</div>
        <div class="total">Total</div>
      </div>
      <div
        class="quote-row sell"
        v-for="([price, size], idx) in data?.data.asks.slice(-8)"
        :key="`ask-${idx}`"
      >
        <div class="price">{{ toThousands(price) }}</div>
        <div class="size">{{ toThousands(size) }}</div>
        <div class="total">
          <div class="total-bar" :style="{ width: +'%' }"></div>
          5,657
        </div>
      </div>
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
      <div
        class="quote-row buy"
        v-for="([price, size], idx) in data?.data.bids.slice(0, 8)"
        :key="`bid-${idx}`"
      >
        <div class="price">{{ toThousands(price) }}</div>
        <div class="size">{{ toThousands(size) }}</div>
        <div class="total">
          <div class="total-bar" :style="{ width: +'%' }"></div>
          591
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
}

.quote-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr) 1.75fr;
  position: relative;
  padding: 0 8px;

  .size,
  .total {
    text-align: right;
  }
}

.heading {
  color: var(--color-heading);
  font-weight: normal;
}

.sell .price {
  color: var(--color-quote-sell);
}
.buy .price {
  color: var(--color-quote-buy);
}

.total-bar {
  position: absolute;
  right: 0;
  height: 100%;
  background-color: rgba(0, 177, 93, 0.12); /* or red for sell */
  z-index: 0;
}

.last-price {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  padding: 0.25rem;

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
</style>
