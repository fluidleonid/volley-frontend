import React from 'react';
import { useScroll } from '../../shared/hooks/useScroll';
import { useAppStore } from '../../app/store/appStore';
import { Shield, User, Coffee, Sparkles, Box, ChevronLeft, X } from 'lucide-react';
import { Avatar } from '../../shared/ui/Avatar';

export interface HeaderProps {
  variant?: 'main' | 'page';
  sticky?: boolean;
  
  // Page variant props
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  onBack?: () => void;
  onClose?: () => void;
  titleAs?: 'h1' | 'h2' | 'h3';
  forceClose?: boolean;
  onDragHandle?: (e: React.PointerEvent | React.TouchEvent) => void;
  className?: string;
  
  // For backwards compatibility with StickyPageHeader's styling
  stickyClassName?: string;
  rightContent?: React.ReactNode;
  forceScrolled?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  variant = 'page',
  sticky = false,
  title,
  subtitle,
  onBack,
  onClose,
  titleAs: Tag = 'h1',
  forceClose = false,
  onDragHandle,
  className = '',
  stickyClassName = '',
  rightContent,
  forceScrolled,
}) => {
  const windowScrolled = useScroll();
  const scrolled = forceScrolled ?? windowScrolled;
  const { role, setRole, currentUser, playerState, setActiveTab } = useAppStore();

  const getStatusDisplay = () => {
    switch (playerState) {
      case 'spectating':
        return { label: 'Spectating', icon: Box, color: 'text-muted-foreground' };
      case 'queued':
      case 'match_found':
        return { label: 'Queued', icon: Sparkles, color: 'text-muted-foreground' };
      case 'playing':
        return { label: 'Training', icon: Sparkles, color: 'text-muted-foreground' };
      case 'resting':
        return { label: 'Resting', icon: Coffee, color: 'text-muted-foreground' };
      default:
        return { label: 'Spectating', icon: Box, color: 'text-muted-foreground' };
    }
  };

  const renderMainHeader = () => {
    const statusInfo = getStatusDisplay();
    const StatusIcon = statusInfo.icon;
    const filledFramesCount = Math.min(10, Math.max(1, Math.floor((currentUser.xp % 1000) / 100) || 7));

    return (
      <div className="flex items-center justify-between max-w-[480px] mx-auto w-full px-4">
        {/* Left: Avatar with Level Ring & Name & Status */}
        <div
          onClick={() => setActiveTab('profile')}
          className="flex items-center gap-3 cursor-pointer group transition-transform active:scale-95"
          title="Open Profile"
        >
          <div className="relative">
            <div className="rounded-full border-2 border-background shadow-[0_0_0_2px_#68BD44] transition-all duration-300 group-hover:shadow-[0_0_0_2px_#5AA739]">
              <Avatar
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                initials={currentUser.name[0]}
                className="w-[44px] h-[44px] border-none"
              />
            </div>
            {role === 'coach' && (
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-black shadow-md" title="Coach">
                ★
              </span>
            )}
          </div>

          <div className="flex flex-col h-[46px] justify-between">
            <div className="flex items-center leading-none">
              <span className="font-display text-[30px] font-bold tracking-tight text-white leading-none group-hover:text-primary transition-colors">
                {currentUser.name}
              </span>
            </div>
            <div className="flex items-center gap-1 text-[12px] font-medium text-muted-foreground h-[18px]">
              <StatusIcon className={`h-3.5 w-3.5 ${statusInfo.color}`} />
              <span className={`${statusInfo.color} leading-none`}>{statusInfo.label}</span>
            </div>
          </div>
        </div>

        {/* Right: XP Value & 10-Frame Level Tracker for Player role only */}
        <div className="flex flex-col h-[46px] justify-between items-end">
          <div className="flex items-center gap-2 leading-none mt-1">
            {role === 'player' && (
              <span className="font-display text-[18px] font-extrabold tracking-tight text-white leading-none">
                {currentUser.xp.toFixed(1)} XP
              </span>
            )}

            <button
              onClick={() => setRole(role === 'player' ? 'coach' : 'player')}
              className="rounded-full bg-card px-2 py-0.5 text-[10px] font-semibold text-muted-foreground hover:text-white transition-colors"
              title="Switch Role for Testing"
            >
              {role === 'coach' ? (
                <span className="text-primary font-bold flex items-center gap-1 leading-none">
                  <Shield className="h-3 w-3 text-primary" /> Admin
                </span>
              ) : (
                <User className="h-3 w-3 inline" />
              )}
            </button>
          </div>

          {role === 'player' && (
            <div className="flex items-center gap-[4px] h-[18px]">
              {Array.from({ length: 10 }).map((_, idx) => (
                <span
                  key={idx}
                  className={`h-[4px] w-[10px] rounded-full transition-colors duration-300 ${
                    idx < filledFramesCount ? 'bg-white' : 'bg-secondary'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderPageHeader = () => {
    const showLeft = !!onBack;
    const showRight = !!onClose || forceClose;

    return (
      <div
        className={`relative flex h-[44px] items-center justify-between select-none ${
          onDragHandle ? 'cursor-grab active:cursor-grabbing' : ''
        } ${className}`}
        onPointerDown={onDragHandle}
        onTouchStart={onDragHandle}
      >
        {showLeft ? (
          <button
            type="button"
            onClick={onBack}
            className="flex h-[44px] w-[44px] items-center justify-center rounded-full bg-card text-white transition-colors hover:bg-brand-surfaceElevated active:scale-95 cursor-pointer z-10 pointer-events-auto"
            title="Back"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        ) : (
          <div className="w-[44px] h-[44px]" />
        )}

        {title !== undefined && title !== '' && (
          <div className="absolute inset-x-12 flex flex-col items-center justify-center pointer-events-none">
            {typeof title === 'string' ? (
              <Tag className="font-display text-lg font-bold text-white tracking-tight text-center truncate">
                {title}
              </Tag>
            ) : (
              title
            )}
            {subtitle && (
              <p className="font-sans text-xs text-muted-foreground font-normal text-center truncate mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {rightContent ? (
          <div className="z-10">{rightContent}</div>
        ) : showRight ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose?.();
            }}
            className="flex h-[44px] w-[44px] items-center justify-center rounded-full bg-card text-white transition-colors hover:bg-brand-surfaceElevated active:scale-95 cursor-pointer z-10"
            title="Close"
          >
            <X className="h-5 w-5" />
          </button>
        ) : (
          <div className="w-[44px] h-[44px]" />
        )}
      </div>
    );
  };

  if (!sticky) {
    return variant === 'main' ? renderMainHeader() : renderPageHeader();
  }

  const stickyStyles = `sticky top-0 z-40 transition-all duration-300 pt-[84px] pb-5 text-white ${
    scrolled ? 'bg-background/80 backdrop-blur-md' : 'bg-transparent'
  } ${stickyClassName}`;

  return (
    <header className={stickyStyles}>
      {variant === 'main' ? renderMainHeader() : renderPageHeader()}
    </header>
  );
};
