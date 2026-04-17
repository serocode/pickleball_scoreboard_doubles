# 🎾 Pickleball Scoreboard — Doubles Edition

A premium, modern, and high-performance scoreboard application designed specifically for **Pickleball Doubles**. This application tracks score, server number, player positions on the court, and detailed match analytics all in real-time.

![Pickleball Scoreboard Preview](https://via.placeholder.com/800x450.png?text=Pickleball+Scoreboard+Interface)

## 🚀 Key Features

### ⚖️ Advanced Scoring Logic
- **Server Tracking**: Automatically tracks "Server 1" and "Server 2".
- **Side-Out Automation**: Automatic server rotation and side-outs based on fault logic.
- **Score Parity**: Correctly calculates server positioning (Right/Left) based on current score parity.

### 🏆 Multi-Game Match Modes
- **Casual**: Single game to 11 (win by 2).
- **Standard**: Best of 3 games.
- **Long**: Best of 5 games for professional-style matches.
- **Match Progression**: Tracks games won per team and automates the transition to the next game.

### 👥 Player & Team Customization
- **Team Names**: Customize names for Team A and Team B.
- **Player Profiles**: Upload player photos (persisted locally) and set individual names.
- **Visual Court Diagram**: Real-time visualization of player positions on the court to ensure correct serving order.

### 📊 Analytics & History
- **Live Momentum**: Visual indicator of which team has the scoring momentum based on the last 5 points.
- **Scoring Streaks**: Track consecutive points scored by a team.
- **Match Timeline**: A detailed, scrollable history of every point, fault, and side-out called.

### 🛠️ UX & Reliability
- **Local Persistence**: Match state is automatically saved to `localStorage`. Refresh or close your browser without losing match progress.
- **Undo Support**: Accidental point? One-click undo to revert the last scoring event.
- **Safe Reset**: Safeguards against accidental resets with a confirmation dialog once a match has started.
- **Responsive & Dark Mode**: Beautifully crafted with a premium dark-themed UI, glassmorphism effects, and smooth animations.

## 🛠️ Technical Stack

- **Core**: Next.js 14, React, TypeScript
- **Styling**: Vanilla CSS with a custom-built design system
- **State Management**: Custom React Hook with persistent logic
- **Icons**: Google Material Symbols

## 🚦 Getting Started

### Prerequisites
- Node.js 18.x or later
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Run the development server
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 How to Use

1. **Setup**: Click the **Settings** icon to configure team names, players, and match mode (Standard/Casual/Long).
2. **Scoring**: Use the **Point** button for the serving team or **Fault** to pass the serve (or trigger a side-out).
3. **Court Positions**: Refer to the live court diagram to see where each player should be standing.
4. **History**: Use the history tab to review the flow of the game.
5. **Match Win**: Once a team wins a game, click "Start Next Game" until the full match criteria are met.

---

Built with ❤️ for the Pickleball community.
