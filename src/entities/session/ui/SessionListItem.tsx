import React from 'react';

export interface Session {
  id: string;
  name: string;
  avatarUrl: string;
  time: string;
}

interface SessionListItemProps {
  session: Session;
  onClick?: (session: Session) => void;
}

export const SessionListItem: React.FC<SessionListItemProps> = ({ session, onClick }) => {
  return (
    <div
      onClick={() => onClick && onClick(session)}
      className="flex flex-row items-center justify-between py-3 border-b border-solid border-border/60 last:border-b-0 w-full cursor-pointer transition-opacity hover:opacity-90 active:scale-[0.99]"
    >
      <div className="flex items-center gap-3">
        <img
          src={session.avatarUrl}
          alt={session.name}
          className="w-9 h-9 rounded-full object-cover"
        />
        <span className="font-display text-base font-semibold text-white tracking-tight">
          {session.name}
        </span>
      </div>

      <span className="font-display text-base font-normal text-muted-foreground">
        {session.time}
      </span>
    </div>
  );
};
