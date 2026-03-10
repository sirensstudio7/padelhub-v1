

## Why There's No Visual

The leaderboard design was planned in the previous message but the code was never actually implemented. The project still has the default "Welcome to Your Blank App" page. Nothing was built yet.

## Plan: Implement the Leaderboard PWA

I will now build the full leaderboard UI based on the reference design and the approved plan.

### Files to Create/Modify

1. **`src/index.css`** — Update CSS variables to the dark charcoal design system (`#1A1A1A` bg, `#2B2B2B` surfaces, `#00FF41` accent), import Space Grotesk + IBM Plex Sans fonts

2. **`src/pages/Index.tsx`** — Build the full leaderboard page:
   - Sticky header with "LEADERBOARD" title
   - Daily / Monthly / All Time filter tabs
   - Top 3 podium (rank 1 center/elevated, rank 2 left, rank 3 right) with geometric avatar placeholders
   - Ranked list (rows 4+) in surface cards
   - Highlighted current user row

3. **`src/components/BottomNav.tsx`** — Text-only bottom navigation: HOME, LIBRARY, QUIZ, RANKS, PROFILE

4. **`src/components/Podium.tsx`** — Top 3 display component with geometric avatars and points in accent green

5. **`src/components/LeaderboardRow.tsx`** — Individual rank row component

6. **`src/data/mockLeaderboard.ts`** — Mock leaderboard data

7. **`src/App.tsx`** — Add bottom nav layout wrapper, placeholder routes for Library/Quiz/Profile

8. **`index.html`** — Update title, theme-color meta tag, add PWA manifest link

9. **`public/manifest.json`** — PWA manifest file

10. **`vite.config.ts`** — Add `vite-plugin-pwa` configuration

### Design Details
- All corners sharp (no rounded pills)
- No gradients or shadows
- Points displayed in `#00FF41` accent green
- Space Grotesk for headings/nav/figures, IBM Plex Sans for body
- Mobile-first layout matching the reference screenshot

