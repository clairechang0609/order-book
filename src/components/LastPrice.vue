<template>
  <div class="last-price" :class="priceClass">
    {{ toThousands(price.toFixed(1)) }}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      role="presentation"
      fill="none"
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
</template>

<script setup lang="ts">
import { computed } from 'vue'
import toThousands from '@/utils/toThousands'

const props = defineProps<{
  price: number
  previousPrice: number
}>()

const priceClass = computed(() => {
  if (props.price > props.previousPrice) return 'last-price--up'
  if (props.price < props.previousPrice) return 'last-price--down'
  return 'last-price--same'
})
</script>

<style lang="scss" scoped>
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
</style>
