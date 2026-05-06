<script setup lang="ts">
import { cn } from '@/shared/lib/cn'

const layoutClass = cn(
  'min-h-screen flex items-center justify-center bg-gray-950',
  'px-4 sm:px-6'
)
</script>

<template>
  <div :class="layoutClass">
    <slot />
  </div>
</template>
