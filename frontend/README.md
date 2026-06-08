# Shortify 🚀
A simple URL shortener with QR code generation.

## Features ✨
- Shorten long URLs via backend API
- Generate and download QR codes
- Copy short link to clipboard
- Retro pixel UI (customizable)

## Tech stack 🧭
- Frontend: React, Vite
- HTTP: axios
- Database: MongoDB
- QR generation: qrcode (and/or react-qr-code)

## Prerequisites ✅
- Node.js (16+ recommended)
- NPM or Yarn
- Running backend that exposes a /shorten endpoint and connects to MongoDB

## Setup (Windows) 🛠️
Open PowerShell or CMD:

1. Install frontend deps
   - cd c:\Users\User\OneDrive\Desktop\Url-Shortner\frontend
   - npm install

2. Set env variable (example)
   - Windows (PowerShell):
     $env:VITE_BACKEND_URL="http://localhost:4000"
   - Or create a .env file at frontend root:
     VITE_BACKEND_URL=http://localhost:4000

3. Run dev server
   - npm run dev

Make sure your backend is running and its MongoDB connection is configured (e.g. MONGO_URI in backend env). The frontend posts to `${VITE_BACKEND_URL}/shorten` with payload: { originalUrl } and expects { shortUrl } in response.

## Usage 🧾
- Paste a long URL, click "Shorten".
- Click "Copy" to copy the short link.
- Download or open the generated QR code.

## Contributing 🤝
PRs welcome. Keep changes scoped to the frontend UI unless coordinating backend/database changes.

## Author ✍️
Sayan Sekhar Ghosh — IIT (ISM) Dhanbad