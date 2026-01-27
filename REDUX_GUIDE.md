# Redux Toolkit Setup - Usage Guide

## 📦 Store Structure

```
src/store/
├── index.ts              # Store configuration with persistence
├── hooks.ts              # Typed hooks (useAppDispatch, useAppSelector)
├── slices/
│   ├── authSlice.ts      # Authentication & user state
│   ├── cartSlice.ts      # Shopping cart state
│   ├── uiSlice.ts        # UI state (theme, sidebar, notifications)
│   └── productsSlice.ts  # Product catalog state
└── selectors/
    └── index.ts          # Reusable selectors
```

## 🚀 Quick Start

### 1. Using Redux in Components

```tsx
'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { login, logout } from '@/store/slices/authSlice';
import { addToCart } from '@/store/slices/cartSlice';
import { setView, toggleTheme } from '@/store/slices/uiSlice';
import { selectCurrentUser, selectCartItems, selectIsDarkMode } from '@/store/selectors';

export function MyComponent() {
  const dispatch = useAppDispatch();
  
  // Select state
  const user = useAppSelector(selectCurrentUser);
  const cartItems = useAppSelector(selectCartItems);
  const isDarkMode = useAppSelector(selectIsDarkMode);
  
  // Dispatch actions
  const handleLogin = () => {
    dispatch(login({
      user: {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        role: UserRole.RETAILER,
      },
      token: 'jwt-token-here',
    }));
  };
  
  const handleAddToCart = (product: Product) => {
    dispatch(addToCart({
      product,
      quantity: 1,
      unit: 'Chai/Gói',
      price: product.price,
    }));
  };
  
  return (
    <div>
      <h1>Welcome {user?.name}</h1>
      <button onClick={() => dispatch(toggleTheme())}>
        Toggle Theme
      </button>
    </div>
  );
}
```

### 2. Auth Actions

```tsx
import { login, logout, updateUser } from '@/store/slices/authSlice';

// Login
dispatch(login({ user, token }));

// Logout
dispatch(logout());

// Update user profile
dispatch(updateUser({ name: 'New Name' }));
```

### 3. Cart Actions

```tsx
import { addToCart, removeFromCart, updateQuantity, clearCart, setMode } from '@/store/slices/cartSlice';

// Add to cart
dispatch(addToCart({
  product,
  quantity: 2,
  variant: selectedVariant,
  unit: 'Thùng',
  price: 150000,
  techSpecs: 'EC 250g/l - Nhật Bản',
}));

// Update quantity
dispatch(updateQuantity({ index: 0, quantity: 5 }));

// Remove item
dispatch(removeFromCart(0));

// Clear cart
dispatch(clearCart());

// Switch mode
dispatch(setMode('WHOLESALE'));
```

### 4. UI Actions

```tsx
import { setView, toggleSidebar, toggleTheme, addNotification } from '@/store/slices/uiSlice';

// Navigate
dispatch(setView('MARKETPLACE'));

// Toggle sidebar
dispatch(toggleSidebar());

// Toggle theme
dispatch(toggleTheme());

// Show notification
dispatch(addNotification({
  message: 'Product added to cart!',
  type: 'success',
}));
```

### 5. Products Actions

```tsx
import { setProducts, setSearchQuery, setSelectedCategory } from '@/store/slices/productsSlice';

// Load products
dispatch(setProducts(productsArray));

// Search
dispatch(setSearchQuery('thuốc trừ sâu'));

// Filter by category
dispatch(setSelectedCategory('Thuốc trừ sâu'));
```

## 🔍 Using Selectors

```tsx
import {
  selectCurrentUser,
  selectCartItems,
  selectCartTotal,
  selectCartItemCount,
  selectIsDarkMode,
  selectCurrentView,
  selectFilteredProducts,
} from '@/store/selectors';

const user = useAppSelector(selectCurrentUser);
const cartTotal = useAppSelector(selectCartTotal);
const itemCount = useAppSelector(selectCartItemCount);
const products = useAppSelector(selectFilteredProducts);
```

## 💾 Persistence

The following slices are automatically persisted to localStorage:
- ✅ `auth` - User authentication state
- ✅ `cart` - Shopping cart items
- ✅ `ui` - Theme, sidebar state, selected branch

Products are NOT persisted (should be fetched from API).

## 🎯 Best Practices

1. **Always use typed hooks**: Use `useAppDispatch` and `useAppSelector` instead of plain Redux hooks
2. **Use selectors**: Create reusable selectors in `store/selectors/index.ts`
3. **Keep slices focused**: Each slice should manage a single domain
4. **Avoid nested state**: Keep state as flat as possible
5. **Use TypeScript**: All actions and state are fully typed

## 🔧 DevTools

Redux DevTools is enabled in development mode. Install the browser extension to debug state changes.

## 📝 Example: Complete Component

```tsx
'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addToCart } from '@/store/slices/cartSlice';
import { setView } from '@/store/slices/uiSlice';
import { selectCartItemCount, selectCurrentUser } from '@/store/selectors';
import { Product } from '@/types/product';

export function ProductCard({ product }: { product: Product }) {
  const dispatch = useAppDispatch();
  const cartItemCount = useAppSelector(selectCartItemCount);
  const user = useAppSelector(selectCurrentUser);
  
  const handleAddToCart = () => {
    dispatch(addToCart({
      product,
      quantity: 1,
      unit: 'Chai/Gói',
      price: product.price,
    }));
  };
  
  return (
    <div>
      <h3>{product.name}</h3>
      <p>{product.price.toLocaleString()}đ</p>
      <button onClick={handleAddToCart}>Add to Cart</button>
      <p>Cart: {cartItemCount} items</p>
    </div>
  );
}
```
