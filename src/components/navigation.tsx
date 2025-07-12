"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { Menu, X, Github } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useTranslations } from "next-intl";
import { useState } from "react";

export function Navigation() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const t = useTranslations('Navigation');

  const links = [
    { href: "/", label: t('home') },
    { href: "/history", label: t('history') },
    { href: "/test", label: t('test') },
    { href: "/settings", label: t('settings') },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center justify-between px-4 mx-auto max-w-screen-2xl">
          <div className="flex items-center">
            <Link className="mr-6 flex items-center space-x-2" href="/" onClick={closeMenu}>
              <span className="font-bold">
                {t('appName')}
              </span>
            </Link>
            {/* Desktop navigation */}
            <nav className="hidden md:flex items-center gap-4 text-sm lg:gap-6">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "transition-colors hover:text-foreground/80",
                    pathname === link.href ? "text-foreground" : "text-foreground/60"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            {/* Language switcher */}
            <LanguageSwitcher />

            {/* GitHub button */}
            <Link
              href="https://github.com/Xy2002/prompt-generator-webui"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="ghost" size="sm" className="h-8 w-8 px-0">
                <Github className="h-4 w-4" />
                <span className="sr-only">{t('github')}</span>
              </Button>
            </Link>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 px-0 md:hidden"
              onClick={toggleMenu}
            >
              {isMenuOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
              <span className="sr-only">{t('menu')}</span>
            </Button>
          </div>
        </div>

        {/* Mobile navigation menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur">
            <nav className="px-4 py-2 space-y-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className={cn(
                    "block px-3 py-2 rounded-md text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                    pathname === link.href
                      ? "bg-accent text-accent-foreground"
                      : "text-foreground/70"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </nav>
    </>
  );
}