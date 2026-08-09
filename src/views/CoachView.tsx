import React from 'react';
import { Card } from '../components/ui/card';
import { Shield, Users, UserPlus, Calendar, DollarSign } from 'lucide-react';

export const CoachView: React.FC = () => {
  return (
    <div className="space-y-4 pb-24 pt-[84px] px-4">
      {/* Header Banner */}
      <div className="rounded-2xl border border-[#68BD44]/40 bg-[#68BD44]/10 p-4 text-[#68BD44]">
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8 text-[#68BD44]" />
          <div>
            <h1 className="text-lg font-bold text-white">Coach Tools</h1>
            <p className="text-xs text-[#8E8E93]">Advanced training session management</p>
          </div>
        </div>
      </div>

      {/* Menu Options */}
      <div className="grid gap-2">
        <Card className="flex items-center justify-between p-4 bg-[#1C1C1E] border-[#2C2C2E] cursor-pointer hover:border-[#68BD44]/50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2C2C2E] text-[#68BD44]">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">All Players Database</div>
              <span className="text-[10px] text-[#8E8E93]">Inspect player profiles, stats and levels</span>
            </div>
          </div>
        </Card>

        <Card className="flex items-center justify-between p-4 bg-[#1C1C1E] border-[#2C2C2E] cursor-pointer hover:border-[#68BD44]/50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2C2C2E] text-[#68BD44]">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Add New Guest</div>
              <span className="text-[10px] text-[#8E8E93]">Quick registration for session</span>
            </div>
          </div>
        </Card>

        <Card className="flex items-center justify-between p-4 bg-[#1C1C1E] border-[#2C2C2E] cursor-pointer hover:border-[#68BD44]/50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2C2C2E] text-[#68BD44]">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Session Schedule</div>
              <span className="text-[10px] text-[#8E8E93]">Manage court time slots and bookings</span>
            </div>
          </div>
        </Card>

        <Card className="flex items-center justify-between p-4 bg-[#1C1C1E] border-[#2C2C2E] cursor-pointer hover:border-[#68BD44]/50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2C2C2E] text-[#68BD44]">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Financial Reports</div>
              <span className="text-[10px] text-[#8E8E93]">Track session payments and dues</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
