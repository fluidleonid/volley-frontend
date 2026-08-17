export const getPlayerTierInfo = (level: number) => {
  if (level < 10) {
    return {
      accentColor: 'var(--level-beginner)',
      ringColor: 'var(--level-beginner)',
      glowColor: 'var(--level-beginner-glow)',
      iconCount: 1,
      tierName: 'Beginner'
    };
  } else if (level < 20) {
    return {
      accentColor: 'var(--level-amateur)',
      ringColor: 'var(--level-amateur)',
      glowColor: 'var(--level-amateur-glow)',
      iconCount: 2,
      tierName: 'Amateur'
    };
  } else if (level < 30) {
    return {
      accentColor: 'var(--level-advanced)',
      ringColor: 'var(--level-advanced)',
      glowColor: 'var(--level-advanced-glow)',
      iconCount: 3,
      tierName: 'Advanced'
    };
  } else {
    return {
      accentColor: 'var(--level-pro)',
      ringColor: 'var(--level-pro)',
      glowColor: 'var(--level-pro-glow)',
      iconCount: 4,
      tierName: 'Pro'
    };
  }
};
