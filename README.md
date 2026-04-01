# Chatty - Real-time Chat Application

Chatty je full-stack real-time chat aplikacija sa modernim UI/UX dizajnom i naprednim funkcionalnostima.

## Features

- Autentifikacija (Login / Register)
- Real-time chat (Socket.io)
- Slanje slika u chatu
- Typing indicator (kada korisnik piše)
- Seen / Sent status poruka
- Notifikacije za nove poruke (toast + sound)
- Unread messages badge
- Theme switcher (više tema)
- Profil korisnika (ime + slika)
- Online / Offline status

---

## Tech Stack

### Frontend

- React
- Zustand (state management)
- Axios
- Socket.io-client

### Backend

- Node.js
- Express
- MySQL
- Socket.io

---

### Backend setup

- cd backend
- npm install
- npm run dev

### Frontend setup

- cd frontend
- npm install
- npm run dev

### .env

PORT=5001
JWT_SECRET=
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=chat_app

### Author

- Dzenan Mehmedovic
