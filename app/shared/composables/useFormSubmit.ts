export function useFormSubmit(fn: () => Promise<void>) {
  const loading = ref(false)
  const error = ref('')

  async function submit() {
    error.value = ''
    loading.value = true
    try {
      await fn()
    } catch (e: unknown) {
      if (e instanceof Error) {
        error.value = e.message
      } else {
        error.value = 'Неизвестная ошибка'
      }
    } finally {
      loading.value = false
    }
  }

  return { loading, error, submit }
}
