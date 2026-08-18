import React, { useState } from 'react';
import { BottomSheet } from '../../shared/ui/BottomSheet';
import { useTranslation } from 'react-i18next';
import { Copy, Check, Share2, Send, QrCode } from 'lucide-react';
import courtLg from '../../shared/assets/icons/court-lg.svg';

export interface InviteSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InviteSheet: React.FC<InviteSheetProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const inviteUrl = 'https://t.me/volley_bot?start=join';

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={t('home.inviteToPlay', 'Invite to play')}
    >
      <div className="space-y-5 pt-1">
        {/* Subtitle / Description */}
        <p className="font-sans text-sm text-muted-foreground text-center px-4">
          {t('home.inviteDesc', 'Share this link or QR code with players to join your training session on Volley.')}
        </p>

        {/* 1. Ticket-Style Invite Link Container with court-lg.svg Notch Cutouts */}
        <div className="relative w-full h-[64px] rounded-[20px] bg-card flex items-center justify-between overflow-hidden px-4 border border-border/40">
          {/* Left Notch Vector Cutout */}
          <img
            src={courtLg}
            alt=""
            className="absolute left-0 top-1/2 -translate-y-1/2 w-[12px] h-[44px] pointer-events-none z-10"
          />

          {/* Right Notch Vector Cutout (Rotated 180 deg) */}
          <img
            src={courtLg}
            alt=""
            className="absolute right-0 top-1/2 -translate-y-1/2 w-[12px] h-[44px] pointer-events-none z-10 rotate-180"
          />

          {/* Link Text */}
          <div className="pl-3 pr-2 flex items-center gap-2.5 truncate max-w-[280px]">
            <Send className="h-5 w-5 text-primary shrink-0" />
            <span className="font-sans text-sm font-semibold text-white truncate">
              t.me/volley_bot?start=join
            </span>
          </div>

          {/* Quick Copy Action Icon */}
          <button
            onClick={handleCopy}
            className="pr-3 flex items-center justify-center text-muted-foreground hover:text-white transition-colors"
            title={t('common.copyLink', 'Copy link')}
          >
            {copied ? (
              <Check className="h-5 w-5 text-primary" />
            ) : (
              <Copy className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* 2. QR Code Representation Card */}
        <div className="flex flex-col items-center justify-center p-6 rounded-[24px] bg-card border border-border/60 space-y-3">
          <div className="p-4 rounded-2xl bg-white flex items-center justify-center shadow-lg">
            <QrCode className="h-32 w-32 text-black" />
          </div>
          <span className="font-sans text-xs text-muted-foreground">
            {t('home.scanToJoin', 'Scan to join instantly in Telegram')}
          </span>
        </div>

        {/* 3. Primary Copy / Share Button (24px margin from content above) */}
        <div className="mt-[24px]">
          <button
            onClick={handleCopy}
            className="w-full h-[52px] rounded-full bg-primary text-primary-foreground font-sans text-base font-bold shadow-lg shadow-primary/20 transition-all active:scale-95 hover:bg-primary/90 flex items-center justify-center gap-2"
          >
            {copied ? (
              <>
                <Check className="h-5 w-5 stroke-[3]" />
                <span>{t('home.linkCopied', 'Link Copied!')}</span>
              </>
            ) : (
              <>
                <Share2 className="h-5 w-5 stroke-[2.5]" />
                <span>{t('home.shareLink', 'Share Link')}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </BottomSheet>
  );
};
