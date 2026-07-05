import { getTranslations } from 'next-intl/server';

import LinkComponent from '@/components/ui/Link';
import AuthFormLayout from '@/features/auth/components/AuthFormLayout';
import SignInForm from '@/features/auth/components/SignInForm';

export const dynamic = 'force-static';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function SignInPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'SignInPage' });
  return (
    <AuthFormLayout
      title={t('title')}
      desc={t('desc')}
      footerText={
        <p>
          {t('footerText')}{' '}
          <LinkComponent name={t('btn')} href="/signup" size="sm" linkVersion="regular" />
        </p>
      }
    >
      <SignInForm />
    </AuthFormLayout>
  );
}
