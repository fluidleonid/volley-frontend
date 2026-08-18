import React from 'react';
import { useTranslation } from 'react-i18next';
import { Header } from '../../widgets/layout/Header';
import { Check } from 'lucide-react';
import { cn } from '../../shared/lib/utils';

interface LanguageSelectViewProps {
  onClose: () => void;
}

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'ru', label: 'Русский' },
  { code: 'am', label: 'Հայերեն' },
];

export const LanguageSelectView: React.FC<LanguageSelectViewProps> = ({ onClose }) => {
  const { t, i18n } = useTranslation();

  const handleSelectLanguage = (code: string) => {
    i18n.changeLanguage(code);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col animate-in slide-in-from-right-full duration-300 max-w-[480px] mx-auto px-4">
      <Header variant="page" sticky stickyClassName="-mx-4 px-4" title={t('language.title')} onBack={onClose} />
      
      <div className="flex-1 overflow-y-auto py-6">
        <div className="space-y-2">
          {LANGUAGES.map((lang) => (
            <div
              key={lang.code}
              onClick={() => handleSelectLanguage(lang.code)}
              className={cn(
                "flex items-center justify-between p-4 rounded-xl cursor-pointer transition-colors",
                i18n.language === lang.code ? "bg-primary/20" : "bg-card hover:bg-muted"
              )}
            >
              <span className={cn(
                "font-medium text-lg",
                i18n.language === lang.code ? "text-primary" : "text-white"
              )}>
                {lang.label}
              </span>
              {i18n.language === lang.code && (
                <Check className="h-5 w-5 text-primary" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
