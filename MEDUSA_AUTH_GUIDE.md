# Medusa.js Authentication Integration

## 📦 Overview

This guide explains how to integrate the SDRP Platform with Medusa.js backend for authentication and user management.

---

## 🔧 Setup

### 1. Environment Variables

Create a `.env.local` file in the project root:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_MEDUSA_URL=http://localhost:8888
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=your_publishable_key_here
```

### 2. Medusa.js Backend

Ensure your Medusa.js backend is running on `localhost:8888` (or your configured URL).

**Required Medusa version:** v2.x (latest)

---

## 🏗️ Architecture

### File Structure

```
src/
├── lib/
│   └── api/
│       ├── config.ts          # API configuration & endpoints
│       └── auth.ts            # Authentication service
├── store/
│   └── slices/
│       └── authSlice.ts       # Redux auth slice with Medusa integration
└── app/
    └── login/
        └── page.tsx           # Login page with Medusa support
```

### Authentication Flow

```
User Login
    ↓
loginWithMedusa() thunk
    ↓
authService.login() → POST /auth/customer/emailpass
    ↓
Medusa returns { customer, token }
    ↓
Redux stores user + token
    ↓
Redirect to /dashboard
```

---

## 🔐 API Endpoints

### Authentication

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/auth/customer/emailpass` | POST | Login with email/password |
| `/auth/customer/emailpass/register` | POST | Register new customer |
| `/auth/session` | GET | Get current session |
| `/auth/session` | DELETE | Logout |

### Customer

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/store/customers/me` | GET | Get customer profile |
| `/store/customers/me` | POST | Update customer profile |

---

## 💻 Usage

### Login Page

The login page has a **toggle switch** to choose between:

1. **Mock Authentication** (🧪 Mock) - For testing without backend
2. **Medusa.js Authentication** (🔗 Medusa.js) - Real API calls

```tsx
// Toggle is at the top of the login form
[🧪 Mock] ←→ [🔗 Medusa.js]
```

### Using Medusa.js Auth

**Step 1:** Toggle to "Medusa.js" mode

**Step 2:** Enter credentials:
- Email: Your Medusa customer email
- Password: Your Medusa customer password

**Step 3:** Click "Sign In"

The app will:
1. Call Medusa API at `localhost:8888`
2. Authenticate user
3. Store JWT token in Redux
4. Redirect to dashboard

### Using Mock Auth

**Step 1:** Toggle to "Mock" mode

**Step 2:** Enter any email/password

**Step 3:** Select role (Retailer/Seller/Admin)

**Step 4:** Click "Sign In"

---

## 🎯 Redux Integration

### Async Thunks

```typescript
// Login with Medusa
dispatch(loginWithMedusa({ email, password }))
  .unwrap()
  .then((result) => {
    console.log('Logged in:', result.user);
  })
  .catch((error) => {
    console.error('Login failed:', error);
  });

// Register
dispatch(registerWithMedusa({
  email,
  password,
  first_name,
  last_name,
}));

// Fetch session
dispatch(fetchSession(token));

// Logout
dispatch(logoutFromMedusa(token));
```

### State Structure

```typescript
{
  auth: {
    isAuthenticated: boolean,
    user: {
      id: string,
      name: string,
      email: string,
      role: UserRole,
      avatarUrl?: string
    } | null,
    token: string | null,
    loading: boolean,
    error: string | null
  }
}
```

---

## 👤 User Roles

Roles are stored in Medusa customer metadata:

```json
{
  "customer": {
    "id": "cus_123",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "metadata": {
      "role": "RETAILER",  // or "SELLER" or "ADMIN"
      "avatar_url": "https://..."
    }
  }
}
```

### Setting Roles in Medusa

You can set roles via:

1. **Medusa Admin Panel:**
   - Go to Customers
   - Edit customer
   - Add metadata: `role = RETAILER`

2. **API:**
```bash
curl -X POST http://localhost:8888/store/customers/me \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "metadata": {
      "role": "SELLER"
    }
  }'
