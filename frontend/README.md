# Royal CMS - Frontend

Church Management System frontend built with **Next.js 14**, **TypeScript**, **Tailwind CSS**, and **shadcn/ui**.

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ installed
- **Backend** running at `http://localhost:8000`

### Installation

```bash
# Navigate to frontend directory
cd /home/authentiano/projects/church/royal/frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🔐 Login

Use the test accounts created in the backend:

| Username | Password | Role |
|----------|----------|------|
| superadmin | pass123 | Super Admin |
| pastor | pass123 | Pastor |
| admin | pass123 | Administrator |
| finance | pass123 | Finance Officer |
| cellleader | pass123 | Cell Leader |
| evangelism | pass123 | Evangelism Team |

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/             # Auth pages (login)
│   │   ├── (dashboard)/        # Dashboard pages
│   │   ├── layout.tsx          # Root layout
│   │   └── globals.css         # Global styles
│   │
│   ├── components/             # React components
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── layout/             # Layout components (sidebar, header)
│   │   └── dashboard/          # Dashboard widgets
│   │
│   ├── hooks/                  # Custom React hooks
│   │   └── use-auth.ts         # Authentication hook
│   │
│   ├── lib/                    # Utilities
│   │   ├── api.ts              # API client
│   │   └── utils.ts            # Helper functions
│   │
│   ├── store/                  # Zustand stores
│   │   └── auth-store.ts       # Auth state management
│   │
│   └── types/                  # TypeScript types
│       └── index.ts            # All type definitions
│
├── .env.local                  # Environment variables
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🛠️ Tech Stack

### Core
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling

### State Management
- **Zustand** - Client state (auth, UI)
- **React Query** - Server state (API data)

### UI Components
- **shadcn/ui** - Component library
- **Radix UI** - Accessible primitives
- **Lucide React** - Icons

### Forms & Validation
- **React Hook Form** - Form handling
- **Zod** - Schema validation

### API & HTTP
- **Axios** - HTTP client
- **JWT Decode** - Token handling

### Charts
- **Recharts** - Data visualization

---

## 🔑 Features

### ✅ Implemented
- [x] Authentication (JWT)
- [x] Auto token refresh
- [x] Role-based access control
- [x] Protected routes
- [x] Dashboard layout (sidebar + header)
- [x] Login page
- [x] Dashboard home with stats
- [x] API client with interceptors
- [x] Auth state persistence

### 🚧 To Build
- [ ] Members module (list, detail, create, edit)
- [ ] Cells module
- [ ] Departments module
- [ ] Events module
- [ ] Finance module
- [ ] Settings page
- [ ] User profile
- [ ] Dark mode toggle
- [ ] Mobile responsive menu
- [ ] Error boundaries
- [ ] Loading skeletons

---

## 🎨 Adding shadcn/ui Components

Install components as needed:

```bash
# Go to frontend directory
cd frontend

# Add components
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add input
npx shadcn-ui@latest add table
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add form
# ... and more
```

---

## 📝 Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_APP_NAME=Royal CMS
```

---

## 🔧 Development Commands

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

---

## 🔐 Authentication Flow

1. User enters credentials on `/login`
2. API returns access + refresh tokens
3. Tokens stored in localStorage
4. User info stored in Zustand + localStorage
5. API interceptor adds token to requests
6. If 401, auto-refresh token
7. If refresh fails, logout and redirect to login

---

## 🎯 Next Steps

### Phase 1: Core Modules
1. **Members Module** - Full CRUD with table, forms, search, filter
2. **Cells Module** - Cell management with member assignment
3. **Departments Module** - Department management
4. **Events Module** - Event calendar and attendance
5. **Finance Module** - Transactions, budgets, reports

### Phase 2: Enhanced Features
1. **Dashboard Charts** - Recharts for analytics
2. **Data Tables** - TanStack Table with sorting, filtering, pagination
3. **Forms** - React Hook Form + Zod validation
4. **Toast Notifications** - Success/error messages
5. **Loading States** - Skeletons for better UX

### Phase 3: Polish
1. **Mobile Menu** - Responsive sidebar
2. **Dark Mode** - Theme toggle
3. **User Profile** - Edit profile, change password
4. **Settings** - App configuration
5. **Error Handling** - Error boundaries, fallback UI

---

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/module-name`
2. Make changes
3. Test thoroughly
4. Commit: `git commit -m "feat: add feature name"`
5. Push and create PR

---

## 📚 Resources

- [Next.js Docs](https://nextjs.org/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)
- [React Query](https://tanstack.com/query)
- [Zustand](https://zustand-demo.pmnd.rs)

---

## 🐛 Troubleshooting

### "Module not found" errors
```bash
npm install
```

### API connection errors
- Check backend is running: `http://localhost:8000/api/`
- Verify `.env.local` has correct `NEXT_PUBLIC_API_URL`

### Auth not working
- Clear localStorage
- Login again
- Check browser console for errors

---

**Ready to build the future of church management!** 🚀
