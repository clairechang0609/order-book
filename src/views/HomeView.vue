<script setup lang="ts">
import { useOrderBookStore } from '@/stores/orderBook'
import { useLastPriceStore } from '@/stores/lastPrice'
import LastPrice from '@/components/LastPrice.vue'
import QuoteRow from '@/components/QuoteRow.vue'

const orderBookStore = useOrderBookStore()
const lastPriceStore = useLastPriceStore()
</script>

<template>
  <main>
    <div class="orderbook">
      <div class="table-row heading">
        <div>Price (USD)</div>
        <div class="size">Size</div>
        <div class="total">Total</div>
      </div>

      <!-- sell quote -->
      <QuoteRow
        v-for="({ price, size, accum, percent }, idx) in orderBookStore.askLevelsWithTotal"
        :key="`ask-${idx}`"
        side="ask"
        :price="price"
        :size="size"
        :accum="accum"
        :percent="percent"
        :prevLevels="orderBookStore.prevAsks"
        class="table-row"
      />

      <!-- last price -->
      <LastPrice
        :price="lastPriceStore.currentLastPrice"
        :previous-price="lastPriceStore.previousLastPrice"
      />

      <!-- buy quote -->
      <QuoteRow
        v-for="({ price, size, accum, percent }, idx) in orderBookStore.bidLevelsWithTotal"
        :key="`bid-${idx}`"
        side="bid"
        :price="price"
        :size="size"
        :accum="accum"
        :percent="percent"
        :prevLevels="orderBookStore.prevBids"
        class="table-row"
      />
    </div>
  </main>
</template>

<style lang="scss" scoped>
.orderbook {
  display: flex;
  flex-direction: column;
  height: calc(100dvh - var(--height-header));
  height: calc(100vh - var(--height-header));
  justify-content: space-between;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.table-row,
:deep(.table-row) {
  display: grid;
  grid-template-columns: repeat(2, 1fr) 1.5fr;
  padding: 0.25rem 1rem;
  font-size: 1.25rem;

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
</style>
