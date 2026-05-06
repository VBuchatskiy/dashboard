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
</script>

<template>
  <div class="w-full sm:max-w-sm md:max-w-md">
    <div class="mb-8 text-center">
      <h1 class="text-2xl font-bold text-white">Регистрация</h1>
      <p class="mt-1 text-sm text-gray-400">Создайте аккаунт</p>
    </div>

    <form :class="formClass" @submit.prevent="onSubmit">
      <BaseFormField
        v-model="email"
        label="Email"
        for-id="reg-email"
        :error="errors.email"
        :input-attrs="emailAttrs"
        type="email"
        placeholder="you@example.com"
        autocomplete="email"
      />

      <BaseFormField
        v-model="password"
        label="Пароль"
        for-id="reg-password"
        :error="errors.password"
        :input-attrs="passwordAttrs"
        type="password"
        placeholder="Не менее 8 символов"
        autocomplete="new-password"
      />

      <BaseFormField
        v-model="passwordConfirm"
        label="Пароль ещё раз"
        for-id="reg-password2"
        :error="errors.passwordConfirm"
        :input-attrs="passwordConfirmAttrs"
        type="password"
        placeholder="Повторите пароль"
        autocomplete="new-password"
      />

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
