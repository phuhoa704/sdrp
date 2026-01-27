# Application Flow - Authentication & Routing

## 🔄 Simplified User Flow

### Entry Point: `/` (Homepage)

**Behavior:**
- **Not Authenticated** → Redirect to `/login`
- **Authenticated** → Redirect to `/dashboard`

The homepage now acts as a **smart router** that automatically directs users based on their authentication state.

---

## 📍 Route Structure

```
/                   → Auto-redirect (login or dashboard)
├── /login          → Login page (public)
└── /dashboard      → Role-based dashboard (protected)
    ├── Retailer    → RetailerDashboard
    ├── Seller      → SellerDashboard
    └── Admin       → AdminDashboard
```

---

## 🔐 Authentication Flow

### 1. First Visit (Not Logged In)

```
User visits http://localhost:3000
    ↓
Homepage checks auth state
    ↓
isAuthenticated = false
    ↓
Redirect to /login
    ↓
User sees login page
```

### 2. Login Process

```
User enters credentials
    ↓
Selects role (Retailer/Seller/Admin)
    ↓
Clicks "Sign In"
    ↓
Redux action: login()
    ↓
User data saved to Redux + localStorage
    ↓
Redirect to /dashboard
    ↓
Dashboard renders based on role
```

### 3. Authenticated User Returns

```
User visits http://localhost:3000
    ↓
Homepage checks auth state
    ↓
isAuthenticated = true (from localStorage)
    ↓
Redirect to /dashboard
    ↓
User sees their role-specific dashboard
```

### 4. Logout Process

```
User clicks "Logout" in NavBar
    ↓
Redux action: logout()
    ↓
Clear Redux state + localStorage
    ↓
Redirect to /login
    ↓
User sees login page
```

---

## 🛡️ Route Protection

### Public Routes
- `/login` - Accessible to everyone

### Protected Routes
- `/dashboard` - Requires authentication
  - Auto-redirects to `/login` if not authenticated
  - Shows loading spinner during redirect

---

## 🎯 Role-Based Dashboard Rendering

After successful login, the dashboard page automatically renders the appropriate view:

| Role | Dashboard Component | Features |
|------|-------------------|----------|
| **RETAILER** | `RetailerDashboard` | AI Diagnosis, Flash Sale, Quick Actions |
| **SELLER** | `SellerDashboard` | Metrics, Campaign, Activity Timeline |
| **ADMIN** | `AdminDashboard` | System Metrics, Charts, Master Data |

---

## 💾 State Persistence

**Redux Persist Configuration:**
- ✅ `auth` - User session persists across page refreshes
- ✅ `cart` - Shopping cart data persists
- ✅ `ui` - Theme, sidebar state persists
- ❌ `products` - Not persisted (fetched from API)

**Storage:** Browser localStorage

---

## 🔄 Redirect Logic Summary

| Current URL | Auth State | Action |
|------------|-----------|--------|
| `/` | Not authenticated | → `/login` |
| `/` | Authenticated | → `/dashboard` |
| `/login` | Authenticated | Stay (can re-login) |
| `/dashboard` | Not authenticated | → `/login` |
| `/dashboard` | Authenticated | Show role dashboard |

---

## 🚀 Quick Start Guide

### Test the Flow

1. **Start dev server:**
   ```bash
   npm run dev
   ```

2. **Visit homepage:**
   ```
   http://localhost:3000
   ```
   → Auto-redirects to `/login`

3. **Login with demo credentials:**
   - Email: `demo@sdrp.com`
   - Password: `demo123`
   - Role: Select any (Retailer/Seller/Admin)

4. **After login:**
   → Auto-redirects to `/dashboard`
   → See role-specific dashboard

5. **Refresh page:**
   → Still logged in (thanks to persistence)
   → Dashboard loads automatically

6. **Logout:**
   → Click logout button in NavBar
   → Redirected to `/login`

---

## 🛠️ Implementation Details

### Homepage (`/app/page.tsx`)

```tsx
'use client';

export default function HomePage() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  return <LoadingSpinner />;
}
```

### Login Page (`/app/login/page.tsx`)

```tsx
const handleLogin = async (e: React.FormEvent) => {
  // ... authentication logic
  dispatch(login({ user, token }));
  router.push('/dashboard'); // ← Changed from '/'
};
```

### Dashboard Page (`/app/dashboard/page.tsx`)

```tsx
export default function DashboardPage() {
  const user = useAppSelector(selectCurrentUser);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated]);

  // Render role-based dashboard
  return <RoleDashboard role={user.role} />;
}
```

---

## 📝 Benefits of This Approach

✅ **Simplified UX** - No unnecessary homepage
✅ **Direct Access** - Users land exactly where they need to be
✅ **Persistent Sessions** - Login state survives page refresh
✅ **Role-Based Views** - Each user sees their relevant dashboard
✅ **Secure** - Protected routes auto-redirect unauthenticated users

---

## 🔧 Customization

### Change Default Redirect

Edit `/app/page.tsx`:

```tsx
useEffect(() => {
  if (isAuthenticated) {
    router.push('/your-custom-route'); // Change this
  } else {
    router.push('/login');
  }
}, [isAuthenticated, router]);
```

### Add More Protected Routes

1. Create new route: `/app/your-route/page.tsx`
2. Add auth check:
   ```tsx
   useEffect(() => {
     if (!isAuthenticated) {
       router.push('/login');
     }
   }, [isAuthenticated]);
   ```

---

## 🐛 Troubleshooting

### Issue: Redirect loop
**Solution:** Check Redux persist is working. Clear localStorage and try again.

### Issue: Not redirecting after login
**Solution:** Verify `router.push('/dashboard')` is called after dispatch.

### Issue: Lost session after refresh
**Solution:** Check Redux persist configuration in `store/index.ts`.

---

## 📚 Related Files

- `/src/app/page.tsx` - Homepage router
- `/src/app/login/page.tsx` - Login page
- `/src/app/dashboard/page.tsx` - Dashboard router
- `/src/store/slices/authSlice.ts` - Auth state management
- `/src/middleware.ts` - Route middleware (future server-side auth)
