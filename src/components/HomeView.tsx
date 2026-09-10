import React from 'react';
import type { Caregiver } from '../types';
import { SVGMapContainer } from './SVGMapContainer';
import { ShieldCheck, Users, Star, ArrowRight, Sparkles, Stethoscope, Trees, Milestone, ShoppingBag, Tag, ChevronRight, X } from 'lucide-react';

const AVAILABLE_CREDENTIALS = [
  { key: 'two-wheeler', label: 'Two-Wheeler', searchTags: ['Two-Wheeler License'] },
  { key: 'first-aid', label: 'First Aid', searchTags: ['First Aid Certified', 'BLS Certified'] },
  { key: 'cpr', label: 'CPR Certified', searchTags: ['CPR Certified', 'BLS Certified'] },
  { key: 'nurse-specialist', label: 'Nurse / Specialist', searchTags: ['Registered Nurse (B.Sc. Nursing)', 'Licensed LPN', 'Bachelor of Physiotherapy (BPT)', 'Orthopedic Care Specialist'] },
];

interface HomeViewProps {
  selectedTier: 'standard' | 'premium';
  onTierChange: (tier: 'standard' | 'premium') => void;
  caregivers: Caregiver[];
  selectedCaregiver: Caregiver | null;
  onSelectCaregiver: (caregiver: Caregiver) => void;
  onRequestCompanion: (caregiver?: Caregiver, prefilledNote?: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  selectedTier,
  onTierChange,
  caregivers,
  selectedCaregiver,
  onSelectCaregiver,
  onRequestCompanion,
}) => {
  const [selectedCredentials, setSelectedCredentials] = React.useState<string[]>([]);

  const handleCredentialToggle = (key: string) => {
    setSelectedCredentials((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const filteredCaregivers = caregivers.filter((cg) => {
    // 1. Filter by Tier first
    if (cg.tier !== selectedTier) return false;

    // 2. Filter by selected credentials (AND logic)
    if (selectedCredentials.length === 0) return true;

    return selectedCredentials.every((credKey) => {
      const config = AVAILABLE_CREDENTIALS.find((c) => c.key === credKey);
      if (!config) return true;
      return config.searchTags.some((tag) => cg.qualifications.includes(tag));
    });
  });

  const currentCaregiverCount = filteredCaregivers.length;

  return (
    <div className="flex flex-col flex-1 pb-6">
      {/* Header Greeting */}
      <div className="bg-gradient-to-b from-sky-50 to-transparent px-4 pt-6 pb-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
              Vanakkam, Sarah <span className="wave animate-bounce">👋</span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">Find trusted local companions, on-demand.</p>
          </div>
          <div className="w-10 h-10 rounded-full border border-sky-100 bg-sky-100/50 flex items-center justify-center text-sky-700 font-bold shadow-sm">
            SJ
          </div>
        </div>
      </div>

      {/* Main Request Form + Map Container */}
      <div className="px-4 flex-1 flex flex-col gap-4">
        {/* Tier Selector Toggle */}
        <div className="bg-slate-100/80 p-1.5 rounded-2xl flex flex-col gap-1.5 shadow-sm border border-slate-200/50">
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => {
                onTierChange('standard');
                if (selectedCaregiver?.tier !== 'standard') {
                  // Deselect if active caregiver tier changes
                  onSelectCaregiver(null as any);
                }
              }}
              className={`py-3 px-3 rounded-xl text-xs font-bold transition-all duration-300 flex flex-col items-center gap-0.5 ${
                selectedTier === 'standard'
                  ? 'bg-white text-sky-600 shadow-[0_2px_8px_rgba(2,132,199,0.08)] border border-sky-100'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <span className="flex items-center gap-1">
                <Users size={14} />
                Standard
              </span>
              <span className="text-[10px] font-normal opacity-85">Students & Adults • Starts at ₹180/hr</span>
            </button>

            <button
              onClick={() => {
                onTierChange('premium');
                if (selectedCaregiver?.tier !== 'premium') {
                  onSelectCaregiver(null as any);
                }
              }}
              className={`py-3 px-3 rounded-xl text-xs font-bold transition-all duration-300 flex flex-col items-center gap-0.5 ${
                selectedTier === 'premium'
                  ? 'bg-white text-emerald-600 shadow-[0_2px_8px_rgba(16,185,129,0.08)] border border-emerald-100'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <span className="flex items-center gap-1">
                <Sparkles size={13} className="text-emerald-500" />
                Premium
              </span>
              <span className="text-[10px] font-normal opacity-85">Nurses & Professionals • Starts at ₹480/hr</span>
            </button>
          </div>
        </div>

        {/* Credentials Filter Bar */}
        <div className="flex flex-col gap-1.5 flex-shrink-0">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Search by Verified Credentials</span>
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {AVAILABLE_CREDENTIALS.map((cred) => {
              const isSelected = selectedCredentials.includes(cred.key);
              return (
                <button
                  key={cred.key}
                  type="button"
                  onClick={() => handleCredentialToggle(cred.key)}
                  className={`px-3 py-1.5 rounded-full text-[9px] font-bold border transition-all flex items-center gap-1 flex-shrink-0 cursor-pointer active:scale-95 ${
                    isSelected 
                      ? 'bg-slate-900 border-slate-900 text-white shadow-sm' 
                      : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {cred.label}
                  {isSelected && <X size={10} />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Map Interface container */}
        <div className="h-[280px] w-full flex-shrink-0 relative">
          <SVGMapContainer
            selectedTier={selectedTier}
            caregivers={filteredCaregivers}
            selectedCaregiver={selectedCaregiver}
            onSelectCaregiver={onSelectCaregiver}
          />
          
          {filteredCaregivers.length === 0 && (
            <div className="absolute inset-0 bg-slate-950/45 backdrop-blur-[1px] z-30 flex items-center justify-center p-6 text-center rounded-2xl">
              <div className="bg-white p-4 rounded-2xl shadow-lg border border-slate-100 max-w-[220px]">
                <ShieldCheck size={28} className="text-slate-400 mx-auto mb-1.5" />
                <h5 className="text-[10px] font-bold text-slate-800 uppercase tracking-wider">No Companions Found</h5>
                <p className="text-[8px] text-slate-500 mt-1 leading-normal">
                  No caregivers match the selected verified credentials. Try clearing your filters.
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedCredentials([])}
                  className="mt-3 px-3 py-1.5 bg-slate-900 text-white text-[9px] font-bold rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Caregiver Mini Detail Overlay on Pin Select */}
        {selectedCaregiver && (
          <div className="bg-white border border-rose-100 rounded-2xl p-3 shadow-md transition-all duration-300 animate-slide-up flex gap-3 items-center">
            <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-100 bg-slate-50 flex-shrink-0">
              <img src={selectedCaregiver.avatar} alt={selectedCaregiver.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-800 truncate">{selectedCaregiver.name}</h4>
                <div className="flex items-center gap-0.5 text-amber-500 font-bold text-[10px]">
                  <Star size={10} fill="currentColor" />
                  <span>{selectedCaregiver.rating}</span>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 truncate mt-0.5">{selectedCaregiver.specialties[0]}</p>
              <div className="flex items-center justify-between mt-1.5">
                <span className="text-[10px] text-slate-400">
                  {selectedCaregiver.distance} km away • <strong className="text-slate-700 font-semibold">₹{selectedCaregiver.rate}/hr</strong>
                </span>
                <button
                  onClick={() => onRequestCompanion(selectedCaregiver)}
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-lg text-white transition-colors flex items-center gap-0.5 ${
                    selectedTier === 'premium' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-sky-600 hover:bg-sky-700'
                  }`}
                >
                  Book Now
                  <ArrowRight size={10} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Unified Request Companion button */}
        {!selectedCaregiver && (
          <button
            onClick={() => onRequestCompanion()}
            className={`w-full py-4 rounded-2xl text-sm font-bold text-white shadow-md active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 touch-manipulation cursor-pointer ${
              selectedTier === 'premium' 
                ? 'bg-gradient-to-r from-emerald-600 to-teal-500 hover:opacity-95 shadow-emerald-200' 
                : 'bg-gradient-to-r from-sky-600 to-blue-500 hover:opacity-95 shadow-sky-200'
            }`}
          >
            <span>Request Companion ({currentCaregiverCount} Available)</span>
            <ArrowRight size={16} />
          </button>
        )}

        {/* Safety & Trust Badges */}
        <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-3 flex justify-between gap-4 mt-1">
          <div className="flex items-start gap-2 flex-1">
            <div className="p-1 rounded-lg bg-sky-100/60 text-sky-600 flex-shrink-0">
              <ShieldCheck size={14} />
            </div>
            <div className="min-w-0">
              <h5 className="text-[10px] font-bold text-slate-800">100% Verified</h5>
              <p className="text-[8px] text-slate-500 mt-0.5 leading-normal">
                Rigorous local background checks.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2 flex-1">
            <div className="p-1 rounded-lg bg-emerald-100/60 text-emerald-600 flex-shrink-0">
              <ShieldCheck size={14} />
            </div>
            <div className="min-w-0">
              <h5 className="text-[10px] font-bold text-slate-800">Liability Insured</h5>
              <p className="text-[8px] text-slate-500 mt-0.5 leading-normal">
                Fully protected care visits.
              </p>
            </div>
          </div>
        </div>

        {/* Promo Banner Card */}
        <div className="relative overflow-hidden bg-gradient-to-r from-sky-600 to-indigo-600 rounded-2xl p-4 text-white shadow-md flex items-center justify-between mt-1 flex-shrink-0">
          <div className="flex-1 pr-3">
            <span className="bg-white/20 text-[8px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider">Launch Offer</span>
            <h4 className="text-xs font-extrabold mt-1.5">Get ₹100 Off First Visit</h4>
            <p className="text-[9px] text-indigo-100 mt-0.5 leading-snug">Use code <strong className="text-white">CHENNAI100</strong> during confirmation.</p>
          </div>
          <div className="p-2 rounded-xl bg-white/10 text-white">
            <Tag size={18} className="animate-pulse" />
          </div>
        </div>

        {/* Quick Booking Services Grid */}
        <div className="mt-1 flex flex-col gap-2">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Quick Book Companion</h4>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onRequestCompanion(undefined, "Assisting grandmother Margaret with her medical checkup appointment and pharmacy queue at Apollo Hospitals Chennai.")}
              className="bg-white border border-slate-200/60 p-3 rounded-2xl text-left hover:border-sky-300 transition-colors shadow-sm flex items-start gap-2 active:scale-[0.98] cursor-pointer"
            >
              <div className="p-2 rounded-xl bg-sky-50 text-sky-600 flex-shrink-0">
                <Stethoscope size={14} />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-slate-800 block">Doctor Visit</span>
                <span className="text-[8px] text-slate-400 block mt-0.5 leading-tight">Accompany queue & prescription support</span>
              </div>
            </button>

            <button
              onClick={() => onRequestCompanion(undefined, "Accompaniment for a relaxing afternoon walk around Nageswara Rao Park. Assistance with walker balance and gentle conversation.")}
              className="bg-white border border-slate-200/60 p-3 rounded-2xl text-left hover:border-emerald-300 transition-colors shadow-sm flex items-start gap-2 active:scale-[0.98] cursor-pointer"
            >
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 flex-shrink-0">
                <Trees size={14} />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-slate-800 block">Park Walk</span>
                <span className="text-[8px] text-slate-400 block mt-0.5 leading-tight">Fresh air stroll & mobility safety</span>
              </div>
            </button>

            <button
              onClick={() => onRequestCompanion(undefined, "Accompanying family senior for temple visits and religious walk near T. Nagar area Chennai.")}
              className="bg-white border border-slate-200/60 p-3 rounded-2xl text-left hover:border-amber-300 transition-colors shadow-sm flex items-start gap-2 active:scale-[0.98] cursor-pointer"
            >
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600 flex-shrink-0">
                <Milestone size={14} />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-slate-800 block">Temple Visit</span>
                <span className="text-[8px] text-slate-400 block mt-0.5 leading-tight">Accompany to local worship places</span>
              </div>
            </button>

            <button
              onClick={() => onRequestCompanion(undefined, "Assistance with grocery shopping, pharmacy medicine pickup, and organizing weekly pillbox details.")}
              className="bg-white border border-slate-200/60 p-3 rounded-2xl text-left hover:border-rose-300 transition-colors shadow-sm flex items-start gap-2 active:scale-[0.98] cursor-pointer"
            >
              <div className="p-2 rounded-xl bg-rose-50 text-rose-600 flex-shrink-0">
                <ShoppingBag size={14} />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-slate-800 block">Meds & Grocery</span>
                <span className="text-[8px] text-slate-400 block mt-0.5 leading-tight">Shopping pickup & pill organizer setup</span>
              </div>
            </button>
          </div>
        </div>

        {/* Featured Companions Carousel */}
        <div className="mt-1 flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-semibold">Spotlight Companions</h4>
            <span className="text-[9px] font-bold text-sky-600 hover:underline cursor-pointer flex items-center">
              See All <ChevronRight size={10} />
            </span>
          </div>
          {filteredCaregivers.length > 0 ? (
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 no-scrollbar">
              {filteredCaregivers.map((cg) => (
                <div
                  key={cg.id}
                  onClick={() => {
                    onSelectCaregiver(cg);
                    onRequestCompanion(cg);
                  }}
                  className="w-[180px] flex-shrink-0 bg-white border border-slate-100 rounded-2xl p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col gap-2 active:scale-[0.98]"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-100 bg-slate-50">
                      <img src={cg.avatar} alt={cg.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h5 className="text-[10px] font-bold text-slate-800 truncate">{cg.name}</h5>
                      <div className="flex items-center gap-0.5 text-amber-500 font-bold text-[8px] mt-0.5">
                        <Star size={8} fill="currentColor" />
                        <span>{cg.rating} ({cg.reviewsCount} visits)</span>
                      </div>
                    </div>
                  </div>
                  <div className="h-px bg-slate-100"></div>
                  <div className="flex justify-between items-center text-[9px]">
                    <span className="text-slate-400">{cg.specialties[0]}</span>
                    <strong className="text-slate-700 font-bold">₹{cg.rate}/hr</strong>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="border border-dashed border-slate-200 bg-white rounded-2xl p-4 text-center text-slate-400 text-[10px] py-6">
              No featured companions match selected credentials.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
