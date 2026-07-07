import { z } from 'zod';

import { passwordRules } from '../utils/passwordRules';

type TranslateFn = (key: string) => string;
export const createSignUpSchema = (t: TranslateFn) =>
  z
    .object({
      email: z.email({ message: t('validation.emailInvalid') }),
      password: z
        .string()
        .min(1, { message: t('validation.required') })
        .min(passwordRules.minLength, { message: t('validation.passwordMinLength') })
        .refine((val) => passwordRules.letter.test(val), { message: t('password.letter') })
        .refine((val) => passwordRules.digit.test(val), { message: t('password.digit') })
        .refine((val) => passwordRules.special.test(val), { message: t('password.special') })
        .max(50),
      confirmPassword: z.string().min(1, { message: t('validation.required') }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('password.mismatch'),
      path: ['confirmPassword'],
    });

export type SignUpSchema = z.infer<ReturnType<typeof createSignUpSchema>>;
