# CareBridge 🌉

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-brightgreen?style=for-the-badge&logo=vercel)](https://carebridge-gules.vercel.app/)
[![Gemma 4:e2b](https://img.shields.io/badge/AI_Model-Gemma_4:e2b-4285F4?style=for-the-badge&logo=google)](https://ollama.com/)
[![React 19](https://img.shields.io/badge/React-19.0-61dafb?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646cff?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![PWA Ready](https://img.shields.io/badge/PWA-Installable-blueviolet?style=for-the-badge&logo=pwa)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)

> **CareBridge** is an on-demand, mobile-first Progressive Web App (PWA) connecting families with verified local temporary caregivers and companions on an hourly basis. Built with care, localized for **Chennai, South India**.

🔗 **Live Deployment:** [https://carebridge-gules.vercel.app/](https://carebridge-gules.vercel.app/)  
📁 **GitHub Repository:** [https://github.com/atse25029-collab/carebridge](https://github.com/atse25029-collab/carebridge)

---

## 🌟 Highlights & Features

### 📱 1. Mobile-First & PWA Enabled
- **Interactive Smartphone Bezel:** Desktop visitors experience an interactive white smartphone mockup (complete with dynamic clock, status bar, and iOS home indicator). Mobile visitors receive a fluid, 100% responsive native-like viewport.
- **Installable (PWA):** Equipped with a Web App Manifest (`manifest.json`) and Service Worker (`sw.js`). Users can add CareBridge to their home screen for an app-like experience with offline caching.

### 🤖 2. CareBot AI Chatbot (Local Gemma 4:e2b via Ollama)
- **Local On-Device Intelligence:** Powered by Google's `gemma4:e2b` running locally on your device via Ollama (configured with models in `E:\ollama models`).
- **Eldercare Guidance for Chennai:** Understands Tamil cultural contexts, elderly companion needs, temple visits, post-op physiotherapy, and emergency protocols (108 Ambulance / Apollo Hospitals).
- **Streaming Responses:** Smooth, real-time token streaming with cancel/stop controls, message copying, and conversation persistence.
- **Connection Monitor & Settings:** Real-time health indicator (🟢 Online / 🔴 Offline) with configurable Ollama endpoint URLs, proxy routing (`/api/ollama`), and model selection.

### 🗺️ 3. Dynamic Chennai Vector Map
- Custom-crafted vector street map highlighting prominent Chennai corridors:
  - **Usman Road** (central shopping and transit hub in T. Nagar)
  - **Anna Salai / Mount Road** (diagonal arterial highway)
  - **G.N. Chetty Road** & **Sardar Patel Road** (boundary avenues)
  - **Nageswara Rao Park** & **Cooum River** landmarks
- **Animated Companions:** Caregiver markers slowly wander along streets in real time with dynamic coordinate offsets and active price badges (`₹120`, `₹150`, etc.).

### 🏷️ 4. Credential-Based Pricing
Pricing is tied directly to verified credentials, offering families flexible options ranging from affordable student companions to certified healthcare professionals:

| Tier | Category | Hourly Rate | Verified Credentials | Typical Companion |
| :--- | :--- | :--- | :--- | :--- |
| **Standard** | Basic Student Companion | **₹120 – ₹130 / hr** | Background Checked, Two-Wheeler License | Loyola / Anna University students (Sanjay, Abhishek) |
| **Standard** | Certified Helper | **₹150 – ₹190 / hr** | CPR Certified, First Aid Certified, BLS | Medical/psychology students (Priya, Meera, Rithika) |
| **Premium** | Specialist / Nurse | **₹400 – ₹600 / hr** | RN (B.Sc. Nursing), Licensed LPN, BPT | Senior nurses & physiotherapists (Lakshmi RN, Sister Mary, Dr. Venkatraman PT) |

### 🔍 5. Real-Time Credential Search & Filter
- Tap verified credential tags on the Home dashboard (`Two-Wheeler`, `First Aid`, `CPR Certified`, `Nurse / Specialist`).
- **Live Pin Filtering:** Non-matching pins vanish from the map instantly, and the bottom **Spotlight Carousel** shrinks in real time.
- **Zero-State Fallback:** Displays a clean overlay modal when no caregivers meet the combination, allowing one-tap filter clearing.

### ⚡ 6. Rapido-Style Bidding Booster
- During companion matching (`Find Companion Match`), if search takes time, an InDrive/Rapido-style booster card appears:
  - *"No one accepting? Boost your offer to find a match faster!"*
  - One-tap quick-add buttons: **+₹20/hr** and **+₹50/hr**.
  - Dynamically recalculates trip totals and triggers an instant simulated match acceptance within 2 seconds.

### ⚠️ 7. Ola-Style Booking Cancellation
- Active bookings feature an intuitive cancellation workflow with safety protections:
  - **Cancellation Warning:** Alerts users of a potential ₹50 cancellation fee to respect scheduled caregiver travel time.
  - **Reason Checklist:** Structured multi-choice reasons (*Plan changed*, *Booked by mistake*, *Rate too high*, *Caregiver too far*, or *Other*).
  - **Synchronized Chat Logs:** Automatically logs cancellation reasons directly into the caregiver chat thread.

---

## 🏗️ Project Architecture

```
d:/Carebridge/
├── public/
│   ├── icon.svg             # Vector application branding icon
│   ├── icon-192.png         # 192x192 PWA maskable icon
│   ├── icon-512.png         # 512x512 PWA maskable icon
│   ├── manifest.json        # PWA Web App Manifest
│   └── sw.js                # Service Worker for offline asset caching
├── src/
│   ├── components/
│   │   ├── BottomNav.tsx    # 5-tab bezel-nested bottom navigation (Home, Bookings, CareBot, Messages, Profile)
│   │   ├── BookingFlow.tsx  # Multi-step booking, bidding booster & confirmation
│   │   ├── BookingsView.tsx # Bookings management & Ola-style cancellation sheet
│   │   ├── ChatbotView.tsx  # CareBot AI chat powered by local Gemma 4:e2b
│   │   ├── HomeView.tsx     # Dashboard, credential filters, CareBot banner & spotlight carousel
│   │   ├── MessagesView.tsx # In-app caregiver chat interface with auto-responder
│   │   ├── ProfileView.tsx  # Recipient care profile, doctor logs & payment methods
│   │   └── SVGMapContainer.tsx # Vector map with live coordinate walkers
│   ├── services/
│   │   └── ollamaService.ts # Ollama API client, health checker & Gemma streaming
│   ├── data/
│   │   └── mockData.ts      # Caregivers database, initial bookings & messages
│   ├── types.ts             # TypeScript interface definitions
│   ├── App.tsx              # Root application state & bezel frame wrapper
│   ├── main.tsx             # Application entry point
│   └── index.css            # Tailwind CSS utility layer
├── index.html               # Main HTML entry with PWA metadata
├── vite.config.ts           # Vite bundler configuration (with proxy to Ollama & allowedHosts: true)
├── package.json             # NPM dependencies and scripts
└── README.md                # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or newer)
- [Ollama](https://ollama.com/) (installed with model `gemma4:e2b`)

### 1. Start Ollama with your local models
Ensure Ollama points to your model storage (`E:\ollama models`):
```powershell
$env:OLLAMA_MODELS = "E:\ollama models"
ollama serve
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev -- --host
```
Open [http://localhost:5173/](http://localhost:5173/) on your desktop or mobile device.
Vite proxies `/api/ollama` directly to your local Ollama port `11434`.

### 4. Build for Production
```bash
npm run build
```

---

## 📱 How to Install the PWA

1. Open **[https://carebridge-gules.vercel.app/](https://carebridge-gules.vercel.app/)** in your mobile browser (Chrome on Android, Safari on iOS).
2. **Android (Chrome):** Tap the install banner at the bottom or open the menu (⋮) $\rightarrow$ **Install App** / **Add to Home screen**.
3. **iOS (Safari):** Tap the **Share** button ($\uparrow$) $\rightarrow$ **Add to Home Screen**.
4. The CareBridge icon will appear on your phone home screen and launch in full-screen standalone mode!

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
