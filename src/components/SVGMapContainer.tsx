import React, { useState, useEffect } from 'react';
import type { Caregiver } from '../types';
import { USER_LOCATION } from '../data/mockData';

interface SVGMapContainerProps {
  selectedTier: 'standard' | 'premium';
  caregivers: Caregiver[];
  onSelectCaregiver: (caregiver: Caregiver) => void;
  selectedCaregiver: Caregiver | null;
}

export const SVGMapContainer: React.FC<SVGMapContainerProps> = ({
  selectedTier,
  caregivers,
  onSelectCaregiver,
  selectedCaregiver,
}) => {
  // Store dynamic caregiver coordinate offsets to simulate slow movement
  const [offsets, setOffsets] = useState<Record<string, { lat: number; lng: number }>>({});

  useEffect(() => {
    // Initialize offsets
    const initialOffsets: Record<string, { lat: number; lng: number }> = {};
    caregivers.forEach((cg) => {
      initialOffsets[cg.id] = { lat: 0, lng: 0 };
    });
    setOffsets(initialOffsets);

    // Update coordinates slightly every 4 seconds to show movement
    const interval = setInterval(() => {
      setOffsets((prev) => {
        const next = { ...prev };
        caregivers.forEach((cg) => {
          // Keep movement tiny so they stay in San Francisco area bounds
          const currentOffset = prev[cg.id] || { lat: 0, lng: 0 };
          
          // Random walk with spring back to origin
          const springForceLat = -currentOffset.lat * 0.1;
          const springForceLng = -currentOffset.lng * 0.1;
          const deltaLat = (Math.random() - 0.5) * 0.0008 + springForceLat;
          const deltaLng = (Math.random() - 0.5) * 0.0008 + springForceLng;
          
          next[cg.id] = {
            lat: currentOffset.lat + deltaLat,
            lng: currentOffset.lng + deltaLng,
          };
        });
        return next;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [caregivers]);

  const filteredCaregivers = caregivers.filter((cg) => cg.tier === selectedTier);

  return (
    <div className="relative w-full h-full bg-slate-100 overflow-hidden select-none rounded-2xl border border-slate-100 shadow-inner">
      {/* Custom Vector Streets Map */}
      <svg viewBox="0 0 400 400" className="w-full h-full opacity-70">
        <rect width="400" height="400" fill="#f8fafc" />
        
        {/* Park */}
        <rect x="240" y="220" width="110" height="90" rx="16" fill="#f0fdf4" stroke="#dcfce7" strokeWidth="2" />
        <text x="295" y="270" fill="#86efac" fontSize="9" fontWeight="bold" textAnchor="middle">Nageswara Rao Park</text>

        {/* Lake / Water Body */}
        <path d="M0,60 Q100,40 200,80 T400,50 L400,0 L0,0 Z" fill="#f0f9ff" stroke="#e0f2fe" strokeWidth="2" />
        <text x="200" y="30" fill="#bae6fd" fontSize="9" fontWeight="bold" textAnchor="middle">Cooum River</text>
        
        {/* Streets Grid */}
        <g stroke="#cbd5e1" strokeWidth="12" strokeLinecap="round" fill="none">
          {/* Main Avenues */}
          <line x1="0" y1="150" x2="400" y2="150" />
          <line x1="0" y1="280" x2="400" y2="280" />
          
          {/* Main Streets */}
          <line x1="120" y1="0" x2="120" y2="400" />
          <line x1="280" y1="0" x2="280" y2="400" />
          
          {/* Diagonal Blvd */}
          <line x1="0" y1="340" x2="400" y2="100" />
        </g>
        
        <g stroke="#ffffff" strokeWidth="8" strokeLinecap="round" fill="none">
          <line x1="0" y1="150" x2="400" y2="150" />
          <line x1="0" y1="280" x2="400" y2="280" />
          <line x1="120" y1="0" x2="120" y2="400" />
          <line x1="280" y1="0" x2="280" y2="400" />
          <line x1="0" y1="340" x2="400" y2="100" />
        </g>

        {/* Street Labels */}
        <g fill="#94a3b8" fontSize="7" fontWeight="600" letterSpacing="0.5">
          <text x="60" y="146" textAnchor="middle">USMAN ROAD</text>
          <text x="350" y="276" textAnchor="middle">ANNA SALAI</text>
          <text x="116" y="200" textAnchor="middle" transform="rotate(-90 116 200)">G.N. CHETTY ROAD</text>
          <text x="276" y="200" textAnchor="middle" transform="rotate(-90 276 200)">SARDAR PATEL ROAD</text>
        </g>
      </svg>

      {/* Pulsating user marker */}
      <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
        <div className="relative flex items-center justify-center h-8 w-8">
          <div className="absolute h-8 w-8 rounded-full bg-sky-500 opacity-20 animate-ping"></div>
          <div className="absolute h-5 w-5 rounded-full bg-sky-400 opacity-40 animate-pulse-ring"></div>
          <div className="relative h-4 w-4 rounded-full bg-sky-600 border-2 border-white shadow-[0_2px_8px_rgba(0,0,0,0.15)] animate-pulse-dot"></div>
        </div>
        <span className="bg-slate-900/80 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-md mt-1 shadow-sm backdrop-blur-[2px]">
          Sarah (You)
        </span>
      </div>

      {/* Caregiver Markers */}
      {filteredCaregivers.map((cg) => {
        const offset = offsets[cg.id] || { lat: 0, lng: 0 };
        // Apply coordinate offset to current caregiver location
        const lat = cg.lat + offset.lat;
        const lng = cg.lng + offset.lng;
        
        // Calculate relative position to center
        const latDiff = lat - USER_LOCATION.lat;
        const lngDiff = lng - USER_LOCATION.lng;
        
        // Scale and map difference to SVG bounds
        const topPercent = 50 - (latDiff * 3800);
        const leftPercent = 50 + (lngDiff * 3800);

        const isSelected = selectedCaregiver?.id === cg.id;

        return (
          <button
            key={cg.id}
            onClick={() => onSelectCaregiver(cg)}
            className="absolute z-20 flex flex-col items-center -translate-x-1/2 -translate-y-1/2 focus:outline-none transition-all duration-300"
            style={{
              top: `${Math.max(12, Math.min(88, topPercent))}%`,
              left: `${Math.max(12, Math.min(88, leftPercent))}%`,
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            <div 
              className={`relative flex items-center justify-center p-0.5 rounded-full border-2 transition-all duration-300 ${
                isSelected 
                  ? 'border-rose-500 scale-125 z-30 shadow-lg ring-4 ring-rose-500/20' 
                  : cg.tier === 'premium'
                    ? 'border-emerald-500 bg-emerald-50 shadow-md hover:scale-110 active:scale-95'
                    : 'border-sky-500 bg-sky-50 shadow-md hover:scale-110 active:scale-95'
              }`}
            >
              <div className="w-10 h-10 rounded-full overflow-hidden bg-white">
                <img src={cg.avatar} alt={cg.name} className="w-full h-full object-cover" />
              </div>
              
              <div 
                className={`absolute -bottom-1 -right-1 text-[8px] font-bold text-white px-1.5 py-0.5 rounded-full shadow-sm ${
                  cg.tier === 'premium' ? 'bg-emerald-600' : 'bg-sky-600'
                }`}
              >
                ₹{cg.rate}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};
