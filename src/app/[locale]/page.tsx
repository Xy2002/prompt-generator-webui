import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { HomeClient } from './home-client';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'HomePage' });

  return {
    title: t('title'),
    description: t('description'),
    keywords: 'prompt generator, AI prompt, metaprompt, template generator, AI tools',
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

export default function Home() {
  return <HomeClient />;
}
