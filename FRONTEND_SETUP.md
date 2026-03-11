# Frontend Setup & Installation Guide

## 📋 What Was Created

A complete **Next.js 14 + TypeScript + Tailwind CSS + shadcn/ui** frontend for your Church Management System with:

✅ **Authentication System**
- JWT login/logout
- Auto token refresh
- Protected routes
- Role-based access control

✅ **Dashboard Layout**
- Responsive sidebar
- Header with user info
- Stats cards
- Recent activity widget

✅ **Project Structure**
- TypeScript types for all models
- API client with interceptors
- Zustand auth store
- React Query setup
- shadcn/ui components

---

## 🚀 Installation Steps

### Step 1: Install Node.js (if not installed)

```bash
# Check if Node.js is installed
node --version

# If not installed, install it:
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Or use nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 20
nvm use 20
```

### Step 2: Navigate to Frontend Directory

```bash
cd /home/authentiano/projects/church/royal/frontend
```

### Step 3: Install Dependencies

```bash
npm install
```

This will install all packages from `package.json` (takes 1-2 minutes).

### Step 4: Verify Environment File

```bash
# Check .env.local exists
cat .env.local

# Should show:
# NEXT_PUBLIC_API_URL=http://localhost:8000/api
# NEXT_PUBLIC_APP_NAME=Royal CMS
```

### Step 5: Start Development Server

```bash
npm run dev
```

You should see:
```
> royal-cms-frontend@0.1.0 dev
> next dev

  ▲ Next.js 14.1.0
  - Local:        http://localhost:3000
  - Ready in 1234ms
```

### Step 6: Test Login

1. Open browser: http://localhost:3000
2. You'll be redirected to `/login`
3. Login with:
   - **Username:** `superadmin`
   - **Password:** `pass123`
4. You should see the dashboard!

---

## 🎨 Testing the Frontend

### Test Accounts

| Username | Password | Role | Access |
|----------|----------|------|--------|
| superadmin | pass123 | Super Admin | Full access |
| pastor | pass123 | Pastor | Most features |
| admin | pass123 | Administrator | Admin features |
| finance | pass123 | Finance | Finance module |
| cellleader | pass123 | Cell Leader | Cell groups |
| evangelism | pass123 | Evangelism | Basic access |

### What to Test

1. ✅ Login with different roles
2. ✅ Check sidebar navigation (different roles see different menus)
3. ✅ Click "Sign out" - should redirect to login
4. ✅ Refresh page - should stay logged in
5. ✅ Try accessing `/` without login - should redirect to `/login`

---

## 🛠️ Troubleshooting

### Error: "npm: command not found"

**Solution:** Install Node.js (see Step 1)

### Error: "Module not found"

**Solution:**
```bash
npm install
```

### Error: "Port 3000 already in use"

**Solution:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
npm run dev -- -p 3001
```

### Login Fails / API Error

**Solutions:**
1. Check backend is running:
   ```bash
   cd /home/authentiano/projects/church/royal/backend
   source ../venv/bin/activate
   python manage.py runserver
   ```

2. Verify backend URL in `.env.local`:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   ```

3. Test backend directly:
   ```bash
   curl http://localhost:8000/api/auth/token/ \
     -H "Content-Type: application/json" \
     -d '{"username":"superadmin","password":"pass123"}'
   ```

### Blank Page / White Screen

**Solution:**
1. Open browser console (F12)
2. Check for errors
3. Clear browser cache
4. Restart dev server

---

## 📁 File Structure Created

```
frontend/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   └── login/
│   │   │       └── page.tsx          # Login page
│   │   │   └── layout.tsx
│   │   ├── (dashboard)/
│   │   │   ├── page.tsx              # Dashboard home
│   │   │   └── layout.tsx
│   │   ├── layout.tsx                # Root layout
│   │   └── globals.css               # Tailwind styles
│   │
│   ├── components/
│   │   ├── ui/
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   └── label.tsx
│   │   ├── layout/
│   │   │   ├── sidebar.tsx
│   │   │   ├── header.tsx
│   │   │   └── dashboard-layout.tsx
│   │   ├── dashboard/
│   │   │   ├── stats-card.tsx
│   │   │   └── recent-activity.tsx
│   │   └── providers.tsx
│   │
│   ├── hooks/
│   │   └── use-auth.ts               # Auth hook
│   │
│   ├── lib/
│   │   ├── api.ts                    # API client
│   │   └── utils.ts                  # Utilities
│   │
│   ├── store/
│   │   └── auth-store.ts             # Zustand store
│   │
│   └── types/
│       └── index.ts                  # TypeScript types
│
├── .env.local                        # Environment variables
├── .gitignore
├── package.json
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.json
├── next.config.js
└── README.md
```

---

## 🎯 What's Next?

After verifying the setup works, we'll build:

1. **Members Module** - Full CRUD with tables and forms
2. **Cells Module** - Cell management
3. **Departments Module** - Department management
4. **Events Module** - Events and attendance
5. **Finance Module** - Transactions and budgets

Each module will have:
- List view with search, filter, sort, pagination
- Detail view with tabs
- Create/Edit forms with validation
- Delete confirmation
- Role-based permissions

---

## ✅ Checklist

Before proceeding, verify:

- [ ] Node.js 18+ installed
- [ ] Dependencies installed (`npm install`)
- [ ] Backend running on port 8000
- [ ] Frontend running on port 3000
- [ ] Can login with `superadmin` / `pass123`
- [ ] Dashboard displays correctly
- [ ] Logout works
- [ ] Can log in again

---

**Once everything works, let me know and we'll build the Members module!** 🚀
