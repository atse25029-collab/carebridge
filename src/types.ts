export interface Caregiver {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  reviewsCount: number;
  distance: number; // in miles
  rate: number; // hourly rate
  tier: 'standard' | 'premium';
  lat: number;
  lng: number;
  specialties: string[];
  bio: string;
  qualifications: string[];
}

export interface Booking {
  id: string;
  caregiver: Caregiver;
  date: string;
  time: string;
  duration: number; // hours
  address: string;
  tier: 'standard' | 'premium';
  status: 'active' | 'completed' | 'cancelled';
  totalCost: number;
}

export interface Message {
  id: string;
  sender: 'user' | 'caregiver';
  text: string;
  timestamp: string;
}

export interface Chat {
  caregiverId: string;
  caregiverName: string;
  caregiverAvatar: string;
  lastMessage: string;
  lastTimestamp: string;
  unread: boolean;
  messages: Message[];
}

export type ActiveView = 'home' | 'bookings' | 'chatbot' | 'messages' | 'profile';
