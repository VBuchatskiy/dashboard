export function useFormSubmit() {
  const loading = ref(false)
  const error = ref('')

  async function submit(fn: () => Promise<void>) {
    error.value = ''
    loading.value = true
    try {
      await fn()
    } catch (e: unknown) {
      if (e instanceof Error) {
        error.value = e.message
      } else {
        error.value = 'unknown error'
      }
    } finally {
      loading.value = false
    }
  }

  return { loading, error, submit }
}
