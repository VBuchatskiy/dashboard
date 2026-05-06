<script setup lang="ts">
const props = defineProps<{
  label: string
  forId: string
  error?: string
}>()

const errorId = computed(() => `${props.forId}-error`)
</script>

<template>
  <div class="space-y-1.5">
    <label class="text-sm font-medium text-gray-300" :for="forId">{{ label }}</label>
    <slot />
    <p
      v-if="error"
      :id="errorId"
      class="text-sm text-red-400"
      role="alert"
    >
      {{ error }}
    </p>
  </div>
</template>
