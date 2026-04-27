# SPC Alliance — Full Stack App

## ▶️ Easiest Way to Run (Windows)

Double-click `START.bat`

That's it! It will:
- Install all packages automatically
- Open backend on http://localhost:8000
- Open frontend on http://localhost:3000

---

## Manual Steps (VS Code)

Open the `spc-full` folder in VS Code.

### Terminal 1 — Backend
```bash
cd backend
npm install
npm run dev
```

### Terminal 2 — Backend  
```bash
cd frontend
npm install
npm run dev
```

Then open http://localhost:3000

---

## Folder Structure

```
spc-full/
├── START.bat         ← Double-click to run everything!
├── backend/
│   ├── server.js     ← Main backend (port 8000)
│   ├── .env          ← MongoDB + JWT + Google OAuth config
│   ├── routes/       ← auth.js, points.js, users.js
│   ├── models/       ← User.js, Point.js, Purchase.js
│   ├── middleware/   ← auth.js (JWT protect)
│   └── config/       ← db.js, passport.js
└── frontend/
    ├── app/          ← Next.js pages
    │   ├── page.tsx        (Homepage)
    │   ├── auth/           (Sign in / Sign up)
    │   ├── marketplace/    (Browse points)
    │   ├── upload/         (Upload points)
    │   └── dashboard/      (Your account)
    ├── components/   ← Navbar
    └── lib/          ← data.ts (types + mock data)
```
