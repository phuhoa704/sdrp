# Hub Auth Service Migration

This document describes the migration from Medusa authentication to Hub authentication service.

## Overview

The application now uses a custom Hub authentication service that communicates with the Bridge API instead of Medusa. The Hub auth service provides token-based authentication stored in localStorage.

## What Changed

### New Files Created

1. **`src/lib/api/hub/authService.ts`**
   - Main hub authentication service
   - Handles login, register, logout, session management
   - Uses JWT tokens stored in localStorage
   - Automatically sets Authorization headers in axios

2. **`src/hooks/hub/useHubAuth.ts`**
   - React hook for hub authentication
   - Provides the same interface as the old Medusa auth hook

3. **`src/components/providers/HubAuthProvider.tsx`**
   - Alternative auth provider using hub auth
   - Can be used instead of the main AuthProvider

### Modified Files

1. **`src/lib/api/bridgeClient.ts`**
   - Updated request interceptor to automatically include hub auth token from localStorage
   - Token is retrieved on every request

2. **`src/lib/api/config.ts`**
   - Added hub auth endpoints:
     - `AUTH_LOGIN`: `/auth/login`
     - `AUTH_REGISTER`: `/auth/register`
     - `AUTH_ME`: `/auth/me`
     - `AUTH_LOGOUT`: `/auth/logout`
     - `AUTH_PROFILE`: `/auth/profile`

3. **`src/store/slices/authSlice.ts`**
   - Added hub auth async thunks:
     - `loginWithHub`
     - `registerWithHub`
     - `fetchHubSession`
     - `logoutFromHub`
   - Added corresponding reducers for hub auth
   - Kept Medusa auth thunks for backward compatibility

4. **`src/hooks/medusa/useAuth.ts`**
   - **BREAKING CHANGE**: Now uses hub auth by default instead of Medusa
   - Import changed from `@/lib/api/medusa/auth` to `@/lib/api/hub/authService`

5. **`src/components/providers/AuthProvider.tsx`**
   - **BREAKING CHANGE**: Now uses hub auth instead of Medusa
   - Initializes hub auth service on mount
   - Fetches session from hub API if token exists

## API Endpoints

The hub auth service expects the following endpoints on the Bridge API:

### POST `/auth/login`
**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "RETAILER",
    "avatar_url": "https://...",
    "metadata": {}
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### POST `/auth/register`
**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "first_name": "John",
  "last_name": "Doe",
  "role": "RETAILER"
}
```

**Response:** Same as login

### GET `/auth/me`
**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "RETAILER",
    "avatar_url": "https://...",
    "metadata": {}
  }
}
```

### POST `/auth/logout`
**Headers:**
```
Authorization: Bearer {token}
```

**Response:** 200 OK

### PUT `/auth/profile`
**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "first_name": "Jane",
  "last_name": "Smith",
  "avatar_url": "https://..."
}
```

**Response:**
```json
{
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "first_name": "Jane",
    "last_name": "Smith",
    "role": "RETAILER",
    "avatar_url": "https://...",
    "metadata": {}
  }
}
```

## Usage

### Using the Default Auth Hook

```typescript
import { useAuth } from '@/hooks/medusa/useAuth';

function MyComponent() {
  const { login, register, logout, user, isAuthenticated, loading, error } = useAuth();

  const handleLogin = async () => {
    await login({ email: 'user@example.com', password: 'password123' });
  };

  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome {user?.name}</p>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
}
```

### Using Hub Auth Directly

```typescript
import { useHubAuth } from '@/hooks/hub/useHubAuth';

function MyComponent() {
  const { login, register, logout, user, isAuthenticated } = useHubAuth();
  // Same interface as useAuth
}
```

### Using Medusa Auth (Legacy)

If you need to use Medusa auth for specific components:

```typescript
import { useAppDispatch } from '@/store/hooks';
import { loginWithMedusa, registerWithMedusa, logoutFromMedusa } from '@/store/slices/authSlice';

function MyComponent() {
  const dispatch = useAppDispatch();

  const handleLogin = async () => {
    await dispatch(loginWithMedusa({ email: '...', password: '...' }));
  };
}
```

## Token Storage

- **Hub Auth**: Tokens are stored in `localStorage` under the key `hub_auth_token`
- **Medusa Auth**: Tokens are stored in Redux state and managed by Medusa SDK

## Migration Checklist

- [x] Create hub auth service
- [x] Update bridge client to include auth token
- [x] Add hub auth endpoints to config
- [x] Create hub auth async thunks
- [x] Add hub auth reducers
- [x] Update main useAuth hook to use hub auth
- [x] Update AuthProvider to use hub auth
- [x] Create HubAuthProvider as alternative
- [ ] Update backend to implement hub auth endpoints
- [ ] Test login flow
- [ ] Test registration flow
- [ ] Test session persistence
- [ ] Test logout flow
- [ ] Remove Medusa auth dependencies (optional)

## Backward Compatibility

Both Medusa and Hub auth systems are available in the codebase:

- **Hub Auth** (Default): Used by `useAuth()` and `AuthProvider`
- **Medusa Auth** (Legacy): Available via direct Redux actions or `useHubAuth` can be modified

To switch back to Medusa auth, simply revert the changes to:
- `src/hooks/medusa/useAuth.ts`
- `src/components/providers/AuthProvider.tsx`

## Environment Variables

No new environment variables are required. The hub auth service uses the existing `NEXT_PUBLIC_BRIDGE_API_URL` from `.env.local`.

## Next Steps

1. Implement the hub auth endpoints on the Bridge API backend
2. Test the authentication flow end-to-end
3. Update any components that directly import from `@/lib/api/medusa/auth`
4. Consider removing Medusa auth dependencies once hub auth is stable
