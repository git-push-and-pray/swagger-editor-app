import { getTranslations } from 'next-intl/server';

import LinkComponent from '@/components/ui/Link';
import AuthFormLayout from '@/features/auth/components/AuthFormLayout';
import SignUpForm from '@/features/auth/components/SignUpForm';

export const dynamic = 'force-static';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function SignUpPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'SignUpPage' });
  return (
    <AuthFormLayout
      title={t('title')}
      desc={t('desc')}
      footerText={
        <p>
          {t('footerText')}{' '}
          <LinkComponent name={t('btn')} href="/signin" size="sm" linkVersion="regular" />
        </p>
      }
    >
      <SignUpForm />
    </AuthFormLayout>
  );
}
