<script setup lang="ts">
import { loginSchema } from '@/features/auth/validation/authForms'
import { cn } from '@/shared/lib/cn'

const { login } = useAuth()

const emit = defineEmits<{ success: [] }>()

const { errors, handleSubmit, defineField } = useForm({
  validationSchema: loginSchema
})

const [email, emailAttrs] = defineField('email')
const [password, passwordAttrs] = defineField('password')

const { loading, error, submit } = useFormSubmit()

const onSubmit = handleSubmit(async (values) => {
  await submit(async () => {
    await login(values.email, values.password)
    emit('success')
  })
})

const formClass = cn('w-full space-y-4')
</script>

<template>
  <div class="w-full sm:max-w-sm md:max-w-md">
    <div class="mb-8 text-center">
      <h1 class="text-2xl font-bold text-white">Войти</h1>
      <p class="mt-1 text-sm text-gray-400">Введите данные для входа</p>
    </div>

    <form :class="formClass" @submit.prevent="onSubmit">
      <BaseFormField
        v-model="email"
        label="Email"
        for-id="email"
        :error="errors.email"
        :input-attrs="emailAttrs"
        type="email"
        placeholder="admin@example.com"
        autocomplete="email"
      />

      <BaseFormField
        v-model="password"
        label="Пароль"
        for-id="password"
        :error="errors.password"
        :input-attrs="passwordAttrs"
        type="password"
        placeholder="••••••••"
        autocomplete="current-password"
      />

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
