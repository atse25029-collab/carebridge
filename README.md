# CareBridge 🌉

CareBridge is a mobile-first Progressive Web App (PWA) that connects families with temporary, local companions and caregivers on an on-demand, hourly basis. Localized specifically for **Chennai, South India**.

---

## ✨ Features

- **📱 Mobile-First PWA:** Centered inside an interactive smartphone bezel on desktop; natively responsive and installable to home screen on mobile.
- **🗺️ Interactive Vector Map:** Custom vector map of Chennai (featuring Usman Road, Anna Salai, G.N. Chetty Road, Nageswara Rao Park, and Cooum River) with animated walking caregiver pins.
- **🏷️ Credential-Based Pricing:**
  - **Basic Student Companions (₹120–₹130/hr):** College students from Loyola, Anna University, etc. (Two-Wheeler License, Background Checked).
  - **First-Aid / CPR Certified Helpers (₹160–₹190/hr):** Trained student assistants (First Aid, CPR, BLS).
  - **Specialists & Nurses (₹400–₹600/hr):** Certified professionals (RN, LPN, Physiotherapy).
- **🔍 Real-Time Credential Filter:** Filter companions by verified credentials (`Two-Wheeler`, `First Aid`, `CPR Certified`, `Nurse / Specialist`) with live map pin updates and fallback empty states.
- **⚡ Rapido-Style Bidding Booster:** When searching for companions, boost your hourly offer (+₹20/hr, +₹50/hr) to attract companions faster with dynamic status updates and instant acceptance simulation.
- **⚠️ Ola-Style Cancellation Protection:** Active booking cancellation dialog with caregiver route alert, policy warnings (₹50 fee alert), reason checklist, and synchronized chat logging.
- **💬 Caregiver Chat:** Direct simulated messaging channel with caregivers for booking instructions and automatic appointment updates.

---

## 🛠️ Tech Stack

- **Framework:** React 19 + TypeScript
- **Bundler & Dev Server:** Vite
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **PWA:** Service Worker + Web App Manifest

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev -- --host
```
Open [http://localhost:5173/](http://localhost:5173/) in your browser.

### 3. Expose via ngrok
```bash
ngrok http 5173
```
*(Vite is already configured with `server.allowedHosts: true` to support tunneling)*

### 4. Build for Production
```bash
npm run build
```
