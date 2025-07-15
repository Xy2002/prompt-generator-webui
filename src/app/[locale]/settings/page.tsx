import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { SettingsClient } from './settings-client';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'SettingsPage' });

  return {
    title: t('title'),
    description: t('description'),
    keywords: 'settings, configuration, data management, export import',
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

export default function SettingsPage() {
  return <SettingsClient />;
}