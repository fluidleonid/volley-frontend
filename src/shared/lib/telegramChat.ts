import { Player } from '../types/index';
import { useAppStore } from '../../app/store/appStore';

/**
 * Exits fullscreen, opens the direct Telegram chat with the given player or coach,
 * and closes/minimizes the Mini App so the chat is immediately visible.
 */
export function openTelegramChat(player: Player) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tg = (window as any).Telegram?.WebApp;
  const state = useAppStore.getState();

  // 1. Resolve telegramUsername or telegramId from player or store
  let rawUsername = player.telegramUsername;
  let telegramId = player.telegramId;

  if (!rawUsername) {
    const foundPlayer = state.allPlayers.find(
      (p) => p.id === player.id || (p.fullName && p.fullName === player.fullName) || p.name === player.name
    );
    if (foundPlayer?.telegramUsername) {
      rawUsername = foundPlayer.telegramUsername;
    }
    if (!telegramId && foundPlayer?.telegramId) {
      telegramId = foundPlayer.telegramId;
    }
  }

  if (!rawUsername && Array.isArray(state.coachesList)) {
    const foundCoach = state.coachesList.find(
      (c: any) => c.id === player.id || (c.name && c.name.includes(player.name))
    );
    if (foundCoach?.telegram_username) {
      rawUsername = foundCoach.telegram_username;
    }
    if (!telegramId && foundCoach?.telegram_id) {
      telegramId = Number(foundCoach.telegram_id);
    }
  }

  if (!rawUsername && (state.isStaging || player.isCoach)) {
    rawUsername = 'hi2leo';
  }

  const username = rawUsername?.replace(/^@/, '').trim();

  // Exit fullscreen first so Telegram iOS/Android doesn't keep the fullscreen WebView covering the chat
  if (tg?.isFullscreen && typeof tg.exitFullscreen === 'function') {
    try {
      tg.exitFullscreen();
    } catch {
      // ignore
    }
  }

  if (username) {
    const tmeUrl = `https://t.me/${username}`;
    if (tg && typeof tg.openTelegramLink === 'function') {
      try {
        tg.openTelegramLink(tmeUrl);
      } catch {
        window.open(tmeUrl, '_blank', 'noopener,noreferrer');
      }
      setTimeout(() => {
        try {
          tg.close?.();
        } catch {
          // ignore
        }
      }, 120);
      return;
    }
    window.open(tmeUrl, '_blank', 'noopener,noreferrer');
    return;
  }

  if (telegramId) {
    const tgUri = `tg://user?id=${telegramId}`;
    try {
      const a = document.createElement('a');
      a.href = tgUri;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch {
      window.location.href = tgUri;
    }
    setTimeout(() => {
      try {
        tg?.close?.();
      } catch {
        // ignore
      }
    }, 150);
  }
}
