import React from 'react';
import { useTranslation } from 'react-i18next';
import { CalendarClock } from 'lucide-react';
import { Badge } from '../../shared/ui/Badge';
import publicSessionImg from '../../shared/assets/images/publicsession.png';

interface ClosedSessionBannerProps {
  title?: string;
  description?: string;
  nextSessionTime?: string;
  children?: React.ReactNode;
}

export const ClosedSessionBanner: React.FC<ClosedSessionBannerProps> = ({
  title,
  description,
  nextSessionTime,
  children
}) => {
  const { t } = useTranslation();
  
  const defaultTitle = t('closedSession.title');
  const finalTitle = title || defaultTitle;
  
  const defaultDescription = t('closedSession.description');
  const finalDescription = description || defaultDescription;

  return (
    <div className="relative overflow-hidden rounded-[40px] bg-card p-6 border border-border/60 shadow-2xl flex flex-col justify-between h-[400px]">
      {/* Blur element: white, opacity 20, blur 240 */}
      <div className="absolute right-0 top-1/3 -translate-y-1/2 w-64 h-64 rounded-full bg-white/20 blur-[100px] pointer-events-none" />

      {/* Image: right 24px, bottom 0 */}
      <img
        src={publicSessionImg}
        alt="Public Session"
        className="absolute right-6 bottom-0 h-[320px] w-auto pointer-events-none z-0 object-contain"
      />

      <div className="flex flex-col gap-2 z-10 pt-2">
        <h3 className="font-display text-2xl font-bold text-white tracking-tight leading-snug">
          {finalTitle}
        </h3>
        <p className="font-sans text-sm text-muted-foreground leading-relaxed max-w-[320px]">
          {finalDescription}
        </p>
        {nextSessionTime && (
          <Badge variant="secondary" className="w-fit mt-1">
            <CalendarClock />
            <span>{nextSessionTime}</span>
          </Badge>
        )}
      </div>

      <div className="flex flex-col gap-2.5 pt-4 z-10 w-full">
        {children}
      </div>
    </div>
  );
};
