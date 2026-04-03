# 🚀 Deployment Guide — Library Management System

Deploy stack: **Railway** (Backend + MySQL) → **Vercel** (Frontend)
All free tiers. Total time: ~20 minutes.

---

## 📋 Prerequisites

- [ ] GitHub account → https://github.com
- [ ] Railway account → https://railway.app (sign in with GitHub)
- [ ] Vercel account → https://vercel.com (sign in with GitHub)

---

## STEP 1 — Push to GitHub

Open terminal in the `library-management-system` root folder:

```bash
git init
git add .
git commit -m "Initial commit - Library Management System"
```

Go to https://github.com/new and create a new repository named `library-management-system` (keep it Public).

Then push:
```bash
git remote add origin https://github.com/YOUR_USERNAME/library-management-system.git
git branch -M main
git push -u origin main
```

---

## STEP 2 — Deploy MySQL Database on Railway

1. Go to https://railway.app/dashboard
2. Click **"New Project"**
3. Click **"Add a service"** → choose **"Database"** → choose **"MySQL"**
4. Railway creates the database automatically. Click on it.
5. Go to the **"Variables"** tab and copy these values — you'll need them soon:
   - `MYSQL_URL`
   - `MYSQL_USER`
   - `MYSQL_PASSWORD`
   - `MYSQLDATABASE` (this is your DB name)

---

## STEP 3 — Deploy Backend on Railway

1. In the same Railway project, click **"New Service"**
2. Choose **"GitHub Repo"**
3. Select your `library-management-system` repository
4. Railway will detect the `backend` folder — if asked for root directory, type: `backend`
5. Go to the **"Variables"** tab of the backend service and add these:

```
DATABASE_URL        =  jdbc:mysql://YOUR_MYSQL_HOST:3306/YOUR_DB_NAME?useSSL=true&serverTimezone=UTC&allowPublicKeyRetrieval=true
DATABASE_USERNAME   =  (paste MYSQL_USER from step 2)
DATABASE_PASSWORD   =  (paste MYSQL_PASSWORD from step 2)
JWT_SECRET          =  MyProductionSecretKeyThatIsVeryLongAndSecure2024LibrarySystem
SPRING_PROFILES_ACTIVE = prod
FINE_PER_DAY        =  5.0
```

> 💡 For DATABASE_URL: Go to your MySQL service → Variables tab → find MYSQL_URL.
> It looks like: `mysql://user:pass@host:port/dbname`
> Convert it to JDBC format: `jdbc:mysql://host:port/dbname?useSSL=true&serverTimezone=UTC&allowPublicKeyRetrieval=true`

6. Go to **"Settings"** tab → set **Root Directory** to `backend`
7. Railway will auto-build using the Dockerfile and deploy
8. Once deployed, go to **"Settings"** → **"Networking"** → click **"Generate Domain"**
9. Copy your backend URL — it looks like: `https://library-management-backend-xxxx.up.railway.app`

---

## STEP 4 — Deploy Frontend on Vercel

1. Go to https://vercel.com/new
2. Click **"Import Git Repository"** → select `library-management-system`
3. Vercel will ask for configuration:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
4. Before clicking Deploy, click **"Environment Variables"** and add:
   ```
   REACT_APP_API_URL = https://your-backend-name.up.railway.app/api
   ```
   (Use the Railway backend URL from Step 3, and add `/api` at the end)
5. Click **"Deploy"**
6. Once done, copy your Vercel frontend URL: `https://library-management-xxxx.vercel.app`

---

## STEP 5 — Connect Frontend URL to Backend CORS

1. Go back to Railway → your backend service → **Variables** tab
2. Add one more variable:
   ```
   FRONTEND_URL = https://library-management-xxxx.vercel.app
   ```
   (Use your actual Vercel URL from Step 4)
3. Railway will auto-redeploy the backend with CORS updated

---

## STEP 6 — Verify Everything Works

1. Open your Vercel URL in browser
2. Login with: `admin@library.com` / `admin123`
3. Test borrowing a book
4. Test returning a book
5. ✅ You're live!

---

## 🔑 Environment Variables Summary

### Railway Backend Variables
| Variable | Value |
|---|---|
| `DATABASE_URL` | `jdbc:mysql://host:port/dbname?useSSL=true&serverTimezone=UTC&allowPublicKeyRetrieval=true` |
| `DATABASE_USERNAME` | from Railway MySQL service |
| `DATABASE_PASSWORD` | from Railway MySQL service |
| `JWT_SECRET` | any long random string (min 32 chars) |
| `SPRING_PROFILES_ACTIVE` | `prod` |
| `FRONTEND_URL` | your Vercel app URL |
| `FINE_PER_DAY` | `5.0` |

### Vercel Frontend Variables
| Variable | Value |
|---|---|
| `REACT_APP_API_URL` | `https://your-backend.up.railway.app/api` |

---

## 🐛 Common Issues & Fixes

**Backend crashes on Railway:**
- Check logs in Railway dashboard → service → "Logs" tab
- Most common cause: wrong DATABASE_URL format (must be JDBC format, not plain MySQL URL)

**Frontend shows "Network Error":**
- REACT_APP_API_URL is wrong or missing
- Make sure it ends with `/api`
- Redeploy Vercel after adding the variable

**Login fails on live site:**
- CORS issue — make sure FRONTEND_URL is set correctly in Railway
- Must match exactly (no trailing slash)

**Tables not created:**
- `SPRING_PROFILES_ACTIVE=prod` must be set
- Check DATABASE_URL is correct

---

## 🔗 Your Links (fill in after deployment)

| Service | URL |
|---|---|
| GitHub Repo | `https://github.com/YOUR_USERNAME/library-management-system` |
| Backend API | `https://________.up.railway.app` |
| Frontend App | `https://________.vercel.app` |
| Railway Dashboard | `https://railway.app/dashboard` |
