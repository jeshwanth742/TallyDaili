# TallyDaili 💸
### Tactical Daily Budgeting. 100% Private. Built with AI.

TallyDaili is a premium, minimalist budget tracker designed for **tactical daily liquidity**. Unlike traditional apps that focus on monthly categories, TallyDaili tells you exactly how much you can spend **today** while protecting your future bills.

---

## 📸 Screenshots

### Dashboard - Your Daily Command Center
![Dashboard](./screenshots/dashboard.png)

The Dashboard shows your **Daily Remaining** amount in bold - this is your "Safe to Spend" number for today. The heat-map health card shows budget usage, average daily spending, and days remaining. The Shield icon indicates your **Planned Spending** buffer.

### Analytics - Spending Intelligence
![Analytics](./screenshots/analytics.png)

Visual breakdown of your spending patterns with an interactive pie chart, category-wise distribution, and time-range bar graphs (Today/Week/Month/Year). Track your spending velocity and identify trends.

### History - Calendar & Transactions
![History](./screenshots/history.png)

A heat-map calendar view showing spending intensity by day. Pulsating indicators mark days with **Planned Spending** reservations. Switch between Calendar and List views to see detailed transaction breakdowns.

### Planned Spending - Future Protection
![Planned Spending](./screenshots/planned-spending.png)

Schedule future expenses (Rent, EMI, Bills) that automatically reduce your daily allowance. One-tap conversion from planned to actual expense when the bill is paid.

---

## 🌟 Key Features

- **Dynamic Daily Allowance**: Automatically calculates your "Safe to Spend" number for today, adjusting in real-time as you log expenses.
- **Planned Spending**: Reserve funds for future obligations (Rent, EMI, Bills). These reservations act as a "shield," hidden from your daily spending power.
- **Heat-map Calendar**: A high-fidelity visual history of your spending velocity.
- **Flexible Budget Cycles**: Choose 7, 14, or 30-day periods during setup, or adjust on-the-fly in settings.
- **Privacy First**: 100% local storage via Dexie.js. No cloud, no tracking, no account required.
- **PWA Ready**: Install it on your Android or iPhone directly from the browser for a native full-screen experience.

---

## 🤖 Built with AI: The Development Story

TallyDaili was created through a high-intensity collaborative process between the **User** and an **Advanced Agentic AI (Antigravity)**.

### How AI was used:
1.  **Iterative Architecture**: The AI didn't just write code; it architected the system using a formal `project_blueprint.md`, ensuring scalability and logic consistency before the first line was written.
2.  **Competitor Intelligence**: The AI performed a real-time `competitor_analysis.md` (vs. Monefy, Goodbudget, Buckwheat) to identify market gaps, leading to the creation of the unique **Planned Spending** shield logic.
3.  **Advanced Pair Programming**: The User provided tactical direction and UI preferences, while the AI managed state logic, persistence (IndexedDB), and high-performance React optimization.
4.  **Mobile-First Refinement**: The AI optimized all touch targets, spacing, and accessibility for a premium 100% Android-compliant feel.
5.  **Automated Verification**: Every feature was verified through AI-driven build checks and linting to ensure production-grade stability.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript + Vite
- **Storage**: IndexedDB (via **Dexie.js**)
- **Styling**: Vanilla CSS / Tailwind CSS
- **Icons**: Lucide React
- **State Management**: Zustand
- **Date Utilities**: date-fns

---

## 🚀 Getting Started

1.  **Clone the repo**:
    ```bash
    git clone https://github.com/jeshwanth742/TallyDaili.git
    cd TallyDaili
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Run locally**:
    ```bash
    npm run dev
    ```
4.  **Build for production**:
    ```bash
    npm run build
    ```

---

## 📱 Mobile Installation

### Option 1: Local Network (No Hosting)
1. Ensure your phone and computer are on the same Wi-Fi
2. Run `npm run dev -- --host`
3. Open `http://YOUR_LOCAL_IP:5173` on your phone
4. Tap **"Add to Home Screen"** or **"Install App"**

### Option 2: Deploy to Vercel/Netlify
1. Push this repo to GitHub
2. Connect to [Vercel](https://vercel.com) or [Netlify](https://netlify.com)
3. Deploy and share the URL with anyone
4. Install as PWA from the hosted URL

---

## 🎯 How to Capture Screenshots

To add the actual screenshots to this README:

1. **Create screenshots folder**:
   ```bash
   mkdir screenshots
   ```

2. **Run the app** and capture these views:
   - **Dashboard**: Main view showing Daily Remaining
   - **Analytics**: Tap 2nd tab, capture pie chart view
   - **History**: Tap 3rd tab, capture calendar view
   - **Planned Spending**: In History, tap "+ Planned Spending" and capture the modal

3. **Save screenshots** as:
   - `screenshots/dashboard.png`
   - `screenshots/analytics.png`
   - `screenshots/history.png`
   - `screenshots/planned-spending.png`

4. **Commit and push**:
   ```bash
   git add screenshots/
   git commit -m "Add app screenshots"
   git push origin main
   ```

---

*Created with ❤️ by Jeshwanth & Antigravity AI.*
