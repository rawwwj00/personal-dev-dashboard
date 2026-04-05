# 🖥️ DevDash — Developer Portfolio OS

A full-stack personal developer dashboard with roadmap tracking, project showcase, certificates, and a private dev tools vault.

---

## 🗂️ Project Structure

```
devdash/
├── backend/           # Express + MongoDB API
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── server.js
│   └── .env.example
├── frontend/          # React + Vite SPA
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── context/
│   │   └── utils/
│   └── .env.example
├── render.yaml        # Render.com backend config
└── README.md
```

---

## ✨ Features

| Feature | Admin | Guest |
|---|---|---|
| Dashboard (overview) | ✅ | ✅ |
| Roadmaps (view) | ✅ | ✅ |
| Roadmaps (create/edit/delete/toggle tasks) | ✅ | ❌ |
| Projects (view + hover video) | ✅ | ✅ |
| Projects (create/edit/delete) | ✅ | ❌ |
| Certificates (view + flip card) | ✅ | ✅ |
| Certificates (upload/manage) | ✅ | ❌ |
| Dev Tools vault | ✅ | ❌ |
| Multilingual preloader animation | ✅ | ✅ |

---

## 🚀 Local Development Setup

### Prerequisites
- Node.js v18+
- npm or yarn
- MongoDB Atlas account (free tier)
- Cloudinary account (free tier) — for image/video uploads

---

### 1. Clone the repository

```bash
git clone https://github.com/rawwwj00/devdash.git
cd devdash
```

---

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` with your values:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/devdash
JWT_SECRET=any_long_random_string_here_change_this
ADMIN_PASSWORD=your_chosen_admin_password
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
FRONTEND_URL=http://localhost:5173
PORT=5000
```

**Getting your credentials:**

- **MongoDB**: [mongodb.com/atlas](https://mongodb.com/atlas) → Create free cluster → Connect → Get connection string
- **Cloudinary**: [cloudinary.com](https://cloudinary.com) → Dashboard → copy Cloud name, API Key, API Secret

Start the backend:

```bash
npm run dev     # development (with nodemon auto-reload)
# or
npm start       # production
```

Backend runs at: `http://localhost:5000`
Health check: `http://localhost:5000/api/health`

---

### 3. Frontend Setup

```bash
cd ../frontend
npm install
cp .env.example .env
```

Edit `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

### 4. Test Locally

1. Open `http://localhost:5173`
2. Watch the multilingual preloader animation
3. **Admin login**: Enter your `ADMIN_PASSWORD` from `.env`
4. **Guest login**: Click "View as Guest"

---

## 🌐 Free Deployment Guide

### Stack
| Service | Platform | Free Tier |
|---|---|---|
| Frontend | [Vercel](https://vercel.com) | ✅ Unlimited |
| Backend | [Render.com](https://render.com) | ✅ Free (spins down after 15min inactivity) |
| Database | [MongoDB Atlas](https://mongodb.com/atlas) | ✅ 512MB |
| Media uploads | [Cloudinary](https://cloudinary.com) | ✅ 25GB bandwidth/month |

---

### Deploy Frontend → Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project
3. Import your GitHub repo
4. Set **Root Directory** to `frontend`
5. Add Environment Variable:
   ```
   VITE_API_URL = https://your-backend.onrender.com/api
   ```
6. Click **Deploy**

Your frontend URL: `https://devdash-xxx.vercel.app`

---

### Deploy Backend → Render.com

1. Go to [render.com](https://render.com) → New → Web Service
2. Connect your GitHub repo
3. Settings:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Runtime**: Node
4. Add all Environment Variables from your `.env`:
   ```
   MONGO_URI
   JWT_SECRET
   ADMIN_PASSWORD
   CLOUDINARY_CLOUD_NAME
   CLOUDINARY_API_KEY
   CLOUDINARY_API_SECRET
   FRONTEND_URL = https://your-frontend.vercel.app
   ```
5. Click **Create Web Service**

Your backend URL: `https://devdash-api.onrender.com`

> ⚠️ **Note**: Render free tier spins down after 15 min of inactivity. First request after sleep takes ~30s. To avoid this, use [UptimeRobot](https://uptimerobot.com) (free) to ping `/api/health` every 10 minutes.

---

### After Deploying Both

1. Go back to **Vercel** → Your project → Settings → Environment Variables
2. Update `VITE_API_URL` to your Render backend URL
3. Redeploy frontend (Vercel → Deployments → Redeploy)

---

## 🔧 Usage Guide

### Roadmaps
- Admin: Create roadmaps with a title, color, icon, and checklist items
- Click tasks to toggle completion — progress bar updates instantly
- Guests can view all roadmaps and progress (read-only)

### Projects
- Admin: Upload thumbnail image + demo video (stored on Cloudinary)
- Hover any project card to see muted video autoplay
- Toggle GitHub link, live link, and video visibility per-project
- Filter projects by domain category

### Certificates
- Admin: Upload certificate image + add verification URL
- Click any certificate card to flip it and see the verify button
- Toggle whether guests can see the verification link

### Dev Tools
- **Admin only** — guests cannot see this page
- Add tools with name, URL, category, emoji icon, tags
- Search and filter by category
- Click any tool card to navigate to it

---

## 🔒 Security Notes

- Only one admin password — store it securely in env vars, never commit `.env`
- JWT tokens expire after 7 days (admin) / 24 hours (guest)
- All write operations are protected by `adminOnly` middleware
- Rate limiting: 200 requests per 15 minutes per IP

---

## 🛠️ Tech Stack

**Frontend**: React 18, React Router 6, Framer Motion, Vite, Lucide React  
**Backend**: Express.js, Mongoose, JWT, Multer, Cloudinary  
**Database**: MongoDB Atlas  
**Media**: Cloudinary (images + videos)  
**Deployment**: Vercel (frontend) + Render (backend) + MongoDB Atlas (DB)

---

## 📝 Customization

- **Admin password**: Change `ADMIN_PASSWORD` in `.env`
- **Theme colors**: Edit CSS variables in `frontend/src/index.css` (`:root` block)
- **Fonts**: Change Google Fonts imports in `index.html` and `index.css`
- **Preloader words**: Edit the `devWords` array in `LoginPage.jsx`
- **Nav items**: Edit `adminNav` / `guestNav` in `Sidebar.jsx`

---

## 📄 License

MIT — use it however you like.
