<script setup lang="ts">
const model = defineModel<string | undefined>()

const props = withDefaults(
  defineProps<{
    label: string
    forId: string
    error?: string
    inputAttrs?: Record<string, unknown>
    type?: string
    placeholder?: string
    autocomplete?: string
  }>(),
  {
    type: 'text',
    inputAttrs: () => ({})
  }
)

const hasError = computed(() => Boolean(props.error))
const errorDescribedBy = computed(() =>
  hasError.value ? `${props.forId}-error` : undefined
)
</script>

<template>
  <BaseField :label="label" :for-id="forId" :error="error">
    <BaseInput
      :id="forId"
      v-bind="inputAttrs"
      v-model="model"
      :type="type"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      :invalid="hasError"
      :aria-describedby="errorDescribedBy"
    />
  </BaseField>
</template>
