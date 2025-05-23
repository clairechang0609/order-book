<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <header>
    <h1>Order Book</h1>
  </header>
  <RouterView />
</template>

<style scoped>
header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  padding: 0.5rem 1rem;
  height: var(--height-header);
}

h1 {
  font-size: 1.5rem;
}
</style>
