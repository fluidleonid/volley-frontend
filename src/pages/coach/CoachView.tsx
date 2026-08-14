import React from 'react';
import { Card } from '../../shared/ui/card';
import { Shield, Users, UserPlus, Calendar, DollarSign } from 'lucide-react';
import { useScroll } from '../../shared/hooks/useScroll';

export const CoachView: React.FC = () => {
  const scrolled = useScroll();
  return (
    <div className="space-y-4 pb-24 px-4 max-w-[480px] mx-auto select-none">
      {/* Sticky Header Banner (No border) */}
      <div className={`sticky top-0 z-40 -mx-4 px-4 pt-[84px] pb-3 transition-all duration-300 ${
        scrolled ? 'bg-background/80 backdrop-blur-md' : 'bg-transparent'
      }`}>
        <div className="rounded-2xl border border-primary/40 bg-primary/10 p-4 text-primary">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-lg font-bold text-white">Coach Tools</h1>
              <p className="text-xs text-muted-foreground">Advanced training session management</p>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Options */}
      <div className="grid gap-2">
        <Card className="flex items-center justify-between p-4 bg-card border-border cursor-pointer hover:border-primary/50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-primary">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">All Players Database</div>
              <span className="text-[10px] text-muted-foreground">Inspect player profiles, stats and levels</span>
            </div>
          </div>
        </Card>

        <Card className="flex items-center justify-between p-4 bg-card border-border cursor-pointer hover:border-primary/50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-primary">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Add New Guest</div>
              <span className="text-[10px] text-muted-foreground">Quick registration for session</span>
            </div>
          </div>
        </Card>

        <Card className="flex items-center justify-between p-4 bg-card border-border cursor-pointer hover:border-primary/50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-primary">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Session Schedule</div>
              <span className="text-[10px] text-muted-foreground">Manage court time slots and bookings</span>
            </div>
          </div>
        </Card>

        <Card className="flex items-center justify-between p-4 bg-card border-border cursor-pointer hover:border-primary/50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-primary">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Financial Reports</div>
              <span className="text-[10px] text-muted-foreground">Track session payments and dues</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
