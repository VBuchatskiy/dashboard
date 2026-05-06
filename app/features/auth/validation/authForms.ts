import { toTypedSchema } from '@vee-validate/valibot'
import * as v from 'valibot'

const loginObject = v.object({
  email: v.pipe(v.string(), v.email('Введите корректный email')),
  password: v.pipe(v.string(), v.minLength(1, 'Укажите пароль'))
})

export const loginSchema = toTypedSchema(loginObject)

const registerObject = v.pipe(
  v.object({
    email: v.pipe(v.string(), v.email('Введите корректный email')),
    password: v.pipe(v.string(), v.minLength(8, 'Не менее 8 символов')),
    passwordConfirm: v.pipe(v.string(), v.minLength(1, 'Подтвердите пароль'))
  }),
  v.forward(
    v.partialCheck(
      [['password'], ['passwordConfirm']],
      (input) => input.password === input.passwordConfirm,
      'Пароли не совпадают'
    ),
    ['passwordConfirm']
  )
)

export const registerSchema = toTypedSchema(registerObject)
