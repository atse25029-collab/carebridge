import React, { useState, useEffect } from 'react';
import type { Caregiver, Booking } from '../types';
import { mockCaregivers } from '../data/mockData';
import { 
  X, Calendar, Clock, MapPin, Star, ShieldCheck, 
  ArrowRight, CheckCircle2, MessageSquare, ListTodo 
} from 'lucide-react';

interface BookingFlowProps {
  initialTier: 'standard' | 'premium';
  preSelectedCaregiver: Caregiver | null;
  prefilledNote?: string;
  onClose: () => void;
  onAddBooking: (booking: Booking) => void;
  onNavigateToMessages: (caregiverId: string) => void;
  onNavigateToBookings: () => void;
}

export const BookingFlow: React.FC<BookingFlowProps> = ({
  initialTier,
  preSelectedCaregiver,
  prefilledNote = '',
  onClose,
  onAddBooking,
  onNavigateToMessages,
  onNavigateToBookings,
}) => {
  // Steps: 'form' | 'scanning' | 'confirmation' | 'success'
  const [step, setStep] = useState<'form' | 'scanning' | 'confirmation' | 'success'>('form');
  
  // Form States
  const [tier, setTier] = useState<'standard' | 'premium'>(initialTier);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState<string>('09:00');
  const [duration, setDuration] = useState<number>(3);
  const [address, setAddress] = useState<string>('42 Usman Road, T. Nagar, Chennai');
  const [notes, setNotes] = useState<string>(prefilledNote);
  
  // Rapido-style offer booster state
  const [priceBoost, setPriceBoost] = useState<number>(0);

  // Matching State
  const [matchedCaregiver, setMatchedCaregiver] = useState<Caregiver | null>(preSelectedCaregiver);
  const [scanText, setScanText] = useState<string>('Searching nearby companions...');

  const baseRate = preSelectedCaregiver ? preSelectedCaregiver.rate : (tier === 'premium' ? 480 : 180);

  // 1. Mock scanning text sequence and matching delay
  useEffect(() => {
    if (step !== 'scanning') return;

    const texts = priceBoost === 0 ? [
      'Searching nearby companions...',
      'Matching specialized credentials...',
      'Verifying availability checks...',
      'Securing connection details...',
    ] : [
      'Offer boosted! Re-submitting request...',
      'Attracting companions with new rate...',
      'Lakshmi Narayanan is reviewing your offer...',
      'Priya Dharshini is reviewing your offer...',
    ];

    let textIdx = 0;
    const interval = setInterval(() => {
      textIdx++;
      if (textIdx < texts.length) {
        setScanText(texts[textIdx]);
      }
    }, 900);

    // If boosted, match quicker (e.g. 2 seconds) to simulate acceptance!
    // If not boosted, wait longer (e.g. 8 seconds) to let them boost!
    const matchDelay = priceBoost > 0 ? 2000 : 8000;

    const timeout = setTimeout(() => {
      if (!matchedCaregiver) {
        // Find caregiver candidates
        const candidates = mockCaregivers.filter(cg => cg.tier === tier);
        const chosen = candidates[0] || mockCaregivers[0];
        setMatchedCaregiver(chosen);
      }
      setStep('confirmation');
    }, matchDelay);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [step, tier, priceBoost, matchedCaregiver]);

  // Handle Confirmed Booking
  const handleConfirm = () => {
    if (!matchedCaregiver) return;

    const finalRate = matchedCaregiver.rate + priceBoost;

    const newBooking: Booking = {
      id: `b-${Date.now()}`,
      caregiver: {
        ...matchedCaregiver,
        rate: finalRate
      },
      date,
      time,
      duration,
      address,
      tier,
      status: 'active',
      totalCost: finalRate * duration,
    };

    onAddBooking(newBooking);
    setStep('success');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex justify-center items-end sm:items-center p-0 sm:p-4">
      {/* Container */}
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[85vh] animate-slide-up pb-safe">
        
        {/* Header (Hidden in scanning and success steps) */}
        {step !== 'scanning' && step !== 'success' && (
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 flex-shrink-0">
            <h3 className="text-sm font-bold text-slate-800">
              {step === 'form' ? 'Request Companion' : 'Confirm Companion Details'}
            </h3>
            <button 
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Dynamic Content Views */}
        <div className="overflow-y-auto flex-1 p-5 no-scrollbar">
          
          {/* STEP 1: details form */}
          {step === 'form' && (
            <div className="flex flex-col gap-4">
              {/* Care Tier Selection */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Select Care Tier</label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setTier('standard');
                      setMatchedCaregiver(null); // Clear preselected to rematch properly
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all duration-200 ${
                      tier === 'standard'
                        ? 'border-sky-500 bg-sky-50/50 text-sky-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Standard (₹150-250/hr)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTier('premium');
                      setMatchedCaregiver(null);
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all duration-200 ${
                      tier === 'premium'
                        ? 'border-emerald-500 bg-emerald-50/50 text-emerald-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Premium (₹400-600/hr)
                  </button>
                </div>
              </div>

              {/* Service Address */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <MapPin size={11} /> Service Location
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full mt-1 px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-sky-500 focus:border-sky-500 outline-none"
                  placeholder="Enter full address"
                  required
                />
              </div>

              {/* Date and Time Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <Calendar size={11} /> Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full mt-1 px-3 py-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:ring-1 focus:ring-sky-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <Clock size={11} /> Time
                  </label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full mt-1 px-3 py-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:ring-1 focus:ring-sky-500"
                    required
                  />
                </div>
              </div>

              {/* Duration Slider */}
              <div>
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Duration</label>
                  <span className="text-xs font-bold text-sky-600">{duration} hours</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="12"
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value))}
                  className="w-full mt-2 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
                />
                <div className="flex justify-between text-[9px] text-slate-400 mt-1">
                  <span>1 hr</span>
                  <span>4 hrs</span>
                  <span>8 hrs</span>
                  <span>12 hrs</span>
                </div>
              </div>

              {/* Special Instructions */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <ListTodo size={11} /> Care Details & Special Needs
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:ring-1 focus:ring-sky-500 h-16 resize-none"
                  placeholder="Any mobility needs, medical checklist details, favorite topics, etc."
                />
              </div>

              {/* Submit to Matching screen */}
              <button
                type="button"
                onClick={() => setStep('scanning')}
                className="w-full mt-2 py-3.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-slate-200 cursor-pointer"
              >
                <span>Find Companion Match</span>
                <ArrowRight size={14} />
              </button>
            </div>
          )}

          {/* STEP 2: matching scanner */}
          {step === 'scanning' && (
            <div className="flex flex-col items-center justify-center py-6">
              {/* Pulsating matching circles */}
              <div className="relative flex items-center justify-center w-24 h-24 mb-6">
                <div className="absolute w-24 h-24 rounded-full border border-sky-500 bg-sky-100/20 animate-pulse-ring"></div>
                <div className="absolute w-18 h-18 rounded-full border border-sky-500 bg-sky-200/30 animate-pulse-ring" style={{ animationDelay: '0.4s' }}></div>
                <div className="absolute w-10 h-10 rounded-full bg-sky-500 border-2 border-white shadow-lg animate-pulse"></div>
                <Clock className="relative text-white z-10 animate-spin-slow" size={16} />
              </div>
              <h4 className="text-xs font-bold text-slate-800 animate-pulse text-center max-w-[280px] h-8 flex items-center justify-center leading-snug">{scanText}</h4>
              <p className="text-[9px] text-slate-400 mt-1 max-w-[200px] text-center leading-normal">
                Connecting you with local caregivers within a 3-km radius.
              </p>

              {/* Rapido-style Booster Card */}
              <div className="mt-6 bg-slate-50 border border-slate-200/50 rounded-2xl p-4 w-full text-center">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Current Offer</span>
                <span className="text-lg font-extrabold text-slate-800 block mt-0.5">₹{baseRate + priceBoost}/hr</span>
                <span className="text-[9px] text-slate-500 block mt-0.5">Total: ₹{(baseRate + priceBoost) * duration} for {duration} hrs</span>
                
                <div className="h-px bg-slate-200/60 my-3"></div>
                
                <span className="text-[10px] text-slate-600 block mb-2.5 font-semibold">No one accepting? Boost your offer to find a match faster!</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPriceBoost(prev => prev + 20)}
                    className="py-2.5 rounded-xl border border-slate-200 hover:border-sky-500 hover:bg-sky-50 bg-white text-slate-700 hover:text-sky-700 text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1 active:scale-95 cursor-pointer"
                  >
                    <span>+ ₹20/hr</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPriceBoost(prev => prev + 50)}
                    className="py-2.5 rounded-xl border border-slate-200 hover:border-sky-500 hover:bg-sky-50 bg-white text-slate-700 hover:text-sky-700 text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1 active:scale-95 cursor-pointer"
                  >
                    <span>+ ₹50/hr</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: match confirmation */}
          {step === 'confirmation' && matchedCaregiver && (
            <div className="flex flex-col gap-4">
              {/* Caregiver profile summary card */}
              <div className="bg-slate-50 border border-slate-200/50 rounded-2xl p-4 flex flex-col items-center text-center shadow-sm">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full overflow-hidden border border-white shadow-md bg-white">
                    <img src={matchedCaregiver.avatar} alt={matchedCaregiver.name} className="w-full h-full object-cover" />
                  </div>
                  <span className={`absolute -bottom-1 -right-1 p-1 rounded-full text-white text-[9px] font-bold ${
                    matchedCaregiver.tier === 'premium' ? 'bg-emerald-500' : 'bg-sky-500'
                  }`}>
                    {matchedCaregiver.tier === 'premium' ? 'Pro' : 'Std'}
                  </span>
                </div>
                
                <h4 className="text-sm font-bold text-slate-800 mt-2.5">{matchedCaregiver.name}</h4>
                
                <div className="flex items-center gap-1.5 mt-1">
                  <div className="flex items-center gap-0.5 text-amber-500 font-bold text-[10px]">
                    <Star size={11} fill="currentColor" />
                    <span>{matchedCaregiver.rating}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">•</span>
                  <span className="text-[10px] text-slate-500 font-medium">{matchedCaregiver.reviewsCount} visits</span>
                  <span className="text-[10px] text-slate-400">•</span>
                  <span className="text-[10px] text-slate-500 font-medium">{matchedCaregiver.distance} km away</span>
                </div>

                <div className="flex flex-wrap justify-center gap-1 mt-3">
                  {matchedCaregiver.specialties.map((spec, i) => (
                    <span key={i} className="text-[9px] font-medium bg-white text-slate-600 px-2 py-0.5 rounded-md border border-slate-100">
                      {spec}
                    </span>
                  ))}
                </div>

                <p className="text-[10px] text-slate-500 mt-3 leading-relaxed max-w-[280px]">
                  "{matchedCaregiver.bio}"
                </p>
              </div>

              {/* Qualifications checklist */}
              <div className="border border-slate-100 rounded-xl p-3">
                <h5 className="text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-2">Verified Credentials</h5>
                <div className="flex flex-col gap-1.5">
                  {matchedCaregiver.qualifications.map((qual, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-[10px] text-slate-600">
                      <ShieldCheck size={12} className="text-emerald-500 flex-shrink-0" />
                      <span>{qual}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="bg-slate-50 rounded-xl p-3 text-xs flex flex-col gap-2">
                <div className="flex justify-between text-slate-500">
                  <span>Hourly Companion Rate</span>
                  <span>₹{matchedCaregiver.rate + priceBoost}/hr</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Requested Hours</span>
                  <span>{duration} hrs</span>
                </div>
                <div className="h-px bg-slate-200 my-1"></div>
                <div className="flex justify-between font-bold text-slate-800 text-sm">
                  <span>Total Booking Cost</span>
                  <span className={tier === 'premium' ? 'text-emerald-600' : 'text-sky-600'}>
                    ₹{(matchedCaregiver.rate + priceBoost) * duration}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 mt-2">
                <button
                  onClick={() => setStep('form')}
                  className="py-3.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-colors cursor-pointer"
                >
                  Edit Details
                </button>
                <button
                  onClick={handleConfirm}
                  className={`py-3.5 rounded-xl text-white text-xs font-bold transition-opacity hover:opacity-95 shadow-md cursor-pointer ${
                    tier === 'premium' 
                      ? 'bg-emerald-600 shadow-emerald-100' 
                      : 'bg-sky-600 shadow-sky-100'
                  }`}
                >
                  Confirm Booking
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: success screen */}
          {step === 'success' && matchedCaregiver && (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              {/* Confetti Visual effect using simple CSS animations */}
              <div className="relative mb-6">
                <CheckCircle2 size={56} className="text-emerald-500 animate-bounce" />
                
                {/* CSS animated confetti dots */}
                <div className="absolute top-0 left-0 w-2 h-2 rounded-full bg-rose-400 animate-ping" style={{ animationDelay: '0.1s', transform: 'translate(-20px, -10px)' }}></div>
                <div className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" style={{ animationDelay: '0.3s', transform: 'translate(25px, -5px)' }}></div>
                <div className="absolute bottom-0 left-1/2 w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping" style={{ animationDelay: '0.5s', transform: 'translate(10px, 30px)' }}></div>
              </div>

              <h4 className="text-base font-bold text-slate-900">Booking Confirmed!</h4>
              <p className="text-xs text-slate-500 mt-1 leading-normal max-w-[280px]">
                You have matched with <strong>{matchedCaregiver.name}</strong> for <strong>{date}</strong> at <strong>{time}</strong>.
              </p>

              {/* Mini caregiver card in Success screen */}
              <div className="bg-slate-50 border border-slate-200/50 rounded-xl p-3 w-full flex items-center gap-3 text-left mt-6">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-100 bg-white flex-shrink-0">
                  <img src={matchedCaregiver.avatar} alt={matchedCaregiver.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="text-xs font-bold text-slate-800">{matchedCaregiver.name}</h5>
                  <p className="text-[10px] text-slate-400 mt-0.5">{matchedCaregiver.specialties[0]}</p>
                </div>
                <button
                  onClick={() => onNavigateToMessages(matchedCaregiver.id)}
                  className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors shadow-sm"
                  title="Message caregiver"
                >
                  <MessageSquare size={16} />
                </button>
              </div>

              <div className="flex flex-col gap-2 w-full mt-8">
                <button
                  onClick={onNavigateToBookings}
                  className="w-full py-3 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors shadow-md shadow-slate-200 cursor-pointer"
                >
                  View My Bookings
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-3 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-800 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
