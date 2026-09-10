import React, { useState } from 'react';
import type { Booking } from '../types';
import { Calendar, MapPin, Star, MessageSquare, AlertTriangle, X } from 'lucide-react';

interface BookingsViewProps {
  bookings: Booking[];
  onNavigateToMessages: (caregiverId: string) => void;
  onRebook: (caregiverId: string, tier: 'standard' | 'premium') => void;
  onCancelBooking: (bookingId: string, reason: string) => void;
}

export const BookingsView: React.FC<BookingsViewProps> = ({
  bookings,
  onNavigateToMessages,
  onRebook,
  onCancelBooking,
}) => {
  const [cancellingBooking, setCancellingBooking] = useState<Booking | null>(null);
  const [cancelReason, setCancelReason] = useState<string>('');
  const [customReason, setCustomReason] = useState<string>('');

  const activeBookings = bookings.filter((b) => b.status === 'active');
  const pastBookings = bookings.filter((b) => b.status === 'completed' || b.status === 'cancelled');

  const getStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case 'active':
        return (
          <span className="bg-sky-50 text-sky-700 text-[9px] font-bold px-2 py-0.5 rounded-full border border-sky-100 flex items-center gap-1 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
            Scheduled
          </span>
        );
      case 'completed':
        return (
          <span className="bg-emerald-50 text-emerald-700 text-[9px] font-bold px-2 py-0.5 rounded-full border border-emerald-100 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="bg-rose-50 text-rose-700 text-[9px] font-bold px-2 py-0.5 rounded-full border border-rose-100 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            Cancelled
          </span>
        );
    }
  };

  const formatDate = (dateStr: string) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', options);
  };

  const renderBookingCard = (booking: Booking) => {
    const cg = booking.caregiver;
    return (
      <div 
        key={booking.id}
        className="bg-white border border-slate-200/60 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-3"
      >
        {/* Header: Caregiver + Status */}
        <div className="flex justify-between items-start gap-2">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full overflow-hidden border border-slate-100 bg-slate-50 flex-shrink-0">
              <img src={cg.avatar} alt={cg.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1">
                {cg.name}
                {cg.tier === 'premium' && (
                  <span className="bg-emerald-500 text-white text-[8px] px-1 rounded-sm font-semibold scale-90">
                    PRO
                  </span>
                )}
              </h4>
              <div className="flex items-center gap-1 mt-0.5 text-amber-500 font-bold text-[9px]">
                <Star size={9} fill="currentColor" />
                <span>{cg.rating}</span>
                <span className="text-slate-400 font-normal">({cg.reviewsCount} visits)</span>
              </div>
            </div>
          </div>
          {getStatusBadge(booking.status)}
        </div>

        {/* Details: Date, Time, Location, Cost */}
        <div className="bg-slate-50 rounded-xl p-3 text-[10px] text-slate-600 flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5">
            <Calendar size={12} className="text-slate-400" />
            <span>{formatDate(booking.date)} at <strong>{booking.time}</strong> ({booking.duration} hours)</span>
          </div>
          <div className="flex items-start gap-1.5">
            <MapPin size={12} className="text-slate-400 mt-0.5 flex-shrink-0" />
            <span className="truncate">{booking.address}</span>
          </div>
          <div className="h-px bg-slate-200/50 my-0.5"></div>
          <div className="flex justify-between items-center text-xs font-semibold text-slate-800">
            <span>Total Cost</span>
            <span>₹{booking.totalCost}</span>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-100">
          {booking.status === 'active' && (
            <button
              onClick={() => setCancellingBooking(booking)}
              className="flex items-center gap-1 border border-rose-200 hover:bg-rose-50 text-rose-600 px-3 py-1.5 rounded-lg text-[10px] font-bold shadow-sm transition-colors cursor-pointer"
            >
              Cancel
            </button>
          )}
          <button
            onClick={() => onNavigateToMessages(cg.id)}
            className="flex items-center gap-1 border border-slate-200 hover:bg-slate-50 text-slate-600 px-3 py-1.5 rounded-lg text-[10px] font-bold shadow-sm transition-colors cursor-pointer"
          >
            <MessageSquare size={12} />
            Chat
          </button>
          {booking.status !== 'active' && (
            <button
              onClick={() => onRebook(cg.id, booking.tier)}
              className="bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold shadow-sm transition-colors cursor-pointer"
            >
              Rebook Caregiver
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col flex-1 pb-6 px-4 pt-4 relative">
      {/* Title */}
      <div className="mb-4">
        <h2 className="text-base font-bold text-slate-900">My Bookings</h2>
        <p className="text-[10px] text-slate-500">Track and manage caregiving appointments.</p>
      </div>

      {/* Active Bookings Section */}
      <div className="flex flex-col gap-3 mb-6">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Upcoming Service</h3>
        {activeBookings.length > 0 ? (
          activeBookings.map((b) => renderBookingCard(b))
        ) : (
          <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center text-slate-400 flex flex-col items-center justify-center">
            <Calendar size={28} className="text-slate-300 stroke-1.5 mb-1.5" />
            <p className="text-[10px] font-medium">No upcoming service booked.</p>
            <p className="text-[9px] mt-0.5 max-w-[180px] text-slate-400">
              Need temporary assistance? Request a companion on the home screen.
            </p>
          </div>
        )}
      </div>

      {/* Past Bookings Section */}
      <div className="flex flex-col gap-3">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Service History</h3>
        {pastBookings.length > 0 ? (
          pastBookings.map((b) => renderBookingCard(b))
        ) : (
          <div className="text-center text-slate-400 py-4 text-[10px]">
            No booking history found.
          </div>
        )}
      </div>

      {/* Cancellation Warning Overlay (Ola/Uber style) */}
      {cancellingBooking && (
        <div className="absolute inset-0 z-50 bg-slate-900/60 backdrop-blur-[2px] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
          <div className="bg-white w-full rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-slide-up pb-safe text-left">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1">
                <AlertTriangle size={14} className="text-rose-500" />
                Cancel Companion Visit?
              </h3>
              <button 
                onClick={() => {
                  setCancellingBooking(null);
                  setCancelReason('');
                  setCustomReason('');
                }}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-5 flex flex-col gap-4 overflow-y-auto no-scrollbar">
              {/* Fee Warning Alert Banner */}
              <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-3 flex gap-2.5 items-start">
                <AlertTriangle size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <h4 className="text-[10px] font-bold text-amber-800">Cancellation Policy Alert</h4>
                  <p className="text-[9px] text-amber-700 mt-0.5 leading-relaxed">
                    Our caregiver <strong>{cancellingBooking.caregiver.name}</strong> is already prep-checking for your visit. Cancelling now may result in a cancellation fee of <strong>₹50</strong> to compensate their scheduled travel time.
                  </p>
                </div>
              </div>

              {/* Cancellation Reason Selector */}
              <div>
                <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block mb-2">Please select cancellation reason:</span>
                <div className="flex flex-col gap-1.5">
                  {[
                    "Plan changed / No longer required",
                    "Booked by mistake / wrong details",
                    "Offer pricing rate is too high",
                    "Companion is taking too long to travel",
                    "Other"
                  ].map((reason) => {
                    const isSelected = cancelReason === reason;
                    return (
                      <button
                        key={reason}
                        type="button"
                        onClick={() => setCancelReason(reason)}
                        className={`w-full text-left py-2.5 px-3.5 rounded-xl border text-[10px] font-semibold transition-all flex items-center justify-between cursor-pointer ${
                          isSelected 
                            ? 'border-sky-500 bg-sky-50/50 text-sky-700 font-bold' 
                            : 'border-slate-200 text-slate-600 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <span>{reason}</span>
                        <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center flex-shrink-0 ${
                          isSelected ? 'border-sky-500 bg-sky-500' : 'border-slate-300'
                        }`}>
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {cancelReason === 'Other' && (
                  <textarea
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    className="w-full mt-2.5 p-2 rounded-xl border border-slate-200 text-[10px] outline-none focus:ring-1 focus:ring-sky-500 h-14 resize-none placeholder:text-slate-400"
                    placeholder="Describe your cancellation reason..."
                  />
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="p-5 border-t border-slate-100 grid grid-cols-2 gap-2 flex-shrink-0">
              <button
                onClick={() => {
                  setCancellingBooking(null);
                  setCancelReason('');
                  setCustomReason('');
                }}
                className="py-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-[10px] font-bold transition-colors cursor-pointer"
              >
                Keep Booking
              </button>
              <button
                disabled={!cancelReason || (cancelReason === 'Other' && !customReason.trim())}
                onClick={() => {
                  const finalReason = cancelReason === 'Other' ? customReason : cancelReason;
                  onCancelBooking(cancellingBooking.id, finalReason);
                  setCancellingBooking(null);
                  setCancelReason('');
                  setCustomReason('');
                }}
                className={`py-3 rounded-xl text-white text-[10px] font-bold transition-all shadow-md cursor-pointer ${
                  (!cancelReason || (cancelReason === 'Other' && !customReason.trim()))
                    ? 'bg-slate-350 text-slate-450 cursor-not-allowed shadow-none'
                    : 'bg-rose-600 hover:bg-rose-700 shadow-rose-100'
                }`}
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
