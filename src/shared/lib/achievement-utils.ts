import { AchievementRarity } from '../types/achievement';

export function isIconUrl(icon: string): boolean {
  return (
    icon.startsWith('http') ||
    icon.startsWith('/') ||
    icon.startsWith('data:')
  );
}

const RARITY_GLOW: Record<AchievementRarity, string> = {
  Common: 'rgba(150, 150, 150, 0.5)',
  Uncommon: 'rgba(48, 209, 88, 0.5)',
  Rare: 'rgba(0, 122, 255, 0.5)',
};

const RARITY_BADGE_CLASS: Record<AchievementRarity, string> = {
  Common: 'bg-brand-surfaceElevated text-muted-foreground',
  Uncommon: 'bg-[#30D158]/20 text-[#30D158]',
  Rare: 'bg-[#007AFF]/20 text-[#007AFF]',
};

export function rarityGlow(rarity: AchievementRarity, custom?: string): string {
  return custom ?? RARITY_GLOW[rarity];
}

export function rarityBadgeClass(rarity: AchievementRarity): string {
  return RARITY_BADGE_CLASS[rarity];
}
