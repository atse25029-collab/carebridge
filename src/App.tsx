import { useState } from 'react';
import type { ActiveView, Booking, Chat, Caregiver } from './types';
import { initialBookings, initialChats, mockCaregivers } from './data/mockData';
import { BottomNav } from './components/BottomNav';
import { HomeView } from './components/HomeView';
import { BookingsView } from './components/BookingsView';
import { MessagesView } from './components/MessagesView';
import { ProfileView } from './components/ProfileView';
import { BookingFlow } from './components/BookingFlow';
import { ChatbotView } from './components/ChatbotView';

export default function App() {
  // Navigation & View states
  const [currentView, setCurrentView] = useState<ActiveView>('home');
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  // Core Data States
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [chats, setChats] = useState<Chat[]>(initialChats);
  const [selectedTier, setSelectedTier] = useState<'standard' | 'premium'>('standard');
  const [selectedCaregiver, setSelectedCaregiver] = useState<Caregiver | null>(null);
  const [isBookingFlowOpen, setIsBookingFlowOpen] = useState<boolean>(false);
  const [prefilledNote, setPrefilledNote] = useState<string>('');

  // Add a new booking
  const handleAddBooking = (newBooking: Booking) => {
    setBookings((prev) => [newBooking, ...prev]);
    
    // Auto-create chat if not exists
    const chatExists = chats.some((c) => c.caregiverId === newBooking.caregiver.id);
    if (!chatExists) {
      const newChat: Chat = {
        caregiverId: newBooking.caregiver.id,
        caregiverName: newBooking.caregiver.name,
        caregiverAvatar: newBooking.caregiver.avatar,
        lastMessage: `Hi, looking forward to our booking on ${newBooking.date}!`,
        lastTimestamp: 'Just now',
        unread: true,
        messages: [
          {
            id: `m-init-${Date.now()}`,
            sender: 'caregiver',
            text: `Hello! I have confirmed your booking request for ${newBooking.date} at ${newBooking.time}. Please let me know if there are any specific preferences or instructions!`,
            timestamp: 'Just now',
          },
        ],
      };
      setChats((prev) => [newChat, ...prev]);
    }
  };

  // Send a message
  const handleSendMessage = (caregiverId: string, text: string) => {
    setChats((prevChats) => {
      return prevChats.map((chat) => {
        if (chat.caregiverId === caregiverId) {
          const isUser = !chat.messages[chat.messages.length - 1]?.sender || chat.messages[chat.messages.length - 1].sender === 'caregiver';
          const newMsg = {
            id: `msg-${Date.now()}`,
            sender: (isUser ? 'user' : 'caregiver') as 'user' | 'caregiver',
            text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
          return {
            ...chat,
            lastMessage: text,
            lastTimestamp: 'Just now',
            unread: !isUser && activeChatId !== caregiverId,
            messages: [...chat.messages, newMsg],
          };
        }
        return chat;
      });
    });
  };

  // Mark chat as read
  const handleMarkRead = (caregiverId: string) => {
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.caregiverId === caregiverId ? { ...chat, unread: false } : chat
      )
    );
  };

  // Navigate to messages and select chat
  const handleNavigateToMessages = (caregiverId: string) => {
    setActiveChatId(caregiverId);
    setCurrentView('messages');
    setIsBookingFlowOpen(false);
  };

  // Navigate to bookings tab
  const handleNavigateToBookings = () => {
    setCurrentView('bookings');
    setIsBookingFlowOpen(false);
  };

  // Cancel booking with reason details
  const handleCancelBooking = (bookingId: string, reason: string) => {
    setBookings((prevBookings) =>
      prevBookings.map((b) => {
        if (b.id === bookingId) {
          // Auto-send cancellation message to chat
          setChats((prevChats) =>
            prevChats.map((chat) => {
              if (chat.caregiverId === b.caregiver.id) {
                const cancelMsg = {
                  id: `msg-cancel-${Date.now()}`,
                  sender: 'user' as 'user' | 'caregiver',
                  text: `Booking cancelled. Reason: ${reason}.`,
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                };
                return {
                  ...chat,
                  lastMessage: 'Booking cancelled.',
                  lastTimestamp: 'Just now',
                  messages: [...chat.messages, cancelMsg],
                };
              }
              return chat;
            })
          );
          return { ...b, status: 'cancelled' as Booking['status'] };
        }
        return b;
      })
    );
  };

  // Rebook helper
  const handleRebook = (caregiverId: string, tier: 'standard' | 'premium') => {
    const cg = mockCaregivers.find((c) => c.id === caregiverId) || null;
    setSelectedCaregiver(cg);
    setSelectedTier(tier);
    setIsBookingFlowOpen(true);
  };

  // Active bookings count for bottom badge
  const activeBookingCount = bookings.filter((b) => b.status === 'active').length;
  // Unread chats count for bottom badge
  const unreadChatCount = chats.filter((c) => c.unread).length;

  return (
    <div className="min-h-screen bg-slate-900 sm:py-6 flex items-center justify-center">
      {/* Mobile-first Device Wrapper on Desktop */}
      <div className="w-full max-w-md h-[100vh] sm:h-[840px] sm:max-h-[92vh] bg-white flex flex-col relative sm:shadow-2xl sm:rounded-[36px] overflow-hidden border border-slate-100">
        
        {/* Top Status Bar Notch Simulator (only on desktop screen size helper) */}
        <div className="hidden sm:flex bg-slate-900 text-white h-6 px-6 items-center justify-between text-[10px] font-semibold flex-shrink-0 z-50">
          <span>9:41</span>
          <div className="w-20 h-4 bg-slate-950 rounded-b-xl absolute left-1/2 -translate-x-1/2 top-0"></div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
            <span>CareBridge LTE</span>
          </div>
        </div>

        {/* Core View Router Container */}
        <main className="flex-1 flex flex-col overflow-y-auto bg-slate-50 relative no-scrollbar">
          {currentView === 'home' && (
            <HomeView
              selectedTier={selectedTier}
              onTierChange={setSelectedTier}
              caregivers={mockCaregivers}
              selectedCaregiver={selectedCaregiver}
              onSelectCaregiver={setSelectedCaregiver}
              onRequestCompanion={(cg, note) => {
                if (cg) setSelectedCaregiver(cg);
                setPrefilledNote(note || '');
                setIsBookingFlowOpen(true);
              }}
              onNavigateToChatbot={() => setCurrentView('chatbot')}
            />
          )}

          {currentView === 'bookings' && (
            <BookingsView
              bookings={bookings}
              onNavigateToMessages={handleNavigateToMessages}
              onRebook={handleRebook}
              onCancelBooking={handleCancelBooking}
            />
          )}

          {currentView === 'chatbot' && (
            <ChatbotView />
          )}

          {currentView === 'messages' && (
            <MessagesView
              chats={chats}
              onSendMessage={handleSendMessage}
              onMarkRead={handleMarkRead}
              activeChatId={activeChatId}
              setActiveChatId={setActiveChatId}
            />
          )}

          {currentView === 'profile' && (
            <ProfileView />
          )}
        </main>

        {/* Booking Overlay Flow */}
        {isBookingFlowOpen && (
          <BookingFlow
            initialTier={selectedTier}
            preSelectedCaregiver={selectedCaregiver}
            prefilledNote={prefilledNote}
            onClose={() => {
              setIsBookingFlowOpen(false);
              setSelectedCaregiver(null);
              setPrefilledNote('');
            }}
            onAddBooking={handleAddBooking}
            onNavigateToMessages={handleNavigateToMessages}
            onNavigateToBookings={handleNavigateToBookings}
          />
        )}

        {/* Global Bottom Sticky Nav */}
        <BottomNav
          currentView={currentView}
          onViewChange={(view) => {
            setCurrentView(view);
            if (view !== 'messages') {
              setActiveChatId(null);
            }
          }}
          unreadCount={unreadChatCount}
          activeCount={activeBookingCount}
        />

        {/* Home Indicator Simulator for iOS */}
        <div className="hidden sm:block absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-300 rounded-full z-50"></div>
      </div>
    </div>
  );
}
