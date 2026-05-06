<script setup lang="ts">
import { cn } from '~/shared/lib/cn'

const { login } = useAuth()

const email = ref('')
const password = ref('')

const emit = defineEmits<{ success: [] }>()

const { loading, error, submit } = useFormSubmit(async () => {
  await login(email.value, password.value)
  emit('success')
})

const formClass = cn('w-full space-y-4')

const inputClass = cn(
  'w-full rounded-lg border border-gray-700 bg-gray-800',
  'px-3 py-2 text-sm text-white placeholder-gray-500',
  'outline-none transition',
  'focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
)
</script>

<template>
  <div class="w-full sm:max-w-sm md:max-w-md">
    <div class="mb-8 text-center">
      <h1 class="text-2xl font-bold text-white">Войти</h1>
      <p class="mt-1 text-sm text-gray-400">Введите данные для входа</p>
    </div>

    <form :class="formClass" @submit.prevent="submit">
      <div class="space-y-1.5">
        <label class="text-sm font-medium text-gray-300" for="email">Email</label>
        <input
          id="email"
          v-model="email"
          type="email"
          placeholder="admin@example.com"
          autocomplete="email"
          required
          :class="inputClass"
        >
      </div>

      <div class="space-y-1.5">
        <label class="text-sm font-medium text-gray-300" for="password">Пароль</label>
        <input
          id="password"
          v-model="password"
          type="password"
          placeholder="••••••••"
          autocomplete="current-password"
          required
          :class="inputClass"
        >
      </div>

      <p v-if="error" class="text-sm text-red-400">{{ error }}</p>

      <BaseButton type="submit" block :loading="loading" :disabled="loading">
        {{ loading ? 'Вход...' : 'Войти' }}
      </BaseButton>
    </form>

    <p class="mt-6 text-center text-sm text-gray-400">
      Нет аккаунта?
      <NuxtLink to="/register" class="text-blue-400 hover:text-blue-300">Зарегистрироваться</NuxtLink>
    </p>
  </div>
</template>
