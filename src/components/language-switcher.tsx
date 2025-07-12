"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Languages, ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";

export function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('LanguageSwitcher');

  const languages = [
    { code: 'en', name: t('english'), flag: '🇺🇸' },
    { code: 'zh-CN', name: t('chinese'), flag: '🇨🇳' }
  ];

  const currentLanguage = languages.find(lang => lang.code === locale);

  const handleLanguageChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        className="h-8 px-2 text-xs"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Languages className="h-3 w-3 mr-1" />
        <span className="hidden sm:inline">{currentLanguage?.flag}</span>
        <span className="hidden md:inline ml-1">{currentLanguage?.name}</span>
        <ChevronDown className="h-3 w-3 ml-1" />
      </Button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-1 z-50 min-w-[120px] rounded-md border bg-popover p-1 text-popover-foreground shadow-md">
            {languages.map((language) => (
              <button
                key={language.code}
                className={`w-full flex items-center px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors ${
                  locale === language.code ? 'bg-accent text-accent-foreground' : ''
                }`}
                onClick={() => handleLanguageChange(language.code)}
              >
                <span className="mr-2">{language.flag}</span>
                <span>{language.name}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}