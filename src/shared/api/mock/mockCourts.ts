import { Court } from '../../types/index';

export const initialCourts: Court[] = [
  { id: 'court-1', name: '#1', courtNumber: 1, status: 'matchmaking', isActive: true, isAvailable: true, isHardmode: false, timerSeconds: 0, teamAIds: [], teamBIds: [], scoreA: 0, scoreB: 0 },
  { id: 'court-2', name: '#2', courtNumber: 2, status: 'matchmaking', isActive: true, isAvailable: true, isHardmode: false, timerSeconds: 0, teamAIds: [], teamBIds: [], scoreA: 0, scoreB: 0 },
  { id: 'court-3', name: '#3', courtNumber: 3, status: 'matchmaking', isActive: true, isAvailable: true, isHardmode: false, timerSeconds: 0, teamAIds: [], teamBIds: [], scoreA: 0, scoreB: 0 },
  { id: 'court-4', name: '#4', courtNumber: 4, status: 'matchmaking', isActive: true, isAvailable: true, isHardmode: false, timerSeconds: 0, teamAIds: [], teamBIds: [], scoreA: 0, scoreB: 0 },
  { id: 'court-5', name: '#5', courtNumber: 5, status: 'matchmaking', isActive: true, isAvailable: true, isHardmode: false, timerSeconds: 0, teamAIds: [], teamBIds: [], scoreA: 0, scoreB: 0 },
  { id: 'court-6', name: '#6', courtNumber: 6, status: 'reserved', isActive: false, isAvailable: false, isHardmode: false, timerSeconds: 0, teamAIds: [], teamBIds: [], scoreA: 0, scoreB: 0 },
];

export const joinedCourts: Court[] = [
  { id: 'court-1', name: '#1', courtNumber: 1, status: 'matchmaking', isActive: true, isAvailable: true, isHardmode: false, timerSeconds: 0, teamAIds: [], teamBIds: [], scoreA: 0, scoreB: 0 },
  {
    id: 'court-2',
    name: '#2',
    courtNumber: 2,
    status: 'in_progress',
    isActive: true,
    isAvailable: true,
    isHardmode: false,
    timerSeconds: 731, // 12:11
    teamAIds: ['tp-1', 'tp-2'],
    teamBIds: ['tp-3', 'tp-4'],
    scoreA: 18,
    scoreB: 16,
  },
  {
    id: 'court-3',
    name: '#3',
    courtNumber: 3,
    status: 'in_progress',
    isActive: true,
    isAvailable: true,
    isHardmode: true,
    timerSeconds: 412,
    teamAIds: ['tp-5', 'tp-6'],
    teamBIds: ['tp-7', 'tp-8'],
    scoreA: 11,
    scoreB: 9,
  },
  { id: 'court-4', name: '#4', courtNumber: 4, status: 'matchmaking', isActive: true, isAvailable: true, isHardmode: false, timerSeconds: 0, teamAIds: [], teamBIds: [], scoreA: 0, scoreB: 0 },
  { id: 'court-5', name: '#5', courtNumber: 5, status: 'matchmaking', isActive: true, isAvailable: true, isHardmode: false, timerSeconds: 0, teamAIds: [], teamBIds: [], scoreA: 0, scoreB: 0 },
  { id: 'court-6', name: '#6', courtNumber: 6, status: 'reserved', isActive: false, isAvailable: false, isHardmode: false, timerSeconds: 0, teamAIds: [], teamBIds: [], scoreA: 0, scoreB: 0 },
];
