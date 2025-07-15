import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { HistoryClient } from './history-client';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'HistoryPage' });

  return {
    title: t('title'),
    description: t('description'),
    keywords: 'prompt history, template history, AI prompt management, saved prompts',
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

export default function HistoryPage() {
  return <HistoryClient />;
}