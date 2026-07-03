'use client';

import { type JSX, useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';

import { signUp } from '@/app/[locale]/actions/signUp';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

import { useAuthActions } from '../hooks/useAuthActions';
import { createSignUpSchema, type SignUpSchema } from '../schemas/signUpSchema';
import PasswordIndicator from './PasswordIndicator';

const SignUpForm = (): JSX.Element => {
  const t = useTranslations('Auth');
  const tToast = useTranslations('Auth.SignUp');
  const tPage = useTranslations('SignUpPage');
  const schema = createSignUpSchema(t);
  const { runAuth } = useAuthActions(tToast);
  const {
    register,
    handleSubmit,
    control,
    trigger,
    formState: { errors, isValid, touchedFields, isSubmitting },
  } = useForm<SignUpSchema>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const password = useWatch({ control, name: 'password' });

  useEffect(() => {
    if (touchedFields['confirmPassword']) trigger('confirmPassword');
  }, [password, trigger, touchedFields]);

  const onSubmit = async (data: SignUpSchema) => {
    await runAuth(signUp, '/')(data);
  };

  return (
    <form
      noValidate={true}
      onSubmit={handleSubmit(onSubmit)}
      className="border-border bg-surface flex w-75 flex-col rounded-xl border p-6 shadow-xl sm:w-96"
    >
      <Input
        type="email"
        label="Email"
        id="sign-up-email"
        {...register('email')}
        placeholder="name@example.com"
        error={errors?.email?.message}
        disabled={isSubmitting}
      />
      <Input
        type="password"
        label="Password"
        id="sign-up-password"
        {...register('password')}
        placeholder={tPage('passPlaceholder')}
        error={errors?.password?.message}
        disabled={isSubmitting}
      />
      <Input
        type="password"
        label="Confirm password"
        id="sign-up-conf-password"
        {...register('confirmPassword')}
        placeholder={tPage('passConfPlaceholder')}
        error={errors?.confirmPassword?.message}
        disabled={isSubmitting}
      />
      <PasswordIndicator value={password} />
      <Button
        type="submit"
        name={tPage('mainBtn')}
        icon="arrow-right"
        hideTextOnMobile={false}
        iconPosition="right"
        size="sm"
        btnVersion="primary"
        disabled={!isValid || isSubmitting}
      />
    </form>
  );
};

export default SignUpForm;
