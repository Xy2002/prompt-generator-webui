import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { ResultsClient } from './results-client';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'TestResults' });

  return {
    title: t('title'),
    description: t('description'),
    keywords: 'test results, prompt results, AI output, template results',
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

export default function TestResultsPage() {
  return <ResultsClient />;
}