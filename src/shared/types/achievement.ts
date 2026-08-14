export type AchievementRarity = 'Common' | 'Uncommon' | 'Rare';

export interface AchievementData {
  id: string;
  title: string;
  desc: string;
  rarity: AchievementRarity;
  icon: string;
  isEarned: boolean;
  progress?: number;
  maxProgress?: number;
  earnedDate?: string;
  glowColor?: string;
}