```

---

## 🔄 Session Management

### Token Storage

JWT tokens are stored in:
- **Redux state** (in-memory)
- **localStorage** (via redux-persist)

### Session Validation

On app load, the app checks:
1. Is there a token in localStorage?
2. If yes, validate with `fetchSession(token)`
3. If valid, restore user session
4. If invalid, redirect to login

### Auto-logout

Token expiration is handled by Medusa. When a request returns 401:
- User is logged out
- Redirected to login page

---

## 🛠️ API Service

### AuthService Methods

```typescript
// Login
const response = await authService.login({
  email: 'user@example.com',
  password: 'password123'
});

// Register
const response = await authService.register({
  email: 'new@example.com',
  password: 'password123',
  first_name: 'John',
  last_name: 'Doe'
});

// Get session
const session = await authService.getSession(token);

// Logout
await authService.logout(token);

// Get profile
const profile = await authService.getCustomerProfile(token);

// Update profile
await authService.updateCustomerProfile(token, {
  first_name: 'Jane',
  metadata: { role: 'ADMIN' }
});
```

---

## 🐛 Troubleshooting

### CORS Errors

If you see CORS errors, configure your Medusa backend:

```javascript
// medusa-config.js
module.exports = {
  projectConfig: {
    http: {
      cors: "http://localhost:3000",
    },
  },
};
```

### Connection Refused

**Error:** `Failed to fetch` or `ECONNREFUSED`

**Solution:**
1. Check Medusa is running: `http://localhost:8888/health`
2. Verify `NEXT_PUBLIC_MEDUSA_URL` in `.env.local`
3. Restart Next.js dev server after changing env vars

### Invalid Credentials

**Error:** `Invalid credentials`

**Solution:**
1. Verify email/password are correct
2. Check customer exists in Medusa admin
3. Ensure customer has `has_account: true`

### Role Not Found

**Error:** User role is `RETAILER` even though you set it differently

**Solution:**
1. Check customer metadata in Medusa admin
2. Ensure metadata key is exactly `role`
3. Value must be `RETAILER`, `SELLER`, or `ADMIN` (uppercase)

---

## 🔒 Security Best Practices

### 1. HTTPS in Production

```env
NEXT_PUBLIC_MEDUSA_URL=https://api.yourdomain.com
```

### 2. Secure Token Storage

Tokens are stored in localStorage. For production:
- Consider using httpOnly cookies
- Implement token refresh logic
- Add CSRF protection

### 3. API Key Protection

Never commit `.env.local` to git:

```bash
# .gitignore
.env.local
.env.*.local
```

### 4. Rate Limiting

Implement rate limiting on login attempts:
- Client-side: Disable button after failed attempts
- Server-side: Medusa has built-in rate limiting

---

## 📊 Testing

### Test with Mock Auth

1. Toggle to "Mock" mode
2. Enter any credentials
3. Select role
4. Login → Should work without backend

### Test with Medusa

1. Start Medusa: `npm run dev` (in Medusa project)
2. Create test customer in Medusa admin
3. Toggle to "Medusa.js" mode
4. Login with test credentials
5. Should authenticate and redirect

---

## 🚀 Production Deployment

### Environment Variables

Set in your hosting platform (Vercel, Netlify, etc.):

```env
NEXT_PUBLIC_MEDUSA_URL=https://your-medusa-backend.com
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_live_...
```

### Build

```bash
npm run build
npm start
```

---

## 📚 Related Documentation

- [Medusa.js Docs](https://docs.medusajs.com/)
- [Medusa Authentication](https://docs.medusajs.com/modules/customers/storefront/implement-customer-profiles)
- [Redux Toolkit Async Thunks](https://redux-toolkit.js.org/api/createAsyncThunk)

---

## 🔮 Future Enhancements

- [ ] Token refresh mechanism
- [ ] Social login (Google, Facebook)
- [ ] Two-factor authentication
- [ ] Password reset flow
- [ ] Email verification
- [ ] Remember me functionality
- [ ] Session timeout warnings

---

**Built with ❤️ for SDRP Platform**
