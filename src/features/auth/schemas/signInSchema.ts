import { z } from 'zod';

import { passwordRules } from '../utils/passwordRules';

type TranslateFn = (key: string) => string;
export const createSignInSchema = (t: TranslateFn) =>
  z.object({
    email: z.email({ message: t('validation.emailInvalid') }),
    password: z
      .string()
      .min(passwordRules.minLength, { message: t('validation.passwordMinLength') })
      .max(50),
  });

export type SignInSchema = z.infer<ReturnType<typeof createSignInSchema>>;
