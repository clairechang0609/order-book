<template>
  <div class="quote-row" :class="[side, isNewQuote && flashClass]">
    <div class="price">{{ toThousands(price) }}</div>
    <div class="size" :class="sizeChangeClass">{{ toThousands(size) }}</div>
    <div class="total">
      <div class="total-bar" :style="{ width: percent }" />
      {{ toThousands(accum) }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import toThousands from '@/utils/toThousands'

const props = defineProps<{
  side: 'ask' | 'bid'
  price: string
  size: string
  accum: string
  percent: string
  prevLevels: [string, string][]
}>()

const isNewQuote = computed(() => !props.prevLevels.some(([p]) => p === props.price))

const flashClass = computed(() => (props.side === 'ask' ? 'flash-red' : 'flash-green'))

const sizeChangeClass = computed(() => {
  const match = props.prevLevels.find(([p]) => p === props.price)
  if (!match) return ''
  const prevSize = parseFloat(match[1])
  const currSize = parseFloat(props.size)
  if (currSize > prevSize) return 'flash-green'
  if (currSize < prevSize) return 'flash-red'
  return ''
})
</script>

<style lang="scss" scoped>
.quote-row:hover {
  background-color: var(--color-quote-hover-bg) !important;
}

.ask .price {
  color: var(--color-quote-sell);
}

.bid .price {
  color: var(--color-quote-buy);
}

.total {
  position: relative;
}

.total-bar {
  position: absolute;
  right: 0;
  height: 100%;
  z-index: 0;
}

.ask .total-bar {
  background-color: var(--color-quote-sell-bar);
}

.bid .total-bar {
  background-color: var(--color-quote-buy-bar);
}

.flash-green {
  animation: flash-green 0.3s ease-out;
}

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
