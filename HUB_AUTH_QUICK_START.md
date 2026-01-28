# Quick Start: Hub Authentication

## For Developers

### Using Authentication in Components

```typescript
import { useAuth } from '@/hooks/medusa/useAuth';

export default function MyPage() {
  const { user, isAuthenticated, login, logout, loading, error } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {isAuthenticated ? (
        <>
          <p>Welcome, {user?.name}!</p>
          <button onClick={() => logout()}>Logout</button>
        </>
      ) : (
        <button onClick={() => login({ 
          email: 'test@example.com', 
          password: 'password' 
        })}>
          Login
        </button>
      )}
    </div>
  );
}
```

### Login Form Example

```typescript
import { useState } from 'react';
import { useAuth } from '@/hooks/medusa/useAuth';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login({ email, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input 
        type="password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
      {error && <p className="error">{error}</p>}
    </form>
  );
}
```

### Registration Example

```typescript
import { useAuth } from '@/hooks/medusa/useAuth';

export default function RegisterForm() {
  const { register, loading, error } = useAuth();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    await register({
      email: 'newuser@example.com',
      password: 'password123',
      first_name: 'John',
      last_name: 'Doe',
      role: 'RETAILER' // optional
    });
  };

  return (
    <form onSubmit={handleRegister}>
      {/* form fields */}
    </form>
  );
}
```

### Protected Routes

```typescript
import { useAuth } from '@/hooks/medusa/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return null;

  return <div>Protected Content</div>;
}
```

### Using AuthGuard Component

If you have an AuthGuard component:

```typescript
import AuthGuard from '@/components/guards/AuthGuard';

export default function ProtectedPage() {
  return (
    <AuthGuard>
      <div>This content is only visible to authenticated users</div>
    </AuthGuard>
  );
}
```

## API Service Usage

### Direct API Calls

```typescript
import { hubAuthService } from '@/lib/api/hub/authService';

// Login
const response = await hubAuthService.login({
  email: 'user@example.com',
  password: 'password123'
});

// Get current user
const { user } = await hubAuthService.getSession();

// Update profile
const { user: updatedUser } = await hubAuthService.updateUserProfile({
  first_name: 'Jane',
  last_name: 'Smith'
});

// Logout
await hubAuthService.logout();
```

## Redux Store Access

```typescript
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { loginWithHub, logoutFromHub } from '@/store/slices/authSlice';

function MyComponent() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, loading, error } = useAppSelector(state => state.auth);

  const handleLogin = () => {
    dispatch(loginWithHub({ email: '...', password: '...' }));
  };

  return <div>{/* component JSX */}</div>;
}
```

## Token Management

The hub auth service automatically handles token storage and retrieval:

- **Storage**: Tokens are stored in `localStorage` as `hub_auth_token`
- **Headers**: Tokens are automatically added to all Bridge API requests
- **Initialization**: Tokens are restored on page reload
- **Cleanup**: Tokens are removed on logout

### Manual Token Access

```typescript
// Get token
const token = localStorage.getItem('hub_auth_token');

// Clear token (logout)
localStorage.removeItem('hub_auth_token');
```

## Common Patterns

### Conditional Rendering Based on Auth

```typescript
const { isAuthenticated, user } = useAuth();

return (
  <>
    {isAuthenticated && user?.role === 'ADMIN' && (
      <AdminPanel />
    )}
    {isAuthenticated && user?.role === 'RETAILER' && (
      <RetailerDashboard />
    )}
    {!isAuthenticated && (
      <LoginPrompt />
    )}
  </>
);
```

### Loading States

```typescript
const { loading, error, isAuthenticated } = useAuth();

if (loading) {
  return <Spinner />;
}

if (error) {
  return <ErrorMessage message={error} />;
}

if (!isAuthenticated) {
  return <LoginPage />;
}

return <Dashboard />;
```

## Troubleshooting

### Token Not Persisting
- Check localStorage in browser DevTools
- Ensure `hubAuthService.initializeAuth()` is called on app start
- Verify `AuthProvider` is wrapping your app

### 401 Unauthorized Errors
- Token may have expired - user needs to login again
- Check if token is being sent in request headers
- Verify backend is accepting the token format

### Session Not Restored on Refresh
- Ensure `AuthProvider` is at the root of your app
- Check if `fetchHubSession` is being called on mount
- Verify token exists in localStorage

## Testing

### Mock Auth in Tests

```typescript
import { renderWithProviders } from '@/test-utils';

test('shows user name when authenticated', () => {
  const { getByText } = renderWithProviders(<MyComponent />, {
    preloadedState: {
      auth: {
        isAuthenticated: true,
        user: { id: '1', name: 'John Doe', email: 'john@example.com', role: 'RETAILER' },
        token: 'mock-token',
        loading: false,
        error: null
      }
    }
  });

  expect(getByText('Welcome, John Doe!')).toBeInTheDocument();
});
```
