import React, { useState, useEffect } from 'react';
import { 
  CreditCard, Download, 
  HeartHandshake, PhoneCall
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  // PWA installation states
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState<boolean>(false);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);

  useEffect(() => {
    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if app is already running in standalone mode (installed)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallApp = async () => {
    if (!deferredPrompt) return;
    
    // Show prompt
    deferredPrompt.prompt();
    
    // Wait for response
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to install prompt: ${outcome}`);
    
    // Clear prompt state
    setDeferredPrompt(null);
    setIsInstallable(false);
    
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
  };

  return (
    <div className="flex flex-col flex-1 pb-6 px-4 pt-4 gap-5">
      
      {/* Title */}
      <div>
        <h2 className="text-base font-bold text-slate-900">My Profile</h2>
        <p className="text-[10px] text-slate-500">Manage account preferences and credentials.</p>
      </div>

      {/* User Info Card */}
      <div className="bg-white border border-slate-200/60 rounded-2xl p-4 flex gap-4 items-center shadow-sm">
        <div className="w-14 h-14 rounded-full bg-sky-100/50 text-sky-700 text-lg font-bold flex items-center justify-center border border-sky-100 flex-shrink-0">
          SJ
        </div>
        <div className="min-w-0">
          <h3 className="text-xs font-bold text-slate-800">Sarah Jenkins</h3>
          <p className="text-[10px] text-slate-500 mt-0.5">sarah.jenkins@example.com</p>
          <span className="inline-block bg-slate-100 text-slate-600 font-semibold text-[8px] px-2 py-0.5 rounded-full mt-1.5 border border-slate-200/50">
            Family Account
          </span>
        </div>
      </div>

      {/* PWA Install Promo */}
      {isInstallable && !isInstalled && (
        <div className="bg-gradient-to-r from-sky-600 to-blue-500 rounded-2xl p-4 text-white shadow-md flex items-center justify-between gap-3 animate-pulse">
          <div className="min-w-0">
            <h4 className="text-xs font-bold flex items-center gap-1">
              <Download size={13} />
              Install CareBridge App
            </h4>
            <p className="text-[9px] text-sky-100 mt-0.5 leading-relaxed">
              Add to your home screen for quick, temporary caregiver booking. Works offline!
            </p>
          </div>
          <button
            onClick={handleInstallApp}
            className="bg-white text-sky-700 hover:bg-sky-50 text-[10px] font-bold px-3 py-2 rounded-xl transition-all shadow flex-shrink-0 cursor-pointer"
          >
            Install
          </button>
        </div>
      )}

      {/* Recipient Details & Emergency Contact */}
      <div className="bg-white border border-slate-200/60 rounded-2xl p-4 shadow-sm flex flex-col gap-4">
        {/* Recipient info */}
        <div>
          <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
            <HeartHandshake size={12} className="text-slate-400" />
            Care Recipient Profile
          </h4>
          <div className="mt-2.5 text-[10px] text-slate-600 flex flex-col gap-1.5">
            <div className="flex justify-between">
              <span className="font-medium text-slate-400">Full Name</span>
              <span className="font-bold text-slate-800">Margaret Jenkins</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-slate-400">Age & Relationship</span>
              <span className="text-slate-800">82 yrs • Grandmother</span>
            </div>
            <div>
              <span className="font-medium text-slate-400 block mb-0.5">Special Care Notes</span>
              <p className="bg-slate-50 p-2 rounded-lg border border-slate-100 leading-normal text-slate-700 font-medium">
                Uses a light walker for balance. Mild early-stage dementia: enjoys puzzles, friendly conversation, and gentle walks in the garden.
              </p>
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div>
          <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
            <PhoneCall size={12} className="text-slate-400" />
            Emergency Contacts
          </h4>
          <div className="mt-2.5 text-[10px] text-slate-600 flex flex-col gap-2">
            <div className="flex justify-between items-center bg-slate-50 p-2 rounded-lg border border-slate-100">
              <div>
                <span className="font-bold text-slate-800 block">Dr. V. Balasubramanian</span>
                <span className="text-[9px] text-slate-400 block">Geriatric Specialist, Apollo Chennai</span>
              </div>
              <span className="font-bold text-sky-600">+91 98400 12345</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Information */}
      <div className="bg-white border border-slate-200/60 rounded-2xl p-4 shadow-sm flex flex-col gap-3">
        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
          <CreditCard size={12} className="text-slate-400" />
          Default Payment Method
        </h4>
        <div className="flex items-center justify-between border border-slate-100 rounded-xl p-3 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="bg-blue-900 text-white rounded-lg p-2 flex items-center justify-center font-bold text-[8px] shadow-sm">
              RuPay
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800">HDFC RuPay ending in 9876</span>
              <span className="text-[9px] text-slate-400 block mt-0.5">Expires 10/30</span>
            </div>
          </div>
          <span className="bg-emerald-100 text-emerald-800 text-[8px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
            Primary
          </span>
        </div>
      </div>



      {/* Legal & Version info */}
      <div className="text-center text-[9px] text-slate-400 flex flex-col gap-1 py-2">
        <span>CareBridge Companion App • Standalone PWA v1.0.0</span>
        <span>All background checks and caregiver records are fully audited.</span>
      </div>

    </div>
  );
};
