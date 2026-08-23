import { Match } from '../../types/index';

export const mockMatches: Match[] = [
  {
    id: 'm1',
    date: '2026-08-10',
    time: '14:30',
    courtName: '#1',
    isHardmode: true,
    teamA: [
      { name: 'John Doe (You)', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80' },
      { name: 'Coach Alex', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80' }
    ],
    teamB: [
      { name: 'Marcus K.', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80' },
      { name: 'Elena T.', avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80' }
    ],
    scoreA: 15,
    scoreB: 12,
    isWin: true,
    xpGained: 54,
    bpGained: 12
  },
  {
    id: 'm2',
    date: '2026-08-10',
    time: '12:00',
    courtName: '#2',
    isHardmode: false,
    teamA: [
      { name: 'John Doe (You)', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80' }
    ],
    teamB: [
      { name: 'David L.', avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80' }
    ],
    scoreA: 8,
    scoreB: 15,
    isWin: false,
    xpGained: 12,
    bpGained: 0
  },
  {
    id: 'm3',
    date: '2026-08-09',
    time: '18:15',
    courtName: '#3',
    isHardmode: true,
    teamA: [
      { name: 'John Doe (You)', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80' },
      { name: 'Alex R.', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80' }
    ],
    teamB: [
      { name: 'Michael B.', avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80' },
      { name: 'Anna S.', avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&auto=format&fit=crop&q=80' }
    ],
    scoreA: 21,
    scoreB: 19,
    isWin: true,
    xpGained: 120,
    bpGained: 25
  },
  {
    id: 'm4',
    date: '2026-08-09',
    time: '16:00',
    courtName: '#1',
    isHardmode: false,
    teamA: [
      { name: 'John Doe (You)', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80' },
      { name: 'Elena T.', avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80' }
    ],
    teamB: [
      { name: 'Sarah M.', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80' },
      { name: 'Alex R.', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80' }
    ],
    scoreA: 21,
    scoreB: 14,
    isWin: true,
    xpGained: 50,
    bpGained: 10
  },
  {
    id: 'm5',
    date: '2026-08-08',
    time: '10:00',
    courtName: '#2',
    isHardmode: true,
    teamA: [
      { name: 'Michael B.', avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80' },
      { name: 'Anna S.', avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&auto=format&fit=crop&q=80' }
    ],
    teamB: [
      { name: 'John Doe (You)', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80' },
      { name: 'David L.', avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80' }
    ],
    scoreA: 21,
    scoreB: 11,
    isWin: false,
    xpGained: 15,
    bpGained: 2
  },
  {
    id: 'm6',
    date: '2026-08-08',
    time: '14:00',
    courtName: '#3',
    isHardmode: false,
    teamA: [
      { name: 'John Doe (You)', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80' }
    ],
    teamB: [
      { name: 'Anna S.', avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&auto=format&fit=crop&q=80' }
    ],
    scoreA: 15,
    scoreB: 8,
    isWin: true,
    xpGained: 30,
    bpGained: 5
  }
];
