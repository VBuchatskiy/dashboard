<script setup lang="ts">
import { registerSchema } from '@/features/auth/validation/authForms'
import { cn } from '@/shared/lib/cn'

const { register } = useAuth()

const emit = defineEmits<{ success: [] }>()

const { errors, handleSubmit, defineField } = useForm({
  validationSchema: registerSchema
})

const [email, emailAttrs] = defineField('email')
const [password, passwordAttrs] = defineField('password')
const [passwordConfirm, passwordConfirmAttrs] = defineField('passwordConfirm')

const { loading, error, submit } = useFormSubmit()

const onSubmit = handleSubmit(async (values) => {
  await submit(async () => {
    await register(values.email, values.password)
    emit('success')
  })
})

const formClass = cn('w-full space-y-4')

const inputClass = cn(
  'w-full rounded-lg border border-gray-700 bg-gray-800',
  'px-3 py-2 text-sm text-white placeholder-gray-500',
  'outline-none transition',
  'focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
)

const inputErrorClass = 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
</script>

<template>
  <div class="w-full sm:max-w-sm md:max-w-md">
    <div class="mb-8 text-center">
      <h1 class="text-2xl font-bold text-white">Регистрация</h1>
      <p class="mt-1 text-sm text-gray-400">Создайте аккаунт</p>
    </div>

    <form :class="formClass" @submit.prevent="onSubmit">
      <div class="space-y-1.5">
        <label class="text-sm font-medium text-gray-300" for="reg-email">Email</label>
        <input
          id="reg-email"
          v-bind="emailAttrs"
          v-model="email"
          type="email"
          placeholder="you@example.com"
          autocomplete="email"
          :class="cn(inputClass, errors.email && inputErrorClass)"
        >
        <p v-if="errors.email" class="text-sm text-red-400">{{ errors.email }}</p>
      </div>

      <div class="space-y-1.5">
        <label class="text-sm font-medium text-gray-300" for="reg-password">Пароль</label>
        <input
          id="reg-password"
          v-bind="passwordAttrs"
          v-model="password"
          type="password"
          placeholder="Не менее 8 символов"
          autocomplete="new-password"
          :class="cn(inputClass, errors.password && inputErrorClass)"
        >
        <p v-if="errors.password" class="text-sm text-red-400">{{ errors.password }}</p>
      </div>

      <div class="space-y-1.5">
        <label class="text-sm font-medium text-gray-300" for="reg-password2">Пароль ещё раз</label>
        <input
          id="reg-password2"
          v-bind="passwordConfirmAttrs"
          v-model="passwordConfirm"
          type="password"
          placeholder="Повторите пароль"
          autocomplete="new-password"
          :class="cn(inputClass, errors.passwordConfirm && inputErrorClass)"
        >
        <p v-if="errors.passwordConfirm" class="text-sm text-red-400">{{ errors.passwordConfirm }}</p>
      </div>

      <p v-if="error" class="text-sm text-red-400">{{ error }}</p>

      <BaseButton type="submit" block :loading="loading" :disabled="loading">
        {{ loading ? 'Регистрация...' : 'Зарегистрироваться' }}
      </BaseButton>
    </form>

    <p class="mt-6 text-center text-sm text-gray-400">
      Уже есть аккаунт?
      <NuxtLink to="/login" class="text-blue-400 hover:text-blue-300">Войти</NuxtLink>
    </p>
  </div>
</template>
