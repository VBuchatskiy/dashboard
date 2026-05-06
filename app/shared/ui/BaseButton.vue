<script setup lang="ts">
import { cn } from '~/shared/lib/cn'

const props = withDefaults(defineProps<{
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  loading?: boolean
  block?: boolean
}>(), {
  type: 'button'
})

const buttonClass = computed(() => cn(
  'rounded-lg px-4 py-2 text-sm font-semibold text-white transition',
  'bg-blue-600 hover:bg-blue-500',
  props.block && 'w-full',
  (props.disabled || props.loading) && 'opacity-50 cursor-not-allowed'
))
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="buttonClass"
  >
    <slot />
  </button>
</template>
