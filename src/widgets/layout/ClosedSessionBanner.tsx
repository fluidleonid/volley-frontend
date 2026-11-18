import React from 'react';
import { useTranslation } from 'react-i18next';
import { CalendarClock } from 'lucide-react';
import { Badge } from '../../shared/ui/badge';
import { Avatar } from '../../shared/ui/Avatar';
import publicSessionImg from '../../shared/assets/images/publicsession.png';
import whistleIcon from '../../shared/assets/icons/whistle-fill.svg';

interface ClosedSessionBannerProps {
  title?: string;
  description?: string;
  nextSessionTime?: string;
  coachAvatar?: string;
  coachName?: string;
  coachInitials?: string;
  onCoachClick?: () => void;
  children?: React.ReactNode;
}

export const ClosedSessionBanner: React.FC<ClosedSessionBannerProps> = ({
  title,
  description,
  nextSessionTime,
  coachAvatar,
  coachName,
  coachInitials,
  onCoachClick,
  children,
}) => {
  const { t } = useTranslation();

  const defaultTitle = t('closedSession.title');
  const finalTitle = title || defaultTitle;

  const defaultDescription = t('closedSession.description');
  const finalDescription = description || defaultDescription;

  return (
    <div className="relative overflow-hidden rounded-[40px] bg-card p-6 border border-border/60 shadow-2xl flex flex-col justify-between min-h-[400px] h-auto gap-4">
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
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary" className="w-fit">
              <CalendarClock className="w-4 h-4 mr-1" />
              <span>{nextSessionTime}</span>
            </Badge>
            {(coachAvatar || coachName) && (
              <div
                className="relative cursor-pointer hover:scale-105 active:scale-95 transition-all"
                onClick={onCoachClick}
              >
                <Avatar
                  src={coachAvatar}
                  alt={coachName || 'Coach'}
                  initials={coachInitials}
                  size="sm"
                  className="w-7 h-7 border border-card/50"
                />
                <div className="absolute -bottom-1 -right-1 flex h-[14px] w-[14px] items-center justify-center rounded-full bg-brand-coach border border-card">
                  <div
                    className="w-[7px] h-[7px] bg-white"
                    style={{
                      maskImage: `url("${whistleIcon}")`,
                      WebkitMaskImage: `url("${whistleIcon}")`,
                      maskSize: 'contain',
                      WebkitMaskSize: 'contain',
                      maskRepeat: 'no-repeat',
                      WebkitMaskRepeat: 'no-repeat',
                      maskPosition: 'center',
                      WebkitMaskPosition: 'center',
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2.5 pt-4 z-10 w-full">
        {children}
      </div>
    </div>
  );
};
