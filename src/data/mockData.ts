import type { Caregiver, Booking, Chat } from '../types';

export const USER_LOCATION = { lat: 13.0827, lng: 80.2707 }; // Chennai, T. Nagar area

export const mockCaregivers: Caregiver[] = [
  {
    id: 'cg-1',
    name: 'Priya Dharshini',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120&h=120',
    rating: 4.8,
    reviewsCount: 38,
    distance: 0.6,
    rate: 180, // Hourly rate in INR
    tier: 'standard',
    lat: 13.0850,
    lng: 80.2650,
    specialties: ['Elderly Companionship', 'Traditional Cooking', 'Tamil Conversation'],
    bio: 'Social work student at Madras School of Social Work. I love talking with elders, helping with household chores, and playing traditional board games like Pallanguzhi.',
    qualifications: ['First Aid Certified', 'Background Checked', 'Fluent in Tamil & English']
  },
  {
    id: 'cg-2',
    name: 'Lakshmi Narayanan, RN',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=120&h=120',
    rating: 4.9,
    reviewsCount: 92,
    distance: 0.9,
    rate: 480,
    tier: 'premium',
    lat: 13.0780,
    lng: 80.2750,
    specialties: ['Diabetic Care', 'Medication Logging', 'Dementia Companion'],
    bio: 'Registered Nurse with 8 years of specialized geriatric care experience in Chennai. Attentive to insulin administration, vitals tracking, and warm companionship.',
    qualifications: ['Registered Nurse (B.Sc. Nursing)', 'Geriatric Care Certified', 'BLS Certified', 'Background Checked']
  },
  {
    id: 'cg-3',
    name: 'Karthik Raja',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=120&h=120',
    rating: 4.7,
    reviewsCount: 21,
    distance: 1.4,
    rate: 150,
    tier: 'standard',
    lat: 13.0910,
    lng: 80.2780,
    specialties: ['Errands & Shopping', 'Walking Companion', 'Temple Visits'],
    bio: 'Second-year nursing student. Dedicated to assisting senior citizens with their daily temple visits, getting groceries, and providing engaging conversations in Tamil.',
    qualifications: ['CPR Certified', 'Background Checked', 'Two-Wheeler License']
  },
  {
    id: 'cg-4',
    name: 'Sister Mary Joseph',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=120&h=120',
    rating: 5.0,
    reviewsCount: 84,
    distance: 0.4,
    rate: 420,
    tier: 'premium',
    lat: 13.0805,
    lng: 80.2675,
    specialties: ['Post-Stroke Care', 'Bedbound Assistance', 'Physiotherapy Support'],
    bio: 'Retired chief nurse with 15+ years of caregiving experience. Specialized in physical rehabilitation support, safety transfers, and post-surgery diet compliance.',
    qualifications: ['Licensed LPN', 'Stroke Rehab Specialist', 'Background Checked', 'Patient Transfer Certified']
  },
  {
    id: 'cg-5',
    name: 'Ananya Swaminathan',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=120&h=120',
    rating: 4.6,
    reviewsCount: 14,
    distance: 2.1,
    rate: 200,
    tier: 'standard',
    lat: 13.0730,
    lng: 80.2640,
    specialties: ['Reading Aloud', 'Cognitive Games', 'Carnatic Music Dialogues'],
    bio: 'Psychology graduate. I enjoy reading Tamil spiritual books or newspapers aloud to seniors, singing Carnatic music snippets, and hosting gentle memory exercises.',
    qualifications: ['CPR Certified', 'Background Checked']
  },
  {
    id: 'cg-6',
    name: 'Dr. Venkatraman, PT',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120&h=120',
    rating: 4.9,
    reviewsCount: 56,
    distance: 1.7,
    rate: 600,
    tier: 'premium',
    lat: 13.0890,
    lng: 80.2800,
    specialties: ['Balance & Strength Training', 'Fall Prevention', 'Joint Pain Therapy'],
    bio: 'Licensed Physiotherapist offering hourly temporary home visits. Focuses on safe indoor mobility, building lower body strength, and joint articulation exercises.',
    qualifications: ['Bachelor of Physiotherapy (BPT)', 'Orthopedic Care Specialist', 'Background Checked']
  },
  {
    id: 'cg-7',
    name: 'Sanjay Kumar',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120&h=120',
    rating: 4.5,
    reviewsCount: 12,
    distance: 0.8,
    rate: 120,
    tier: 'standard',
    lat: 13.0810,
    lng: 80.2760,
    specialties: ['Tamil Reading', 'Chess Partner', 'Medicine Buying'],
    bio: 'Loyola College student. Passionate about helping senior citizens with chess sessions, reading Tamil newspapers, and buying daily medicines.',
    qualifications: ['Background Checked', 'Two-Wheeler License']
  },
  {
    id: 'cg-8',
    name: 'Abhishek Sundar',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=120&h=120',
    rating: 4.6,
    reviewsCount: 16,
    distance: 1.1,
    rate: 130,
    tier: 'standard',
    lat: 13.0840,
    lng: 80.2740,
    specialties: ['Tech Setup', 'Newspaper Reading', 'Banking Help'],
    bio: 'Anna University student. Helping elder tech support, bill payments, banking assistance, and running neighborhood errands.',
    qualifications: ['Background Checked', 'Two-Wheeler License']
  },
  {
    id: 'cg-9',
    name: 'Meera Krishnan',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120&h=120',
    rating: 4.8,
    reviewsCount: 24,
    distance: 0.7,
    rate: 160,
    tier: 'standard',
    lat: 13.0870,
    lng: 80.2690,
    specialties: ['Arts & Crafts', 'Singing Companion', 'Board Games'],
    bio: 'Stella Maris College student. Enjoys singing, teaching drawing, playing board games, and trained in first aid for elderly emergency response.',
    qualifications: ['Background Checked', 'CPR Certified', 'First Aid Certified']
  },
  {
    id: 'cg-10',
    name: 'Rithika Ravichandran',
    avatar: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=120&h=120',
    rating: 4.8,
    reviewsCount: 30,
    distance: 1.3,
    rate: 190,
    tier: 'standard',
    lat: 13.0760,
    lng: 80.2670,
    specialties: ['Vitals Logging', 'Mobility Assistance', 'Hospital Escort'],
    bio: 'Madras Medical College student. Providing specialized support for checking blood pressure, walking assistance, and doctor hospital appointments escorting.',
    qualifications: ['Background Checked', 'First Aid Certified', 'BLS Certified']
  }
];

