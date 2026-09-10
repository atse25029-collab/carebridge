import React, { useState, useEffect, useRef } from 'react';
import type { Chat } from '../types';
import { Send, ChevronLeft, Search, CheckCheck } from 'lucide-react';

interface MessagesViewProps {
  chats: Chat[];
  onSendMessage: (caregiverId: string, text: string) => void;
  onMarkRead: (caregiverId: string) => void;
  activeChatId: string | null;
  setActiveChatId: (id: string | null) => void;
}

export const MessagesView: React.FC<MessagesViewProps> = ({
  chats,
  onSendMessage,
  onMarkRead,
  activeChatId,
  setActiveChatId,
}) => {
  const [inputText, setInputText] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const activeChat = chats.find((c) => c.caregiverId === activeChatId);

  // Scroll to bottom of message list on updates
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (activeChatId) {
      onMarkRead(activeChatId);
      scrollToBottom();
    }
  }, [activeChatId, activeChat?.messages.length]);

  // Mock caregiver response generator
  const simulateCaregiverResponse = (userText: string, caregiverId: string) => {
    setIsTyping(true);
    setTimeout(() => {
      let replyText = 'Thanks for your message! Looking forward to helping out.';
      const lowText = userText.toLowerCase();

      if (caregiverId === 'cg-1') {
        // Elena (Standard Student)
        if (lowText.includes('game') || lowText.includes('scrabble')) {
          replyText = "I love Scrabble! I'll make sure to bring my travel edition. My grandmother taught me a few tricks, so get ready!";
        } else if (lowText.includes('time') || lowText.includes('arrive')) {
          replyText = "I'll be there right on time at 9:00 AM. Let me know if you need me to grab anything on the way!";
        } else if (lowText.includes('food') || lowText.includes('cook') || lowText.includes('meal')) {
          replyText = "I can cook! I usually make delicious light soups, pasta, or oatmeal. Let me know if she has any allergies!";
        } else {
          replyText = "That sounds perfect! Let me know if you have any other questions. See you soon!";
        }
      } else if (caregiverId === 'cg-2') {
        // Marcus, RN (Premium Nurse)
        if (lowText.includes('medicine') || lowText.includes('medication') || lowText.includes('pill')) {
          replyText = 'Excellent. I will review the pill organizer and log chart upon arrival to ensure medication adherence.';
        } else if (lowText.includes('report') || lowText.includes('care')) {
          replyText = 'I will compile a clinical log detailing vitals, fluid intake, and mood/alertness and share it before I head out.';
        } else if (lowText.includes('emergency') || lowText.includes('doctor')) {
          replyText = "If any issue arises, I'll administer immediate CPR/BLS and contact emergency protocols. Rest assured she's in professional hands.";
        } else {
          replyText = "Understood. I've noted down these details in my preparation log. See you on Friday.";
        }
      }

      onSendMessage(caregiverId, replyText);
      setIsTyping(false);
    }, 1500);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeChatId) return;

    const userText = inputText.trim();
    onSendMessage(activeChatId, userText);
    setInputText('');

    // Trigger mock responder
    simulateCaregiverResponse(userText, activeChatId);
  };

  // Filtered Chat List for search
  const filteredChats = chats.filter((c) =>
    c.caregiverName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col flex-1 h-full overflow-hidden bg-slate-50 relative">
      
      {/* CASE 1: Active Chat View (Full Screen Cover on mobile) */}
      {activeChatId && activeChat ? (
        <div className="absolute inset-0 z-30 bg-white flex flex-col h-full animate-slide-right pb-safe">
          {/* Chat Header */}
          <div className="flex items-center gap-2 px-3 py-3 border-b border-slate-100 flex-shrink-0 bg-white">
            <button
              onClick={() => setActiveChatId(null)}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
              aria-label="Back"
            >
              <ChevronLeft size={20} />
            </button>
            
            <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-100 bg-slate-50 relative">
              <img src={activeChat.caregiverAvatar} alt={activeChat.caregiverName} className="w-full h-full object-cover" />
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white"></div>
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-xs font-bold text-slate-800 truncate">{activeChat.caregiverName}</h3>
              <span className="text-[9px] text-emerald-600 font-semibold flex items-center gap-1">
                Active Companion
              </span>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-slate-50/50 flex flex-col gap-3">
            {activeChat.messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col max-w-[75%] ${isUser ? 'self-end items-end' : 'self-start items-start'}`}
                >
                  <div
                    className={`px-4 py-2.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                      isUser
                        ? 'bg-sky-600 text-white rounded-tr-none'
                        : 'bg-white text-slate-800 rounded-tl-none border border-slate-200/50'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[8px] text-slate-400 mt-1 flex items-center gap-0.5 px-1">
                    {msg.timestamp}
                    {isUser && <CheckCheck size={10} className="text-sky-500" />}
                  </span>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="self-start flex flex-col items-start max-w-[75%] animate-pulse">
                <div className="px-4 py-3 rounded-2xl rounded-tl-none bg-white border border-slate-200/50 text-[10px] text-slate-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input Box */}
          <form
            onSubmit={handleSend}
            className="p-3 border-t border-slate-100 bg-white flex items-center gap-2 flex-shrink-0"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:bg-slate-100 disabled:text-slate-400 text-white transition-colors cursor-pointer"
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      ) : (
        
        // CASE 2: Chats Directory List
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="px-4 pt-4 pb-2 bg-white border-b border-slate-100 flex-shrink-0">
            <h2 className="text-base font-bold text-slate-900">Chats</h2>
            <p className="text-[10px] text-slate-500">Coordinate visits with your scheduled companions.</p>
            
            {/* Search Box */}
            <div className="relative mt-3 mb-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>
          </div>

          {/* List Area */}
          <div className="flex-1 overflow-y-auto px-2 py-3 flex flex-col gap-1">
            {filteredChats.length > 0 ? (
              filteredChats.map((chat) => (
                <button
                  key={chat.caregiverId}
                  onClick={() => setActiveChatId(chat.caregiverId)}
                  className={`w-full p-3 rounded-2xl flex gap-3 text-left transition-all duration-150 border ${
                    chat.unread
                      ? 'bg-sky-50/40 border-sky-100/50 shadow-sm'
                      : 'bg-white border-transparent hover:bg-slate-100/50'
                  }`}
                >
                  <div className="w-11 h-11 rounded-full overflow-hidden border border-slate-100 bg-slate-50 flex-shrink-0 relative">
                    <img src={chat.caregiverAvatar} alt={chat.caregiverName} className="w-full h-full object-cover" />
                    {chat.unread && (
                      <span className="absolute top-0 right-0 w-3 h-3 bg-sky-500 rounded-full border-2 border-white"></span>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <div className="flex justify-between items-baseline">
                      <h4 className="text-xs font-bold text-slate-800 truncate">{chat.caregiverName}</h4>
                      <span className="text-[9px] text-slate-400">{chat.lastTimestamp}</span>
                    </div>
                    <p className={`text-[10px] truncate mt-0.5 ${chat.unread ? 'text-sky-700 font-semibold' : 'text-slate-500'}`}>
                      {chat.lastMessage}
                    </p>
                  </div>
                </button>
              ))
            ) : (
              <div className="text-center text-slate-400 py-12 text-[10px]">
                No chats found.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
