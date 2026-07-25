# Time Utility Dashboard (MERN Stack)

A full-stack time management dashboard: live clock, stopwatch, countdown timer,
alarms, world clock, calendar, day-progress ring, and live weather — now backed
by a Node/Express/MongoDB API with user accounts, so your alarms and timer
presets are saved across devices instead of just sitting in `localStorage`.

## What changed from the original version

- **Security fix**: the OpenWeather API key used to be hardcoded in
  frontend JS (visible to anyone viewing source). It now lives only in the
  backend's `.env` file, and the frontend calls your own `/api/weather` route.
- **Accounts**: sign up / log in with email + password (JWT auth, hashed
  passwords with bcrypt).
- **Persistence**: alarms, timer presets, and theme preference are stored in
  MongoDB per user, instead of `localStorage`.
- **React**: the frontend was rebuilt as a Vite + React app, component per
  feature, but keeps the same visual design as the original HTML/CSS.

## Project structure

```
time-utility-mern/
├── backend/          Express API (auth, weather proxy, user data)
└── frontend/          Vite + React app
```

## Setup

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` and fill in:
- `MONGO_URI` — get a free cluster at https://www.mongodb.com/atlas
- `JWT_SECRET` — any long random string
- `WEATHER_API_KEY` — your key from https://openweathermap.org/api

Then run:

```bash
npm run dev
```

Server runs at `http://localhost:5000`.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs at `http://localhost:5173`.

### 3. Assets

Copy over two things from your original project:
- `images/day.jpg`, `images/evening.jpg`, `images/night.jpg` →
  `frontend/public/images/`
- `alarmsound.mp3` → `frontend/public/alarmsound.mp3`

(See the placeholder `.txt` notes left in those folders.)

## API endpoints

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/signup` | — | Create account |
| POST | `/api/auth/login` | — | Log in |
| GET | `/api/auth/me` | ✅ | Get current user |
| GET | `/api/weather?city=` or `?lat=&lon=` | — | Weather (key hidden server-side) |
| PUT | `/api/user/theme` | ✅ | Save theme preference |
| POST/DELETE | `/api/user/alarms` | ✅ | Add / remove alarm |
| POST/DELETE | `/api/user/timer-presets` | ✅ | Add / remove saved timer preset |
| POST/DELETE | `/api/user/favorite-cities` | ✅ | Add / remove favorite city |

## Ideas for extending this further

- Deploy backend to Render/Railway and frontend to Vercel/Netlify
- Add a Pomodoro mode on top of the countdown timer
- Add a habit-tracker heatmap on the calendar card
- Add browser push notifications for alarms
- Turn it into a PWA (installable app)

## Tech stack

**Frontend:** React, React Router, Axios, Vite
**Backend:** Node.js, Express, MongoDB (Mongoose), JWT, bcrypt