export const initialBookings: Booking[] = [
  {
    id: 'b-past-1',
    caregiver: mockCaregivers[0], // Priya Dharshini
    date: '2026-08-25',
    time: '14:00',
    duration: 3,
    address: 'Flat 3B, Ceebros Heights, T. Nagar, Chennai',
    tier: 'standard',
    status: 'completed',
    totalCost: 540 // 180 * 3
  },
  {
    id: 'b-past-2',
    caregiver: mockCaregivers[1], // Lakshmi Narayanan, RN
    date: '2026-08-28',
    time: '09:00',
    duration: 4,
    address: 'Flat 3B, Ceebros Heights, T. Nagar, Chennai',
    tier: 'premium',
    status: 'completed',
    totalCost: 1920 // 480 * 4
  }
];

export const initialChats: Chat[] = [
  {
    caregiverId: 'cg-1',
    caregiverName: 'Priya Dharshini',
    caregiverAvatar: mockCaregivers[0].avatar,
    lastMessage: 'Sure, I will bring the Pallanguzhi board on Tuesday!',
    lastTimestamp: 'Yesterday',
    unread: false,
    messages: [
      { id: 'm1', sender: 'user', text: 'Hi Priya, my grandmother loves playing traditional board games. Do you know how to play Pallanguzhi?', timestamp: 'Yesterday, 4:15 PM' },
      { id: 'm2', sender: 'caregiver', text: 'Sure, I will bring the Pallanguzhi board on Tuesday!', timestamp: 'Yesterday, 4:20 PM' }
    ]
  },
  {
    caregiverId: 'cg-2',
    caregiverName: 'Lakshmi Narayanan, RN',
    caregiverAvatar: mockCaregivers[1].avatar,
    lastMessage: 'I will check her fasting blood sugar levels first thing in the morning.',
    lastTimestamp: '2 days ago',
    unread: false,
    messages: [
      { id: 'm3', sender: 'caregiver', text: 'Hello! Looking forward to assisting you on Friday morning.', timestamp: '2 days ago' },
      { id: 'm4', sender: 'user', text: 'Thanks Lakshmi. We have kept the Glucometer ready.', timestamp: '2 days ago' },
      { id: 'm5', sender: 'caregiver', text: 'I will check her fasting blood sugar levels first thing in the morning.', timestamp: '2 days ago' }
    ]
  }
];
