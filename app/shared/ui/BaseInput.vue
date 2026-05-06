<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/shared/lib/cn'

defineOptions({ inheritAttrs: false })

const model = defineModel<string | undefined>()

const props = defineProps<{
  invalid?: boolean
  ariaDescribedby?: string
}>()

const attrs = useAttrs()

const inputClass = computed(() =>
  cn(
    'w-full rounded-lg border border-gray-700 bg-gray-800',
    'px-3 py-2 text-sm text-white placeholder-gray-500',
    'outline-none transition',
    'focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20',
    props.invalid && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
    attrs.class as HTMLAttributes['class']
  )
)

const passthroughAttrs = computed(() => {
  const { class: _c, ...rest } = attrs as Record<string, unknown>
  return rest
})
</script>

<template>
  <input
    v-bind="passthroughAttrs"
    v-model="model"
    :class="inputClass"
    :aria-invalid="invalid ? true : undefined"
    :aria-describedby="ariaDescribedby"
  >
</template>
