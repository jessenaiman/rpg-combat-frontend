# Dice-Learner RPG Combat Simulator Frontend

Welcome to the **Dice-Learner RPG Combat Simulator Frontend**, a Phaser-powered interface that beams the raw chaos and strategic brilliance of turn-based RPG combat straight to your screen. Inspired by the pixelated glory of *Final Fantasy 1* and *Dragon Quest 1-3*, this front-end fuses retro vibes with a sci-fi HUD twist—think *Star Trek* meets *Warhammer 40K*. It’s your portal to visualize simulations, dissect test data, and explore the electrifying tension of battle, all while syncing seamlessly with the Python backend.

Built to complement the `Dice-Learner RPG Combat Simulator` backend, this front-end isn’t just a display—it’s a laboratory for game designers, data enthusiasts, and retro fans to witness combat mechanics in action. Whether you’re analyzing the razor-edge decisions of a low-health showdown or replaying a galaxy-shaking boss fight, this tool brings the numbers to life with a futuristic edge.

---

## Project Goals

The frontend exists to bridge the backend’s raw data with a gripping, visual experience. Here’s what we’re targeting:

- **Visualize Combat Simulations**: Transform API outputs into dynamic health bars, turn-by-turn replays, and a pulsing combat log—capturing the suspense and strategy of classic RPG battles.
- **Showcase Test Data**: Display sci-fi-inspired metrics (FLUX, CHAOS, Flow State, Narrative Tension, PULSE) in a sleek dashboard, turning abstract analytics into actionable insights.
- **Retro Meets Sci-Fi**: Deliver a pixel-art-inspired UI with a glowing, futuristic overlay, blending nostalgia with cutting-edge design.
- **Empower Exploration**: Offer an intuitive interface—complete with a Submit button and on-screen instructions—so users can tweak simulations and see results in real time.

This front-end is your viewport into the simulator’s soul: a sandbox where data dances, battles unfold, and human insights flicker to life.

---

## Key Features

- **Dynamic Combat Display**: Watch character health bars shift with each turn, flashing red in perilous PULSE moments (health < 20%), evoking the thrill of a last-stand firefight.
- **Turn-by-Turn Replay**: Hit the "Replay" button to relive the simulation step-by-step, seeing every attack, heal, and clutch moment unfold like a sci-fi tactical holo-feed.
- **Sci-Fi Metrics Dashboard**: A glowing panel tracks FLUX (strategic pivots), CHAOS (battle unpredictability), Flow State (immersion), Narrative Tension (story stakes), and PULSE (suspense spikes)—mocked for now, ready for full API integration.
- **Combat Log**: A scrolling log at the screen’s base narrates each turn’s action, pulling you into the narrative flow of the fight.
- **User-Friendly Controls**: Enter turns via an input field, click "Submit" to launch a simulation, and follow clear on-screen instructions—all styled with a retro-sci-fi sheen.

---

## Sci-Fi Aesthetic

The frontend leans hard into a science fiction vibe, inspired by the backend’s futuristic metrics:

- **HUD Design**: A gray battlegrid framed by a neon-green sci-fi border, like a tactical display from a starship bridge.
- **Visual Effects**: Health bars pulse red in crisis moments, metrics glow in green, and buttons shift hues on hover—channeling the energy of *Aliens* or *Star Trek*.
- **Retro Roots**: Placeholder rectangles stand in for pixel-art sprites, with plans to adopt a font like “Press Start 2P” for that authentic RPG feel.

This isn’t just a UI—it’s a window into a galaxy where dice rolls meet warp drives.

---

## Frontend-Backend Integration

This project syncs with the `Dice-Learner RPG Combat Simulator` backend (running at `http://localhost:8000`) via its API:

- **Simulation Trigger**: `POST /combat/simulate?turns=X` kicks off a battle, pulling the number of turns from the user input.
- **Data Fetch**: `GET /combat/report` retrieves the full combat report—health states, damage dealt, healing done, spells cast, and a timeline of actions.
- **Future-Ready**: Built to accommodate planned endpoints like `/combat/reset`, `/combat/characters`, and `/combat/metrics`, ensuring smooth evolution as the backend grows.

The frontend visualizes this data in real time, turning raw JSON into a living battlefield.

---

## Setup

### Prerequisites

- Node.js and npm installed.
- Backend API running locally (`uvicorn src.api:app --reload` at `http://localhost:8000`).

### Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/your-username/rpg-combat-frontend.git
   cd rpg-combat-frontend

MIT License

Copyright (c) 2023 [Your Name]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.