import React from 'react';
import { Home, Calendar, MessageSquare, User, Bot, Sparkles } from 'lucide-react';
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
      isAI: false,
    },
    {
      id: 'bookings' as ActiveView,
      label: 'Bookings',
      icon: Calendar,
      badge: activeCount,
      isAI: false,
    },
    {
      id: 'chatbot' as ActiveView,
      label: 'CareBot',
      icon: Bot,
      badge: 0,
      isAI: true,
    },
    {
      id: 'messages' as ActiveView,
      label: 'Messages',
      icon: MessageSquare,
      badge: unreadCount,
      isAI: false,
    },
    {
      id: 'profile' as ActiveView,
      label: 'Profile',
      icon: User,
      badge: 0,
      isAI: false,
    },
  ];

  return (
    <nav className="w-full bg-white border-t border-slate-200 shadow-[0_-4px_12px_rgba(0,0,0,0.03)] px-2 pb-safe flex-shrink-0 z-40">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className="relative flex flex-col items-center justify-center w-14 h-12 text-slate-400 select-none outline-none group active:scale-95 transition-transform duration-75"
              aria-label={item.label}
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <div
                className={`relative flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 ${
                  isActive
                    ? item.isAI
                      ? 'bg-gradient-to-tr from-sky-500 to-indigo-600 text-white shadow-sm scale-110'
                      : 'bg-sky-50 text-sky-600 scale-110'
                    : item.isAI
                    ? 'text-indigo-500 hover:text-indigo-600 hover:bg-indigo-50/50'
                    : 'text-slate-400 group-hover:text-slate-600'
                }`}
              >
                <Icon size={19} strokeWidth={isActive ? 2.5 : 2} />
                {item.isAI && !isActive && (
                  <span className="absolute -top-0.5 -right-0.5 text-amber-500">
                    <Sparkles size={10} fill="currentColor" />
                  </span>
                )}
              </div>
              <span
                className={`text-[9px] font-medium mt-0.5 transition-all duration-200 ${
                  isActive
                    ? item.isAI
                      ? 'text-indigo-600 font-bold scale-105'
                      : 'text-sky-600 font-semibold scale-105'
                    : 'text-slate-500'
                }`}
              >
                {item.label}
              </span>

              {/* Notification Badges */}
              {item.badge > 0 && (
                <span className="absolute top-1.5 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-bold text-white ring-2 ring-white animate-pulse">
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
