import { AchievementData } from '../../types/achievement';
import bloodImg from '../../assets/images/blood.png';
import ach2Img from '../../assets/achievements/ach2.png';
import ach3Img from '../../assets/achievements/ach3.png';
import ach4Img from '../../assets/achievements/ach4.png';
import ach5Img from '../../assets/achievements/ach5.png';

export const MOCK_ACHIEVEMENTS: AchievementData[] = [
  {
    id: 'ach-1',
    title: 'Fresh Blood',
    desc: 'Attended your very first training session',
    rarity: 'Common',
    icon: bloodImg,
    isEarned: true,
    earnedDate: 'July 3, 2026',
    glowColor: 'rgba(255, 59, 48, 0.5)',
  },
  {
    id: 'ach-2',
    title: 'Marathon Man',
    desc: 'Played 15+ matches in a single day',
    rarity: 'Rare',
    icon: ach2Img,
    isEarned: false,
    progress: 4,
    maxProgress: 15,
    glowColor: 'rgba(0, 122, 255, 0.5)',
  },
  {
    id: 'ach-3',
    title: 'Welcome to Hell',
    desc: 'Won your first Hard Mode match',
    rarity: 'Uncommon',
    icon: ach3Img,
    isEarned: true,
    earnedDate: 'July 10, 2026',
    glowColor: 'rgba(255, 69, 58, 0.6)',
  },
  {
    id: 'ach-4',
    title: '25 Hard Mode Wins',
    desc: 'Won 25 Hard Mode matches',
    rarity: 'Uncommon',
    icon: ach4Img,
    isEarned: true,
    earnedDate: 'August 1, 2026',
    glowColor: 'rgba(255, 159, 10, 0.5)',
  },
  {
    id: 'ach-5',
    title: 'Sniper',
    desc: 'Score 10 aces in one match',
    rarity: 'Rare',
    icon: ach5Img,
    isEarned: false,
    progress: 2,
    maxProgress: 10,
    glowColor: 'rgba(50, 173, 230, 0.5)',
  },
  {
    id: 'ach-6',
    title: 'Team Player',
    desc: 'Play 50 matches with friends',
    rarity: 'Common',
    icon: ach4Img,
    isEarned: true,
    earnedDate: 'August 5, 2026',
    glowColor: 'rgba(48, 209, 88, 0.5)',
  },
  {
    id: 'ach-7',
    title: 'Unstoppable',
    desc: 'Win 10 matches in a row',
    rarity: 'Rare',
    icon: ach3Img,
    isEarned: false,
    progress: 4,
    maxProgress: 10,
    glowColor: 'rgba(255, 59, 48, 0.7)',
  },
];

export const TOTAL_ACHIEVEMENTS_COUNT = 80;
