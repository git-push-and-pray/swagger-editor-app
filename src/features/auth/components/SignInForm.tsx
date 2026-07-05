'use client';

import type { JSX } from 'react/jsx-runtime';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';

import { signIn } from '@/app/[locale]/actions/signIn';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

import { useAuthActions } from '../hooks/useAuthActions';
import { createSignInSchema, type SignInSchema } from '../schemas/signInSchema';

const SignInForm = (): JSX.Element => {
  const t = useTranslations('Auth');
  const tToast = useTranslations('Auth.SignIn');
  const tPage = useTranslations('SignInPage');
  const schema = createSignInSchema(t);
  const { runAuth } = useAuthActions(tToast);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<SignInSchema>({
    mode: 'onChange',
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: SignInSchema) => {
    await runAuth(signIn, '/')(data);
  };

  return (
    <form
      noValidate={true}
      onSubmit={handleSubmit(onSubmit)}
      className="border-border bg-surface flex w-75 flex-col gap-1 rounded-xl border p-6 shadow-xl sm:w-96"
    >
      <Input
        type="email"
        label="Email"
        id="sign-in-email"
        {...register('email')}
        placeholder="name@example.com"
        error={errors?.email?.message}
        disabled={isSubmitting}
      />
      <Input
        type="password"
        label="Password"
        id="sign-in-password"
        {...register('password')}
        placeholder="••••••••"
        error={errors?.password?.message}
        disabled={isSubmitting}
      />
      <Button
        type="submit"
        name={tPage('mainBtn')}
        icon="arrow-right"
        hideTextOnMobile={false}
        iconPosition="right"
        size="sm"
        btnVersion="primary"
        className="mt-4"
        disabled={!isValid || isSubmitting}
      />
    </form>
  );
};

export default SignInForm;
