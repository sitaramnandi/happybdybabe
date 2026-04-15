# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A static, single-page romantic birthday website. No build step, no package manager, no server — open `index.html` directly in a browser or serve with any static file server (e.g. `npx serve .` or VS Code Live Server).

## File Structure

- `index.html` — full page markup; all sections are inline
- `style.css` — all styles except games
- `games.css` — styles for the three mini-games (Memory Match, Spin Wheel, Scratch Card)
- `script.js` — all JavaScript (~1430 lines), single file
- `assets/images/` — photos referenced by `photoData` in script.js
- `assets/videos/` — videos referenced by `videoData` in script.js
- `assets/music/background.mp3` — background music

## Key Customization Points (top of script.js)

- **Line 6**: `const TEST_MODE = true;` — set to `false` before giving her the link. Controls whether the April 19 date lock is enforced.
- **Lines 13–23**: `photoData` array — edit `src` and `caption` for each photo.
- **Lines 30–34**: `videoData` array — edit `src` and `title` for each video.
- **Timeline & love letter**: Edit directly in `index.html` (sections `<!-- LOVE STORY TIMELINE -->` and `<!-- LOVE LETTER -->`).

## Architecture

### Date Lock System
`isSurpriseUnlocked()` checks whether `now >= April 19 00:00:00`. When `TEST_MODE = true` it always returns `true`. The lock applies to:
- The **Surprise button** (hero section) — shows a countdown if locked
- Four **lockable sections** (gallery, timeline, letter, footer) — each has a `.lock-veil` overlay div and a `.section-container` child. The JS function `initSectionLocks()` adds the `revealed` class when unlocked; CSS transitions handle the unblur/opacity change.

Sections that are **always visible**: countdown, games.

### WebGL / Canvas 2D Fallback Pattern
Every Three.js `WebGLRenderer` is wrapped in `try/catch`. On failure, each canvas falls back to `initCanvas2DParticles(canvasId, count)` — a shared Canvas 2D bouncing-dot particle system. Three canvases use this pattern:
- `heroCanvas` — Three.js star field → Canvas 2D particles
- `sxBgCanvas` (surprise overlay bg) — Three.js star field → Canvas 2D particles
- `sxHeartCanvas` (surprise overlay 3D heart) — Three.js extruded heart → `initSxHeartFallback()` (emoji heart with orbiting emojis)

### Surprise Overlay (`#sxOverlay`)
Full-screen overlay with `.sx-card` containing:
1. `.sx-ribbon` — "✨ Happy Birthday ✨" banner (must be first child of `.sx-card` to avoid clipping)
2. `.sx-split` — two-column layout: left (`sxHeartCanvas`) and right (tabbed content: message, photos, videos)

The typing animation uses `_typingIv` / `_typingDone` guard flags to prevent multiple `setInterval` races when switching tabs.

### Countdown Section
Always visible. Uses `initCountdownCanvas()` (Canvas 2D shooting stars), `initHypeMessages()` (8 rotating messages cycling every 4s), and `getUnlockTarget()` to target April 19 of the current year (rolls to next year if past).

### Games
Three games in a tabbed panel (`initGameTabs`). All always accessible:
- **Memory Match** — `initMemoryGame()`, 4×4 grid, emoji pairs
- **Spin Wheel** — `initSpinWheel()`, Canvas 2D drawn wheel with CSS easing spin
- **Scratch Card** — `initScratchCard()`, Canvas 2D with `destination-out` compositing, reveals a love message at 60% scratched

Win notifications use `showToast(title, msg)` which controls `.game-toast` visibility.

### CSS Variables (defined in style.css `:root`)
`--pink`, `--purple`, `--light-pink`, `--dark`, `--darker`, `--font-script` (Dancing Script), `--font-display` (Playfair Display), `--font-sans` (Poppins), `--glow-pink`.

## Deployment

Push all files to a GitHub repo and enable GitHub Pages (Settings → Pages → Deploy from branch → main / root). Or use Render.com as a Static Site with publish directory `.`.
