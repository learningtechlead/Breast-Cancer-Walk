# 🎀 Pink Ribbon Walk — Team Walking Tracker

A vibrant, Breast Cancer Awareness-themed web application designed for teams to collectively track and celebrate their walking steps over the course of a month.

Built with **React 18, Vite, TypeScript, and Tailwind CSS**, and pre-configured for instant **Netlify** hosting with shared cloud persistence.

---

## ✨ Key Features

- **🎀 Breast Cancer Awareness Theme**: Elegant white & pink palette (`#ec4899`, rose gradients, blush accents) with custom SVG awareness ribbon branding and festive confetti animations.
- **🏃 Collective Team Odometer (Hero View)**:
  - Big collective step counter & distance totals (km / miles).
  - Team monthly milestone progress bar (e.g. 1.5M / 2M steps goal).
  - Active walkers count, team averages, and today's step volume.
- **🏆 Top Walkers Podium & Leaderboard**:
  - Visual Top 3 awareness podium with Gold, Silver, and Bronze ribbon medals.
  - Ranked leaderboard of all team members with progress bars.
  - One-click step logging directly from any person's rank or avatar.
- **👥 Team Roster**:
  - Interactive grid of all teammates showing individual step totals, walking days, and custom stride lengths.
  - "+ Add Walker" button to seamlessly add new team members.
- **👟 "Add My Steps" & Smart Calculator**:
  - Select team member or quick-add a new walker.
  - Date picker defaulting to today (supports backdating for any day in the month).
  - Step counter with quick increment buttons (`+1k`, `+2.5k`, `+5k`, `+10k`).
  - **Dynamic Step-to-Distance Calculator**:
    - *Auto Mode*: Uses customizable stride presets (Petite 0.65m, Average 0.76m, Long 0.85m, or Custom) to compute distance in **km** and **miles**.
    - *Manual Mode*: Enter exact distance directly from GPS watches or treadmills (Fitbit, Apple Watch, Garmin).
  - Celebratory pink-and-gold confetti burst on save!
- **📊 Daily Trends & Activity Feed**:
  - Daily step distribution bar chart for the entire month.
  - Chronological feed of step entries with edit/delete capability (to fix mistakes).
  - **1-Click Export**: Download monthly activity reports in CSV or JSON format.
- **☁️ Cloud Persistence on Netlify**:
  - Powered by **Netlify Functions & Netlify Blobs** for multi-device live team synchronization.
  - Seamless offline fallback to `localStorage` with rich demo data for instant local preview.

---

## 🚀 Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Build for production
npm run build
```

---

## 🌐 Deploying to Netlify

### Option 1: Git Integration (Recommended)
1. Push this repository to GitHub, GitLab, or Bitbucket.
2. In [Netlify Dashboard](https://app.netlify.com), click **"Add new site" > "Import an existing project"**.
3. Select your repository.
4. Netlify will automatically detect settings from `netlify.toml`:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Functions directory**: `netlify/functions`
5. Click **Deploy Site**!

### Option 2: Drag & Drop (Instant)
1. Run `npm run build` on your machine.
2. Go to [Netlify Drop](https://app.netlify.com/drop).
3. Drag the generated `dist` folder into the browser window.
