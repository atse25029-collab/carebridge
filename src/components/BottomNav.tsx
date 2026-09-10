import React from 'react';
import { Home, Calendar, MessageSquare, User } from 'lucide-react';
import type { ActiveView } from '../types';

interface BottomNavProps {
  currentView: ActiveView;
  onViewChange: (view: ActiveView) => void;
  unreadCount: number;
  activeCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentView,
  onViewChange,
  unreadCount,
  activeCount,
}) => {
  const navItems = [
    {
      id: 'home' as ActiveView,
      label: 'Home',
      icon: Home,
      badge: 0,
    },
    {
      id: 'bookings' as ActiveView,
      label: 'Bookings',
      icon: Calendar,
      badge: activeCount,
    },
    {
      id: 'messages' as ActiveView,
      label: 'Messages',
      icon: MessageSquare,
      badge: unreadCount,
    },
    {
      id: 'profile' as ActiveView,
      label: 'Profile',
      icon: User,
      badge: 0,
    },
  ];

  return (
    <nav className="w-full bg-white border-t border-slate-200 shadow-[0_-4px_12px_rgba(0,0,0,0.03)] px-4 pb-safe flex-shrink-0 z-40">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className="relative flex flex-col items-center justify-center w-16 h-12 text-slate-400 select-none outline-none group active:scale-95 transition-transform duration-75"
              aria-label={item.label}
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 ${
                  isActive
                    ? 'bg-sky-50 text-sky-600 scale-110'
                    : 'text-slate-400 group-hover:text-slate-600'
                }`}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span
                className={`text-[10px] font-medium mt-0.5 transition-all duration-200 ${
                  isActive ? 'text-sky-600 font-semibold scale-105' : 'text-slate-500'
                }`}
              >
                {item.label}
              </span>

              {/* Notification Badges */}
              {item.badge > 0 && (
                <span className="absolute top-1.5 right-3.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-bold text-white ring-2 ring-white animate-pulse">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
