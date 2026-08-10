import React, { useState } from 'react';
import { ChevronLeft, X, Plus } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { Avatar } from '../components/ui/Avatar';
import { SelectPlayerSheet } from '../components/ui/SelectPlayerSheet';
import { Player } from '../types';
import courtLg from '../assets/court-lg.svg';

export interface InviteViewProps {
  onClose?: () => void;
}

export const InviteView: React.FC<InviteViewProps> = ({ onClose }) => {
  const { currentUser, setActiveTab, sendInvite } = useAppStore();

  // Team A starts with logged in user
  const [teamAPlayers, setTeamAPlayers] = useState<Player[]>([currentUser]);

  // Team B starts empty
  const [teamBPlayers, setTeamBPlayers] = useState<Player[]>([]);

  // Picker bottom sheet state
  const [activePicker, setActivePicker] = useState<'teamA' | 'teamB' | null>(null);

  const handleBack = () => {
    if (onClose) {
      onClose();
    } else {
      setActiveTab('home');
    }
  };

  const handleSendInvite = () => {
    const allPicked = [...teamAPlayers.filter(p => p.id !== currentUser.id), ...teamBPlayers];
    sendInvite(allPicked);
    if (onClose) {
      onClose();
    } else {
      setActiveTab('home');
    }
  };

  const handleTogglePlayerInPicker = (player: Player) => {
    if (activePicker === 'teamA') {
      setTeamAPlayers((prev) => {
        const exists = prev.some((p) => p.id === player.id);
        if (exists) return prev.filter((p) => p.id !== player.id);
        if (prev.length >= 2) return prev;
        return [...prev, player];
      });
    } else if (activePicker === 'teamB') {
      setTeamBPlayers((prev) => {
        const exists = prev.some((p) => p.id === player.id);
        if (exists) return prev.filter((p) => p.id !== player.id);
        if (prev.length >= 2) return prev;
        return [...prev, player];
      });
    }
  };

  // Determine helper subtitle text based on exact Figma state nodes:
  // - Node 11530:12708: "Add 2 opponents to start matching" (when teammate added, 0 opponents)
  // - Node 11534:18553: "Ready to play" (when equal teams 1v1 or 2v2)
  // - Initial: "Fill the court — pick 1 or 2 players"
  const getHelperSubtitle = () => {
    const countA = teamAPlayers.length;
    const countB = teamBPlayers.length;

    if (countA === 1 && countB === 0) {
      return "Fill the court — pick 1 or 2 players";
    }
    if (countA === 2 && countB === 0) {
      return "Add 2 opponents to start matching";
    }
    if (countA === 1 && countB === 1) {
      return "Ready to play";
    }
    if (countA === 2 && countB === 2) {
      return "Ready to play";
    }
    if (countA === 2 && countB === 1) {
      return "Add 1 more opponent to balance teams";
    }
    if (countA === 1 && countB === 2) {
      return "Add 1 teammate to balance teams";
    }

    return "Fill the court — pick 1 or 2 players";
  };

  // Button is active when teams are balanced (1v1 or 2v2 or ready)
  const isReadyToInvite =
    (teamAPlayers.length === 1 && teamBPlayers.length === 1) ||
    (teamAPlayers.length === 2 && teamBPlayers.length === 2) ||
    (teamAPlayers.length === 2 && teamBPlayers.length === 1);

  const selectedPlayerIdsInActivePicker =
    activePicker === 'teamA'
      ? teamAPlayers.map((p) => p.id)
      : teamBPlayers.map((p) => p.id);

  return (
    <div className="min-h-screen bg-[#121212] text-white pb-28 px-4 space-y-6 max-w-[480px] mx-auto select-none">
      {/* 1. Header with Back (<) and Close (X) buttons */}
      <div className="sticky top-0 z-40 bg-[#121212] pt-[84px] pb-3 -mx-4 px-4">
        <div className="relative flex items-center justify-between">
          <button
            onClick={handleBack}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1C1C1E] text-white transition-colors hover:bg-[#242426] active:scale-95"
            title="Back"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <h1 className="font-display text-lg font-bold text-white tracking-tight">
            Invite to play
          </h1>

          <button
            onClick={handleBack}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1C1C1E] text-white transition-colors hover:bg-[#242426] active:scale-95"
            title="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* 2. Main Court Card Container (Height: 400px, Outer Radius: 40px, Padding: 20px, Border: 0) */}
      <div className="relative w-full h-[400px] rounded-[40px] bg-[#1C1C1E] p-[20px] shadow-2xl border-0 overflow-hidden flex flex-col justify-between">
        {/* Left Side Notch Cutout */}
        <img
          src={courtLg}
          alt=""
          className="absolute left-0 top-1/2 -translate-y-1/2 w-[12px] h-[44px] pointer-events-none z-20"
        />

        {/* Right Side Notch Cutout (Rotated 180 deg) */}
        <img
          src={courtLg}
          alt=""
          className="absolute right-0 top-1/2 -translate-y-1/2 w-[12px] h-[44px] pointer-events-none z-20 rotate-180"
        />

        {/* Full-bleed Edge-to-Edge Dashed Line (runs edge-to-edge under notch shapes) */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 border-b border-dashed border-[#2C2C2E]/60 pointer-events-none z-10" />

        {/* TOP BOX: Team A Section (Entire box area is clickable for intuitive UX) */}
        <div
          onClick={() => setActivePicker('teamA')}
          className="relative w-full h-[170px] rounded-[20px] bg-[#242426] hover:bg-[#2A2A2C] transition-all active:scale-[0.99] flex items-center justify-center cursor-pointer select-none"
        >
          <div className="flex items-center -space-x-2">
            {teamAPlayers.map((player, idx) => (
              <Avatar
                key={player.id}
                src={player.avatarUrl}
                alt={player.name}
                initials={player.name[0]}
                size="lg"
                hasBorder={false}
                className={`relative ring-2 ring-[#242426] z-[${10 - idx}]`}
              />
            ))}

            {teamAPlayers.length < 2 && (
              <div
                className="relative z-10 flex h-[44px] w-[44px] items-center justify-center rounded-full ring-2 ring-[#242426] bg-[#2C2C2E] text-white transition-all"
                title="Add teammate"
              >
                <Plus className="h-5 w-5 stroke-[2.5]" />
              </div>
            )}
          </div>
        </div>

        {/* BOTTOM BOX: Team B Section (Entire box area is clickable for intuitive UX) */}
        <div
          onClick={() => setActivePicker('teamB')}
          className="relative w-full h-[170px] rounded-[20px] bg-[#242426] hover:bg-[#2A2A2C] transition-all active:scale-[0.99] flex items-center justify-center cursor-pointer select-none"
        >
          <div className="flex items-center -space-x-2">
            {teamBPlayers.map((player, idx) => (
              <Avatar
                key={player.id}
                src={player.avatarUrl}
                alt={player.name}
                initials={player.name[0]}
                size="lg"
                hasBorder={false}
                className={`relative ring-2 ring-[#242426] z-[${10 - idx}]`}
              />
            ))}

            {teamBPlayers.length < 2 && (
              <div
                className="relative z-10 flex h-[44px] w-[44px] items-center justify-center rounded-full ring-2 ring-[#242426] bg-[#2C2C2E] text-white transition-all"
                title="Add opponent"
              >
                <Plus className="h-5 w-5 stroke-[2.5]" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Subtitle Description (Dynamic State Helper Text) */}
      <div className="text-center pt-2">
        <p className="font-sans text-sm text-[#8E8E93] transition-colors duration-200">
          {getHelperSubtitle()}
        </p>
      </div>

      {/* 4. Bottom Action Button (fixed at exactly 48px from bottom of screen) */}
      <div className="fixed bottom-0 inset-x-0 pb-[48px] px-4 max-w-[480px] mx-auto z-20 bg-[#121212]">
        <button
          onClick={handleSendInvite}
          disabled={!isReadyToInvite}
          className={`w-full h-[52px] rounded-full bg-[#68BD44] text-[#050505] font-sans text-base font-bold transition-all ${
            isReadyToInvite
              ? 'shadow-lg shadow-[#68BD44]/20 hover:bg-[#5AA739] active:scale-95 cursor-pointer opacity-100'
              : 'opacity-20 shadow-none cursor-not-allowed'
          }`}
        >
          Invite
        </button>
      </div>

      {/* Player Picker Sheet Modal */}
      <SelectPlayerSheet
        isOpen={!!activePicker}
        onClose={() => setActivePicker(null)}
        title={activePicker === 'teamA' ? 'Select teammate' : 'Select opponents'}
        subtitle={
          activePicker === 'teamA'
            ? 'Pick 1 player for your team'
            : 'Pick 1 or 2 players for opposing team'
        }
        selectedPlayerIds={selectedPlayerIdsInActivePicker}
        onTogglePlayer={handleTogglePlayerInPicker}
      />
    </div>
  );
};
