import { Player } from '../types/index';

/**
 * Minimizes the Telegram Mini App and opens the direct Telegram chat with the given player or coach.
 */
export function openTelegramChat(player: Player) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tg = (window as any).Telegram?.WebApp;
  const username = player.telegramUsername?.replace(/^@/, '').trim();

  if (username) {
    const tmeUrl = `https://t.me/${username}`;
    if (tg && typeof tg.openTelegramLink === 'function') {
      tg.openTelegramLink(tmeUrl);
      return;
    }
    window.open(tmeUrl, '_blank', 'noopener,noreferrer');
    return;
  }

  if (player.telegramId) {
    const tgUri = `tg://user?id=${player.telegramId}`;
    window.location.href = tgUri;
    return;
  }

  const fallbackUrl = 'https://t.me/';
  if (tg && typeof tg.openTelegramLink === 'function') {
    tg.openTelegramLink(fallbackUrl);
  } else {
    window.open(fallbackUrl, '_blank', 'noopener,noreferrer');
  }
}
