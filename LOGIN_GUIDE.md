# Login Page - Implementation Guide

## 📍 Routes

- **Login Page:** `/login`
- **Homepage:** `/` (shows login button if not authenticated)

## 🎨 Features

### Login Page (`/login`)

✅ **Premium Glassmorphism Design**
- Animated background with gradient orbs
- Glass card with backdrop blur
- Smooth animations (fade-in, pulse effects)

✅ **Form Fields**
- Email input with validation
- Password input (masked)
- Role selection (Retailer, Seller, Admin)

✅ **Role Selection**
- Visual role cards with emojis
- Active state highlighting
- 3 roles: RETAILER 🏪, SELLER 📦, ADMIN 👑

✅ **Authentication Flow**
1. User enters email & password
2. Selects role
3. Clicks "Sign In"
4. Redux action dispatched
5. User data stored in Redux + localStorage
6. Redirect to homepage

✅ **Demo Credentials**
```
Email: demo@sdrp.com
Password: demo123
```

## 🔐 Authentication Architecture

### Redux Integration

```tsx
// Login action
dispatch(login({
  user: {
    id: string,
    name: string,
    email: string,
    role: UserRole,
    avatarUrl?: string,
  },
  token: string,
}));

// Logout action
dispatch(logout());
```

### State Persistence

- Auth state automatically saved to localStorage via `redux-persist`
- Survives page refresh
- Cleared on logout

### Protected Routes

Use `AuthGuard` component to protect routes:

```tsx
import { AuthGuard } from '@/components/guards/AuthGuard';

export default function ProtectedPage() {
  return (
    <AuthGuard>
      <YourContent />
    </AuthGuard>
  );
}
```

## 🎯 User Flow

### First Visit (Not Authenticated)
1. User lands on homepage
2. Sees "Sign In" button
3. Clicks → redirected to `/login`
4. Enters credentials & selects role
5. Submits form
6. Redirected back to homepage (authenticated)

### Authenticated User
1. User lands on homepage
2. Sees user info card with avatar, name, role
3. Can logout via logout button
4. Logout clears Redux state & localStorage

## 🔧 Customization

### Change Login API

Edit `/src/app/login/page.tsx`:

```tsx
const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    // Replace with your API call
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role: selectedRole }),
    });

    const data = await response.json();

    dispatch(login({
      user: data.user,
      token: data.token,
    }));

    router.push('/');
  } catch (err) {
    setError('Login failed');
  } finally {
    setIsLoading(false);
  }
};
```

### Add Server-Side Auth

Update `middleware.ts`:

```tsx
export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token');
  const { pathname } = request.nextUrl;

  if (!token && !publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}
```

## 🎨 Styling

### Colors Used

- **Primary:** Blue gradient (`from-primary-500 to-secondary-500`)
- **Glass:** `bg-white/10 backdrop-blur-xl`
- **Inputs:** Custom `.input` class from `globals.css`
- **Buttons:** `.btn-primary`, `.btn-secondary`

### Responsive Design

- Mobile-first approach
- Breakpoints: `sm:`, `md:`, `lg:`
- Stacks vertically on mobile
- Side-by-side on desktop

## 📱 Screenshots

### Login Page
- Centered card layout
- Role selection grid (3 columns)
- Loading state with spinner
- Error message display

### Homepage (Authenticated)
- User info card at top
- Avatar with border
- Logout button
- "Go to Dashboard" CTA

## 🚀 Next Steps

1. **Integrate Real API:** Replace mock authentication
2. **Add Validation:** Email format, password strength
3. **Remember Me:** Checkbox for persistent login
4. **Forgot Password:** Link to password reset flow
5. **Social Login:** Google, Facebook OAuth
6. **2FA:** Two-factor authentication

## 🐛 Troubleshooting

### Login not persisting after refresh
- Check Redux persist configuration in `store/index.ts`
- Verify localStorage is enabled in browser

### Redirect loop
- Check `AuthGuard` logic
- Ensure `/login` is in public routes

### Role not saving
- Verify `selectedRole` state is passed to login action
- Check Redux DevTools for action payload

## 📚 Related Files

- `/src/app/login/page.tsx` - Login page component
- `/src/components/guards/AuthGuard.tsx` - Route protection
- `/src/store/slices/authSlice.ts` - Auth Redux slice
- `/src/middleware.ts` - Next.js middleware
- `/src/app/page.tsx` - Homepage with auth integration
