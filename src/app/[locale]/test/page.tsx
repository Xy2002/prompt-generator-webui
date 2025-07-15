import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { TestClient } from './test-client';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'TestPage' });

  return {
    title: t('title'),
    description: t('description'),
    keywords: 'prompt testing, AI prompt validation, template testing, prompt evaluation',
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
    },
  };
}

export default function TestPage() {
  return <TestClient />;
}